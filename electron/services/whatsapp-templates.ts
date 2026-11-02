import type { OrderDetail, ShopSettings } from '../../shared/types.js';

export type WhatsAppMessageType='confirmation'|'ready'|'reminder';
export function buildWhatsAppMessage(order:OrderDetail,settings:ShopSettings,type:WhatsAppMessageType){
  const items=order.items.map(i=>`${i.itemName} ${i.quantity}${i.billingMode==='weight'?'kg':' pcs'} (${i.serviceName})`).join(', ');
  const delivery=new Date(order.expectedDeliveryAt).toLocaleDateString('en-IN');
  const en={confirmation:`Hello ${order.customerName},\n\nYour laundry order has been received successfully.\nOrder ID: ${order.orderNumber}\nItems: ${items}\nTotal: ₹${order.total.toFixed(2)}\nDelivery: ${delivery}\n\nThank you for choosing ${settings.shopName}.`,ready:`Hello ${order.customerName},\n\nYour laundry order ${order.orderNumber} is ready for collection. Please visit our shop to collect your clothes.\n\nThank you.`,reminder:`Hello ${order.customerName},\n\nPayment reminder for order ${order.orderNumber}.\nTotal: ₹${order.total.toFixed(2)}\nPaid: ₹${order.paid.toFixed(2)}\nBalance: ₹${order.balance.toFixed(2)}\n\nThank you.`};
  const ta={confirmation:`வணக்கம் ${order.customerName},\n\nஉங்கள் சலவை ஆர்டர் பெறப்பட்டது.\nஆர்டர் எண்: ${order.orderNumber}\nதுணிகள்: ${items}\nமொத்த தொகை: ₹${order.total.toFixed(2)}\nவிநியோக தேதி: ${delivery}\n\n${settings.shopName}-ஐ தேர்ந்தெடுத்ததற்கு நன்றி.`,ready:`வணக்கம் ${order.customerName},\n\nஉங்கள் சலவை ஆர்டர் ${order.orderNumber} தயாராக உள்ளது. துணிகளை பெற்றுக்கொள்ள எங்கள் கடைக்கு வரவும்.\n\nநன்றி.`,reminder:`வணக்கம் ${order.customerName},\n\nஆர்டர் ${order.orderNumber}-க்கான கட்டண நினைவூட்டல்.\nமொத்த தொகை: ₹${order.total.toFixed(2)}\nசெலுத்தியது: ₹${order.paid.toFixed(2)}\nமீதித் தொகை: ₹${order.balance.toFixed(2)}\n\nநன்றி.`};
  return settings.communicationLanguage==='ta'?ta[type]:settings.communicationLanguage==='both'?`${ta[type]}\n\n----------------\n\n${en[type]}`:en[type];
}
