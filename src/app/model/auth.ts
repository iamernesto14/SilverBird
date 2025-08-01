export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  roles: string[];
}

export interface ApiWrapper<T> {
  data: T | null;
  status: number;
  success: boolean;
  error: string[];
  message: string;
  timestamp: string;
}


export interface LoginRequest {
  email: string;
  password: string;
}