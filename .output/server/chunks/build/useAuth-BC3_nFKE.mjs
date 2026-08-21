import { a as apiFetch } from './api-BiGERn36.mjs';
import { toRefs, reactive } from 'vue';
import { b as useRouter } from './server.mjs';

const authState = reactive({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isMfaPending: false,
  isLoading: false
});
function useAuth() {
  const router = useRouter();
  async function login(email, password) {
    var _a;
    authState.isLoading = true;
    try {
      const response = await apiFetch(
        "/api/auth/login",
        {
          method: "POST",
          body: { email, password }
        }
      );
      if (response.success && response.data) {
        if (response.data.requiresMfa) {
          authState.isMfaPending = true;
          return { requiresMfa: true };
        }
        authState.accessToken = response.data.accessToken;
        authState.user = response.data.user;
        authState.isAuthenticated = true;
        return { success: true };
      }
      return { error: response.message || "Login failed" };
    } catch (error) {
      const err = error;
      return { error: ((_a = err.data) == null ? void 0 : _a.message) || "Login failed" };
    } finally {
      authState.isLoading = false;
    }
  }
  async function verifyMfa(code) {
    var _a;
    authState.isLoading = true;
    try {
      const response = await apiFetch(
        "/api/auth/mfa/verify",
        {
          method: "POST",
          body: { code }
        }
      );
      if (response.success && response.data) {
        authState.accessToken = response.data.accessToken;
        authState.user = response.data.user;
        authState.isAuthenticated = true;
        authState.isMfaPending = false;
        return { success: true };
      }
      return { error: response.message || "MFA verification failed" };
    } catch (error) {
      const err = error;
      return { error: ((_a = err.data) == null ? void 0 : _a.message) || "MFA verification failed" };
    } finally {
      authState.isLoading = false;
    }
  }
  async function logout() {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } finally {
      authState.accessToken = null;
      authState.user = null;
      authState.isAuthenticated = false;
      authState.isMfaPending = false;
      router.push("/login");
    }
  }
  function initializeAuth(user, accessToken) {
    authState.user = user;
    authState.accessToken = accessToken;
    authState.isAuthenticated = true;
  }
  return {
    ...toRefs(authState),
    login,
    verifyMfa,
    logout,
    initializeAuth
  };
}

export { useAuth as u };
//# sourceMappingURL=useAuth-BC3_nFKE.mjs.map
