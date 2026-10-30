import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LaundryDatabase } from './db/database.js';
import { registerIpc } from './ipc.js';
const dir=path.dirname(fileURLToPath(import.meta.url));let db:LaundryDatabase|null=null;
function createWindow(){const window=new BrowserWindow({width:1440,height:900,minWidth:1100,minHeight:700,backgroundColor:'#f5f7fb',show:false,webPreferences:{preload:path.join(dir,'preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true}});db=new LaundryDatabase();registerIpc(db,window);if(process.env.VITE_DEV_SERVER_URL)window.loadURL(process.env.VITE_DEV_SERVER_URL);else window.loadFile(path.join(dir,'../../dist/index.html'));window.once('ready-to-show',()=>window.show());}
app.whenReady().then(createWindow);app.on('window-all-closed',()=>{db?.close();if(process.platform!=='darwin')app.quit();});app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});
