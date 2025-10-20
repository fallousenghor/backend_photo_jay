import type { Product } from './Product';
import type { User } from './User';
import type { Action } from '@prisma/client';

export interface ModerationLog {
  id: number;
  productId: number;
  product?: Product | { id: number; title: string };
  moderatorId: number;
  moderator?: User | { id: number; userName: string };
  action: Action;
  reason: string | null;
  createdAt: Date;
}

export interface CreateModerationLog {
  productId: number;
  moderatorId: number;
  action: Action;
  reason?: string | null;
}

export interface UpdateModerationLog {
  productId?: number;
  moderatorId?: number;
  action?: Action;
  reason?: string | null;
}
