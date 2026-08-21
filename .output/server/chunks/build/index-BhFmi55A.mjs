import { _ as __nuxt_component_0 } from './server.mjs';
import { defineComponent, reactive, mergeProps, withCtx, unref, createVNode, withKeys, toDisplayString, ref, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import script$4 from './index-BDaj-nhv.mjs';
import script$6 from './index-BrgvDYif.mjs';
import script$5 from './index-EG4FwBE9.mjs';
import script$2 from './index-CnIUS0M4.mjs';
import script$3 from './index-DctHMqNs.mjs';
import script$7 from './index-BKjnf36X.mjs';
import script from './index-CKMc6Q8z.mjs';
import script$1 from './index-c24ZxKWA.mjs';
import { a as apiFetch } from './api-BiGERn36.mjs';
import { u as usePagination, a as useApiError } from './useApiError-DVtejTJD.mjs';
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
import './index-BH9iduCK.mjs';
import './index-CLrwot36.mjs';

const AUDIT_RESOURCE_TYPES = [
  "User",
  "Role",
  "Expense",
  "Tenant",
  "Department",
  "Permission",
  "Session"
];
const auditService = {
  async list(params) {
    return apiFetch("/api/audit-logs", {
      query: params
    });
  },
  async get(id) {
    return apiFetch(`/api/audit-logs/${id}`);
  }
};
function useAuditLogs() {
  const auditLogs = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const pagination = usePagination();
  async function fetchAuditLogs(params = {}) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await auditService.list({
        page: pagination.page.value,
        size: pagination.size.value,
        sort: pagination.sort.value,
        direction: pagination.direction.value,
        ...params
      });
      if (response.success && response.data) {
        auditLogs.value = response.data.content;
        pagination.updateFromResponse(
          response.data.totalElements,
          response.data.totalPages
        );
      } else {
        error.value = response.message || "Failed to fetch audit logs";
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
    auditLogs,
    isLoading,
    error,
    pagination,
    fetchAuditLogs
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { auditLogs, isLoading, pagination, fetchAuditLogs } = useAuditLogs();
    const filters = reactive({
      action: "",
      resourceType: null,
      result: null
    });
    const resourceTypeOptions = AUDIT_RESOURCE_TYPES.map((rt) => ({
      label: rt,
      value: rt
    }));
    const resultOptions = [
      { label: "Success", value: "SUCCESS" },
      { label: "Failure", value: "FAILURE" }
    ];
    function resetFilters() {
      filters.action = "";
      filters.resourceType = null;
      filters.result = null;
      fetchLogs();
    }
    function formatTimestamp(dateStr) {
      return new Date(dateStr).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
    function formatAction(action) {
      return action.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    }
    function handleSearch() {
      fetchLogs();
    }
    function handleResourceChange() {
      fetchLogs();
    }
    function handleResultChange() {
      fetchLogs();
    }
    function fetchLogs() {
      fetchAuditLogs({
        action: filters.action || void 0,
        resourceType: filters.resourceType || void 0,
        result: filters.result || void 0
      });
    }
    function onPage(event) {
      pagination.setPage(event.page);
      fetchLogs();
    }
    function onSort(event) {
      const field = typeof event.sortField === "string" ? event.sortField : void 0;
      if (field) {
        pagination.setSort(field, event.sortOrder === 1 ? "asc" : "desc");
        fetchLogs();
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "dashboard" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="page-container"${_scopeId}><div class="mb-6"${_scopeId}><h1 class="page-title"${_scopeId}>Audit Logs</h1><p class="page-subtitle"${_scopeId}>Track system activities and security events</p></div><div class="filter-bar"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(script), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(script$1), { class: "pi pi-search" }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(script$2), {
                    modelValue: unref(filters).action,
                    "onUpdate:modelValue": ($event) => unref(filters).action = $event,
                    placeholder: "Filter by action...",
                    onKeyup: handleSearch
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(script$1), { class: "pi pi-search" }),
                    createVNode(unref(script$2), {
                      modelValue: unref(filters).action,
                      "onUpdate:modelValue": ($event) => unref(filters).action = $event,
                      placeholder: "Filter by action...",
                      onKeyup: withKeys(handleSearch, ["enter"])
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$3), {
              modelValue: unref(filters).resourceType,
              "onUpdate:modelValue": ($event) => unref(filters).resourceType = $event,
              options: unref(resourceTypeOptions),
              optionLabel: "label",
              optionValue: "value",
              placeholder: "All Resources",
              class: "w-48",
              showClear: "",
              onChange: handleResourceChange
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$3), {
              modelValue: unref(filters).result,
              "onUpdate:modelValue": ($event) => unref(filters).result = $event,
              options: resultOptions,
              optionLabel: "label",
              optionValue: "value",
              placeholder: "All Results",
              class: "w-48",
              showClear: "",
              onChange: handleResultChange
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$4), {
              label: "Reset",
              severity: "secondary",
              text: "",
              onClick: resetFilters
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="table-container"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(script$5), {
              value: unref(auditLogs),
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
                  _push3(`<div class="text-center py-8"${_scopeId2}><p class="text-surface-500"${_scopeId2}>No audit logs found</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-center py-8" }, [
                      createVNode("p", { class: "text-surface-500" }, "No audit logs found")
                    ])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(script$6), {
                    field: "createdAt",
                    header: "Timestamp",
                    sortable: ""
                  }, {
                    body: withCtx(({ data }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span class="text-sm text-surface-600"${_scopeId3}>${ssrInterpolate(formatTimestamp(data.createdAt))}</span>`);
                      } else {
                        return [
                          createVNode("span", { class: "text-sm text-surface-600" }, toDisplayString(formatTimestamp(data.createdAt)), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(script$6), {
                    field: "actor",
                    header: "Actor"
                  }, {
                    body: withCtx(({ data }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div${_scopeId3}><p class="text-sm font-medium text-surface-900"${_scopeId3}>${ssrInterpolate(data.actor.firstName)} ${ssrInterpolate(data.actor.lastName)}</p><p class="text-xs text-surface-500"${_scopeId3}>${ssrInterpolate(data.actor.email)}</p></div>`);
                      } else {
                        return [
                          createVNode("div", null, [
                            createVNode("p", { class: "text-sm font-medium text-surface-900" }, toDisplayString(data.actor.firstName) + " " + toDisplayString(data.actor.lastName), 1),
                            createVNode("p", { class: "text-xs text-surface-500" }, toDisplayString(data.actor.email), 1)
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(script$6), {
                    field: "action",
                    header: "Action",
                    sortable: ""
                  }, {
                    body: withCtx(({ data }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span class="text-sm font-medium text-surface-700"${_scopeId3}>${ssrInterpolate(formatAction(data.action))}</span>`);
                      } else {
                        return [
                          createVNode("span", { class: "text-sm font-medium text-surface-700" }, toDisplayString(formatAction(data.action)), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(script$6), {
                    field: "resourceType",
                    header: "Resource"
                  }, {
                    body: withCtx(({ data }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(script$7), {
                          value: data.resourceType,
                          severity: "info",
                          class: "text-xs"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(script$7), {
                            value: data.resourceType,
                            severity: "info",
                            class: "text-xs"
                          }, null, 8, ["value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(script$6), {
                    field: "resourceId",
                    header: "Resource ID"
                  }, {
                    body: withCtx(({ data }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span class="text-xs text-surface-500 font-mono"${_scopeId3}>${ssrInterpolate(data.resourceId)}</span>`);
                      } else {
                        return [
                          createVNode("span", { class: "text-xs text-surface-500 font-mono" }, toDisplayString(data.resourceId), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(script$6), {
                    field: "result",
                    header: "Result",
                    sortable: ""
                  }, {
                    body: withCtx(({ data }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(script$7), {
                          value: data.result,
                          severity: data.result === "SUCCESS" ? "success" : "danger",
                          class: "text-xs"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(script$7), {
                            value: data.result,
                            severity: data.result === "SUCCESS" ? "success" : "danger",
                            class: "text-xs"
                          }, null, 8, ["value", "severity"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(script$6), {
                    field: "ipAddress",
                    header: "IP Address"
                  }, {
                    body: withCtx(({ data }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span class="text-xs text-surface-500 font-mono"${_scopeId3}>${ssrInterpolate(data.ipAddress)}</span>`);
                      } else {
                        return [
                          createVNode("span", { class: "text-xs text-surface-500 font-mono" }, toDisplayString(data.ipAddress), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(script$6), {
                      field: "createdAt",
                      header: "Timestamp",
                      sortable: ""
                    }, {
                      body: withCtx(({ data }) => [
                        createVNode("span", { class: "text-sm text-surface-600" }, toDisplayString(formatTimestamp(data.createdAt)), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(unref(script$6), {
                      field: "actor",
                      header: "Actor"
                    }, {
                      body: withCtx(({ data }) => [
                        createVNode("div", null, [
                          createVNode("p", { class: "text-sm font-medium text-surface-900" }, toDisplayString(data.actor.firstName) + " " + toDisplayString(data.actor.lastName), 1),
                          createVNode("p", { class: "text-xs text-surface-500" }, toDisplayString(data.actor.email), 1)
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(script$6), {
                      field: "action",
                      header: "Action",
                      sortable: ""
                    }, {
                      body: withCtx(({ data }) => [
                        createVNode("span", { class: "text-sm font-medium text-surface-700" }, toDisplayString(formatAction(data.action)), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(unref(script$6), {
                      field: "resourceType",
                      header: "Resource"
                    }, {
                      body: withCtx(({ data }) => [
                        createVNode(unref(script$7), {
                          value: data.resourceType,
                          severity: "info",
                          class: "text-xs"
                        }, null, 8, ["value"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(script$6), {
                      field: "resourceId",
                      header: "Resource ID"
                    }, {
                      body: withCtx(({ data }) => [
                        createVNode("span", { class: "text-xs text-surface-500 font-mono" }, toDisplayString(data.resourceId), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(unref(script$6), {
                      field: "result",
                      header: "Result",
                      sortable: ""
                    }, {
                      body: withCtx(({ data }) => [
                        createVNode(unref(script$7), {
                          value: data.result,
                          severity: data.result === "SUCCESS" ? "success" : "danger",
                          class: "text-xs"
                        }, null, 8, ["value", "severity"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(script$6), {
                      field: "ipAddress",
                      header: "IP Address"
                    }, {
                      body: withCtx(({ data }) => [
                        createVNode("span", { class: "text-xs text-surface-500 font-mono" }, toDisplayString(data.ipAddress), 1)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "page-container" }, [
                createVNode("div", { class: "mb-6" }, [
                  createVNode("h1", { class: "page-title" }, "Audit Logs"),
                  createVNode("p", { class: "page-subtitle" }, "Track system activities and security events")
                ]),
                createVNode("div", { class: "filter-bar" }, [
                  createVNode(unref(script), null, {
                    default: withCtx(() => [
                      createVNode(unref(script$1), { class: "pi pi-search" }),
                      createVNode(unref(script$2), {
                        modelValue: unref(filters).action,
                        "onUpdate:modelValue": ($event) => unref(filters).action = $event,
                        placeholder: "Filter by action...",
                        onKeyup: withKeys(handleSearch, ["enter"])
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(script$3), {
                    modelValue: unref(filters).resourceType,
                    "onUpdate:modelValue": ($event) => unref(filters).resourceType = $event,
                    options: unref(resourceTypeOptions),
                    optionLabel: "label",
                    optionValue: "value",
                    placeholder: "All Resources",
                    class: "w-48",
                    showClear: "",
                    onChange: handleResourceChange
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                  createVNode(unref(script$3), {
                    modelValue: unref(filters).result,
                    "onUpdate:modelValue": ($event) => unref(filters).result = $event,
                    options: resultOptions,
                    optionLabel: "label",
                    optionValue: "value",
                    placeholder: "All Results",
                    class: "w-48",
                    showClear: "",
                    onChange: handleResultChange
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(unref(script$4), {
                    label: "Reset",
                    severity: "secondary",
                    text: "",
                    onClick: resetFilters
                  })
                ]),
                createVNode("div", { class: "table-container" }, [
                  createVNode(unref(script$5), {
                    value: unref(auditLogs),
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
                        createVNode("p", { class: "text-surface-500" }, "No audit logs found")
                      ])
                    ]),
                    default: withCtx(() => [
                      createVNode(unref(script$6), {
                        field: "createdAt",
                        header: "Timestamp",
                        sortable: ""
                      }, {
                        body: withCtx(({ data }) => [
                          createVNode("span", { class: "text-sm text-surface-600" }, toDisplayString(formatTimestamp(data.createdAt)), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(script$6), {
                        field: "actor",
                        header: "Actor"
                      }, {
                        body: withCtx(({ data }) => [
                          createVNode("div", null, [
                            createVNode("p", { class: "text-sm font-medium text-surface-900" }, toDisplayString(data.actor.firstName) + " " + toDisplayString(data.actor.lastName), 1),
                            createVNode("p", { class: "text-xs text-surface-500" }, toDisplayString(data.actor.email), 1)
                          ])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(script$6), {
                        field: "action",
                        header: "Action",
                        sortable: ""
                      }, {
                        body: withCtx(({ data }) => [
                          createVNode("span", { class: "text-sm font-medium text-surface-700" }, toDisplayString(formatAction(data.action)), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(script$6), {
                        field: "resourceType",
                        header: "Resource"
                      }, {
                        body: withCtx(({ data }) => [
                          createVNode(unref(script$7), {
                            value: data.resourceType,
                            severity: "info",
                            class: "text-xs"
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(script$6), {
                        field: "resourceId",
                        header: "Resource ID"
                      }, {
                        body: withCtx(({ data }) => [
                          createVNode("span", { class: "text-xs text-surface-500 font-mono" }, toDisplayString(data.resourceId), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(script$6), {
                        field: "result",
                        header: "Result",
                        sortable: ""
                      }, {
                        body: withCtx(({ data }) => [
                          createVNode(unref(script$7), {
                            value: data.result,
                            severity: data.result === "SUCCESS" ? "success" : "danger",
                            class: "text-xs"
                          }, null, 8, ["value", "severity"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(script$6), {
                        field: "ipAddress",
                        header: "IP Address"
                      }, {
                        body: withCtx(({ data }) => [
                          createVNode("span", { class: "text-xs text-surface-500 font-mono" }, toDisplayString(data.ipAddress), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["value", "loading", "first", "rows", "totalRecords", "sortField", "sortOrder"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/management/audit/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BhFmi55A.mjs.map
