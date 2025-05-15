// signin/model/types.ts
import { TokenInfo } from '@/shared/model';

export interface SignInCredentials {
  username: string; // 이메일 형식
  password: string;
}

// 로그인 응답형은 TokenInfo와 동일함
export type SignInResponse = TokenInfo;
