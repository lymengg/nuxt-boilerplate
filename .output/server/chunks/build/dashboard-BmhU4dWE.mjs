import { _ as __nuxt_component_0 } from './nuxt-link-CeaKTE3h.mjs';
import { defineComponent, ref, mergeProps, unref, computed, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderClass, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { j as useRoute } from './server.mjs';
import { u as useAuth } from './useAuth-BC3_nFKE.mjs';
import script from './index-BDaj-nhv.mjs';
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
import '@primeuix/utils/object';
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
import '@primeuix/styles/inputtext';
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
import '@primeuix/styles/button';
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
import '@primeuix/styles/card';
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
import '@primeuix/styles/badge';
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
import '@primeuix/styles/ripple';
import 'node:url';
import 'vue-router';
import '@primeuix/utils/eventbus';
import '@primeuix/styled';
import '@primeuix/utils';
import '@primeuix/styles/base';
import '@primeuix/utils/dom';
import './api-BiGERn36.mjs';
import './index-RZE_erJD.mjs';
import './index-DxKIPVaB.mjs';
import './index-DI7ROuCk.mjs';
import './index-IoILXe0H.mjs';
import './index-DmGtcQDa.mjs';
import './index-Dl3T3yr5.mjs';
import '@primeuix/utils/uuid';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Sidebar",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean }
  },
  emits: ["close"],
  setup(__props) {
    const route = useRoute();
    const { user } = useAuth();
    const navItems = [
      { path: "/dashboard", label: "Dashboard", icon: "\u{1F4CA}" },
      { path: "/expenses", label: "Expenses", icon: "\u{1F4CB}" },
      { path: "/management/users", label: "Users", icon: "\u{1F465}" },
      { path: "/management/roles", label: "Roles", icon: "\u{1F6E1}" },
      { path: "/management/tenants", label: "Tenants", icon: "\u{1F3E2}" },
      { path: "/management/departments", label: "Departments", icon: "\u{1F3DB}" },
      { path: "/management/audit", label: "Audit Logs", icon: "\u{1F4DD}" }
    ];
    const userName = computed(() => {
      if (!user.value) return "";
      return `${user.value.firstName} ${user.value.lastName}`;
    });
    const userInitials = computed(() => {
      if (!user.value) return "";
      return `${user.value.firstName[0]}${user.value.lastName[0]}`.toUpperCase();
    });
    function isActive(path) {
      return route.path === path || route.path.startsWith(path + "/");
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<!--[--><aside class="${ssrRenderClass([
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-surface-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        __props.isOpen ? "translate-x-0" : "-translate-x-full"
      ])}"><div class="flex items-center justify-between h-16 px-4 border-b border-surface-200">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard",
        class: "flex items-center gap-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center"${_scopeId}><span class="text-white font-bold text-sm"${_scopeId}>EM</span></div><span class="font-semibold text-surface-900"${_scopeId}>ExpenseManager</span>`);
          } else {
            return [
              createVNode("div", { class: "w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center" }, [
                createVNode("span", { class: "text-white font-bold text-sm" }, "EM")
              ]),
              createVNode("span", { class: "font-semibold text-surface-900" }, "ExpenseManager")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="lg:hidden p-1 rounded hover:bg-surface-100"><svg class="w-5 h-5 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><nav class="p-4 space-y-1"><!--[-->`);
      ssrRenderList(navItems, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.path,
          to: item.path,
          class: [
            "sidebar-link",
            isActive(item.path) ? "sidebar-link-active" : "sidebar-link-inactive"
          ],
          onClick: ($event) => _ctx.$emit("close")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="w-5 h-5 flex items-center justify-center text-sm"${_scopeId}>${ssrInterpolate(item.icon)}</span><span${_scopeId}>${ssrInterpolate(item.label)}</span>`);
            } else {
              return [
                createVNode("span", { class: "w-5 h-5 flex items-center justify-center text-sm" }, toDisplayString(item.icon), 1),
                createVNode("span", null, toDisplayString(item.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><div class="absolute bottom-0 left-0 right-0 p-4 border-t border-surface-200"><div class="flex items-center gap-3"><div class="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center"><span class="text-primary-700 font-medium text-sm">${ssrInterpolate(unref(userInitials))}</span></div><div class="flex-1 min-w-0"><p class="text-sm font-medium text-surface-900 truncate">${ssrInterpolate(unref(userName))}</p><p class="text-xs text-surface-500 truncate">${ssrInterpolate((_a = unref(user)) == null ? void 0 : _a.email)}</p></div><button class="p-1.5 rounded hover:bg-surface-100 text-surface-400 hover:text-surface-600" title="Logout"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg></button></div></div></aside>`);
      if (__props.isOpen) {
        _push(`<div class="fixed inset-0 bg-black/50 z-40 lg:hidden"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Sidebar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Header",
  __ssrInlineRender: true,
  emits: ["toggleSidebar"],
  setup(__props) {
    const route = useRoute();
    const pageTitle = computed(() => {
      const titles = {
        "/dashboard": "Dashboard",
        "/expenses": "Expenses",
        "/management/users": "User Management",
        "/management/roles": "Role Management",
        "/management/tenants": "Tenant Management",
        "/management/departments": "Department Management",
        "/management/audit": "Audit Logs"
      };
      return titles[route.path] || "Expense Management";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "h-16 bg-white border-b border-surface-200 flex items-center justify-between px-6" }, _attrs))}><div class="flex items-center gap-4"><button class="lg:hidden p-2 rounded-lg hover:bg-surface-100 text-surface-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button><div class="hidden md:block"><h1 class="text-lg font-semibold text-surface-900">${ssrInterpolate(unref(pageTitle))}</h1></div></div><div class="flex items-center gap-3">`);
      _push(ssrRenderComponent(unref(script), {
        icon: "pi pi-bell",
        severity: "secondary",
        text: "",
        rounded: "",
        "aria-label": "Notifications"
      }, null, _parent));
      _push(`</div></header>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/Header.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const sidebarOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LayoutSidebar = _sfc_main$2;
      const _component_LayoutHeader = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-surface-50 flex" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_LayoutSidebar, {
        "is-open": unref(sidebarOpen),
        onClose: ($event) => sidebarOpen.value = false
      }, null, _parent));
      _push(`<div class="flex-1 flex flex-col min-h-screen lg:ml-64">`);
      _push(ssrRenderComponent(_component_LayoutHeader, {
        onToggleSidebar: ($event) => sidebarOpen.value = !unref(sidebarOpen)
      }, null, _parent));
      _push(`<main class="flex-1 p-6">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dashboard-BmhU4dWE.mjs.map
