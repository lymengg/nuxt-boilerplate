import { defineComponent, ref, mergeProps, unref, withCtx, isRef, createVNode, withModifiers, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import script$2 from './index-BDaj-nhv.mjs';
import script from './index-CDExI0xy.mjs';
import script$1 from './index-CnIUS0M4.mjs';
import { u as useAuth } from './useAuth-BC3_nFKE.mjs';
import { n as navigateTo } from './server.mjs';
import '@primeuix/utils';
import '@primeuix/utils/object';
import './index-RZE_erJD.mjs';
import './index-DxKIPVaB.mjs';
import './index-DI7ROuCk.mjs';
import '@primeuix/styled';
import '@primeuix/utils/dom';
import './index-IoILXe0H.mjs';
import '@primeuix/styles/badge';
import './index-DmGtcQDa.mjs';
import './index-Dl3T3yr5.mjs';
import '@primeuix/utils/uuid';
import '@primeuix/styles/ripple';
import '@primeuix/styles/button';
import '@primeuix/styles/card';
import './index-xRlVhXwl.mjs';
import './index-BDpKneMc.mjs';
import '@primeuix/styles/inputtext';
import './api-BiGERn36.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@primevue/core/base/style';
import '@primevue/core/basecomponent/style';
import '@primeuix/styles/autocomplete';
import '@primeuix/styles/cascadeselect';
import '@primeuix/styles/checkbox';
import '@primeuix/styles/checkboxgroup';
import '@primeuix/styles/colorpicker';
import '@primeuix/styles/datepicker';
import '@primeuix/styles/floatlabel';
import '@primeuix/styles/iconfield';
import '@primeuix/styles/iftalabel';
import '@primeuix/styles/inputchips';
import '@primeuix/styles/inputgroup';
import '@primeuix/styles/inputnumber';
import '@primeuix/styles/inputotp';
import '@primeuix/styles/knob';
import '@primeuix/styles/listbox';
import '@primeuix/styles/multiselect';
import '@primeuix/styles/password';
import '@primeuix/styles/radiobutton';
import '@primeuix/styles/radiobuttongroup';
import '@primeuix/styles/rating';
import '@primeuix/styles/select';
import '@primeuix/styles/selectbutton';
import '@primeuix/styles/slider';
import '@primeuix/styles/textarea';
import '@primeuix/styles/togglebutton';
import '@primeuix/styles/toggleswitch';
import '@primeuix/styles/treeselect';
import '@primeuix/styles/buttongroup';
import '@primeuix/styles/speeddial';
import '@primeuix/styles/splitbutton';
import '@primeuix/styles/datatable';
import '@primeuix/styles/dataview';
import '@primeuix/styles/orderlist';
import '@primeuix/styles/organizationchart';
import '@primeuix/styles/paginator';
import '@primeuix/styles/picklist';
import '@primeuix/styles/tree';
import '@primeuix/styles/treetable';
import '@primeuix/styles/timeline';
import '@primeuix/styles/virtualscroller';
import '@primeuix/styles/accordion';
import '@primeuix/styles/divider';
import '@primeuix/styles/fieldset';
import '@primeuix/styles/panel';
import '@primeuix/styles/scrollpanel';
import '@primeuix/styles/splitter';
import '@primeuix/styles/stepper';
import '@primeuix/styles/tabview';
import '@primeuix/styles/tabs';
import '@primeuix/styles/toolbar';
import '@primeuix/styles/confirmdialog';
import '@primeuix/styles/confirmpopup';
import '@primeuix/styles/dialog';
import '@primeuix/styles/drawer';
import '@primeuix/styles/popover';
import '@primeuix/styles/fileupload';
import '@primeuix/styles/breadcrumb';
import '@primeuix/styles/contextmenu';
import '@primeuix/styles/dock';
import '@primeuix/styles/menu';
import '@primeuix/styles/menubar';
import '@primeuix/styles/megamenu';
import '@primeuix/styles/panelmenu';
import '@primeuix/styles/steps';
import '@primeuix/styles/tabmenu';
import '@primeuix/styles/tieredmenu';
import '@primeuix/styles/message';
import '@primeuix/styles/inlinemessage';
import '@primeuix/styles/toast';
import '@primeuix/styles/carousel';
import '@primeuix/styles/galleria';
import '@primeuix/styles/image';
import '@primeuix/styles/imagecompare';
import '@primeuix/styles/avatar';
import '@primeuix/styles/blockui';
import '@primeuix/styles/chip';
import '@primeuix/styles/inplace';
import '@primeuix/styles/metergroup';
import '@primeuix/styles/overlaybadge';
import '@primeuix/styles/scrolltop';
import '@primeuix/styles/skeleton';
import '@primeuix/styles/progressbar';
import '@primeuix/styles/progressspinner';
import '@primeuix/styles/tag';
import '@primeuix/styles/terminal';
import '@primevue/forms/form/style';
import '@primevue/forms/formfield/style';
import '@primeuix/styles/tooltip';
import 'node:url';
import 'vue-router';
import '@primeuix/utils/eventbus';
import '@primeuix/styles/base';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "verify",
  __ssrInlineRender: true,
  setup(__props) {
    const { verifyMfa, isLoading } = useAuth();
    const code = ref("");
    const error = ref("");
    async function handleVerify() {
      error.value = "";
      if (code.value.length !== 6) {
        error.value = "Please enter a 6-digit code";
        return;
      }
      const result = await verifyMfa(code.value);
      if (result.success) {
        navigateTo("/dashboard");
      } else if ("error" in result) {
        error.value = result.error;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex items-center justify-center bg-surface-50 p-4" }, _attrs))}><div class="w-full max-w-md"><div class="text-center mb-8"><div class="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4"><span class="text-white font-bold text-lg">EM</span></div><h1 class="text-2xl font-semibold text-surface-900">Two-Factor Authentication</h1><p class="text-sm text-surface-500 mt-1">Enter the code from your authenticator app</p></div>`);
      _push(ssrRenderComponent(unref(script), { class: "shadow-sm" }, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="space-y-4"${_scopeId}><div class="form-field"${_scopeId}><label for="code" class="form-label"${_scopeId}>Verification Code</label>`);
            _push2(ssrRenderComponent(unref(script$1), {
              id: "code",
              modelValue: unref(code),
              "onUpdate:modelValue": ($event) => isRef(code) ? code.value = $event : null,
              placeholder: "000000",
              class: "w-full text-center text-2xl tracking-widest",
              maxlength: "6",
              invalid: !!unref(error),
              disabled: unref(isLoading),
              autofocus: ""
            }, null, _parent2, _scopeId));
            if (unref(error)) {
              _push2(`<small class="form-error"${_scopeId}>${ssrInterpolate(unref(error))}</small>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            _push2(ssrRenderComponent(unref(script$2), {
              type: "submit",
              label: "Verify",
              class: "w-full",
              loading: unref(isLoading),
              disabled: unref(isLoading) || unref(code).length !== 6
            }, null, _parent2, _scopeId));
            _push2(`</form>`);
          } else {
            return [
              createVNode("form", {
                onSubmit: withModifiers(handleVerify, ["prevent"]),
                class: "space-y-4"
              }, [
                createVNode("div", { class: "form-field" }, [
                  createVNode("label", {
                    for: "code",
                    class: "form-label"
                  }, "Verification Code"),
                  createVNode(unref(script$1), {
                    id: "code",
                    modelValue: unref(code),
                    "onUpdate:modelValue": ($event) => isRef(code) ? code.value = $event : null,
                    placeholder: "000000",
                    class: "w-full text-center text-2xl tracking-widest",
                    maxlength: "6",
                    invalid: !!unref(error),
                    disabled: unref(isLoading),
                    autofocus: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid", "disabled"]),
                  unref(error) ? (openBlock(), createBlock("small", {
                    key: 0,
                    class: "form-error"
                  }, toDisplayString(unref(error)), 1)) : createCommentVNode("", true)
                ]),
                createVNode(unref(script$2), {
                  type: "submit",
                  label: "Verify",
                  class: "w-full",
                  loading: unref(isLoading),
                  disabled: unref(isLoading) || unref(code).length !== 6
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/mfa/verify.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=verify-BQ6WBcsc.mjs.map
