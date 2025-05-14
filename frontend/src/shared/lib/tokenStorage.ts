import { TokenInfo } from '@/shared/model/types';
import { Storage } from './storage';

export const tokenStorage = new Storage<TokenInfo>('auth-token-info');
