import {renderToStaticMarkup} from 'react-dom/server';
import {describe,expect,it} from 'vitest';
import {Select} from './ui';

describe('shortcut Select',()=>{
  it('labels selectable choices with the default numeric shortcuts',()=>{
    const html=renderToStaticMarkup(<Select><option value="">Choose</option><option value="cash">Cash</option><option value="upi">UPI</option></Select>);
    expect(html).toContain('<option value="">Choose</option>');
    expect(html).toContain('[1] Cash');
    expect(html).toContain('[2] UPI');
  });
});
