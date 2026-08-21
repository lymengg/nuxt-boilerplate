import { u as useToast, a as useConfirm, _ as __nuxt_component_0 } from "../server.mjs";
import { defineComponent, ref, computed, resolveComponent, mergeProps, withCtx, unref, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createCommentVNode, isRef, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import script from "./index-BDaj-nhv.js";
import script$5 from "./index-BMp5kizY.js";
import script$2 from "./index-BrgvDYif.js";
import script$1 from "./index-EG4FwBE9.js";
import script$4 from "./index-DzCo-7Br.js";
import script$3 from "./index-BKjnf36X.js";
import script$7 from "./index-C40nmvEk.js";
import script$6 from "./index-D8qY11de.js";
import { a as apiFetch } from "./api-BiGERn36.js";
import "/home/runner/work/nuxt-boilerplate/nuxt-boilerplate/node_modules/hookable/dist/index.mjs";
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
import "./index-CP_fvbAb.js";
import "./index-BkujatKk.js";
import "./index-xRlVhXwl.js";
import "./index-BDpKneMc.js";
import "@primeuix/styles/checkbox";
import "./index-1v7fOn3J.js";
import "./index-CtIVYbH4.js";
import "@primeuix/styles/paginator";
import "./index-qhzJtE_o.js";
import "./index-DctHMqNs.js";
import "@primeuix/utils/zindex";
import "./index-BH9iduCK.js";
import "./index-CobSNMix.js";
import "./index-CLrwot36.js";
import "./index-BJFn3Jal.js";
import "./index-CKMc6Q8z.js";
import "@primeuix/styles/iconfield";
import "./index-c24ZxKWA.js";
import "./index-CnIUS0M4.js";
import "@primeuix/styles/inputtext";
import "./index-rAVNvoJo.js";
import "./index-zZrFrjQS.js";
import "./index-BYQtjd9C.js";
import "@primeuix/styles/virtualscroller";
import "@primeuix/styles/select";
import "./index-CBACXbvA.js";
import "./index-BLBoPBG9.js";
import "./index-CEjm7QwF.js";
import "@primeuix/styles/inputnumber";
import "./index-CyoypR2R.js";
import "@primeuix/styles/datatable";
import "./index-BSlrD5b6.js";
import "./index-CZMkDb0s.js";
import "./index-CaqxMkRc.js";
import "@primeuix/styles/radiobutton";
import "./index-CPX8QLh4.js";
import "./index-Cn5F1NyX.js";
import "./index-D6DLQGdG.js";
import "./index-Din928lO.js";
import "@primeuix/styles/dialog";
import "@primeuix/styles/tag";
import "@primeuix/styles/toast";
import "./index-D-XLIqRy.js";
import "./index-BDUbCchk.js";
import "@primeuix/styles/confirmdialog";
import "./useAuth-BC3_nFKE.js";
const roleService = {
  async list(params) {
    return apiFetch("/api/roles", { query: params });
  },
  async getAll() {
    return apiFetch("/api/roles/all");
  },
  async get(id) {
    return apiFetch(`/api/roles/${id}`);
  },
  async create(data) {
    return apiFetch("/api/roles", {
      method: "POST",
      body: data
    });
  },
  async update(id, data) {
    return apiFetch(`/api/roles/${id}`, {
      method: "PUT",
      body: data
    });
  },
  async assignPermissions(id, data) {
    return apiFetch(`/api/roles/${id}/permissions`, {
      method: "PUT",
      body: data
    });
  },
  async delete(id) {
    return apiFetch(`/api/roles/${id}`, {
      method: "DELETE"
    });
  }
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { can } = useAuthorization();
    const toast = useToast();
    const confirm = useConfirm();
    const roles = ref([]);
    const allPermissions = ref([]);
    const isLoading = ref(false);
    const isSubmitting = ref(false);
    const showCreateDialog = ref(false);
    const showEditDialog = ref(false);
    const showPermissionDialog = ref(false);
    const selectedRole = ref(null);
    const selectedPermissionIds = ref([]);
    const groupedPermissions = computed(() => {
      const groups = {};
      for (const perm of allPermissions.value) {
        if (!groups[perm.category]) {
          groups[perm.category] = [];
        }
        groups[perm.category].push(perm);
      }
      return groups;
    });
    function togglePermission(id) {
      const idx = selectedPermissionIds.value.indexOf(id);
      if (idx >= 0) {
        selectedPermissionIds.value.splice(idx, 1);
      } else {
        selectedPermissionIds.value.push(id);
      }
    }
    async function fetchRoles() {
      isLoading.value = true;
      try {
        const response = await roleService.list();
        if (response.success && response.data) {
          roles.value = response.data.content;
        }
      } catch {
      } finally {
        isLoading.value = false;
      }
    }
    function editRole(role) {
      selectedRole.value = role;
      showEditDialog.value = true;
    }
    function managePermissions(role) {
      selectedRole.value = role;
      selectedPermissionIds.value = role.permissions.map((p) => p.id);
      showPermissionDialog.value = true;
    }
    function deleteRole(role) {
      confirm.require({
        message: `Are you sure you want to delete the role "${role.name}"?`,
        header: "Delete Role",
        icon: "pi pi-exclamation-triangle",
        acceptClass: "p-button-danger",
        accept: async () => {
          try {
            await roleService.delete(role.id);
            toast.add({ severity: "success", summary: "Success", detail: "Role deleted", life: 3e3 });
            fetchRoles();
          } catch {
            toast.add({ severity: "error", summary: "Error", detail: "Failed to delete role", life: 3e3 });
          }
        }
      });
    }
    async function savePermissions() {
      if (!selectedRole.value) return;
      isSubmitting.value = true;
      try {
        await roleService.assignPermissions(selectedRole.value.id, {
          permissionIds: selectedPermissionIds.value
        });
        toast.add({ severity: "success", summary: "Success", detail: "Permissions updated", life: 3e3 });
        showPermissionDialog.value = false;
        fetchRoles();
      } catch {
        toast.add({ severity: "error", summary: "Error", detail: "Failed to update permissions", life: 3e3 });
      } finally {
        isSubmitting.value = false;
      }
    }
    async function handleCreate(data) {
      try {
        await roleService.create(data);
        toast.add({ severity: "success", summary: "Success", detail: "Role created", life: 3e3 });
        showCreateDialog.value = false;
        fetchRoles();
      } catch {
        toast.add({ severity: "error", summary: "Error", detail: "Failed to create role", life: 3e3 });
      }
    }
    async function handleUpdate(data) {
      if (!selectedRole.value) return;
      try {
        await roleService.update(selectedRole.value.id, data);
        toast.add({ severity: "success", summary: "Success", detail: "Role updated", life: 3e3 });
        showEditDialog.value = false;
        fetchRoles();
      } catch {
        toast.add({ severity: "error", summary: "Error", detail: "Failed to update role", life: 3e3 });
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_RoleForm = resolveComponent("RoleForm");
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "dashboard" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="page-container"${_scopeId}><div class="flex items-center justify-between mb-6"${_scopeId}><div${_scopeId}><h1 class="page-title"${_scopeId}>Role Management</h1><p class="page-subtitle"${_scopeId}>Manage roles and permissions</p></div>`);
            _push2(ssrRenderComponent(unref(script), {
              label: "Add Role",
              icon: "pi pi-plus",
              onClick: ($event) => showCreateDialog.value = true
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="table-container"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(script$1), {
              value: unref(roles),
              loading: unref(isLoading),
              stripedRows: "",
              responsiveLayout: "scroll"
            }, {
              empty: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="text-center py-8"${_scopeId2}><p class="text-surface-500"${_scopeId2}>No roles found</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "text-center py-8" }, [
                      createVNode("p", { class: "text-surface-500" }, "No roles found")
                    ])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(script$2), {
                    field: "name",
                    header: "Role",
                    sortable: ""
                  }, {
                    body: withCtx(({ data }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div${_scopeId3}><p class="font-medium text-surface-900"${_scopeId3}>${ssrInterpolate(data.name)}</p><p class="text-xs text-surface-500 mt-0.5"${_scopeId3}>${ssrInterpolate(data.description)}</p></div>`);
                      } else {
                        return [
                          createVNode("div", null, [
                            createVNode("p", { class: "font-medium text-surface-900" }, toDisplayString(data.name), 1),
                            createVNode("p", { class: "text-xs text-surface-500 mt-0.5" }, toDisplayString(data.description), 1)
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(script$2), {
                    field: "permissions",
                    header: "Permissions"
                  }, {
                    body: withCtx(({ data }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex flex-wrap gap-1"${_scopeId3}><!--[-->`);
                        ssrRenderList(data.permissions.slice(0, 3), (perm) => {
                          _push4(ssrRenderComponent(unref(script$3), {
                            key: perm.id,
                            value: perm.name,
                            severity: "info",
                            class: "text-xs"
                          }, null, _parent4, _scopeId3));
                        });
                        _push4(`<!--]-->`);
                        if (data.permissions.length > 3) {
                          _push4(ssrRenderComponent(unref(script$3), {
                            value: `+${data.permissions.length - 3} more`,
                            severity: "secondary",
                            class: "text-xs"
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "flex flex-wrap gap-1" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(data.permissions.slice(0, 3), (perm) => {
                              return openBlock(), createBlock(unref(script$3), {
                                key: perm.id,
                                value: perm.name,
                                severity: "info",
                                class: "text-xs"
                              }, null, 8, ["value"]);
                            }), 128)),
                            data.permissions.length > 3 ? (openBlock(), createBlock(unref(script$3), {
                              key: 0,
                              value: `+${data.permissions.length - 3} more`,
                              severity: "secondary",
                              class: "text-xs"
                            }, null, 8, ["value"])) : createCommentVNode("", true)
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(script$2), {
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
                  _push3(ssrRenderComponent(unref(script$2), {
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
                          onClick: ($event) => editRole(data),
                          "aria-label": "Edit role"
                        }, null, _parent4, _scopeId3));
                        if (unref(can)("ROLE_PERMISSIONS")) {
                          _push4(ssrRenderComponent(unref(script), {
                            icon: "pi pi-key",
                            severity: "info",
                            text: "",
                            rounded: "",
                            size: "small",
                            onClick: ($event) => managePermissions(data),
                            "aria-label": "Manage permissions"
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        if (unref(can)("ROLE_DELETE")) {
                          _push4(ssrRenderComponent(unref(script), {
                            icon: "pi pi-trash",
                            severity: "danger",
                            text: "",
                            rounded: "",
                            size: "small",
                            onClick: ($event) => deleteRole(data),
                            "aria-label": "Delete role"
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
                              onClick: ($event) => editRole(data),
                              "aria-label": "Edit role"
                            }, null, 8, ["onClick"]),
                            unref(can)("ROLE_PERMISSIONS") ? (openBlock(), createBlock(unref(script), {
                              key: 0,
                              icon: "pi pi-key",
                              severity: "info",
                              text: "",
                              rounded: "",
                              size: "small",
                              onClick: ($event) => managePermissions(data),
                              "aria-label": "Manage permissions"
                            }, null, 8, ["onClick"])) : createCommentVNode("", true),
                            unref(can)("ROLE_DELETE") ? (openBlock(), createBlock(unref(script), {
                              key: 1,
                              icon: "pi pi-trash",
                              severity: "danger",
                              text: "",
                              rounded: "",
                              size: "small",
                              onClick: ($event) => deleteRole(data),
                              "aria-label": "Delete role"
                            }, null, 8, ["onClick"])) : createCommentVNode("", true)
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(script$2), {
                      field: "name",
                      header: "Role",
                      sortable: ""
                    }, {
                      body: withCtx(({ data }) => [
                        createVNode("div", null, [
                          createVNode("p", { class: "font-medium text-surface-900" }, toDisplayString(data.name), 1),
                          createVNode("p", { class: "text-xs text-surface-500 mt-0.5" }, toDisplayString(data.description), 1)
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(script$2), {
                      field: "permissions",
                      header: "Permissions"
                    }, {
                      body: withCtx(({ data }) => [
                        createVNode("div", { class: "flex flex-wrap gap-1" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(data.permissions.slice(0, 3), (perm) => {
                            return openBlock(), createBlock(unref(script$3), {
                              key: perm.id,
                              value: perm.name,
                              severity: "info",
                              class: "text-xs"
                            }, null, 8, ["value"]);
                          }), 128)),
                          data.permissions.length > 3 ? (openBlock(), createBlock(unref(script$3), {
                            key: 0,
                            value: `+${data.permissions.length - 3} more`,
                            severity: "secondary",
                            class: "text-xs"
                          }, null, 8, ["value"])) : createCommentVNode("", true)
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(unref(script$2), {
                      field: "userCount",
                      header: "Users",
                      sortable: ""
                    }, {
                      body: withCtx(({ data }) => [
                        createVNode("span", { class: "text-sm text-surface-600" }, toDisplayString(data.userCount), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(unref(script$2), {
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
                            onClick: ($event) => editRole(data),
                            "aria-label": "Edit role"
                          }, null, 8, ["onClick"]),
                          unref(can)("ROLE_PERMISSIONS") ? (openBlock(), createBlock(unref(script), {
                            key: 0,
                            icon: "pi pi-key",
                            severity: "info",
                            text: "",
                            rounded: "",
                            size: "small",
                            onClick: ($event) => managePermissions(data),
                            "aria-label": "Manage permissions"
                          }, null, 8, ["onClick"])) : createCommentVNode("", true),
                          unref(can)("ROLE_DELETE") ? (openBlock(), createBlock(unref(script), {
                            key: 1,
                            icon: "pi pi-trash",
                            severity: "danger",
                            text: "",
                            rounded: "",
                            size: "small",
                            onClick: ($event) => deleteRole(data),
                            "aria-label": "Delete role"
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
            _push2(ssrRenderComponent(unref(script$4), {
              visible: unref(showCreateDialog),
              "onUpdate:visible": ($event) => isRef(showCreateDialog) ? showCreateDialog.value = $event : null,
              header: "Add Role",
              modal: "",
              style: { width: "400px" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_RoleForm, {
                    onSubmit: handleCreate,
                    onCancel: ($event) => showCreateDialog.value = false
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_RoleForm, {
                      onSubmit: handleCreate,
                      onCancel: ($event) => showCreateDialog.value = false
                    }, null, 8, ["onCancel"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$4), {
              visible: unref(showEditDialog),
              "onUpdate:visible": ($event) => isRef(showEditDialog) ? showEditDialog.value = $event : null,
              header: "Edit Role",
              modal: "",
              style: { width: "400px" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (unref(selectedRole)) {
                    _push3(ssrRenderComponent(_component_RoleForm, {
                      role: unref(selectedRole),
                      onSubmit: handleUpdate,
                      onCancel: ($event) => showEditDialog.value = false
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    unref(selectedRole) ? (openBlock(), createBlock(_component_RoleForm, {
                      key: 0,
                      role: unref(selectedRole),
                      onSubmit: handleUpdate,
                      onCancel: ($event) => showEditDialog.value = false
                    }, null, 8, ["role", "onCancel"])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$4), {
              visible: unref(showPermissionDialog),
              "onUpdate:visible": ($event) => isRef(showPermissionDialog) ? showPermissionDialog.value = $event : null,
              header: "Manage Permissions",
              modal: "",
              style: { width: "600px" }
            }, {
              footer: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(script), {
                    label: "Cancel",
                    severity: "secondary",
                    text: "",
                    onClick: ($event) => showPermissionDialog.value = false
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(script), {
                    label: "Save",
                    onClick: savePermissions,
                    loading: unref(isSubmitting)
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(script), {
                      label: "Cancel",
                      severity: "secondary",
                      text: "",
                      onClick: ($event) => showPermissionDialog.value = false
                    }, null, 8, ["onClick"]),
                    createVNode(unref(script), {
                      label: "Save",
                      onClick: savePermissions,
                      loading: unref(isSubmitting)
                    }, null, 8, ["loading"])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (unref(selectedRole)) {
                    _push3(`<div class="space-y-4"${_scopeId2}><p class="text-sm text-surface-600"${_scopeId2}> Managing permissions for <strong${_scopeId2}>${ssrInterpolate(unref(selectedRole).name)}</strong></p><!--[-->`);
                    ssrRenderList(unref(groupedPermissions), (perms, category) => {
                      _push3(`<div class="space-y-2"${_scopeId2}><h4 class="text-sm font-semibold text-surface-700"${_scopeId2}>${ssrInterpolate(category)}</h4><div class="flex flex-wrap gap-2"${_scopeId2}><!--[-->`);
                      ssrRenderList(perms, (perm) => {
                        _push3(`<div class="flex items-center gap-2"${_scopeId2}>`);
                        _push3(ssrRenderComponent(unref(script$5), {
                          inputId: perm.id,
                          modelValue: unref(selectedPermissionIds).includes(perm.id),
                          "onUpdate:modelValue": ($event) => togglePermission(perm.id)
                        }, null, _parent3, _scopeId2));
                        _push3(`<label${ssrRenderAttr("for", perm.id)} class="text-sm text-surface-600"${_scopeId2}>${ssrInterpolate(perm.name)}</label></div>`);
                      });
                      _push3(`<!--]--></div></div>`);
                    });
                    _push3(`<!--]--></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    unref(selectedRole) ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "space-y-4"
                    }, [
                      createVNode("p", { class: "text-sm text-surface-600" }, [
                        createTextVNode(" Managing permissions for "),
                        createVNode("strong", null, toDisplayString(unref(selectedRole).name), 1)
                      ]),
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(groupedPermissions), (perms, category) => {
                        return openBlock(), createBlock("div", {
                          key: category,
                          class: "space-y-2"
                        }, [
                          createVNode("h4", { class: "text-sm font-semibold text-surface-700" }, toDisplayString(category), 1),
                          createVNode("div", { class: "flex flex-wrap gap-2" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(perms, (perm) => {
                              return openBlock(), createBlock("div", {
                                key: perm.id,
                                class: "flex items-center gap-2"
                              }, [
                                createVNode(unref(script$5), {
                                  inputId: perm.id,
                                  modelValue: unref(selectedPermissionIds).includes(perm.id),
                                  "onUpdate:modelValue": ($event) => togglePermission(perm.id)
                                }, null, 8, ["inputId", "modelValue", "onUpdate:modelValue"]),
                                createVNode("label", {
                                  for: perm.id,
                                  class: "text-sm text-surface-600"
                                }, toDisplayString(perm.name), 9, ["for"])
                              ]);
                            }), 128))
                          ])
                        ]);
                      }), 128))
                    ])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$6), null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(script$7), null, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "page-container" }, [
                createVNode("div", { class: "flex items-center justify-between mb-6" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "page-title" }, "Role Management"),
                    createVNode("p", { class: "page-subtitle" }, "Manage roles and permissions")
                  ]),
                  createVNode(unref(script), {
                    label: "Add Role",
                    icon: "pi pi-plus",
                    onClick: ($event) => showCreateDialog.value = true
                  }, null, 8, ["onClick"])
                ]),
                createVNode("div", { class: "table-container" }, [
                  createVNode(unref(script$1), {
                    value: unref(roles),
                    loading: unref(isLoading),
                    stripedRows: "",
                    responsiveLayout: "scroll"
                  }, {
                    empty: withCtx(() => [
                      createVNode("div", { class: "text-center py-8" }, [
                        createVNode("p", { class: "text-surface-500" }, "No roles found")
                      ])
                    ]),
                    default: withCtx(() => [
                      createVNode(unref(script$2), {
                        field: "name",
                        header: "Role",
                        sortable: ""
                      }, {
                        body: withCtx(({ data }) => [
                          createVNode("div", null, [
                            createVNode("p", { class: "font-medium text-surface-900" }, toDisplayString(data.name), 1),
                            createVNode("p", { class: "text-xs text-surface-500 mt-0.5" }, toDisplayString(data.description), 1)
                          ])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(script$2), {
                        field: "permissions",
                        header: "Permissions"
                      }, {
                        body: withCtx(({ data }) => [
                          createVNode("div", { class: "flex flex-wrap gap-1" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(data.permissions.slice(0, 3), (perm) => {
                              return openBlock(), createBlock(unref(script$3), {
                                key: perm.id,
                                value: perm.name,
                                severity: "info",
                                class: "text-xs"
                              }, null, 8, ["value"]);
                            }), 128)),
                            data.permissions.length > 3 ? (openBlock(), createBlock(unref(script$3), {
                              key: 0,
                              value: `+${data.permissions.length - 3} more`,
                              severity: "secondary",
                              class: "text-xs"
                            }, null, 8, ["value"])) : createCommentVNode("", true)
                          ])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(script$2), {
                        field: "userCount",
                        header: "Users",
                        sortable: ""
                      }, {
                        body: withCtx(({ data }) => [
                          createVNode("span", { class: "text-sm text-surface-600" }, toDisplayString(data.userCount), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(script$2), {
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
                              onClick: ($event) => editRole(data),
                              "aria-label": "Edit role"
                            }, null, 8, ["onClick"]),
                            unref(can)("ROLE_PERMISSIONS") ? (openBlock(), createBlock(unref(script), {
                              key: 0,
                              icon: "pi pi-key",
                              severity: "info",
                              text: "",
                              rounded: "",
                              size: "small",
                              onClick: ($event) => managePermissions(data),
                              "aria-label": "Manage permissions"
                            }, null, 8, ["onClick"])) : createCommentVNode("", true),
                            unref(can)("ROLE_DELETE") ? (openBlock(), createBlock(unref(script), {
                              key: 1,
                              icon: "pi pi-trash",
                              severity: "danger",
                              text: "",
                              rounded: "",
                              size: "small",
                              onClick: ($event) => deleteRole(data),
                              "aria-label": "Delete role"
                            }, null, 8, ["onClick"])) : createCommentVNode("", true)
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["value", "loading"])
                ]),
                createVNode(unref(script$4), {
                  visible: unref(showCreateDialog),
                  "onUpdate:visible": ($event) => isRef(showCreateDialog) ? showCreateDialog.value = $event : null,
                  header: "Add Role",
                  modal: "",
                  style: { width: "400px" }
                }, {
                  default: withCtx(() => [
                    createVNode(_component_RoleForm, {
                      onSubmit: handleCreate,
                      onCancel: ($event) => showCreateDialog.value = false
                    }, null, 8, ["onCancel"])
                  ]),
                  _: 1
                }, 8, ["visible", "onUpdate:visible"]),
                createVNode(unref(script$4), {
                  visible: unref(showEditDialog),
                  "onUpdate:visible": ($event) => isRef(showEditDialog) ? showEditDialog.value = $event : null,
                  header: "Edit Role",
                  modal: "",
                  style: { width: "400px" }
                }, {
                  default: withCtx(() => [
                    unref(selectedRole) ? (openBlock(), createBlock(_component_RoleForm, {
                      key: 0,
                      role: unref(selectedRole),
                      onSubmit: handleUpdate,
                      onCancel: ($event) => showEditDialog.value = false
                    }, null, 8, ["role", "onCancel"])) : createCommentVNode("", true)
                  ]),
                  _: 1
                }, 8, ["visible", "onUpdate:visible"]),
                createVNode(unref(script$4), {
                  visible: unref(showPermissionDialog),
                  "onUpdate:visible": ($event) => isRef(showPermissionDialog) ? showPermissionDialog.value = $event : null,
                  header: "Manage Permissions",
                  modal: "",
                  style: { width: "600px" }
                }, {
                  footer: withCtx(() => [
                    createVNode(unref(script), {
                      label: "Cancel",
                      severity: "secondary",
                      text: "",
                      onClick: ($event) => showPermissionDialog.value = false
                    }, null, 8, ["onClick"]),
                    createVNode(unref(script), {
                      label: "Save",
                      onClick: savePermissions,
                      loading: unref(isSubmitting)
                    }, null, 8, ["loading"])
                  ]),
                  default: withCtx(() => [
                    unref(selectedRole) ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "space-y-4"
                    }, [
                      createVNode("p", { class: "text-sm text-surface-600" }, [
                        createTextVNode(" Managing permissions for "),
                        createVNode("strong", null, toDisplayString(unref(selectedRole).name), 1)
                      ]),
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(groupedPermissions), (perms, category) => {
                        return openBlock(), createBlock("div", {
                          key: category,
                          class: "space-y-2"
                        }, [
                          createVNode("h4", { class: "text-sm font-semibold text-surface-700" }, toDisplayString(category), 1),
                          createVNode("div", { class: "flex flex-wrap gap-2" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(perms, (perm) => {
                              return openBlock(), createBlock("div", {
                                key: perm.id,
                                class: "flex items-center gap-2"
                              }, [
                                createVNode(unref(script$5), {
                                  inputId: perm.id,
                                  modelValue: unref(selectedPermissionIds).includes(perm.id),
                                  "onUpdate:modelValue": ($event) => togglePermission(perm.id)
                                }, null, 8, ["inputId", "modelValue", "onUpdate:modelValue"]),
                                createVNode("label", {
                                  for: perm.id,
                                  class: "text-sm text-surface-600"
                                }, toDisplayString(perm.name), 9, ["for"])
                              ]);
                            }), 128))
                          ])
                        ]);
                      }), 128))
                    ])) : createCommentVNode("", true)
                  ]),
                  _: 1
                }, 8, ["visible", "onUpdate:visible"]),
                createVNode(unref(script$6)),
                createVNode(unref(script$7))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/management/roles/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-DlM5KIuU.js.map
