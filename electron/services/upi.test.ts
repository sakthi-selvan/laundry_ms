import {describe,expect,it} from 'vitest';
import {createUpiUri} from './upi';

const order={orderNumber:'LD-20261030-001',balance:245.5} as never;
const settings={shopName:'செல்வம் Laundry',upiId:'selvam@upi',upiPayeeName:'Selvam Laundry'} as never;

describe('createUpiUri',()=>{
  it('encodes the exact order balance and reference',()=>{
    const uri=createUpiUri(order,settings);
    expect(uri).toContain('pa=selvam%40upi');
    expect(uri).toContain('am=245.50');
    expect(uri).toContain('cu=INR');
    expect(uri).toContain('LD-20261030-001');
  });
  it('stays disabled until a UPI ID is configured',()=>{
    expect(createUpiUri(order,{...settings,upiId:' '})).toBe('');
  });
});
