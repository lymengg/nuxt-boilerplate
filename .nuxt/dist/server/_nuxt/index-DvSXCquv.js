import { u as useToast, a as useConfirm, _ as __nuxt_component_0 } from "../server.mjs";
import { ref, defineComponent, reactive, resolveComponent, mergeProps, withCtx, unref, createVNode, withKeys, toDisplayString, openBlock, createBlock, createCommentVNode, isRef, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import script from "./index-BDaj-nhv.js";
import script$6 from "./index-BrgvDYif.js";
import script$5 from "./index-EG4FwBE9.js";
import script$8 from "./index-DzCo-7Br.js";
import script$3 from "./index-CnIUS0M4.js";
import script$4 from "./index-DctHMqNs.js";
import script$7 from "./index-BKjnf36X.js";
import script$a from "./index-C40nmvEk.js";
import script$9 from "./index-D8qY11de.js";
import script$1 from "./index-CKMc6Q8z.js";
import script$2 from "./index-c24ZxKWA.js";
import { a as apiFetch } from "./api-BiGERn36.js";
import "/home/runner/work/nuxt-boilerplate/nuxt-boilerplate/node_modules/hookable/dist/index.mjs";
import { u as usePagination, a as useApiError } from "./useApiError-DVtejTJD.js";
import { u as useAuthorization } from "./useAuthorization-D0KfPdVu.js";
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
import "./index-1v7fOn3J.js";
import "./index-CtIVYbH4.js";
import "@primeuix/styles/paginator";
import "./index-qhzJtE_o.js";
import "./index-CBACXbvA.js";
import "./index-BLBoPBG9.js";
import "./index-CEjm7QwF.js";
import "./index-BJFn3Jal.js";
import "./index-xRlVhXwl.js";
import "./index-BDpKneMc.js";
import "@primeuix/styles/inputnumber";
import "./index-CyoypR2R.js";
import "./index-BYQtjd9C.js";
import "@primeuix/styles/virtualscroller";
import "@primeuix/styles/datatable";
import "./index-CobSNMix.js";
import "./index-BSlrD5b6.js";
import "./index-CZMkDb0s.js";
import "./index-CP_fvbAb.js";
import "./index-rAVNvoJo.js";
import "./index-BMp5kizY.js";
import "./index-BkujatKk.js";
import "@primeuix/styles/checkbox";
import "./index-CaqxMkRc.js";
import "@primeuix/styles/radiobutton";
import "@primeuix/utils/zindex";
import "./index-CPX8QLh4.js";
import "./index-Cn5F1NyX.js";
import "./index-zZrFrjQS.js";
import "./index-D6DLQGdG.js";
import "./index-Din928lO.js";
import "@primeuix/styles/dialog";
import "@primeuix/styles/inputtext";
import "./index-BH9iduCK.js";
import "./index-CLrwot36.js";
import "@primeuix/styles/select";
import "@primeuix/styles/tag";
import "@primeuix/styles/toast";
import "./index-D-XLIqRy.js";
import "./index-BDUbCchk.js";
import "@primeuix/styles/confirmdialog";
import "@primeuix/styles/iconfield";
import "./useAuth-BC3_nFKE.js";
const tenantService = {
  async list(params) {
    return apiFetch("/api/tenants", { query: params });
  },
  async getAll() {
    return apiFetch("/api/tenants/all");
  },
  async get(id) {
    return apiFetch(`/api/tenants/${id}`);
  },
  async create(data) {
    return apiFetch("/api/tenants", {
      method: "POST",
      body: data
    });
  },
  async update(id, data) {
    return apiFetch(`/api/tenants/${id}`, {
      method: "PUT",
      body: data
    });
  },
  async delete(id) {
    return apiFetch(`/api/tenants/${id}`, {
      method: "DELETE"
    });
  }
};
function useTenants() {
  const tenants = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const pagination = usePagination();
  async function fetchTenants(params = {}) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await tenantService.list({
        page: pagination.page.value,
        size: pagination.size.value,
        sort: pagination.sort.value,
        direction: pagination.direction.value,
        ...params
      });
      if (response.success && response.data) {
        tenants.value = response.data.content;
        pagination.updateFromResponse(
          response.data.totalElements,
          response.data.totalPages
        );
      } else {
        error.value = response.message || "Failed to fetch tenants";
      }
    } catch (err) {
      const apiError = useApiError();
      const parsed = apiError.handleError(err);
      error.value = parsed.message;
    } finally {
      isLoading.value = false;
    }
  }
  async function fetchAllTenants() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await tenantService.getAll();
      if (response.success && response.data) {
        tenants.value = response.data;
      } else {
        error.value = response.message || "Failed to fetch tenants";
      }
    } catch (err) {
      const apiError = useApiError();
      const parsed = apiError.handleError(err);
      error.value = parsed.message;
    } finally {
      isLoading.value = false;
    }
  }
  return {
    tenants,
    isLoading,
    error,
    pagination,
    fetchTenants,
    fetchAllTenants
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { tenants, isLoading, pagination, fetchTenants } = useTenants();
    const { can } = useAuthorization();
    const toast = useToast();
    const confirm = useConfirm();
    const showCreateDialog = ref(false);
    const showEditDialog = ref(false);
    const selectedTenant = ref(null);
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
      fetchTenants();
    }
    function handleSearch() {
      fetchTenants({
        search: filters.search || void 0,
        enabled: filters.enabled ?? void 0
      });
    }
    function handleStatusChange() {
      fetchTenants({
        search: filters.search || void 0,
        enabled: filters.enabled ?? void 0
      });
    }
    function onPage(event) {
      pagination.setPage(event.page);
      fetchTenants({
        search: filters.search || void 0,
        enabled: filters.enabled ?? void 0
      });
    }
    function onSort(event) {
      const field = typeof event.sortField === "string" ? event.sortField : void 0;
      if (field) {
        pagination.setSort(field, event.sortOrder === 1 ? "asc" : "desc");
        fetchTenants({
          search: filters.search || void 0,
          enabled: filters.enabled ?? void 0
        });
      }
    }
    function editTenant(tenant) {
      selectedTenant.value = tenant;
      showEditDialog.value = true;
    }
    function toggleTenantStatus(tenant) {
      const action = tenant.enabled ? "disable" : "enable";
      confirm.require({
        message: `Are you sure you want to ${action} this tenant?`,
        header: `${action === "enable" ? "Enable" : "Disable"} Tenant`,
        icon: "pi pi-exclamation-triangle",
        acceptClass: action === "disable" ? "p-button-danger" : void 0,
        accept: async () => {
          try {
            await tenantService.update(tenant.id, { enabled: !tenant.enabled });
            toast.add({
              severity: "success",
              summary: "Success",
              detail: `Tenant ${action}d successfully`,
              life: 3e3
            });
            fetchTenants({
              search: filters.search || void 0,
              enabled: filters.enabled ?? void 0
            });
          } catch {
            toast.add({
              severity: "error",
              summary: "Error",
              detail: `Failed to ${action} tenant`,
              life: 3e3
            });
          }
        }
      });
    }
    function deleteTenant(tenant) {
      confirm.require({
        message: `Are you sure you want to delete "${tenant.name}"? This action cannot be undone.`,
        header: "Delete Tenant",
        icon: "pi pi-exclamation-triangle",
        acceptClass: "p-button-danger",
        accept: async () => {
          try {
            await tenantService.delete(tenant.id);
            toast.add({ severity: "success", summary: "Success", detail: "Tenant deleted", life: 3e3 });
            fetchTenants({
              search: filters.search || void 0,
              enabled: filters.enabled ?? void 0
            });
          } catch {
            toast.add({ severity: "error", summary: "Error", detail: "Failed to delete tenant", life: 3e3 });
          }
        }
      });
    }
    async function handleCreate(data) {
      try {
        await tenantService.create(data);
        toast.add({ severity: "success", summary: "Success", detail: "Tenant created", life: 3e3 });
        showCreateDialog.value = false;
        fetchTenants({
          search: filters.search || void 0,
          enabled: filters.enabled ?? void 0
        });
      } catch {
        toast.add({ severity: "error", summary: "Error", detail: "Failed to create tenant", life: 3e3 });
      }
    }
    async function handleUpdate(data) {
      if (!selectedTenant.value) return;
      try {
        await tenantService.update(selectedTenant.value.id, data);
        toast.add({ severity: "success", summary: "Success", detail: "Tenant updated", life: 3e3 });
        showEditDialog.value = false;
        fetchTenants({
          search: filters.search || void 0,
          enabled: filters.enabled ?? void 0
        });
      } catch {
        toast.add({ severity: "error", summary: "Error", detail: "Failed to update tenant", life: 3e3 });
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_TenantForm = resolveComponent("TenantForm");
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "dashboard" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="page-container"${_scopeId}><div class="flex items-center justify-between mb-6"${_scopeId}><div${_scopeId}><h1 class="page-title"${_scopeId}>Tenant Management</h1><p class="page-subtitle"${_scopeId}>Manage system tenants</p></div>`);
            _push2(ssrRenderComponent(unref(script), {
              label: "Add Tenant",
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
                    placeholder: "Search tenants...",
                    onKeyup: handleSearch
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(script$2), { class: "pi pi-search" }),
                    createVNode(unref(script$3), {
                      modelValue: unref(filters).search,
                      "onUpdate:modelValue": ($event) => unref(filters).search = $event,
                      placeholder: "Search tenants...",
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
              value: unref(tenants),
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
                  _push3(`<div class="text-center py-8"${_scopeId2}><p class="text-surface-500"${_scopeId2}>No tenants found</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-center py-8" }, [
                      createVNode("p", { class: "text-surface-500" }, "No tenants found")
                    ])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(script$6), {
                    field: "name",
                    header: "Tenant",
                    sortable: ""
                  }, {
                    body: withCtx(({ data }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div${_scopeId3}><p class="font-medium text-surface-900"${_scopeId3}>${ssrInterpolate(data.name)}</p><p class="text-xs text-surface-500 mt-0.5"${_scopeId3}>${ssrInterpolate(data.domain)}</p></div>`);
                      } else {
                        return [
                          createVNode("div", null, [
                            createVNode("p", { class: "font-medium text-surface-900" }, toDisplayString(data.name), 1),
                            createVNode("p", { class: "text-xs text-surface-500 mt-0.5" }, toDisplayString(data.domain), 1)
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(script$6), {
                    field: "userCount",
                    header: "Users",
                    sortable: ""
                  }, {
                    body: withCtx(({ data }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span class="text-sm text-surface-600"${_scopeId3}>${ssrInterpolate(data.userCount)}</span>`);
                      } else {
                        return [
                          createVNode("span", { class: "text-sm text-surface-600" }, toDisplayString(data.userCount), 1)
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
                    style: { "width": "120px" }
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
                          onClick: ($event) => editTenant(data),
                          "aria-label": "Edit tenant"
                        }, null, _parent4, _scopeId3));
                        if (unref(can)("TENANT_UPDATE")) {
                          _push4(ssrRenderComponent(unref(script), {
                            icon: data.enabled ? "pi pi-ban" : "pi pi-check",
                            severity: data.enabled ? "warn" : "success",
                            text: "",
                            rounded: "",
                            size: "small",
                            onClick: ($event) => toggleTenantStatus(data),
                            "aria-label": data.enabled ? "Disable tenant" : "Enable tenant"
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        if (unref(can)("TENANT_DELETE")) {
                          _push4(ssrRenderComponent(unref(script), {
                            icon: "pi pi-trash",
                            severity: "danger",
                            text: "",
                            rounded: "",
                            size: "small",
                            onClick: ($event) => deleteTenant(data),
                            "aria-label": "Delete tenant"
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
                              onClick: ($event) => editTenant(data),
                              "aria-label": "Edit tenant"
                            }, null, 8, ["onClick"]),
                            unref(can)("TENANT_UPDATE") ? (openBlock(), createBlock(unref(script), {
                              key: 0,
                              icon: data.enabled ? "pi pi-ban" : "pi pi-check",
                              severity: data.enabled ? "warn" : "success",
                              text: "",
                              rounded: "",
                              size: "small",
                              onClick: ($event) => toggleTenantStatus(data),
                              "aria-label": data.enabled ? "Disable tenant" : "Enable tenant"
                            }, null, 8, ["icon", "severity", "onClick", "aria-label"])) : createCommentVNode("", true),
                            unref(can)("TENANT_DELETE") ? (openBlock(), createBlock(unref(script), {
                              key: 1,
                              icon: "pi pi-trash",
                              severity: "danger",
                              text: "",
                              rounded: "",
                              size: "small",
                              onClick: ($event) => deleteTenant(data),
                              "aria-label": "Delete tenant"
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
                      field: "name",
                      header: "Tenant",
                      sortable: ""
                    }, {
                      body: withCtx(({ data }) => [
                        createVNode("div", null, [
                          createVNode("p", { class: "font-medium text-surface-900" }, toDisplayString(data.name), 1),
                          createVNode("p", { class: "text-xs text-surface-500 mt-0.5" }, toDisplayString(data.domain), 1)
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(script$6), {
                      field: "userCount",
                      header: "Users",
                      sortable: ""
                    }, {
                      body: withCtx(({ data }) => [
                        createVNode("span", { class: "text-sm text-surface-600" }, toDisplayString(data.userCount), 1)
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
                      style: { "width": "120px" }
                    }, {
                      body: withCtx(({ data }) => [
                        createVNode("div", { class: "flex items-center gap-1" }, [
                          createVNode(unref(script), {
                            icon: "pi pi-pencil",
                            severity: "secondary",
                            text: "",
                            rounded: "",
                            size: "small",
                            onClick: ($event) => editTenant(data),
                            "aria-label": "Edit tenant"
                          }, null, 8, ["onClick"]),
                          unref(can)("TENANT_UPDATE") ? (openBlock(), createBlock(unref(script), {
                            key: 0,
                            icon: data.enabled ? "pi pi-ban" : "pi pi-check",
                            severity: data.enabled ? "warn" : "success",
                            text: "",
                            rounded: "",
                            size: "small",
                            onClick: ($event) => toggleTenantStatus(data),
                            "aria-label": data.enabled ? "Disable tenant" : "Enable tenant"
                          }, null, 8, ["icon", "severity", "onClick", "aria-label"])) : createCommentVNode("", true),
                          unref(can)("TENANT_DELETE") ? (openBlock(), createBlock(unref(script), {
                            key: 1,
                            icon: "pi pi-trash",
                            severity: "danger",
                            text: "",
                            rounded: "",
                            size: "small",
                            onClick: ($event) => deleteTenant(data),
                            "aria-label": "Delete tenant"
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
              header: "Add Tenant",
              modal: "",
              style: { width: "400px" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_TenantForm, {
                    onSubmit: handleCreate,
                    onCancel: ($event) => showCreateDialog.value = false
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_TenantForm, {
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
              header: "Edit Tenant",
              modal: "",
              style: { width: "400px" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (unref(selectedTenant)) {
                    _push3(ssrRenderComponent(_component_TenantForm, {
                      tenant: unref(selectedTenant),
                      onSubmit: handleUpdate,
                      onCancel: ($event) => showEditDialog.value = false
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    unref(selectedTenant) ? (openBlock(), createBlock(_component_TenantForm, {
                      key: 0,
                      tenant: unref(selectedTenant),
                      onSubmit: handleUpdate,
                      onCancel: ($event) => showEditDialog.value = false
                    }, null, 8, ["tenant", "onCancel"])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$9), null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$a), null, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "page-container" }, [
                createVNode("div", { class: "flex items-center justify-between mb-6" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "page-title" }, "Tenant Management"),
                    createVNode("p", { class: "page-subtitle" }, "Manage system tenants")
                  ]),
                  createVNode(unref(script), {
                    label: "Add Tenant",
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
                        placeholder: "Search tenants...",
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
                    value: unref(tenants),
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
                        createVNode("p", { class: "text-surface-500" }, "No tenants found")
                      ])
                    ]),
                    default: withCtx(() => [
                      createVNode(unref(script$6), {
                        field: "name",
                        header: "Tenant",
                        sortable: ""
                      }, {
                        body: withCtx(({ data }) => [
                          createVNode("div", null, [
                            createVNode("p", { class: "font-medium text-surface-900" }, toDisplayString(data.name), 1),
                            createVNode("p", { class: "text-xs text-surface-500 mt-0.5" }, toDisplayString(data.domain), 1)
                          ])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(script$6), {
                        field: "userCount",
                        header: "Users",
                        sortable: ""
                      }, {
                        body: withCtx(({ data }) => [
                          createVNode("span", { class: "text-sm text-surface-600" }, toDisplayString(data.userCount), 1)
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
                        style: { "width": "120px" }
                      }, {
                        body: withCtx(({ data }) => [
                          createVNode("div", { class: "flex items-center gap-1" }, [
                            createVNode(unref(script), {
                              icon: "pi pi-pencil",
                              severity: "secondary",
                              text: "",
                              rounded: "",
                              size: "small",
                              onClick: ($event) => editTenant(data),
                              "aria-label": "Edit tenant"
                            }, null, 8, ["onClick"]),
                            unref(can)("TENANT_UPDATE") ? (openBlock(), createBlock(unref(script), {
                              key: 0,
                              icon: data.enabled ? "pi pi-ban" : "pi pi-check",
                              severity: data.enabled ? "warn" : "success",
                              text: "",
                              rounded: "",
                              size: "small",
                              onClick: ($event) => toggleTenantStatus(data),
                              "aria-label": data.enabled ? "Disable tenant" : "Enable tenant"
                            }, null, 8, ["icon", "severity", "onClick", "aria-label"])) : createCommentVNode("", true),
                            unref(can)("TENANT_DELETE") ? (openBlock(), createBlock(unref(script), {
                              key: 1,
                              icon: "pi pi-trash",
                              severity: "danger",
                              text: "",
                              rounded: "",
                              size: "small",
                              onClick: ($event) => deleteTenant(data),
                              "aria-label": "Delete tenant"
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
                  header: "Add Tenant",
                  modal: "",
                  style: { width: "400px" }
                }, {
                  default: withCtx(() => [
                    createVNode(_component_TenantForm, {
                      onSubmit: handleCreate,
                      onCancel: ($event) => showCreateDialog.value = false
                    }, null, 8, ["onCancel"])
                  ]),
                  _: 1
                }, 8, ["visible", "onUpdate:visible"]),
                createVNode(unref(script$8), {
                  visible: unref(showEditDialog),
                  "onUpdate:visible": ($event) => isRef(showEditDialog) ? showEditDialog.value = $event : null,
                  header: "Edit Tenant",
                  modal: "",
                  style: { width: "400px" }
                }, {
                  default: withCtx(() => [
                    unref(selectedTenant) ? (openBlock(), createBlock(_component_TenantForm, {
                      key: 0,
                      tenant: unref(selectedTenant),
                      onSubmit: handleUpdate,
                      onCancel: ($event) => showEditDialog.value = false
                    }, null, 8, ["tenant", "onCancel"])) : createCommentVNode("", true)
                  ]),
                  _: 1
                }, 8, ["visible", "onUpdate:visible"]),
                createVNode(unref(script$9)),
                createVNode(unref(script$a))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/management/tenants/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-DvSXCquv.js.map
