/// <reference types="vite/client" />
import type { LaundryAPI } from '../shared/types';
declare global { interface Window { laundry: LaundryAPI; } }
export {};
