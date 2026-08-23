/**
 * Auth DTOs — mirror the Spring Boot backend contracts exactly
 * (see spring-boilerplate: LoginRequest, TokenResponse, MfaLoginResponse,
 * MfaVerifyRequest, UserProfileResponse).
 */

export interface LoginRequest {
  usernameOrEmail: string
  password: string
  rememberMe?: boolean
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  username: string
  roles: string[]
}

export type MfaMethod = 'NONE' | 'TOTP' | 'EMAIL'

export interface MfaLoginResponse {
  mfaRequired: boolean
  mfaSessionToken: string
  method: MfaMethod
  expiresIn: number
}

export interface MfaVerifyRequest {
  mfaSessionToken: string
  code: string
}

export interface UserProfileResponse {
  username: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
  enabled: boolean
  mfaEnabled: boolean
  mfaMethod: MfaMethod
}

/**
 * Authenticated user in the store: the `/api/auth/me` profile plus a
 * permission set derived client-side from roles (the backend does not expose
 * permissions for the current user; the server remains the enforcement point).
 */
export interface AuthUser extends UserProfileResponse {
  permissions: string[]
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
  confirmPassword: string
}
