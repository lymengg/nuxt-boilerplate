import { _ as __nuxt_component_0 } from "../server.mjs";
import { _ as __nuxt_component_0$1 } from "./nuxt-link-CeaKTE3h.js";
import { defineComponent, mergeProps, withCtx, unref, createVNode, openBlock, createBlock, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import script from "./index-BDaj-nhv.js";
import "/home/runner/work/nuxt-boilerplate/nuxt-boilerplate/node_modules/hookable/dist/index.mjs";
import "/home/runner/work/nuxt-boilerplate/nuxt-boilerplate/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/home/runner/work/nuxt-boilerplate/nuxt-boilerplate/node_modules/unctx/dist/index.mjs";
import "/home/runner/work/nuxt-boilerplate/nuxt-boilerplate/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/home/runner/work/nuxt-boilerplate/nuxt-boilerplate/node_modules/defu/dist/defu.mjs";
import "/home/runner/work/nuxt-boilerplate/nuxt-boilerplate/node_modules/ufo/dist/index.mjs";
import "@primeuix/utils/eventbus";
import "@primeuix/styled";
import "@primeuix/utils";
import "@primeuix/utils/object";
import "@primeuix/styles/base";
import "@primeuix/utils/dom";
import "./index-RZE_erJD.js";
import "./index-DxKIPVaB.js";
import "./index-DI7ROuCk.js";
import "./index-IoILXe0H.js";
import "@primeuix/styles/badge";
import "./index-DmGtcQDa.js";
import "./index-Dl3T3yr5.js";
import "@primeuix/utils/uuid";
import "@primeuix/styles/ripple";
import "@primeuix/styles/button";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "unauthorized",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "default" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen flex items-center justify-center p-4"${_scopeId}><div class="text-center"${_scopeId}><div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"${_scopeId}><svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"${_scopeId}></path></svg></div><h1 class="text-2xl font-semibold text-surface-900 mb-2"${_scopeId}>Access Denied</h1><p class="text-surface-500 mb-6"${_scopeId}>You do not have permission to access this page.</p>`);
            _push2(ssrRenderComponent(_component_NuxtLink, { to: "/dashboard" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(script), { label: "Return to Dashboard" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(script), { label: "Return to Dashboard" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "min-h-screen flex items-center justify-center p-4" }, [
                createVNode("div", { class: "text-center" }, [
                  createVNode("div", { class: "w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4" }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-8 h-8 text-red-600",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                      })
                    ]))
                  ]),
                  createVNode("h1", { class: "text-2xl font-semibold text-surface-900 mb-2" }, "Access Denied"),
                  createVNode("p", { class: "text-surface-500 mb-6" }, "You do not have permission to access this page."),
                  createVNode(_component_NuxtLink, { to: "/dashboard" }, {
                    default: withCtx(() => [
                      createVNode(unref(script), { label: "Return to Dashboard" })
                    ]),
                    _: 1
                  })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/unauthorized.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=unauthorized-Br0Vj7s2.js.map
