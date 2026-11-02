import makeWASocket,{Browsers,DisconnectReason,useMultiFileAuthState,type WASocket} from '@whiskeysockets/baileys';
import {Boom} from '@hapi/boom';
import pino from 'pino';
import QRCode from 'qrcode';
import {rmSync} from 'node:fs';
import type {WhatsAppConnectionStatus} from '../../shared/types.js';

type Job={phone:string;text:string;onSent?:(id:string)=>void;onFailed?:(error:string)=>void};
const wait=(ms:number)=>new Promise(resolve=>setTimeout(resolve,ms));
export class WhatsAppAutomation{
  private socket?:WASocket;private connecting?:Promise<void>;private queue:Job[]=[];private flushing=false;private manualDisconnect=false;private reconnectTimer?:NodeJS.Timeout;private lastSentAt=0;
  private current:WhatsAppConnectionStatus={state:'disconnected',updatedAt:new Date().toISOString()};
  constructor(private readonly authDir:string,private readonly publish:(status:WhatsAppConnectionStatus)=>void){}
  status(){return this.current}
  private update(next:Omit<WhatsAppConnectionStatus,'updatedAt'>){this.current={...next,updatedAt:new Date().toISOString()};this.publish(this.current)}
  async connect(){if(this.current.state==='connected'||this.current.state==='connecting'||this.current.state==='qr')return this.current;this.manualDisconnect=false;this.connecting=this.start();await this.connecting;return this.current}
  private async start(){try{this.update({state:'connecting',message:'Connecting to WhatsApp…'});const{state,saveCreds}=await useMultiFileAuthState(this.authDir);const socket=makeWASocket({auth:state,logger:pino({level:'silent'}),browser:Browsers.windows('Laundry Desk'),printQRInTerminal:false,markOnlineOnConnect:false,syncFullHistory:false,generateHighQualityLinkPreview:false});this.socket=socket;socket.ev.on('creds.update',saveCreds);socket.ev.on('connection.update',async update=>{if(update.qr){const qrDataUrl=await QRCode.toDataURL(update.qr,{width:360,margin:1});this.update({state:'qr',qrDataUrl,message:'Scan from WhatsApp → Linked devices'})}if(update.connection==='open'){this.update({state:'connected',account:socket.user?.id?.split(':')[0],message:'Automatic transactional messages are ready'});void this.flush()}if(update.connection==='close'){const code=new Boom(update.lastDisconnect?.error).output.statusCode;this.socket=undefined;if(code===DisconnectReason.loggedOut){this.update({state:'disconnected',message:'Session logged out. Connect and scan again.'})}else if(!this.manualDisconnect){this.update({state:'connecting',message:'Connection lost. Reconnecting…'});clearTimeout(this.reconnectTimer);this.reconnectTimer=setTimeout(()=>{this.connecting=undefined;void this.connect()},3000)}}});}catch(error){this.update({state:'error',message:error instanceof Error?error.message:String(error)})}finally{this.connecting=undefined}}
  async disconnect(){this.manualDisconnect=true;clearTimeout(this.reconnectTimer);try{await this.socket?.logout()}catch{}this.socket=undefined;rmSync(this.authDir,{recursive:true,force:true});this.queue.splice(0).forEach(j=>j.onFailed?.('WhatsApp was disconnected'));this.update({state:'disconnected',message:'Session removed from this computer'});return this.current}
  async send(job:Job):Promise<'queued'|'sent'>{const normalized=job.phone.replace(/\D/g,'');if(!/^91\d{10}$/.test(normalized))throw new Error('WhatsApp number must be an Indian number with country code 91');job.phone=normalized;if(this.current.state==='connected'&&this.socket){await this.sendNow(job);return'sent'}this.queue.push(job);if(this.current.state==='disconnected'||this.current.state==='error')void this.connect();return'queued'}
  private async sendNow(job:Job){if(!this.socket)throw new Error('WhatsApp is not connected');const cooldown=1500-(Date.now()-this.lastSentAt);if(cooldown>0)await wait(cooldown);try{const result=await this.socket.sendMessage(`${job.phone}@s.whatsapp.net`,{text:job.text});this.lastSentAt=Date.now();job.onSent?.(result?.key?.id||'sent')}catch(error){const message=error instanceof Error?error.message:String(error);job.onFailed?.(message);throw error}}
  private async flush(){if(this.flushing)return;this.flushing=true;try{while(this.socket&&this.current.state==='connected'&&this.queue.length){const job=this.queue.shift()!;try{await this.sendNow(job)}catch{}await wait(1500)}}finally{this.flushing=false}}
}
