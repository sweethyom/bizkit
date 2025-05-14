export interface ApiResponse<T = void> {
  result: 'SUCCESS' | 'ERROR';
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
