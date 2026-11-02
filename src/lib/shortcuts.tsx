import {createContext,useContext,useEffect,useMemo,useState,type ReactNode} from 'react';

export const defaultDropdownShortcuts=['1','2','3','4','5','6','7','8','9'];
export function normalizeShortcuts(value:unknown){
  if(!Array.isArray(value))return [...defaultDropdownShortcuts];
  const used=new Set<string>();
  return defaultDropdownShortcuts.map((fallback,index)=>{
    const candidate=String(value[index]??'').trim().slice(0,1).toLocaleLowerCase();
    if(candidate&&!used.has(candidate)){used.add(candidate);return candidate}
    const replacement=[fallback,...defaultDropdownShortcuts].find(key=>!used.has(key))!;
    used.add(replacement);return replacement;
  });
}

type ShortcutContextValue={shortcuts:string[];setShortcuts:(value:string[])=>void};
const ShortcutContext=createContext<ShortcutContextValue>({shortcuts:defaultDropdownShortcuts,setShortcuts:()=>{}});
export function ShortcutProvider({children}:{children:ReactNode}){
  const[shortcuts,setValue]=useState(defaultDropdownShortcuts);
  useEffect(()=>{window.laundry.settings.get().then(settings=>setValue(normalizeShortcuts(settings.dropdownShortcuts)))},[]);
  const value=useMemo(()=>({shortcuts,setShortcuts:(next:string[])=>setValue(normalizeShortcuts(next))}),[shortcuts]);
  return <ShortcutContext.Provider value={value}>{children}</ShortcutContext.Provider>
}
export const useShortcuts=()=>useContext(ShortcutContext);
