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
  id: number;
  name: string;
  cause: string;
  details: string;
  image?: string;
  deathTime: string;
  status: VictimStatus;
}