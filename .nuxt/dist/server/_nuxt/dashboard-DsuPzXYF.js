import { _ as __nuxt_component_0 } from "../server.mjs";
import { _ as __nuxt_component_0$1 } from "./nuxt-link-CeaKTE3h.js";
import { defineComponent, computed, ref, resolveComponent, mergeProps, withCtx, unref, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createTextVNode, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import script$2 from "./index-BDaj-nhv.js";
import script from "./index-CDExI0xy.js";
import script$1 from "./index-BHZLo0Go.js";
import "/home/runner/work/nuxt-boilerplate/nuxt-boilerplate/node_modules/hookable/dist/index.mjs";
import { u as useAuth } from "./useAuth-BC3_nFKE.js";
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
import "@primeuix/styles/card";
import "@primeuix/styles/skeleton";
import "./api-BiGERn36.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useAuth();
    const { can } = useAuthorization();
    const userName = computed(() => {
      if (!user.value) return "";
      return user.value.firstName;
    });
    const stats = ref([
      { label: "Total Expenses", value: "—", icon: "📋", bgClass: "bg-blue-50", iconClass: "text-blue-600" },
      { label: "Pending Approval", value: "—", icon: "⏳", bgClass: "bg-amber-50", iconClass: "text-amber-600" },
      { label: "Approved", value: "—", icon: "✓", bgClass: "bg-green-50", iconClass: "text-green-600" },
      { label: "Total Amount", value: "—", icon: "💰", bgClass: "bg-purple-50", iconClass: "text-purple-600" }
    ]);
    const recentExpenses = ref([]);
    const isLoading = ref(true);
    function formatCurrency(amount, currency) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency
      }).format(amount);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_ExpenseStatusTag = resolveComponent("ExpenseStatusTag");
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "dashboard" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="page-container"${_scopeId}><div class="page-header"${_scopeId}><h1 class="page-title"${_scopeId}>Dashboard</h1><p class="page-subtitle"${_scopeId}>Welcome back, ${ssrInterpolate(unref(userName))}</p></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"${_scopeId}><!--[-->`);
            ssrRenderList(unref(stats), (stat) => {
              _push2(ssrRenderComponent(unref(script), {
                key: stat.label,
                class: "shadow-sm"
              }, {
                content: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex items-center justify-between"${_scopeId2}><div${_scopeId2}><p class="text-sm text-surface-500"${_scopeId2}>${ssrInterpolate(stat.label)}</p><p class="text-2xl font-semibold text-surface-900 mt-1"${_scopeId2}>${ssrInterpolate(stat.value)}</p></div><div class="${ssrRenderClass(["w-10 h-10 rounded-lg flex items-center justify-center", stat.bgClass])}"${_scopeId2}><span class="${ssrRenderClass(["text-lg", stat.iconClass])}"${_scopeId2}>${ssrInterpolate(stat.icon)}</span></div></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "flex items-center justify-between" }, [
                        createVNode("div", null, [
                          createVNode("p", { class: "text-sm text-surface-500" }, toDisplayString(stat.label), 1),
                          createVNode("p", { class: "text-2xl font-semibold text-surface-900 mt-1" }, toDisplayString(stat.value), 1)
                        ]),
                        createVNode("div", {
                          class: ["w-10 h-10 rounded-lg flex items-center justify-center", stat.bgClass]
                        }, [
                          createVNode("span", {
                            class: ["text-lg", stat.iconClass]
                          }, toDisplayString(stat.icon), 3)
                        ], 2)
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-6"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(script), { class: "shadow-sm" }, {
              title: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center justify-between"${_scopeId2}><span class="text-base font-semibold"${_scopeId2}>Recent Expenses</span>`);
                  _push3(ssrRenderComponent(_component_NuxtLink, {
                    to: "/expenses",
                    class: "text-sm text-primary-600 hover:text-primary-700"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`View All`);
                      } else {
                        return [
                          createTextVNode("View All")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex items-center justify-between" }, [
                      createVNode("span", { class: "text-base font-semibold" }, "Recent Expenses"),
                      createVNode(_component_NuxtLink, {
                        to: "/expenses",
                        class: "text-sm text-primary-600 hover:text-primary-700"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("View All")
                        ]),
                        _: 1
                      })
                    ])
                  ];
                }
              }),
              content: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (unref(isLoading)) {
                    _push3(`<div class="space-y-3"${_scopeId2}><!--[-->`);
                    ssrRenderList(3, (i) => {
                      _push3(`<div class="flex items-center gap-3"${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(script$1), {
                        shape: "circle",
                        size: "2rem"
                      }, null, _parent3, _scopeId2));
                      _push3(`<div class="flex-1"${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(script$1), {
                        width: "60%",
                        height: "1rem"
                      }, null, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(unref(script$1), {
                        width: "40%",
                        height: "0.75rem",
                        class: "mt-1"
                      }, null, _parent3, _scopeId2));
                      _push3(`</div></div>`);
                    });
                    _push3(`<!--]--></div>`);
                  } else if (unref(recentExpenses).length === 0) {
                    _push3(`<div class="text-center py-8"${_scopeId2}><p class="text-sm text-surface-500"${_scopeId2}>No recent expenses</p></div>`);
                  } else {
                    _push3(`<div class="space-y-3"${_scopeId2}><!--[-->`);
                    ssrRenderList(unref(recentExpenses), (expense) => {
                      _push3(`<div class="flex items-center justify-between p-3 rounded-lg hover:bg-surface-50"${_scopeId2}><div class="flex items-center gap-3"${_scopeId2}><div class="w-8 h-8 bg-surface-100 rounded-full flex items-center justify-center"${_scopeId2}><span class="text-xs font-medium text-surface-600"${_scopeId2}>${ssrInterpolate(expense.category.substring(0, 2))}</span></div><div${_scopeId2}><p class="text-sm font-medium text-surface-900"${_scopeId2}>${ssrInterpolate(expense.title)}</p><p class="text-xs text-surface-500"${_scopeId2}>${ssrInterpolate(expense.submittedAt)}</p></div></div><div class="text-right"${_scopeId2}><p class="text-sm font-medium text-surface-900"${_scopeId2}>${ssrInterpolate(formatCurrency(expense.amount, expense.currency))}</p>`);
                      _push3(ssrRenderComponent(_component_ExpenseStatusTag, {
                        status: expense.status
                      }, null, _parent3, _scopeId2));
                      _push3(`</div></div>`);
                    });
                    _push3(`<!--]--></div>`);
                  }
                } else {
                  return [
                    unref(isLoading) ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "space-y-3"
                    }, [
                      (openBlock(), createBlock(Fragment, null, renderList(3, (i) => {
                        return createVNode("div", {
                          key: i,
                          class: "flex items-center gap-3"
                        }, [
                          createVNode(unref(script$1), {
                            shape: "circle",
                            size: "2rem"
                          }),
                          createVNode("div", { class: "flex-1" }, [
                            createVNode(unref(script$1), {
                              width: "60%",
                              height: "1rem"
                            }),
                            createVNode(unref(script$1), {
                              width: "40%",
                              height: "0.75rem",
                              class: "mt-1"
                            })
                          ])
                        ]);
                      }), 64))
                    ])) : unref(recentExpenses).length === 0 ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "text-center py-8"
                    }, [
                      createVNode("p", { class: "text-sm text-surface-500" }, "No recent expenses")
                    ])) : (openBlock(), createBlock("div", {
                      key: 2,
                      class: "space-y-3"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(recentExpenses), (expense) => {
                        return openBlock(), createBlock("div", {
                          key: expense.id,
                          class: "flex items-center justify-between p-3 rounded-lg hover:bg-surface-50"
                        }, [
                          createVNode("div", { class: "flex items-center gap-3" }, [
                            createVNode("div", { class: "w-8 h-8 bg-surface-100 rounded-full flex items-center justify-center" }, [
                              createVNode("span", { class: "text-xs font-medium text-surface-600" }, toDisplayString(expense.category.substring(0, 2)), 1)
                            ]),
                            createVNode("div", null, [
                              createVNode("p", { class: "text-sm font-medium text-surface-900" }, toDisplayString(expense.title), 1),
                              createVNode("p", { class: "text-xs text-surface-500" }, toDisplayString(expense.submittedAt), 1)
                            ])
                          ]),
                          createVNode("div", { class: "text-right" }, [
                            createVNode("p", { class: "text-sm font-medium text-surface-900" }, toDisplayString(formatCurrency(expense.amount, expense.currency)), 1),
                            createVNode(_component_ExpenseStatusTag, {
                              status: expense.status
                            }, null, 8, ["status"])
                          ])
                        ]);
                      }), 128))
                    ]))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script), { class: "shadow-sm" }, {
              title: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="text-base font-semibold"${_scopeId2}>Quick Actions</span>`);
                } else {
                  return [
                    createVNode("span", { class: "text-base font-semibold" }, "Quick Actions")
                  ];
                }
              }),
              content: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-3"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_NuxtLink, {
                    to: "/expenses",
                    class: "block"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(script$2), {
                          label: "Submit New Expense",
                          icon: "pi pi-plus",
                          class: "w-full",
                          severity: "secondary"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(script$2), {
                            label: "Submit New Expense",
                            icon: "pi pi-plus",
                            class: "w-full",
                            severity: "secondary"
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  if (unref(can)("USER_CREATE")) {
                    _push3(ssrRenderComponent(_component_NuxtLink, {
                      to: "/management/users",
                      class: "block"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(script$2), {
                            label: "Manage Users",
                            icon: "pi pi-users",
                            class: "w-full",
                            severity: "secondary",
                            outlined: ""
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(script$2), {
                              label: "Manage Users",
                              icon: "pi pi-users",
                              class: "w-full",
                              severity: "secondary",
                              outlined: ""
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (unref(can)("ROLE_CREATE")) {
                    _push3(ssrRenderComponent(_component_NuxtLink, {
                      to: "/management/roles",
                      class: "block"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(script$2), {
                            label: "Manage Roles",
                            icon: "pi pi-shield",
                            class: "w-full",
                            severity: "secondary",
                            outlined: ""
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(script$2), {
                              label: "Manage Roles",
                              icon: "pi pi-shield",
                              class: "w-full",
                              severity: "secondary",
                              outlined: ""
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-3" }, [
                      createVNode(_component_NuxtLink, {
                        to: "/expenses",
                        class: "block"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(script$2), {
                            label: "Submit New Expense",
                            icon: "pi pi-plus",
                            class: "w-full",
                            severity: "secondary"
                          })
                        ]),
                        _: 1
                      }),
                      unref(can)("USER_CREATE") ? (openBlock(), createBlock(_component_NuxtLink, {
                        key: 0,
                        to: "/management/users",
                        class: "block"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(script$2), {
                            label: "Manage Users",
                            icon: "pi pi-users",
                            class: "w-full",
                            severity: "secondary",
                            outlined: ""
                          })
                        ]),
                        _: 1
                      })) : createCommentVNode("", true),
                      unref(can)("ROLE_CREATE") ? (openBlock(), createBlock(_component_NuxtLink, {
                        key: 1,
                        to: "/management/roles",
                        class: "block"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(script$2), {
                            label: "Manage Roles",
                            icon: "pi pi-shield",
                            class: "w-full",
                            severity: "secondary",
                            outlined: ""
                          })
                        ]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "page-container" }, [
                createVNode("div", { class: "page-header" }, [
                  createVNode("h1", { class: "page-title" }, "Dashboard"),
                  createVNode("p", { class: "page-subtitle" }, "Welcome back, " + toDisplayString(unref(userName)), 1)
                ]),
                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(stats), (stat) => {
                    return openBlock(), createBlock(unref(script), {
                      key: stat.label,
                      class: "shadow-sm"
                    }, {
                      content: withCtx(() => [
                        createVNode("div", { class: "flex items-center justify-between" }, [
                          createVNode("div", null, [
                            createVNode("p", { class: "text-sm text-surface-500" }, toDisplayString(stat.label), 1),
                            createVNode("p", { class: "text-2xl font-semibold text-surface-900 mt-1" }, toDisplayString(stat.value), 1)
                          ]),
                          createVNode("div", {
                            class: ["w-10 h-10 rounded-lg flex items-center justify-center", stat.bgClass]
                          }, [
                            createVNode("span", {
                              class: ["text-lg", stat.iconClass]
                            }, toDisplayString(stat.icon), 3)
                          ], 2)
                        ])
                      ]),
                      _: 2
                    }, 1024);
                  }), 128))
                ]),
                createVNode("div", { class: "grid grid-cols-1 lg:grid-cols-2 gap-6" }, [
                  createVNode(unref(script), { class: "shadow-sm" }, {
                    title: withCtx(() => [
                      createVNode("div", { class: "flex items-center justify-between" }, [
                        createVNode("span", { class: "text-base font-semibold" }, "Recent Expenses"),
                        createVNode(_component_NuxtLink, {
                          to: "/expenses",
                          class: "text-sm text-primary-600 hover:text-primary-700"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("View All")
                          ]),
                          _: 1
                        })
                      ])
                    ]),
                    content: withCtx(() => [
                      unref(isLoading) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "space-y-3"
                      }, [
                        (openBlock(), createBlock(Fragment, null, renderList(3, (i) => {
                          return createVNode("div", {
                            key: i,
                            class: "flex items-center gap-3"
                          }, [
                            createVNode(unref(script$1), {
                              shape: "circle",
                              size: "2rem"
                            }),
                            createVNode("div", { class: "flex-1" }, [
                              createVNode(unref(script$1), {
                                width: "60%",
                                height: "1rem"
                              }),
                              createVNode(unref(script$1), {
                                width: "40%",
                                height: "0.75rem",
                                class: "mt-1"
                              })
                            ])
                          ]);
                        }), 64))
                      ])) : unref(recentExpenses).length === 0 ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "text-center py-8"
                      }, [
                        createVNode("p", { class: "text-sm text-surface-500" }, "No recent expenses")
                      ])) : (openBlock(), createBlock("div", {
                        key: 2,
                        class: "space-y-3"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(recentExpenses), (expense) => {
                          return openBlock(), createBlock("div", {
                            key: expense.id,
                            class: "flex items-center justify-between p-3 rounded-lg hover:bg-surface-50"
                          }, [
                            createVNode("div", { class: "flex items-center gap-3" }, [
                              createVNode("div", { class: "w-8 h-8 bg-surface-100 rounded-full flex items-center justify-center" }, [
                                createVNode("span", { class: "text-xs font-medium text-surface-600" }, toDisplayString(expense.category.substring(0, 2)), 1)
                              ]),
                              createVNode("div", null, [
                                createVNode("p", { class: "text-sm font-medium text-surface-900" }, toDisplayString(expense.title), 1),
                                createVNode("p", { class: "text-xs text-surface-500" }, toDisplayString(expense.submittedAt), 1)
                              ])
                            ]),
                            createVNode("div", { class: "text-right" }, [
                              createVNode("p", { class: "text-sm font-medium text-surface-900" }, toDisplayString(formatCurrency(expense.amount, expense.currency)), 1),
                              createVNode(_component_ExpenseStatusTag, {
                                status: expense.status
                              }, null, 8, ["status"])
                            ])
                          ]);
                        }), 128))
                      ]))
                    ]),
                    _: 1
                  }),
                  createVNode(unref(script), { class: "shadow-sm" }, {
                    title: withCtx(() => [
                      createVNode("span", { class: "text-base font-semibold" }, "Quick Actions")
                    ]),
                    content: withCtx(() => [
                      createVNode("div", { class: "space-y-3" }, [
                        createVNode(_component_NuxtLink, {
                          to: "/expenses",
                          class: "block"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(script$2), {
                              label: "Submit New Expense",
                              icon: "pi pi-plus",
                              class: "w-full",
                              severity: "secondary"
                            })
                          ]),
                          _: 1
                        }),
                        unref(can)("USER_CREATE") ? (openBlock(), createBlock(_component_NuxtLink, {
                          key: 0,
                          to: "/management/users",
                          class: "block"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(script$2), {
                              label: "Manage Users",
                              icon: "pi pi-users",
                              class: "w-full",
                              severity: "secondary",
                              outlined: ""
                            })
                          ]),
                          _: 1
                        })) : createCommentVNode("", true),
                        unref(can)("ROLE_CREATE") ? (openBlock(), createBlock(_component_NuxtLink, {
                          key: 1,
                          to: "/management/roles",
                          class: "block"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(script$2), {
                              label: "Manage Roles",
                              icon: "pi pi-shield",
                              class: "w-full",
                              severity: "secondary",
                              outlined: ""
                            })
                          ]),
                          _: 1
                        })) : createCommentVNode("", true)
                      ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=dashboard-DsuPzXYF.js.map
