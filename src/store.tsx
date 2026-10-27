import {useContext,useEffect,useState,type ReactNode} from 'react';
import {AppContext} from './context';
import {seed,type AppState} from './domain';
const KEY='trayce-demo-v1';
function load():AppState{try{const raw=localStorage.getItem(KEY);if(raw){const s=JSON.parse(raw);if(s.version===1&&Array.isArray(s.entries)&&Array.isArray(s.schedules))return s;}}catch{}return seed()}

export function Provider({children}:{children:ReactNode}){const [state,setState]=useState(load);const [notice,setNotice]=useState('');const [memoryOnly,setMemoryOnly]=useState(false);const [online,setOnline]=useState(navigator.onLine);const [syncing,setSyncing]=useState(false);
useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify(state));setMemoryOnly(false)}catch{setMemoryOnly(true)}},[state]);
useEffect(()=>{const update=()=>setOnline(navigator.onLine);window.addEventListener('online',update);window.addEventListener('offline',update);return()=>{window.removeEventListener('online',update);window.removeEventListener('offline',update)}},[]);
useEffect(()=>{if(state.offline||!online||!state.entries.some(e=>e.status==='sync'))return;setSyncing(true);const timer=setTimeout(()=>{setState(s=>({...s,entries:s.entries.map(e=>e.status==='sync'?{...e,status:'pending'}:e)}));setSyncing(false);setNotice('Sinkronisasi demo selesai. Entri siap divalidasi.');},1100);return()=>{clearTimeout(timer);setSyncing(false)}},[state.offline,online,state.entries]);
useEffect(()=>{if(!notice)return;const t=setTimeout(()=>setNotice(''),3800);return()=>clearTimeout(t)},[notice]);return <AppContext.Provider value={{state,setState,toast:setNotice,syncing,online,memoryOnly}}>{children}{notice&&<div className="toast" role="status">{notice}</div>}</AppContext.Provider>}
export function useApp(){const value=useContext(AppContext);if(!value)throw new Error('Komponen Trayce harus berada di dalam Provider.');return value;}
export function go(path:string){location.hash=path;document.querySelector('.app-scroll')?.scrollTo({top:0,behavior:'instant'});}
export function useRoute(){const [route,setRoute]=useState(location.hash.slice(1)||'/');useEffect(()=>{const h=()=>setRoute(location.hash.slice(1)||'/');addEventListener('hashchange',h);return()=>removeEventListener('hashchange',h)},[]);return route}
