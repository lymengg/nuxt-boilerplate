import { u as useToast, _ as __nuxt_component_0, n as navigateTo } from "../server.mjs";
import { ref, defineComponent, reactive, resolveComponent, mergeProps, withCtx, unref, createVNode, withKeys, toDisplayString, openBlock, createBlock, createCommentVNode, isRef, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import script from "./index-BDaj-nhv.js";
import script$6 from "./index-BrgvDYif.js";
import script$5 from "./index-EG4FwBE9.js";
import script$7 from "./index-DzCo-7Br.js";
import script$3 from "./index-CnIUS0M4.js";
import script$4 from "./index-DctHMqNs.js";
import script$8 from "./index-CnAzX4JO.js";
import script$9 from "./index-C40nmvEk.js";
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
import "@primeuix/styles/textarea";
import "@primeuix/styles/toast";
import "./index-D-XLIqRy.js";
import "./index-BDUbCchk.js";
import "@primeuix/styles/iconfield";
import "./useAuth-BC3_nFKE.js";
const expenseService = {
  async list(params) {
    return apiFetch("/api/expenses", { query: params });
  },
  async get(id) {
    return apiFetch(`/api/expenses/${id}`);
  },
  async create(data) {
    return apiFetch("/api/expenses", {
      method: "POST",
      body: data
    });
  },
  async update(id, data) {
    return apiFetch(`/api/expenses/${id}`, {
      method: "PUT",
      body: data
    });
  },
  async approve(id, data) {
    return apiFetch(`/api/expenses/${id}/approve`, {
      method: "POST",
      body: data
    });
  },
  async reject(id, data) {
    return apiFetch(`/api/expenses/${id}/reject`, {
      method: "POST",
      body: data
    });
  },
  async cancel(id) {
    return apiFetch(`/api/expenses/${id}/cancel`, {
      method: "POST"
    });
  },
  async process(id) {
    return apiFetch(`/api/expenses/${id}/process`, {
      method: "POST"
    });
  },
  async delete(id) {
    return apiFetch(`/api/expenses/${id}`, {
      method: "DELETE"
    });
  }
};
const EXPENSE_CATEGORIES = [
  "Travel",
  "Meals",
  "Office Supplies",
  "Software",
  "Hardware",
  "Training",
  "Marketing",
  "Other"
];
const EXPENSE_STATUSES = {
  PENDING: { label: "Pending", severity: "warn" },
  APPROVED: { label: "Approved", severity: "info" },
  PROCESSED: { label: "Processed", severity: "success" },
  REJECTED: { label: "Rejected", severity: "danger" },
  CANCELLED: { label: "Cancelled", severity: "secondary" }
};
function useExpenses() {
  const expenses = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const pagination = usePagination();
  async function fetchExpenses(params = {}) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await expenseService.list({
        page: pagination.page.value,
        size: pagination.size.value,
        sort: pagination.sort.value,
        direction: pagination.direction.value,
        ...params
      });
      if (response.success && response.data) {
        expenses.value = response.data.content;
        pagination.updateFromResponse(
          response.data.totalElements,
          response.data.totalPages
        );
      } else {
        error.value = response.message || "Failed to fetch expenses";
      }
    } catch (err) {
      const apiError = useApiError();
      const parsed = apiError.handleError(err);
      error.value = parsed.message;
    } finally {
      isLoading.value = false;
    }
  }
  async function getExpense(id) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await expenseService.get(id);
      if (response.success && response.data) {
        return response.data;
      }
      error.value = response.message || "Failed to fetch expense";
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
    expenses,
    isLoading,
    error,
    pagination,
    fetchExpenses,
    getExpense
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { expenses, isLoading, pagination, fetchExpenses } = useExpenses();
    const { can } = useAuthorization();
    const toast = useToast();
    const showCreateDialog = ref(false);
    const showRejectDialog = ref(false);
    const rejectReason = ref("");
    const selectedExpense = ref(null);
    const filters = reactive({
      search: "",
      status: null,
      category: null
    });
    const statusOptions = Object.entries(EXPENSE_STATUSES).map(([value, { label }]) => ({
      label,
      value
    }));
    const categoryOptions = EXPENSE_CATEGORIES.map((c) => ({
      label: c,
      value: c
    }));
    function formatCurrency(amount, currency) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency
      }).format(amount);
    }
    function formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    }
    function resetFilters() {
      filters.search = "";
      filters.status = null;
      filters.category = null;
      fetchExpenses();
    }
    function handleSearch() {
      fetchExpenses({
        search: filters.search || void 0,
        status: filters.status || void 0,
        category: filters.category || void 0
      });
    }
    function handleStatusChange() {
      fetchExpenses({
        search: filters.search || void 0,
        status: filters.status || void 0,
        category: filters.category || void 0
      });
    }
    function handleCategoryChange() {
      fetchExpenses({
        search: filters.search || void 0,
        status: filters.status || void 0,
        category: filters.category || void 0
      });
    }
    function onPage(event) {
      pagination.setPage(event.page);
      fetchExpenses({
        search: filters.search || void 0,
        status: filters.status || void 0,
        category: filters.category || void 0
      });
    }
    function onSort(event) {
      const field = typeof event.sortField === "string" ? event.sortField : void 0;
      if (field) {
        pagination.setSort(field, event.sortOrder === 1 ? "asc" : "desc");
        fetchExpenses({
          search: filters.search || void 0,
          status: filters.status || void 0,
          category: filters.category || void 0
        });
      }
    }
    function viewExpense(expense) {
      navigateTo(`/expenses/${expense.id}`);
    }
    function approveExpense(expense) {
      selectedExpense.value = expense;
      confirmExpenseAction(expense.id, "approve");
    }
    function rejectExpense(expense) {
      selectedExpense.value = expense;
      rejectReason.value = "";
      showRejectDialog.value = true;
    }
    async function confirmExpenseAction(id, action) {
      try {
        if (action === "approve") {
          await expenseService.approve(id);
          toast.add({ severity: "success", summary: "Success", detail: "Expense approved", life: 3e3 });
        } else {
          await expenseService.reject(id, { reason: rejectReason.value });
          toast.add({ severity: "success", summary: "Success", detail: "Expense rejected", life: 3e3 });
          showRejectDialog.value = false;
        }
        fetchExpenses({
          search: filters.search || void 0,
          status: filters.status || void 0,
          category: filters.category || void 0
        });
      } catch {
        toast.add({ severity: "error", summary: "Error", detail: "Failed to process expense", life: 3e3 });
      }
    }
    async function confirmReject() {
      if (!selectedExpense.value || !rejectReason.value) return;
      await confirmExpenseAction(selectedExpense.value.id, "reject");
    }
    async function handleCreate(data) {
      try {
        await expenseService.create(data);
        toast.add({ severity: "success", summary: "Success", detail: "Expense created", life: 3e3 });
        showCreateDialog.value = false;
        fetchExpenses({
          search: filters.search || void 0,
          status: filters.status || void 0,
          category: filters.category || void 0
        });
      } catch {
        toast.add({ severity: "error", summary: "Error", detail: "Failed to create expense", life: 3e3 });
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_ExpenseStatusTag = resolveComponent("ExpenseStatusTag");
      const _component_ExpenseForm = resolveComponent("ExpenseForm");
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "dashboard" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="page-container"${_scopeId}><div class="flex items-center justify-between mb-6"${_scopeId}><div${_scopeId}><h1 class="page-title"${_scopeId}>Expenses</h1><p class="page-subtitle"${_scopeId}>Manage and track expense requests</p></div>`);
            _push2(ssrRenderComponent(unref(script), {
              label: "New Expense",
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
                    placeholder: "Search expenses...",
                    onKeyup: handleSearch
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(script$2), { class: "pi pi-search" }),
                    createVNode(unref(script$3), {
                      modelValue: unref(filters).search,
                      "onUpdate:modelValue": ($event) => unref(filters).search = $event,
                      placeholder: "Search expenses...",
                      onKeyup: withKeys(handleSearch, ["enter"])
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$4), {
              modelValue: unref(filters).status,
              "onUpdate:modelValue": ($event) => unref(filters).status = $event,
              options: unref(statusOptions),
              optionLabel: "label",
              optionValue: "value",
              placeholder: "All Statuses",
              class: "w-48",
              showClear: "",
              onChange: handleStatusChange
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$4), {
              modelValue: unref(filters).category,
              "onUpdate:modelValue": ($event) => unref(filters).category = $event,
              options: unref(categoryOptions),
              optionLabel: "label",
              optionValue: "value",
              placeholder: "All Categories",
              class: "w-48",
              showClear: "",
              onChange: handleCategoryChange
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script), {
              label: "Reset",
              severity: "secondary",
              text: "",
              onClick: resetFilters
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="table-container"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(script$5), {
              value: unref(expenses),
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
                  _push3(`<div class="text-center py-8"${_scopeId2}><p class="text-surface-500"${_scopeId2}>No expenses found</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-center py-8" }, [
                      createVNode("p", { class: "text-surface-500" }, "No expenses found")
                    ])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(script$6), {
                    field: "title",
                    header: "Title",
                    sortable: ""
                  }, {
                    body: withCtx(({ data }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div${_scopeId3}><p class="font-medium text-surface-900"${_scopeId3}>${ssrInterpolate(data.title)}</p><p class="text-xs text-surface-500 mt-0.5"${_scopeId3}>${ssrInterpolate(data.category)}</p></div>`);
                      } else {
                        return [
                          createVNode("div", null, [
                            createVNode("p", { class: "font-medium text-surface-900" }, toDisplayString(data.title), 1),
                            createVNode("p", { class: "text-xs text-surface-500 mt-0.5" }, toDisplayString(data.category), 1)
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(script$6), {
                    field: "amount",
                    header: "Amount",
                    sortable: ""
                  }, {
                    body: withCtx(({ data }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span class="font-medium"${_scopeId3}>${ssrInterpolate(formatCurrency(data.amount, data.currency))}</span>`);
                      } else {
                        return [
                          createVNode("span", { class: "font-medium" }, toDisplayString(formatCurrency(data.amount, data.currency)), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(script$6), {
                    field: "status",
                    header: "Status",
                    sortable: ""
                  }, {
                    body: withCtx(({ data }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_ExpenseStatusTag, {
                          status: data.status
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_ExpenseStatusTag, {
                            status: data.status
                          }, null, 8, ["status"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(script$6), {
                    field: "submittedBy",
                    header: "Submitted By"
                  }, {
                    body: withCtx(({ data }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span class="text-sm"${_scopeId3}>${ssrInterpolate(data.submittedBy.firstName)} ${ssrInterpolate(data.submittedBy.lastName)}</span>`);
                      } else {
                        return [
                          createVNode("span", { class: "text-sm" }, toDisplayString(data.submittedBy.firstName) + " " + toDisplayString(data.submittedBy.lastName), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(script$6), {
                    field: "createdAt",
                    header: "Date",
                    sortable: ""
                  }, {
                    body: withCtx(({ data }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span class="text-sm text-surface-600"${_scopeId3}>${ssrInterpolate(formatDate(data.createdAt))}</span>`);
                      } else {
                        return [
                          createVNode("span", { class: "text-sm text-surface-600" }, toDisplayString(formatDate(data.createdAt)), 1)
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
                          icon: "pi pi-eye",
                          severity: "secondary",
                          text: "",
                          rounded: "",
                          size: "small",
                          onClick: ($event) => viewExpense(data),
                          "aria-label": "View expense"
                        }, null, _parent4, _scopeId3));
                        if (unref(can)("EXPENSE_APPROVE") && data.status === "PENDING") {
                          _push4(ssrRenderComponent(unref(script), {
                            icon: "pi pi-check",
                            severity: "success",
                            text: "",
                            rounded: "",
                            size: "small",
                            onClick: ($event) => approveExpense(data),
                            "aria-label": "Approve expense"
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        if (unref(can)("EXPENSE_APPROVE") && data.status === "PENDING") {
                          _push4(ssrRenderComponent(unref(script), {
                            icon: "pi pi-times",
                            severity: "danger",
                            text: "",
                            rounded: "",
                            size: "small",
                            onClick: ($event) => rejectExpense(data),
                            "aria-label": "Reject expense"
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "flex items-center gap-1" }, [
                            createVNode(unref(script), {
                              icon: "pi pi-eye",
                              severity: "secondary",
                              text: "",
                              rounded: "",
                              size: "small",
                              onClick: ($event) => viewExpense(data),
                              "aria-label": "View expense"
                            }, null, 8, ["onClick"]),
                            unref(can)("EXPENSE_APPROVE") && data.status === "PENDING" ? (openBlock(), createBlock(unref(script), {
                              key: 0,
                              icon: "pi pi-check",
                              severity: "success",
                              text: "",
                              rounded: "",
                              size: "small",
                              onClick: ($event) => approveExpense(data),
                              "aria-label": "Approve expense"
                            }, null, 8, ["onClick"])) : createCommentVNode("", true),
                            unref(can)("EXPENSE_APPROVE") && data.status === "PENDING" ? (openBlock(), createBlock(unref(script), {
                              key: 1,
                              icon: "pi pi-times",
                              severity: "danger",
                              text: "",
                              rounded: "",
                              size: "small",
                              onClick: ($event) => rejectExpense(data),
                              "aria-label": "Reject expense"
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
                      field: "title",
                      header: "Title",
                      sortable: ""
                    }, {
                      body: withCtx(({ data }) => [
                        createVNode("div", null, [
                          createVNode("p", { class: "font-medium text-surface-900" }, toDisplayString(data.title), 1),
                          createVNode("p", { class: "text-xs text-surface-500 mt-0.5" }, toDisplayString(data.category), 1)
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(script$6), {
                      field: "amount",
                      header: "Amount",
                      sortable: ""
                    }, {
                      body: withCtx(({ data }) => [
                        createVNode("span", { class: "font-medium" }, toDisplayString(formatCurrency(data.amount, data.currency)), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(unref(script$6), {
                      field: "status",
                      header: "Status",
                      sortable: ""
                    }, {
                      body: withCtx(({ data }) => [
                        createVNode(_component_ExpenseStatusTag, {
                          status: data.status
                        }, null, 8, ["status"])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(script$6), {
                      field: "submittedBy",
                      header: "Submitted By"
                    }, {
                      body: withCtx(({ data }) => [
                        createVNode("span", { class: "text-sm" }, toDisplayString(data.submittedBy.firstName) + " " + toDisplayString(data.submittedBy.lastName), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(unref(script$6), {
                      field: "createdAt",
                      header: "Date",
                      sortable: ""
                    }, {
                      body: withCtx(({ data }) => [
                        createVNode("span", { class: "text-sm text-surface-600" }, toDisplayString(formatDate(data.createdAt)), 1)
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
                            icon: "pi pi-eye",
                            severity: "secondary",
                            text: "",
                            rounded: "",
                            size: "small",
                            onClick: ($event) => viewExpense(data),
                            "aria-label": "View expense"
                          }, null, 8, ["onClick"]),
                          unref(can)("EXPENSE_APPROVE") && data.status === "PENDING" ? (openBlock(), createBlock(unref(script), {
                            key: 0,
                            icon: "pi pi-check",
                            severity: "success",
                            text: "",
                            rounded: "",
                            size: "small",
                            onClick: ($event) => approveExpense(data),
                            "aria-label": "Approve expense"
                          }, null, 8, ["onClick"])) : createCommentVNode("", true),
                          unref(can)("EXPENSE_APPROVE") && data.status === "PENDING" ? (openBlock(), createBlock(unref(script), {
                            key: 1,
                            icon: "pi pi-times",
                            severity: "danger",
                            text: "",
                            rounded: "",
                            size: "small",
                            onClick: ($event) => rejectExpense(data),
                            "aria-label": "Reject expense"
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
            _push2(ssrRenderComponent(unref(script$7), {
              visible: unref(showCreateDialog),
              "onUpdate:visible": ($event) => isRef(showCreateDialog) ? showCreateDialog.value = $event : null,
              header: "New Expense",
              modal: "",
              style: { width: "500px" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_ExpenseForm, {
                    onSubmit: handleCreate,
                    onCancel: ($event) => showCreateDialog.value = false
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_ExpenseForm, {
                      onSubmit: handleCreate,
                      onCancel: ($event) => showCreateDialog.value = false
                    }, null, 8, ["onCancel"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$7), {
              visible: unref(showRejectDialog),
              "onUpdate:visible": ($event) => isRef(showRejectDialog) ? showRejectDialog.value = $event : null,
              header: "Reject Expense",
              modal: "",
              style: { width: "400px" }
            }, {
              footer: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(script), {
                    label: "Cancel",
                    severity: "secondary",
                    text: "",
                    onClick: ($event) => showRejectDialog.value = false
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(script), {
                    label: "Reject",
                    severity: "danger",
                    disabled: !unref(rejectReason),
                    onClick: confirmReject
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(script), {
                      label: "Cancel",
                      severity: "secondary",
                      text: "",
                      onClick: ($event) => showRejectDialog.value = false
                    }, null, 8, ["onClick"]),
                    createVNode(unref(script), {
                      label: "Reject",
                      severity: "danger",
                      disabled: !unref(rejectReason),
                      onClick: confirmReject
                    }, null, 8, ["disabled"])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-4"${_scopeId2}><div class="form-field"${_scopeId2}><label for="rejectReason" class="form-label"${_scopeId2}>Reason for Rejection</label>`);
                  _push3(ssrRenderComponent(unref(script$8), {
                    id: "rejectReason",
                    modelValue: unref(rejectReason),
                    "onUpdate:modelValue": ($event) => isRef(rejectReason) ? rejectReason.value = $event : null,
                    rows: "3",
                    class: "w-full",
                    placeholder: "Provide a reason for rejection..."
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode("div", { class: "form-field" }, [
                        createVNode("label", {
                          for: "rejectReason",
                          class: "form-label"
                        }, "Reason for Rejection"),
                        createVNode(unref(script$8), {
                          id: "rejectReason",
                          modelValue: unref(rejectReason),
                          "onUpdate:modelValue": ($event) => isRef(rejectReason) ? rejectReason.value = $event : null,
                          rows: "3",
                          class: "w-full",
                          placeholder: "Provide a reason for rejection..."
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$9), null, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "page-container" }, [
                createVNode("div", { class: "flex items-center justify-between mb-6" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "page-title" }, "Expenses"),
                    createVNode("p", { class: "page-subtitle" }, "Manage and track expense requests")
                  ]),
                  createVNode(unref(script), {
                    label: "New Expense",
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
                        placeholder: "Search expenses...",
                        onKeyup: withKeys(handleSearch, ["enter"])
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(unref(script$4), {
                    modelValue: unref(filters).status,
                    "onUpdate:modelValue": ($event) => unref(filters).status = $event,
                    options: unref(statusOptions),
                    optionLabel: "label",
                    optionValue: "value",
                    placeholder: "All Statuses",
                    class: "w-48",
                    showClear: "",
                    onChange: handleStatusChange
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                  createVNode(unref(script$4), {
                    modelValue: unref(filters).category,
                    "onUpdate:modelValue": ($event) => unref(filters).category = $event,
                    options: unref(categoryOptions),
                    optionLabel: "label",
                    optionValue: "value",
                    placeholder: "All Categories",
                    class: "w-48",
                    showClear: "",
                    onChange: handleCategoryChange
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                  createVNode(unref(script), {
                    label: "Reset",
                    severity: "secondary",
                    text: "",
                    onClick: resetFilters
                  })
                ]),
                createVNode("div", { class: "table-container" }, [
                  createVNode(unref(script$5), {
                    value: unref(expenses),
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
                        createVNode("p", { class: "text-surface-500" }, "No expenses found")
                      ])
                    ]),
                    default: withCtx(() => [
                      createVNode(unref(script$6), {
                        field: "title",
                        header: "Title",
                        sortable: ""
                      }, {
                        body: withCtx(({ data }) => [
                          createVNode("div", null, [
                            createVNode("p", { class: "font-medium text-surface-900" }, toDisplayString(data.title), 1),
                            createVNode("p", { class: "text-xs text-surface-500 mt-0.5" }, toDisplayString(data.category), 1)
                          ])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(script$6), {
                        field: "amount",
                        header: "Amount",
                        sortable: ""
                      }, {
                        body: withCtx(({ data }) => [
                          createVNode("span", { class: "font-medium" }, toDisplayString(formatCurrency(data.amount, data.currency)), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(script$6), {
                        field: "status",
                        header: "Status",
                        sortable: ""
                      }, {
                        body: withCtx(({ data }) => [
                          createVNode(_component_ExpenseStatusTag, {
                            status: data.status
                          }, null, 8, ["status"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(script$6), {
                        field: "submittedBy",
                        header: "Submitted By"
                      }, {
                        body: withCtx(({ data }) => [
                          createVNode("span", { class: "text-sm" }, toDisplayString(data.submittedBy.firstName) + " " + toDisplayString(data.submittedBy.lastName), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(script$6), {
                        field: "createdAt",
                        header: "Date",
                        sortable: ""
                      }, {
                        body: withCtx(({ data }) => [
                          createVNode("span", { class: "text-sm text-surface-600" }, toDisplayString(formatDate(data.createdAt)), 1)
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
                              icon: "pi pi-eye",
                              severity: "secondary",
                              text: "",
                              rounded: "",
                              size: "small",
                              onClick: ($event) => viewExpense(data),
                              "aria-label": "View expense"
                            }, null, 8, ["onClick"]),
                            unref(can)("EXPENSE_APPROVE") && data.status === "PENDING" ? (openBlock(), createBlock(unref(script), {
                              key: 0,
                              icon: "pi pi-check",
                              severity: "success",
                              text: "",
                              rounded: "",
                              size: "small",
                              onClick: ($event) => approveExpense(data),
                              "aria-label": "Approve expense"
                            }, null, 8, ["onClick"])) : createCommentVNode("", true),
                            unref(can)("EXPENSE_APPROVE") && data.status === "PENDING" ? (openBlock(), createBlock(unref(script), {
                              key: 1,
                              icon: "pi pi-times",
                              severity: "danger",
                              text: "",
                              rounded: "",
                              size: "small",
                              onClick: ($event) => rejectExpense(data),
                              "aria-label": "Reject expense"
                            }, null, 8, ["onClick"])) : createCommentVNode("", true)
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["value", "loading", "first", "rows", "totalRecords", "sortField", "sortOrder"])
                ]),
                createVNode(unref(script$7), {
                  visible: unref(showCreateDialog),
                  "onUpdate:visible": ($event) => isRef(showCreateDialog) ? showCreateDialog.value = $event : null,
                  header: "New Expense",
                  modal: "",
                  style: { width: "500px" }
                }, {
                  default: withCtx(() => [
                    createVNode(_component_ExpenseForm, {
                      onSubmit: handleCreate,
                      onCancel: ($event) => showCreateDialog.value = false
                    }, null, 8, ["onCancel"])
                  ]),
                  _: 1
                }, 8, ["visible", "onUpdate:visible"]),
                createVNode(unref(script$7), {
                  visible: unref(showRejectDialog),
                  "onUpdate:visible": ($event) => isRef(showRejectDialog) ? showRejectDialog.value = $event : null,
                  header: "Reject Expense",
                  modal: "",
                  style: { width: "400px" }
                }, {
                  footer: withCtx(() => [
                    createVNode(unref(script), {
                      label: "Cancel",
                      severity: "secondary",
                      text: "",
                      onClick: ($event) => showRejectDialog.value = false
                    }, null, 8, ["onClick"]),
                    createVNode(unref(script), {
                      label: "Reject",
                      severity: "danger",
                      disabled: !unref(rejectReason),
                      onClick: confirmReject
                    }, null, 8, ["disabled"])
                  ]),
                  default: withCtx(() => [
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode("div", { class: "form-field" }, [
                        createVNode("label", {
                          for: "rejectReason",
                          class: "form-label"
                        }, "Reason for Rejection"),
                        createVNode(unref(script$8), {
                          id: "rejectReason",
                          modelValue: unref(rejectReason),
                          "onUpdate:modelValue": ($event) => isRef(rejectReason) ? rejectReason.value = $event : null,
                          rows: "3",
                          class: "w-full",
                          placeholder: "Provide a reason for rejection..."
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ])
                    ])
                  ]),
                  _: 1
                }, 8, ["visible", "onUpdate:visible"]),
                createVNode(unref(script$9))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/expenses/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-CHxFOPUh.js.map
