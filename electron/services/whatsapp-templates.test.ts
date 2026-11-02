import {describe,expect,it} from 'vitest';
import {buildWhatsAppMessage} from './whatsapp-templates.js';

const order={customerName:'Arun',orderNumber:'LD-001',total:240,paid:100,balance:140,expectedDeliveryAt:'2026-11-03T18:00:00.000Z',items:[{itemName:'Shirt',quantity:2,billingMode:'piece',serviceName:'Wash and Iron'}]} as any;
const settings={shopName:'Selvam Laundry',communicationLanguage:'both'} as any;

describe('WhatsApp transactional templates',()=>{
  it('builds a bilingual confirmation with order details',()=>{const message=buildWhatsAppMessage(order,settings,'confirmation');expect(message).toContain('உங்கள் சலவை ஆர்டர்');expect(message).toContain('Your laundry order');expect(message).toContain('LD-001');expect(message).toContain('₹240.00')});
  it('builds an exact-balance reminder',()=>{const message=buildWhatsAppMessage(order,{...settings,communicationLanguage:'en'},'reminder');expect(message).toContain('Balance: ₹140.00');expect(message).not.toContain('உங்கள்')});
});
