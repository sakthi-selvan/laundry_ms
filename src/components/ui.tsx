import {Children,cloneElement,isValidElement} from 'react';
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactElement, ReactNode, SelectHTMLAttributes } from 'react';
import { X } from 'lucide-react';
import {useI18n} from '@/lib/i18n';
import {useShortcuts} from '@/lib/shortcuts';
export function Button({className='',variant='primary',...p}:ButtonHTMLAttributes<HTMLButtonElement>&{variant?:'primary'|'secondary'|'danger'|'ghost'}){return <button className={`button ${variant} ${className}`} {...p}/>}
export function Input(p:InputHTMLAttributes<HTMLInputElement>){return <input className="input" {...p}/>}
export function Select({children,onKeyDown,...p}:SelectHTMLAttributes<HTMLSelectElement>){
  const{shortcuts}=useShortcuts();let optionIndex=0;const values:string[]=[];
  const decorated=Children.map(children,child=>{
    if(!isValidElement(child)||child.type!=='option')return child;
    const option=child as ReactElement<{value?:string;children?:ReactNode;disabled?:boolean}>;
    const selectable=!option.props.disabled&&String(option.props.value??'')!=='';
    if(!selectable)return option;
    const key=shortcuts[optionIndex++];if(!key)return option;values.push(String(option.props.value));
    return cloneElement(option,{},<>[{key}] {option.props.children}</>);
  });
  return <select className="input shortcut-select" {...p} onKeyDown={event=>{
    onKeyDown?.(event);if(event.defaultPrevented||event.altKey||event.ctrlKey||event.metaKey)return;
    const index=shortcuts.findIndex(key=>key.toLocaleLowerCase()===event.key.toLocaleLowerCase());
    if(index<0||!values[index])return;event.preventDefault();event.currentTarget.value=values[index];event.currentTarget.dispatchEvent(new Event('change',{bubbles:true}));
  }}>{decorated}</select>
}
export function Field({label,children,hint}:{label:string;children:ReactNode;hint?:string}){return <label className="field"><span>{label}</span>{children}{hint&&<small>{hint}</small>}</label>}
export function Card({children,className=''}:{children:ReactNode;className?:string}){return <section className={`card ${className}`}>{children}</section>}
export function Badge({children,tone='neutral'}:{children:ReactNode;tone?:string}){return <span className={`badge ${tone}`}>{children}</span>}
export function PageHeader({title,subtitle,actions}:{title:string;subtitle:string;actions?:ReactNode}){const{t}=useI18n();return <div className="page-header"><div><h1>{t(title)}</h1><p>{t(subtitle)}</p></div><div className="header-actions">{actions}</div></div>}
export function Empty({title,description}:{title:string;description:string}){return <div className="empty"><div className="empty-icon">✦</div><strong>{title}</strong><span>{description}</span></div>}
export function Modal({title,children,onClose,width='600px'}:{title:string;children:ReactNode;onClose:()=>void;width?:string}){return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className="modal" style={{maxWidth:width}}><div className="modal-head"><h2>{title}</h2><button onClick={onClose}><X size={20}/></button></div>{children}</div></div>}
export function Spinner(){return <div className="spinner"/>}
