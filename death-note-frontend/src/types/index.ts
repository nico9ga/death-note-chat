export type SenderType = 'system' | 'user';

export interface Message {
  id: number;
  text: string;
  sender: SenderType;
  isInstruction?: boolean;
  requiresAction?: boolean;
  actionType?: 'name' | 'cause' | 'image' | 'confirm';
}

export type VictimStatus = 'executed' | 'failed' | 'cancelled';

export interface Victim {
  id: string; 
  name: string;
  lastName: string;
  deathType?: string;
  details?: string; 
  image?: string;
  images?: string[]; 
  deathTime: string;
  status: VictimStatus;
}


export interface CreateVictimRequest {
  name: string;
  lastName: string;
  deathType?: string;
  images?: string[];
}

export interface AddDeathDetailsRequest {
  details: string;
}

export interface VictimResponse {
  id: string;
  name: string;
  lastName: string;
  deathType?: string;
  details?: string;
  images?: string[];
  deathTime: string;
  status: VictimStatus;
}