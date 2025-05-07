// signin/model/types.ts
export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignInResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  }
}

export interface SignInFormState {
  email: string;
  password: string;
  isLoading: boolean;
  error: string | null;
}
