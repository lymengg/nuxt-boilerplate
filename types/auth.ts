/**
 * Auth DTOs — mirror the Spring Boot backend contracts exactly
 * (see spring-boilerplate: LoginRequest, MfaLoginResponse,
 * MfaVerifyRequest, UserProfileResponse).
 */

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
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
  email: string
  firstName: string
  lastName: string
  roles: string[]
  permissions: string[]
  enabled: boolean
  mfaEnabled: boolean
  mfaMethod: MfaMethod | null
}

/**
 * Authenticated user in the store: the `/api/auth/me` profile.
 *
 * The backend now returns the effective permission set in `permissions`, so the
 * frontend no longer derives permissions client-side. The store only displays
 * what the backend sent; the server remains the enforcement point.
 */
export type AuthUser = UserProfileResponse

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
