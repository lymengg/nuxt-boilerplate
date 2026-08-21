export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  requiresMfa: boolean
  user: AuthUser
}

export interface MfaVerifyRequest {
  token: string
}

export interface MfaVerifyResponse {
  accessToken: string
  user: AuthUser
}

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  tenantId: string
  tenantName: string
  roles: string[]
  permissions: string[]
}

export interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  isAuthenticated: boolean
  isInitialized: boolean
}
