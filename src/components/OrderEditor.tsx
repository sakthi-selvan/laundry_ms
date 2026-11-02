import {useMemo,useState} from 'react';
import {Plus,Save,Trash2} from 'lucide-react';
import type {BillingMode,CatalogItem,Customer,OrderDetail,OrderLineInput,PriceEntry,UpdateOrderInput} from '@shared/types';
import {Button,Field,Input,Select} from './ui';
import {errorMessage,money} from '@/lib/utils';

type Catalog={clothing:CatalogItem[];services:CatalogItem[];prices:PriceEntry[]};
type EditLine={clothingItemId:string;serviceId:string;quantity:number;unitPrice:number;billingMode:BillingMode;notes:string};
const emptyLine=():EditLine=>({clothingItemId:'',serviceId:'',quantity:1,unitPrice:0,billingMode:'piece',notes:''});

export function OrderEditor({order,customers,catalog,onCancel,onSaved}:{order:OrderDetail;customers:Customer[];catalog:Catalog;onCancel:()=>void;onSaved:(order:OrderDetail)=>void}){
  const[customerId,setCustomerId]=useState(order.customerId),[delivery,setDelivery]=useState(order.expectedDeliveryAt.slice(0,10)),[instructions,setInstructions]=useState(order.instructions||''),[discount,setDiscount]=useState(order.discount),[lines,setLines]=useState<EditLine[]>(order.items.map(item=>({clothingItemId:item.clothingItemId,serviceId:item.serviceId,quantity:item.quantity,unitPrice:item.unitPrice,billingMode:item.billingMode,notes:item.notes||''}))),[saving,setSaving]=useState(false),[error,setError]=useState('');
  const subtotal=useMemo(()=>lines.reduce((sum,line)=>sum+line.quantity*line.unitPrice,0),[lines]);
  const total=Math.max(0,subtotal-discount),balance=total-order.paid,invalidTotal=total<order.paid;
  function change(index:number,part:Partial<EditLine>){setLines(current=>current.map((line,i)=>{if(i!==index)return line;const next={...line,...part};if(part.clothingItemId!==undefined||part.serviceId!==undefined||part.billingMode!==undefined){const price=catalog.prices.find(p=>p.clothingItemId===next.clothingItemId&&p.serviceId===next.serviceId&&p.billingMode===next.billingMode);next.unitPrice=price?.price||0}return next}))}
  async function save(){
    if(!customerId){setError('Choose a customer');return}
    if(lines.some(line=>!line.clothingItemId||!line.serviceId)){setError('Choose an item and service for every row');return}
    if(discount>subtotal){setError('Discount cannot exceed the subtotal');return}
    if(invalidTotal){setError(`Revised total cannot be below the ${money(order.paid)} already paid`);return}
    try{
      setSaving(true);setError('');
      const input:UpdateOrderInput={customerId,expectedDeliveryAt:new Date(`${delivery}T18:00:00`).toISOString(),discount,instructions,items:lines.map(line=>({...line,itemName:catalog.clothing.find(item=>item.id===line.clothingItemId)?.name||'',serviceName:catalog.services.find(service=>service.id===line.serviceId)?.name||''} satisfies OrderLineInput))};
      onSaved(await window.laundry.orders.update(order.id,input));
    }catch(caught){setError(errorMessage(caught))}finally{setSaving(false)}
  }
  return <div className="order-editor">
    <div className="edit-order-top">
      <Field label="Customer"><Select value={customerId} onChange={event=>setCustomerId(event.target.value)}>{customers.map(customer=><option key={customer.id} value={customer.id}>{customer.name} — {customer.mobile}</option>)}</Select></Field>
      <Field label="Expected delivery"><Input type="date" value={delivery} onChange={event=>setDelivery(event.target.value)}/></Field>
      <Field label="Special instructions"><Input value={instructions} onChange={event=>setInstructions(event.target.value)} placeholder="Stains, starch, delicate fabric…"/></Field>
    </div>
    <div className="edit-items-head"><div><strong>Garments and services</strong><span>Change item, service, quantity, weight or rate directly</span></div><Button variant="secondary" onClick={()=>setLines(current=>[...current,emptyLine()])}><Plus size={15}/> Add item</Button></div>
    <div className="edit-line-head"><span>Item</span><span>Service</span><span>Billing</span><span>Qty / kg</span><span>Rate</span><span>Total</span><span/></div>
    {lines.map((line,index)=><div className="edit-line-wrap" key={index}><div className="edit-order-line">
      <Select value={line.clothingItemId} onChange={event=>change(index,{clothingItemId:event.target.value})}><option value="">Choose item</option>{catalog.clothing.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</Select>
      <Select value={line.serviceId} onChange={event=>change(index,{serviceId:event.target.value})}><option value="">Choose service</option>{catalog.services.map(service=><option key={service.id} value={service.id}>{service.name}</option>)}</Select>
      <Select value={line.billingMode} onChange={event=>change(index,{billingMode:event.target.value as BillingMode})}><option value="piece">Per piece</option><option value="weight">Per kg</option></Select>
      <Input type="number" min={line.billingMode==='weight'?0.1:1} step={line.billingMode==='weight'?0.1:1} value={line.quantity} onChange={event=>change(index,{quantity:Number(event.target.value)})}/>
      <Input type="number" min={0} step="0.01" value={line.unitPrice} onChange={event=>change(index,{unitPrice:Number(event.target.value)})}/>
      <strong>{money(line.quantity*line.unitPrice)}</strong>
      <button className="icon-danger" title="Remove item" disabled={lines.length===1} onClick={()=>setLines(current=>current.filter((_,i)=>i!==index))}><Trash2 size={17}/></button>
    </div><Input className="input edit-item-note" value={line.notes} onChange={event=>change(index,{notes:event.target.value})} placeholder="Optional note for this item"/></div>)}
    <div className="edit-order-summary"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><Field label="Total discount"><Input type="number" min={0} max={subtotal} step="0.01" value={discount} onChange={event=>setDiscount(Number(event.target.value))}/></Field><div><span>Already paid</span><strong>{money(order.paid)}</strong></div><div className="edit-grand"><span>Revised total</span><strong>{money(total)}</strong></div><div className={invalidTotal?'edit-invalid':''}><span>Balance</span><strong>{money(balance)}</strong></div></div>
    {invalidTotal&&<div className="alert error">The revised total is below the amount already paid. Increase the total or reduce the discount.</div>}{error&&<div className="alert error">{error}</div>}
    <div className="modal-actions"><Button variant="secondary" onClick={onCancel}>Cancel</Button><Button onClick={save} disabled={saving||invalidTotal}><Save size={16}/> {saving?'Saving…':'Save order changes'}</Button></div>
  </div>
}
