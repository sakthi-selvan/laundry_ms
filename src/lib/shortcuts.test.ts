import {describe,expect,it} from 'vitest';
import {defaultDropdownShortcuts,normalizeShortcuts} from './shortcuts';

describe('dropdown shortcuts',()=>{
  it('uses numeric defaults when no saved setting exists',()=>expect(normalizeShortcuts(undefined)).toEqual(defaultDropdownShortcuts));
  it('normalizes custom keys and replaces duplicates',()=>expect(normalizeShortcuts(['A','b','A'])).toEqual(['a','b','3','4','5','6','7','8','9']));
  it('keeps every shortcut unique when a custom key uses a later default',()=>expect(normalizeShortcuts(['2','2'])).toEqual(['2','1','3','4','5','6','7','8','9']));
});
