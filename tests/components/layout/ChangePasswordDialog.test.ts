import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import ChangePasswordDialog from '~/components/layout/ChangePasswordDialog.vue'

// The dialog calls authStore.changePassword(), which delegates to
// authService — mock the service seam (the real store must stay intact for
// the app's auth.client plugin and route middleware).
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

const dialogStub = {
  template: '<div><slot /><slot name="footer" /></div>',
}

async function mountDialog() {
  const wrapper = await mountSuspended(ChangePasswordDialog, {
    props: { visible: false },
    global: { stubs: { Dialog: dialogStub } },
  })
  await wrapper.setProps({ visible: true })
  await nextTick()
  await flushPromises()
  await new Promise(resolve => setTimeout(resolve, 20))
  return wrapper
}

async function fill(wrapper: Awaited<ReturnType<typeof mountDialog>>, id: string, value: string) {
  // PrimeVue Password puts the id on a wrapper div; the input is inside.
  await wrapper.find(`#${id} input`).setValue(value)
  await flushPromises()
}

async function submit(wrapper: Awaited<ReturnType<typeof mountDialog>>) {
  await wrapper.find('form').trigger('submit')
  await flushPromises()
  await new Promise(resolve => setTimeout(resolve, 20))
  await flushPromises()
  await nextTick()
}

describe('ChangePasswordDialog', () => {
  let mounted: Awaited<ReturnType<typeof mountDialog>> | undefined

  beforeEach(() => {
    vi.clearAllMocks()
    authService.changePassword.mockResolvedValue({ success: true, message: 'ok', data: null, timestamp: '' })
  })

  afterEach(() => {
    mounted?.unmount()
    mounted = undefined
  })

  it('calls the auth store and closes on a successful change', async () => {
    const wrapper = await mountDialog()
    mounted = wrapper

    await fill(wrapper, 'currentPassword', 'OldPassword1!')
    await fill(wrapper, 'newPassword', 'NewPassword123!')
    await fill(wrapper, 'confirmPassword', 'NewPassword123!')
    await submit(wrapper)

    expect(authService.changePassword).toHaveBeenCalledWith({
      currentPassword: 'OldPassword1!',
      newPassword: 'NewPassword123!',
      confirmPassword: 'NewPassword123!',
    })
    // The dialog closes itself via the visible model.
    expect(wrapper.emitted('update:visible')?.at(-1)).toEqual([false])
  })

  it('does not submit when validation fails', async () => {
    const wrapper = await mountDialog()
    mounted = wrapper

    await submit(wrapper)

    expect(authService.changePassword).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Current password is required')
    expect(wrapper.text()).toContain('New password is required')
  })

  it('rejects mismatched confirmation', async () => {
    const wrapper = await mountDialog()
    mounted = wrapper

    await fill(wrapper, 'currentPassword', 'OldPassword1!')
    await fill(wrapper, 'newPassword', 'NewPassword123!')
    await fill(wrapper, 'confirmPassword', 'Different123!')
    await submit(wrapper)

    expect(authService.changePassword).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Passwords do not match')
  })

  it('shows a general error when the change fails', async () => {
    authService.changePassword.mockRejectedValue(new Error('Current password is incorrect'))
    const wrapper = await mountDialog()
    mounted = wrapper

    await fill(wrapper, 'currentPassword', 'WrongPassword1!')
    await fill(wrapper, 'newPassword', 'NewPassword123!')
    await fill(wrapper, 'confirmPassword', 'NewPassword123!')
    await submit(wrapper)

    expect(wrapper.text()).toContain('Current password is incorrect')
  })
})
