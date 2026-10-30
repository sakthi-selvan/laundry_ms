import {createContext,useContext,useMemo,useState,type ReactNode} from 'react';
type UiLanguage='en'|'ta';
const tamil:Record<string,string>={
  'Dashboard':'முகப்பு','New Order':'புதிய ஆர்டர்','All Orders':'அனைத்து ஆர்டர்கள்','Customers':'வாடிக்கையாளர்கள்','Payments':'கட்டணங்கள்','Price Management':'விலை நிர்வாகம்','Reports':'அறிக்கைகள்','Settings':'அமைப்புகள்','Admin Panel':'நிர்வாகம்',
  'Good morning':'வணக்கம்','New order':'புதிய ஆர்டர்','All orders':'அனைத்து ஆர்டர்கள்','Price management':'விலை நிர்வாகம்','Admin panel':'நிர்வாகம்',
  'Shop management':'கடை நிர்வாகம்','Local database':'உள்ளூர் தரவுத்தளம்','Stored securely on this PC':'இந்தக் கணினியில் பாதுகாப்பாக சேமிக்கப்பட்டுள்ளது',
  'Today at a glance':'இன்றைய நிலவரம்','Quick order entry':'விரைவு ஆர்டர் பதிவு','Administrator':'நிர்வாகி','Local account':'உள்ளூர் கணக்கு',
  'Manage customer details, balances and order history.':'வாடிக்கையாளர் விவரங்கள், நிலுவை மற்றும் ஆர்டர் வரலாற்றை நிர்வகிக்கவும்.',
  'Search, track and manage every laundry order.':'அனைத்து சலவை ஆர்டர்களையும் தேடி நிர்வகிக்கவும்.',
  'Record collections without overwriting payment history.':'பழைய கட்டண பதிவுகளை மாற்றாமல் புதிய கட்டணத்தை பதிவு செய்யவும்.',
  'Create a bill quickly — by piece or by kilogram.':'துணி எண்ணிக்கை அல்லது கிலோ அடிப்படையில் விரைவாக பில் உருவாக்கவும்.',
  'Maintain separate per-piece and per-kilogram rates without changing old orders.':'பழைய ஆர்டர்களை மாற்றாமல் துணி மற்றும் கிலோ விலைகளை தனித்தனியாக நிர்வகிக்கவும்.',
  'Configure bilingual communication, UPI payments, receipts and data protection.':'தமிழ் தொடர்பு, UPI கட்டணம், ரசீது மற்றும் தரவு பாதுகாப்பை அமைக்கவும்.'
};
const Context=createContext({language:'en' as UiLanguage,setLanguage:(_v:UiLanguage)=>{},t:(v:string)=>v});
export function I18nProvider({children}:{children:ReactNode}){const[language,setState]=useState<UiLanguage>(()=>(localStorage.getItem('laundry-ui-language') as UiLanguage)||'en');const value=useMemo(()=>({language,setLanguage:(v:UiLanguage)=>{localStorage.setItem('laundry-ui-language',v);setState(v)},t:(v:string)=>language==='ta'?(tamil[v]||v):v}),[language]);return <Context.Provider value={value}>{children}</Context.Provider>}
export const useI18n=()=>useContext(Context);
