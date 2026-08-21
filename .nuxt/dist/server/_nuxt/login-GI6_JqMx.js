import { defineComponent, reactive, ref, mergeProps, unref, withCtx, createVNode, withModifiers, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import script$3 from "./index-BDaj-nhv.js";
import script from "./index-CDExI0xy.js";
import script$1 from "./index-CnIUS0M4.js";
import script$2 from "./index-BMOkN0oS.js";
import "/home/runner/work/nuxt-boilerplate/nuxt-boilerplate/node_modules/hookable/dist/index.mjs";
import { u as useAuth } from "./useAuth-BC3_nFKE.js";
import { n as navigateTo } from "../server.mjs";
import "@primeuix/utils";
import "@primeuix/utils/object";
import "./index-RZE_erJD.js";
import "./index-DxKIPVaB.js";
import "./index-DI7ROuCk.js";
import "@primeuix/styled";
import "@primeuix/utils/dom";
import "./index-IoILXe0H.js";
import "@primeuix/styles/badge";
import "./index-DmGtcQDa.js";
import "./index-Dl3T3yr5.js";
import "@primeuix/utils/uuid";
import "@primeuix/styles/ripple";
import "@primeuix/styles/button";
import "@primeuix/styles/card";
import "./index-xRlVhXwl.js";
import "./index-BDpKneMc.js";
import "@primeuix/styles/inputtext";
import "@primeuix/utils/zindex";
import "./index-1v7fOn3J.js";
import "./index-DaAWxXsm.js";
import "./index-BJFn3Jal.js";
import "./index-rAVNvoJo.js";
import "@primeuix/utils/eventbus";
import "./index-zZrFrjQS.js";
import "@primeuix/styles/password";
import "./api-BiGERn36.js";
import "/home/runner/work/nuxt-boilerplate/nuxt-boilerplate/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/home/runner/work/nuxt-boilerplate/nuxt-boilerplate/node_modules/unctx/dist/index.mjs";
import "/home/runner/work/nuxt-boilerplate/nuxt-boilerplate/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/home/runner/work/nuxt-boilerplate/nuxt-boilerplate/node_modules/defu/dist/defu.mjs";
import "/home/runner/work/nuxt-boilerplate/nuxt-boilerplate/node_modules/ufo/dist/index.mjs";
import "@primeuix/styles/base";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const { login, isLoading } = useAuth();
    const form = reactive({
      email: "",
      password: ""
    });
    const errors = reactive({
      email: "",
      password: ""
    });
    const serverError = ref("");
    function validate() {
      let valid = true;
      errors.email = "";
      errors.password = "";
      if (!form.email) {
        errors.email = "Email is required";
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = "Please enter a valid email";
        valid = false;
      }
      if (!form.password) {
        errors.password = "Password is required";
        valid = false;
      }
      return valid;
    }
    async function handleLogin() {
      serverError.value = "";
      if (!validate()) return;
      const result = await login(form.email, form.password);
      if (result.success) {
        navigateTo("/dashboard");
      } else if ("requiresMfa" in result && result.requiresMfa) {
        navigateTo("/mfa/verify");
      } else if ("error" in result) {
        serverError.value = result.error;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex items-center justify-center bg-surface-50 p-4" }, _attrs))}><div class="w-full max-w-md"><div class="text-center mb-8"><div class="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4"><span class="text-white font-bold text-lg">EM</span></div><h1 class="text-2xl font-semibold text-surface-900">Expense Management</h1><p class="text-sm text-surface-500 mt-1">Sign in to your account</p></div>`);
      _push(ssrRenderComponent(unref(script), { class: "shadow-sm" }, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="space-y-4"${_scopeId}><div class="form-field"${_scopeId}><label for="email" class="form-label"${_scopeId}>Email</label>`);
            _push2(ssrRenderComponent(unref(script$1), {
              id: "email",
              modelValue: unref(form).email,
              "onUpdate:modelValue": ($event) => unref(form).email = $event,
              type: "email",
              placeholder: "you@company.com",
              class: "w-full",
              invalid: !!unref(errors).email,
              disabled: unref(isLoading),
              "aria-describedby": "email-error"
            }, null, _parent2, _scopeId));
            if (unref(errors).email) {
              _push2(`<small id="email-error" class="form-error"${_scopeId}>${ssrInterpolate(unref(errors).email)}</small>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="form-field"${_scopeId}><label for="password" class="form-label"${_scopeId}>Password</label>`);
            _push2(ssrRenderComponent(unref(script$2), {
              id: "password",
              modelValue: unref(form).password,
              "onUpdate:modelValue": ($event) => unref(form).password = $event,
              placeholder: "Enter your password",
              feedback: false,
              toggleMask: "",
              class: "w-full",
              inputClass: "w-full",
              invalid: !!unref(errors).password,
              disabled: unref(isLoading),
              "aria-describedby": "password-error"
            }, null, _parent2, _scopeId));
            if (unref(errors).password) {
              _push2(`<small id="password-error" class="form-error"${_scopeId}>${ssrInterpolate(unref(errors).password)}</small>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (unref(serverError)) {
              _push2(`<div class="p-3 bg-red-50 border border-red-200 rounded-lg"${_scopeId}><p class="text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(serverError))}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(script$3), {
              type: "submit",
              label: "Sign In",
              class: "w-full",
              loading: unref(isLoading),
              disabled: unref(isLoading)
            }, null, _parent2, _scopeId));
            _push2(`</form>`);
          } else {
            return [
              createVNode("form", {
                onSubmit: withModifiers(handleLogin, ["prevent"]),
                class: "space-y-4"
              }, [
                createVNode("div", { class: "form-field" }, [
                  createVNode("label", {
                    for: "email",
                    class: "form-label"
                  }, "Email"),
                  createVNode(unref(script$1), {
                    id: "email",
                    modelValue: unref(form).email,
                    "onUpdate:modelValue": ($event) => unref(form).email = $event,
                    type: "email",
                    placeholder: "you@company.com",
                    class: "w-full",
                    invalid: !!unref(errors).email,
                    disabled: unref(isLoading),
                    "aria-describedby": "email-error"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid", "disabled"]),
                  unref(errors).email ? (openBlock(), createBlock("small", {
                    key: 0,
                    id: "email-error",
                    class: "form-error"
                  }, toDisplayString(unref(errors).email), 1)) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "form-field" }, [
                  createVNode("label", {
                    for: "password",
                    class: "form-label"
                  }, "Password"),
                  createVNode(unref(script$2), {
                    id: "password",
                    modelValue: unref(form).password,
                    "onUpdate:modelValue": ($event) => unref(form).password = $event,
                    placeholder: "Enter your password",
                    feedback: false,
                    toggleMask: "",
                    class: "w-full",
                    inputClass: "w-full",
                    invalid: !!unref(errors).password,
                    disabled: unref(isLoading),
                    "aria-describedby": "password-error"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid", "disabled"]),
                  unref(errors).password ? (openBlock(), createBlock("small", {
                    key: 0,
                    id: "password-error",
                    class: "form-error"
                  }, toDisplayString(unref(errors).password), 1)) : createCommentVNode("", true)
                ]),
                unref(serverError) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "p-3 bg-red-50 border border-red-200 rounded-lg"
                }, [
                  createVNode("p", { class: "text-sm text-red-600" }, toDisplayString(unref(serverError)), 1)
                ])) : createCommentVNode("", true),
                createVNode(unref(script$3), {
                  type: "submit",
                  label: "Sign In",
                  class: "w-full",
                  loading: unref(isLoading),
                  disabled: unref(isLoading)
                }, null, 8, ["loading", "disabled"])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=login-GI6_JqMx.js.map
