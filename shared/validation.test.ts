import {describe,expect,it} from 'vitest';
import {updateOrderSchema} from './validation.js';

const valid={customerId:'5d81e138-4458-49ef-9a39-a79cf4a844c7',expectedDeliveryAt:'2026-11-05T18:00:00.000Z',discount:20,instructions:'Use light starch',items:[{clothingItemId:'item',serviceId:'service',itemName:'Shirt',serviceName:'Wash & Iron',quantity:2,unitPrice:50,billingMode:'piece' as const}]};

describe('order update validation',()=>{
  it('accepts editable order details without changing payment history',()=>expect(updateOrderSchema.parse(valid)).toEqual(valid));
  it('requires at least one garment row',()=>expect(()=>updateOrderSchema.parse({...valid,items:[]})).toThrow());
  it('rejects zero or negative quantities',()=>expect(()=>updateOrderSchema.parse({...valid,items:[{...valid.items[0],quantity:0}]})).toThrow());
});
