import { describe, expect, it, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { setActivePinia } from 'pinia'
import type { UserProfileResponse, MfaLoginResponse } from '~/types/auth'
import { useAuthStore } from '~/stores/auth'
import LoginPage from '~/pages/login.vue'

const profile: UserProfileResponse = {
  username: 'john.doe',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  roles: ['EMPLOYEE'],
  enabled: true,
  mfaEnabled: false,
  mfaMethod: 'NONE',
}

const mfaChallenge: MfaLoginResponse = {
  mfaRequired: true,
  mfaSessionToken: 'mfa-token',
  method: 'TOTP',
  expiresIn: 300,
}

const ok = (data: unknown) => ({ success: true, message: 'ok', data, timestamp: '' })

const { authService } = vi.hoisted(() => ({
  authService: {
    login: vi.fn(),
    verifyMfa: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn().mockRejectedValue(new Error('no session')),
    changePassword: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
  },
}))

vi.mock('~/services/auth.service', () => ({ authService }))

async function mountPage() {
  const wrapper = await mountSuspended(LoginPage)
  await nextTick()
  await flushPromises()
  await new Promise(resolve => setTimeout(resolve, 20))
  return wrapper
}

async function fillUsername(wrapper: Awaited<ReturnType<typeof mountPage>>, value: string) {
  await wrapper.find('#usernameOrEmail').setValue(value)
  await flushPromises()
}

async function fillPassword(wrapper: Awaited<ReturnType<typeof mountPage>>, value: string) {
  await wrapper.find('#password input').setValue(value)
  await flushPromises()
}

async function submit(wrapper: Awaited<ReturnType<typeof mountPage>>) {
  await wrapper.find('form').trigger('submit')
  await flushPromises()
  await new Promise(resolve => setTimeout(resolve, 20))
  await flushPromises()
  await nextTick()
}

describe('login page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // The page writes to the app's auth store — reset it between tests so
    // state does not leak across cases.
    setActivePinia(useNuxtApp().$pinia)
    const store = useAuthStore()
    store.user = null
    store.pendingMfa = null
  })

  it('shows validation errors and does not call the service for an empty form', async () => {
    const wrapper = await mountPage()

    await submit(wrapper)

    expect(authService.login).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Username or email is required')
    expect(wrapper.text()).toContain('Password is required')
  })

  it('authenticates the user on a successful login', async () => {
    authService.login.mockResolvedValue(ok(profile))
    const wrapper = await mountPage()

    await fillUsername(wrapper, 'john.doe')
    await fillPassword(wrapper, 'Password123!')
    await submit(wrapper)

    expect(authService.login).toHaveBeenCalledWith({ usernameOrEmail: 'john.doe', password: 'Password123!' })
    const store = useAuthStore()
    expect(store.user?.username).toBe('john.doe')
    expect(store.pendingMfa).toBeNull()
  })

  it('stores the MFA challenge and does not authenticate when MFA is required', async () => {
    authService.login.mockResolvedValue(ok(mfaChallenge))
    const wrapper = await mountPage()

    await fillUsername(wrapper, 'john.doe')
    await fillPassword(wrapper, 'Password123!')
    await submit(wrapper)

    const store = useAuthStore()
    expect(store.pendingMfa?.method).toBe('TOTP')
    expect(store.user).toBeNull()
  })

  it('shows the error message when login fails', async () => {
    authService.login.mockResolvedValue({ success: false, message: 'Invalid credentials', data: null, timestamp: '' })
    const wrapper = await mountPage()

    await fillUsername(wrapper, 'john.doe')
    await fillPassword(wrapper, 'WrongPassword1!')
    await submit(wrapper)

    expect(wrapper.text()).toContain('Invalid credentials')
    expect(useAuthStore().user).toBeNull()
  })
})
