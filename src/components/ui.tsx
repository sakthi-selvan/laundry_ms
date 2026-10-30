import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import { X } from 'lucide-react';
export function Button({className='',variant='primary',...p}:ButtonHTMLAttributes<HTMLButtonElement>&{variant?:'primary'|'secondary'|'danger'|'ghost'}){return <button className={`button ${variant} ${className}`} {...p}/>}
export function Input(p:InputHTMLAttributes<HTMLInputElement>){return <input className="input" {...p}/>}
export function Select(p:SelectHTMLAttributes<HTMLSelectElement>){return <select className="input" {...p}/>}
export function Field({label,children,hint}:{label:string;children:ReactNode;hint?:string}){return <label className="field"><span>{label}</span>{children}{hint&&<small>{hint}</small>}</label>}
export function Card({children,className=''}:{children:ReactNode;className?:string}){return <section className={`card ${className}`}>{children}</section>}
export function Badge({children,tone='neutral'}:{children:ReactNode;tone?:string}){return <span className={`badge ${tone}`}>{children}</span>}
export function PageHeader({title,subtitle,actions}:{title:string;subtitle:string;actions?:ReactNode}){return <div className="page-header"><div><h1>{title}</h1><p>{subtitle}</p></div><div className="header-actions">{actions}</div></div>}
export function Empty({title,description}:{title:string;description:string}){return <div className="empty"><div className="empty-icon">✦</div><strong>{title}</strong><span>{description}</span></div>}
export function Modal({title,children,onClose,width='600px'}:{title:string;children:ReactNode;onClose:()=>void;width?:string}){return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className="modal" style={{maxWidth:width}}><div className="modal-head"><h2>{title}</h2><button onClick={onClose}><X size={20}/></button></div>{children}</div></div>}
export function Spinner(){return <div className="spinner"/>}
