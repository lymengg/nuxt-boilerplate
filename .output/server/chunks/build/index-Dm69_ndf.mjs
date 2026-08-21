import { u as useToast, a as useConfirm, _ as __nuxt_component_0 } from './server.mjs';
import { defineComponent, ref, reactive, resolveComponent, mergeProps, withCtx, unref, createVNode, withKeys, toDisplayString, openBlock, createBlock, Fragment, renderList, createCommentVNode, isRef, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import script from './index-BDaj-nhv.mjs';
import script$6 from './index-BrgvDYif.mjs';
import script$5 from './index-EG4FwBE9.mjs';
import script$8 from './index-DzCo-7Br.mjs';
import script$3 from './index-CnIUS0M4.mjs';
import script$4 from './index-DctHMqNs.mjs';
import script$7 from './index-BKjnf36X.mjs';
import script$b from './index-C40nmvEk.mjs';
import script$a from './index-D8qY11de.mjs';
import script$9 from './index-C1SASExj.mjs';
import script$1 from './index-CKMc6Q8z.mjs';
import script$2 from './index-c24ZxKWA.mjs';
import { a as apiFetch } from './api-BiGERn36.mjs';
import { u as usePagination, a as useApiError } from './useApiError-DVtejTJD.mjs';
import { u as useAuthorization } from './useAuthorization-D0KfPdVu.mjs';
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
import './index-RZE_erJD.mjs';
import './index-DxKIPVaB.mjs';
import './index-DI7ROuCk.mjs';
import './index-IoILXe0H.mjs';
import './index-DmGtcQDa.mjs';
import './index-Dl3T3yr5.mjs';
import '@primeuix/utils/uuid';
import './index-1v7fOn3J.mjs';
import './index-CtIVYbH4.mjs';
import './index-qhzJtE_o.mjs';
import './index-CBACXbvA.mjs';
import './index-BLBoPBG9.mjs';
import './index-CEjm7QwF.mjs';
import './index-BJFn3Jal.mjs';
import './index-xRlVhXwl.mjs';
import './index-BDpKneMc.mjs';
import './index-CyoypR2R.mjs';
import './index-BYQtjd9C.mjs';
import './index-CobSNMix.mjs';
import './index-BSlrD5b6.mjs';
import './index-CZMkDb0s.mjs';
import './index-CP_fvbAb.mjs';
import './index-rAVNvoJo.mjs';
import './index-BMp5kizY.mjs';
import './index-BkujatKk.mjs';
import './index-CaqxMkRc.mjs';
import '@primeuix/utils/zindex';
import './index-CPX8QLh4.mjs';
import './index-Cn5F1NyX.mjs';
import './index-zZrFrjQS.mjs';
import './index-D6DLQGdG.mjs';
import './index-Din928lO.mjs';
import './index-BH9iduCK.mjs';
import './index-CLrwot36.mjs';
import './index-D-XLIqRy.mjs';
import './index-BDUbCchk.mjs';
import './index-hAeZCk-_.mjs';
import './useAuth-BC3_nFKE.mjs';

const userService = {
  async list(params) {
    return apiFetch("/api/users", { query: params });
  },
  async get(id) {
    return apiFetch(`/api/users/${id}`);
  },
  async create(data) {
    return apiFetch("/api/users", {
      method: "POST",
      body: data
    });
  },
  async update(id, data) {
    return apiFetch(`/api/users/${id}`, {
      method: "PUT",
      body: data
    });
  },
  async enable(id) {
    return apiFetch(`/api/users/${id}/enable`, {
      method: "POST"
    });
  },
  async disable(id) {
    return apiFetch(`/api/users/${id}/disable`, {
      method: "POST"
    });
  },
  async assignRoles(id, roleIds) {
    return apiFetch(`/api/users/${id}/roles`, {
      method: "PUT",
      body: { roleIds }
    });
  },
  async delete(id) {
    return apiFetch(`/api/users/${id}`, {
      method: "DELETE"
    });
  }
};
function useUsers() {
  const users = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const pagination = usePagination();
  async function fetchUsers(params = {}) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await userService.list({
        page: pagination.page.value,
        size: pagination.size.value,
        sort: pagination.sort.value,
        direction: pagination.direction.value,
        ...params
      });
      if (response.success && response.data) {
        users.value = response.data.content;
        pagination.updateFromResponse(
          response.data.totalElements,
          response.data.totalPages
        );
      } else {
        error.value = response.message || "Failed to fetch users";
      }
    } catch (err) {
      const apiError = useApiError();
      const parsed = apiError.handleError(err);
      error.value = parsed.message;
    } finally {
      isLoading.value = false;
    }
  }
  async function getUser(id) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await userService.get(id);
      if (response.success && response.data) {
        return response.data;
      }
      error.value = response.message || "Failed to fetch user";
      return null;
    } catch (err) {
      const apiError = useApiError();
      const parsed = apiError.handleError(err);
      error.value = parsed.message;
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  return {
    users,
    isLoading,
    error,
    pagination,
    fetchUsers,
    getUser
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { users, isLoading, pagination, fetchUsers } = useUsers();
    const { can } = useAuthorization();
    const toast = useToast();
    const confirm = useConfirm();
    const showCreateDialog = ref(false);
    const showEditDialog = ref(false);
    const showRoleDialog = ref(false);
    const selectedUser = ref(null);
    const selectedRoleIds = ref([]);
    const allRoles = ref([]);
    const isSubmitting = ref(false);
    const filters = reactive({
      search: "",
      enabled: null
    });
    const statusOptions = [
      { label: "Active", value: true },
      { label: "Disabled", value: false }
    ];
    function resetFilters() {
      filters.search = "";
      filters.enabled = null;
      fetchUsers();
    }
    function handleSearch() {
      var _a;
      fetchUsers({
        search: filters.search || void 0,
        enabled: (_a = filters.enabled) != null ? _a : void 0
      });
    }
    function handleStatusChange() {
      var _a;
      fetchUsers({
        search: filters.search || void 0,
        enabled: (_a = filters.enabled) != null ? _a : void 0
      });
    }
    function onPage(event) {
      var _a;
      pagination.setPage(event.page);
      fetchUsers({
        search: filters.search || void 0,
        enabled: (_a = filters.enabled) != null ? _a : void 0
      });
    }
    function onSort(event) {
      var _a;
      const field = typeof event.sortField === "string" ? event.sortField : void 0;
      if (field) {
        pagination.setSort(field, event.sortOrder === 1 ? "asc" : "desc");
        fetchUsers({
          search: filters.search || void 0,
          enabled: (_a = filters.enabled) != null ? _a : void 0
        });
      }
    }
    function editUser(user) {
      selectedUser.value = user;
      showEditDialog.value = true;
    }
    function assignRoles(user) {
      selectedUser.value = user;
      selectedRoleIds.value = user.roles.map((r) => r.id);
      showRoleDialog.value = true;
    }
    function toggleUserStatus(user) {
      const action = user.enabled ? "disable" : "enable";
      confirm.require({
        message: `Are you sure you want to ${action} this user?`,
        header: `${action === "enable" ? "Enable" : "Disable"} User`,
        icon: "pi pi-exclamation-triangle",
        acceptClass: action === "disable" ? "p-button-danger" : void 0,
        accept: async () => {
          var _a;
          try {
            if (user.enabled) {
              await userService.disable(user.id);
            } else {
              await userService.enable(user.id);
            }
            toast.add({
              severity: "success",
              summary: "Success",
              detail: `User ${action}d successfully`,
              life: 3e3
            });
            fetchUsers({
              search: filters.search || void 0,
              enabled: (_a = filters.enabled) != null ? _a : void 0
            });
          } catch {
            toast.add({
              severity: "error",
              summary: "Error",
              detail: `Failed to ${action} user`,
              life: 3e3
            });
          }
        }
      });
    }
    async function confirmAssignRoles() {
      var _a;
      if (!selectedUser.value) return;
      isSubmitting.value = true;
      try {
        await userService.assignRoles(selectedUser.value.id, selectedRoleIds.value);
        toast.add({
          severity: "success",
          summary: "Success",
          detail: "Roles updated successfully",
          life: 3e3
        });
        showRoleDialog.value = false;
        fetchUsers({
          search: filters.search || void 0,
          enabled: (_a = filters.enabled) != null ? _a : void 0
        });
      } catch {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to update roles",
          life: 3e3
        });
      } finally {
        isSubmitting.value = false;
      }
    }
    async function handleCreate(data) {
      var _a;
      try {
        await userService.create(data);
        toast.add({ severity: "success", summary: "Success", detail: "User created", life: 3e3 });
        showCreateDialog.value = false;
        fetchUsers({
          search: filters.search || void 0,
          enabled: (_a = filters.enabled) != null ? _a : void 0
        });
      } catch {
        toast.add({ severity: "error", summary: "Error", detail: "Failed to create user", life: 3e3 });
      }
    }
    async function handleUpdate(data) {
      var _a;
      if (!selectedUser.value) return;
      try {
        await userService.update(selectedUser.value.id, data);
        toast.add({ severity: "success", summary: "Success", detail: "User updated", life: 3e3 });
        showEditDialog.value = false;
        fetchUsers({
          search: filters.search || void 0,
          enabled: (_a = filters.enabled) != null ? _a : void 0
        });
      } catch {
        toast.add({ severity: "error", summary: "Error", detail: "Failed to update user", life: 3e3 });
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_UserForm = resolveComponent("UserForm");
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "dashboard" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="page-container"${_scopeId}><div class="flex items-center justify-between mb-6"${_scopeId}><div${_scopeId}><h1 class="page-title"${_scopeId}>User Management</h1><p class="page-subtitle"${_scopeId}>Manage system users and their roles</p></div>`);
            _push2(ssrRenderComponent(unref(script), {
              label: "Add User",
              icon: "pi pi-plus",
              onClick: ($event) => showCreateDialog.value = true
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="filter-bar"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(script$1), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(script$2), { class: "pi pi-search" }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(script$3), {
                    modelValue: unref(filters).search,
                    "onUpdate:modelValue": ($event) => unref(filters).search = $event,
                    placeholder: "Search users...",
                    onKeyup: handleSearch
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(script$2), { class: "pi pi-search" }),
                    createVNode(unref(script$3), {
                      modelValue: unref(filters).search,
                      "onUpdate:modelValue": ($event) => unref(filters).search = $event,
                      placeholder: "Search users...",
                      onKeyup: withKeys(handleSearch, ["enter"])
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$4), {
              modelValue: unref(filters).enabled,
              "onUpdate:modelValue": ($event) => unref(filters).enabled = $event,
              options: statusOptions,
              optionLabel: "label",
              optionValue: "value",
              placeholder: "All Statuses",
              class: "w-48",
              showClear: "",
              onChange: handleStatusChange
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script), {
              label: "Reset",
              severity: "secondary",
              text: "",
              onClick: resetFilters
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="table-container"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(script$5), {
              value: unref(users),
              loading: unref(isLoading),
              lazy: "",
              paginator: "",
              first: unref(pagination).page.value * unref(pagination).size.value,
              rows: unref(pagination).size.value,
              totalRecords: unref(pagination).totalElements.value,
              onPage,
              onSort,
              sortMode: "single",
              sortField: unref(pagination).sort.value,
              sortOrder: unref(pagination).direction.value === "asc" ? 1 : -1,
              stripedRows: "",
              responsiveLayout: "scroll"
            }, {
              empty: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="text-center py-8"${_scopeId2}><p class="text-surface-500"${_scopeId2}>No users found</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-center py-8" }, [
                      createVNode("p", { class: "text-surface-500" }, "No users found")
                    ])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(script$6), {
                    field: "email",
                    header: "User",
                    sortable: ""
                  }, {
                    body: withCtx(({ data }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex items-center gap-3"${_scopeId3}><div class="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center"${_scopeId3}><span class="text-primary-700 font-medium text-sm"${_scopeId3}>${ssrInterpolate(data.firstName[0])}${ssrInterpolate(data.lastName[0])}</span></div><div${_scopeId3}><p class="font-medium text-surface-900"${_scopeId3}>${ssrInterpolate(data.firstName)} ${ssrInterpolate(data.lastName)}</p><p class="text-xs text-surface-500"${_scopeId3}>${ssrInterpolate(data.email)}</p></div></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "flex items-center gap-3" }, [
                            createVNode("div", { class: "w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center" }, [
                              createVNode("span", { class: "text-primary-700 font-medium text-sm" }, toDisplayString(data.firstName[0]) + toDisplayString(data.lastName[0]), 1)
                            ]),
                            createVNode("div", null, [
                              createVNode("p", { class: "font-medium text-surface-900" }, toDisplayString(data.firstName) + " " + toDisplayString(data.lastName), 1),
                              createVNode("p", { class: "text-xs text-surface-500" }, toDisplayString(data.email), 1)
                            ])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(script$6), {
                    field: "roles",
                    header: "Roles"
                  }, {
                    body: withCtx(({ data }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex flex-wrap gap-1"${_scopeId3}><!--[-->`);
                        ssrRenderList(data.roles, (role) => {
                          _push4(ssrRenderComponent(unref(script$7), {
                            key: role.id,
                            value: role.name,
                            severity: "info",
                            class: "text-xs"
                          }, null, _parent4, _scopeId3));
                        });
                        _push4(`<!--]--></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "flex flex-wrap gap-1" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(data.roles, (role) => {
                              return openBlock(), createBlock(unref(script$7), {
                                key: role.id,
                                value: role.name,
                                severity: "info",
                                class: "text-xs"
                              }, null, 8, ["value"]);
                            }), 128))
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(script$6), {
                    field: "departmentName",
                    header: "Department"
                  }, {
                    body: withCtx(({ data }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span class="text-sm text-surface-600"${_scopeId3}>${ssrInterpolate(data.departmentName || "\u2014")}</span>`);
                      } else {
                        return [
                          createVNode("span", { class: "text-sm text-surface-600" }, toDisplayString(data.departmentName || "\u2014"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(script$6), {
                    field: "enabled",
                    header: "Status",
                    sortable: ""
                  }, {
                    body: withCtx(({ data }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(script$7), {
                          value: data.enabled ? "Active" : "Disabled",
                          severity: data.enabled ? "success" : "danger"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(script$7), {
                            value: data.enabled ? "Active" : "Disabled",
                            severity: data.enabled ? "success" : "danger"
                          }, null, 8, ["value", "severity"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(script$6), {
                    header: "Actions",
                    style: { "width": "150px" }
                  }, {
                    body: withCtx(({ data }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex items-center gap-1"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(script), {
                          icon: "pi pi-pencil",
                          severity: "secondary",
                          text: "",
                          rounded: "",
                          size: "small",
                          onClick: ($event) => editUser(data),
                          "aria-label": "Edit user"
                        }, null, _parent4, _scopeId3));
                        if (unref(can)("USER_UPDATE")) {
                          _push4(ssrRenderComponent(unref(script), {
                            icon: data.enabled ? "pi pi-ban" : "pi pi-check",
                            severity: data.enabled ? "warn" : "success",
                            text: "",
                            rounded: "",
                            size: "small",
                            onClick: ($event) => toggleUserStatus(data),
                            "aria-label": data.enabled ? "Disable user" : "Enable user"
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        if (unref(can)("ROLE_ASSIGN")) {
                          _push4(ssrRenderComponent(unref(script), {
                            icon: "pi pi-shield",
                            severity: "info",
                            text: "",
                            rounded: "",
                            size: "small",
                            onClick: ($event) => assignRoles(data),
                            "aria-label": "Assign roles"
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "flex items-center gap-1" }, [
                            createVNode(unref(script), {
                              icon: "pi pi-pencil",
                              severity: "secondary",
                              text: "",
                              rounded: "",
                              size: "small",
                              onClick: ($event) => editUser(data),
                              "aria-label": "Edit user"
                            }, null, 8, ["onClick"]),
                            unref(can)("USER_UPDATE") ? (openBlock(), createBlock(unref(script), {
                              key: 0,
                              icon: data.enabled ? "pi pi-ban" : "pi pi-check",
                              severity: data.enabled ? "warn" : "success",
                              text: "",
                              rounded: "",
                              size: "small",
                              onClick: ($event) => toggleUserStatus(data),
                              "aria-label": data.enabled ? "Disable user" : "Enable user"
                            }, null, 8, ["icon", "severity", "onClick", "aria-label"])) : createCommentVNode("", true),
                            unref(can)("ROLE_ASSIGN") ? (openBlock(), createBlock(unref(script), {
                              key: 1,
                              icon: "pi pi-shield",
                              severity: "info",
                              text: "",
                              rounded: "",
                              size: "small",
                              onClick: ($event) => assignRoles(data),
                              "aria-label": "Assign roles"
                            }, null, 8, ["onClick"])) : createCommentVNode("", true)
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(script$6), {
                      field: "email",
                      header: "User",
                      sortable: ""
                    }, {
                      body: withCtx(({ data }) => [
                        createVNode("div", { class: "flex items-center gap-3" }, [
                          createVNode("div", { class: "w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center" }, [
                            createVNode("span", { class: "text-primary-700 font-medium text-sm" }, toDisplayString(data.firstName[0]) + toDisplayString(data.lastName[0]), 1)
                          ]),
                          createVNode("div", null, [
                            createVNode("p", { class: "font-medium text-surface-900" }, toDisplayString(data.firstName) + " " + toDisplayString(data.lastName), 1),
                            createVNode("p", { class: "text-xs text-surface-500" }, toDisplayString(data.email), 1)
                          ])
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(script$6), {
                      field: "roles",
                      header: "Roles"
                    }, {
                      body: withCtx(({ data }) => [
                        createVNode("div", { class: "flex flex-wrap gap-1" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(data.roles, (role) => {
                            return openBlock(), createBlock(unref(script$7), {
                              key: role.id,
                              value: role.name,
                              severity: "info",
                              class: "text-xs"
                            }, null, 8, ["value"]);
                          }), 128))
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(script$6), {
                      field: "departmentName",
                      header: "Department"
                    }, {
                      body: withCtx(({ data }) => [
                        createVNode("span", { class: "text-sm text-surface-600" }, toDisplayString(data.departmentName || "\u2014"), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(unref(script$6), {
                      field: "enabled",
                      header: "Status",
                      sortable: ""
                    }, {
                      body: withCtx(({ data }) => [
                        createVNode(unref(script$7), {
                          value: data.enabled ? "Active" : "Disabled",
                          severity: data.enabled ? "success" : "danger"
                        }, null, 8, ["value", "severity"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(script$6), {
                      header: "Actions",
                      style: { "width": "150px" }
                    }, {
                      body: withCtx(({ data }) => [
                        createVNode("div", { class: "flex items-center gap-1" }, [
                          createVNode(unref(script), {
                            icon: "pi pi-pencil",
                            severity: "secondary",
                            text: "",
                            rounded: "",
                            size: "small",
                            onClick: ($event) => editUser(data),
                            "aria-label": "Edit user"
                          }, null, 8, ["onClick"]),
                          unref(can)("USER_UPDATE") ? (openBlock(), createBlock(unref(script), {
                            key: 0,
                            icon: data.enabled ? "pi pi-ban" : "pi pi-check",
                            severity: data.enabled ? "warn" : "success",
                            text: "",
                            rounded: "",
                            size: "small",
                            onClick: ($event) => toggleUserStatus(data),
                            "aria-label": data.enabled ? "Disable user" : "Enable user"
                          }, null, 8, ["icon", "severity", "onClick", "aria-label"])) : createCommentVNode("", true),
                          unref(can)("ROLE_ASSIGN") ? (openBlock(), createBlock(unref(script), {
                            key: 1,
                            icon: "pi pi-shield",
                            severity: "info",
                            text: "",
                            rounded: "",
                            size: "small",
                            onClick: ($event) => assignRoles(data),
                            "aria-label": "Assign roles"
                          }, null, 8, ["onClick"])) : createCommentVNode("", true)
                        ])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(unref(script$8), {
              visible: unref(showCreateDialog),
              "onUpdate:visible": ($event) => isRef(showCreateDialog) ? showCreateDialog.value = $event : null,
              header: "Add User",
              modal: "",
              style: { width: "500px" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UserForm, {
                    onSubmit: handleCreate,
                    onCancel: ($event) => showCreateDialog.value = false
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UserForm, {
                      onSubmit: handleCreate,
                      onCancel: ($event) => showCreateDialog.value = false
                    }, null, 8, ["onCancel"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$8), {
              visible: unref(showEditDialog),
              "onUpdate:visible": ($event) => isRef(showEditDialog) ? showEditDialog.value = $event : null,
              header: "Edit User",
              modal: "",
              style: { width: "500px" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (unref(selectedUser)) {
                    _push3(ssrRenderComponent(_component_UserForm, {
                      user: unref(selectedUser),
                      onSubmit: handleUpdate,
                      onCancel: ($event) => showEditDialog.value = false
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    unref(selectedUser) ? (openBlock(), createBlock(_component_UserForm, {
                      key: 0,
                      user: unref(selectedUser),
                      onSubmit: handleUpdate,
                      onCancel: ($event) => showEditDialog.value = false
                    }, null, 8, ["user", "onCancel"])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$8), {
              visible: unref(showRoleDialog),
              "onUpdate:visible": ($event) => isRef(showRoleDialog) ? showRoleDialog.value = $event : null,
              header: "Assign Roles",
              modal: "",
              style: { width: "400px" }
            }, {
              footer: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(script), {
                    label: "Cancel",
                    severity: "secondary",
                    text: "",
                    onClick: ($event) => showRoleDialog.value = false
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(script), {
                    label: "Save",
                    onClick: confirmAssignRoles,
                    loading: unref(isSubmitting)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(script), {
                      label: "Cancel",
                      severity: "secondary",
                      text: "",
                      onClick: ($event) => showRoleDialog.value = false
                    }, null, 8, ["onClick"]),
                    createVNode(unref(script), {
                      label: "Save",
                      onClick: confirmAssignRoles,
                      loading: unref(isSubmitting)
                    }, null, 8, ["loading"])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-4"${_scopeId2}><div class="form-field"${_scopeId2}><label class="form-label"${_scopeId2}>Select Roles</label>`);
                  _push3(ssrRenderComponent(unref(script$9), {
                    modelValue: unref(selectedRoleIds),
                    "onUpdate:modelValue": ($event) => isRef(selectedRoleIds) ? selectedRoleIds.value = $event : null,
                    options: unref(allRoles),
                    optionLabel: "name",
                    optionValue: "id",
                    placeholder: "Select roles",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode("div", { class: "form-field" }, [
                        createVNode("label", { class: "form-label" }, "Select Roles"),
                        createVNode(unref(script$9), {
                          modelValue: unref(selectedRoleIds),
                          "onUpdate:modelValue": ($event) => isRef(selectedRoleIds) ? selectedRoleIds.value = $event : null,
                          options: unref(allRoles),
                          optionLabel: "name",
                          optionValue: "id",
                          placeholder: "Select roles",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$a), null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$b), null, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "page-container" }, [
                createVNode("div", { class: "flex items-center justify-between mb-6" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "page-title" }, "User Management"),
                    createVNode("p", { class: "page-subtitle" }, "Manage system users and their roles")
                  ]),
                  createVNode(unref(script), {
                    label: "Add User",
                    icon: "pi pi-plus",
                    onClick: ($event) => showCreateDialog.value = true
                  }, null, 8, ["onClick"])
                ]),
                createVNode("div", { class: "filter-bar" }, [
                  createVNode(unref(script$1), null, {
                    default: withCtx(() => [
                      createVNode(unref(script$2), { class: "pi pi-search" }),
                      createVNode(unref(script$3), {
                        modelValue: unref(filters).search,
                        "onUpdate:modelValue": ($event) => unref(filters).search = $event,
                        placeholder: "Search users...",
                        onKeyup: withKeys(handleSearch, ["enter"])
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(script$4), {
                    modelValue: unref(filters).enabled,
                    "onUpdate:modelValue": ($event) => unref(filters).enabled = $event,
                    options: statusOptions,
                    optionLabel: "label",
                    optionValue: "value",
                    placeholder: "All Statuses",
                    class: "w-48",
                    showClear: "",
                    onChange: handleStatusChange
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(unref(script), {
                    label: "Reset",
                    severity: "secondary",
                    text: "",
                    onClick: resetFilters
                  })
                ]),
                createVNode("div", { class: "table-container" }, [
                  createVNode(unref(script$5), {
                    value: unref(users),
                    loading: unref(isLoading),
                    lazy: "",
                    paginator: "",
                    first: unref(pagination).page.value * unref(pagination).size.value,
                    rows: unref(pagination).size.value,
                    totalRecords: unref(pagination).totalElements.value,
                    onPage,
                    onSort,
                    sortMode: "single",
                    sortField: unref(pagination).sort.value,
                    sortOrder: unref(pagination).direction.value === "asc" ? 1 : -1,
                    stripedRows: "",
                    responsiveLayout: "scroll"
                  }, {
                    empty: withCtx(() => [
                      createVNode("div", { class: "text-center py-8" }, [
                        createVNode("p", { class: "text-surface-500" }, "No users found")
                      ])
                    ]),
                    default: withCtx(() => [
                      createVNode(unref(script$6), {
                        field: "email",
                        header: "User",
                        sortable: ""
                      }, {
                        body: withCtx(({ data }) => [
                          createVNode("div", { class: "flex items-center gap-3" }, [
                            createVNode("div", { class: "w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center" }, [
                              createVNode("span", { class: "text-primary-700 font-medium text-sm" }, toDisplayString(data.firstName[0]) + toDisplayString(data.lastName[0]), 1)
                            ]),
                            createVNode("div", null, [
                              createVNode("p", { class: "font-medium text-surface-900" }, toDisplayString(data.firstName) + " " + toDisplayString(data.lastName), 1),
                              createVNode("p", { class: "text-xs text-surface-500" }, toDisplayString(data.email), 1)
                            ])
                          ])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(script$6), {
                        field: "roles",
                        header: "Roles"
                      }, {
                        body: withCtx(({ data }) => [
                          createVNode("div", { class: "flex flex-wrap gap-1" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(data.roles, (role) => {
                              return openBlock(), createBlock(unref(script$7), {
                                key: role.id,
                                value: role.name,
                                severity: "info",
                                class: "text-xs"
                              }, null, 8, ["value"]);
                            }), 128))
                          ])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(script$6), {
                        field: "departmentName",
                        header: "Department"
                      }, {
                        body: withCtx(({ data }) => [
                          createVNode("span", { class: "text-sm text-surface-600" }, toDisplayString(data.departmentName || "\u2014"), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(script$6), {
                        field: "enabled",
                        header: "Status",
                        sortable: ""
                      }, {
                        body: withCtx(({ data }) => [
                          createVNode(unref(script$7), {
                            value: data.enabled ? "Active" : "Disabled",
                            severity: data.enabled ? "success" : "danger"
                          }, null, 8, ["value", "severity"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(script$6), {
                        header: "Actions",
                        style: { "width": "150px" }
                      }, {
                        body: withCtx(({ data }) => [
                          createVNode("div", { class: "flex items-center gap-1" }, [
                            createVNode(unref(script), {
                              icon: "pi pi-pencil",
                              severity: "secondary",
                              text: "",
                              rounded: "",
                              size: "small",
                              onClick: ($event) => editUser(data),
                              "aria-label": "Edit user"
                            }, null, 8, ["onClick"]),
                            unref(can)("USER_UPDATE") ? (openBlock(), createBlock(unref(script), {
                              key: 0,
                              icon: data.enabled ? "pi pi-ban" : "pi pi-check",
                              severity: data.enabled ? "warn" : "success",
                              text: "",
                              rounded: "",
                              size: "small",
                              onClick: ($event) => toggleUserStatus(data),
                              "aria-label": data.enabled ? "Disable user" : "Enable user"
                            }, null, 8, ["icon", "severity", "onClick", "aria-label"])) : createCommentVNode("", true),
                            unref(can)("ROLE_ASSIGN") ? (openBlock(), createBlock(unref(script), {
                              key: 1,
                              icon: "pi pi-shield",
                              severity: "info",
                              text: "",
                              rounded: "",
                              size: "small",
                              onClick: ($event) => assignRoles(data),
                              "aria-label": "Assign roles"
                            }, null, 8, ["onClick"])) : createCommentVNode("", true)
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["value", "loading", "first", "rows", "totalRecords", "sortField", "sortOrder"])
                ]),
                createVNode(unref(script$8), {
                  visible: unref(showCreateDialog),
                  "onUpdate:visible": ($event) => isRef(showCreateDialog) ? showCreateDialog.value = $event : null,
                  header: "Add User",
                  modal: "",
                  style: { width: "500px" }
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UserForm, {
                      onSubmit: handleCreate,
                      onCancel: ($event) => showCreateDialog.value = false
                    }, null, 8, ["onCancel"])
                  ]),
                  _: 1
                }, 8, ["visible", "onUpdate:visible"]),
                createVNode(unref(script$8), {
                  visible: unref(showEditDialog),
                  "onUpdate:visible": ($event) => isRef(showEditDialog) ? showEditDialog.value = $event : null,
                  header: "Edit User",
                  modal: "",
                  style: { width: "500px" }
                }, {
                  default: withCtx(() => [
                    unref(selectedUser) ? (openBlock(), createBlock(_component_UserForm, {
                      key: 0,
                      user: unref(selectedUser),
                      onSubmit: handleUpdate,
                      onCancel: ($event) => showEditDialog.value = false
                    }, null, 8, ["user", "onCancel"])) : createCommentVNode("", true)
                  ]),
                  _: 1
                }, 8, ["visible", "onUpdate:visible"]),
                createVNode(unref(script$8), {
                  visible: unref(showRoleDialog),
                  "onUpdate:visible": ($event) => isRef(showRoleDialog) ? showRoleDialog.value = $event : null,
                  header: "Assign Roles",
                  modal: "",
                  style: { width: "400px" }
                }, {
                  footer: withCtx(() => [
                    createVNode(unref(script), {
                      label: "Cancel",
                      severity: "secondary",
                      text: "",
                      onClick: ($event) => showRoleDialog.value = false
                    }, null, 8, ["onClick"]),
                    createVNode(unref(script), {
                      label: "Save",
                      onClick: confirmAssignRoles,
                      loading: unref(isSubmitting)
                    }, null, 8, ["loading"])
                  ]),
                  default: withCtx(() => [
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode("div", { class: "form-field" }, [
                        createVNode("label", { class: "form-label" }, "Select Roles"),
                        createVNode(unref(script$9), {
                          modelValue: unref(selectedRoleIds),
                          "onUpdate:modelValue": ($event) => isRef(selectedRoleIds) ? selectedRoleIds.value = $event : null,
                          options: unref(allRoles),
                          optionLabel: "name",
                          optionValue: "id",
                          placeholder: "Select roles",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                      ])
                    ])
                  ]),
                  _: 1
                }, 8, ["visible", "onUpdate:visible"]),
                createVNode(unref(script$a)),
                createVNode(unref(script$b))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/management/users/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Dm69_ndf.mjs.map
