import {createContext,type Dispatch,type SetStateAction} from 'react';
import type {AppState} from './domain';
export interface AppContextValue {state:AppState;setState:Dispatch<SetStateAction<AppState>>;toast:(s:string)=>void;syncing:boolean;online:boolean;memoryOnly:boolean}
// Keep the context identity separate from hot-reloaded provider/component modules.
export const AppContext=createContext<AppContextValue|null>(null);
