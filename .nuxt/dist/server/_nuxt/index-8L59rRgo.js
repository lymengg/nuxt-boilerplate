import { uuid } from "@primeuix/utils";
import { s as script$2 } from "./index-BDpKneMc.js";
import { style } from "@primeuix/styles/radiobuttongroup";
import { B as BaseStyle } from "../server.mjs";
import { openBlock, createElementBlock, mergeProps, renderSlot } from "vue";
import "./index-DI7ROuCk.js";
import "@primeuix/styled";
import "@primeuix/utils/dom";
import "@primeuix/utils/object";
import "/home/runner/work/nuxt-boilerplate/nuxt-boilerplate/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/home/runner/work/nuxt-boilerplate/nuxt-boilerplate/node_modules/hookable/dist/index.mjs";
import "/home/runner/work/nuxt-boilerplate/nuxt-boilerplate/node_modules/unctx/dist/index.mjs";
import "/home/runner/work/nuxt-boilerplate/nuxt-boilerplate/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/home/runner/work/nuxt-boilerplate/nuxt-boilerplate/node_modules/defu/dist/defu.mjs";
import "/home/runner/work/nuxt-boilerplate/nuxt-boilerplate/node_modules/ufo/dist/index.mjs";
import "@primeuix/utils/eventbus";
import "@primeuix/styles/base";
import "vue/server-renderer";
var classes = {
  root: "p-radiobutton-group p-component"
};
var RadioButtonGroupStyle = BaseStyle.extend({
  name: "radiobuttongroup",
  style,
  classes
});
var script$1 = {
  name: "BaseRadioButtonGroup",
  "extends": script$2,
  style: RadioButtonGroupStyle,
  provide: function provide() {
    return {
      $pcRadioButtonGroup: this,
      $parentInstance: this
    };
  }
};
var script = {
  name: "RadioButtonGroup",
  "extends": script$1,
  inheritAttrs: false,
  data: function data() {
    return {
      groupName: this.name
    };
  },
  watch: {
    name: function name(newValue) {
      this.groupName = newValue || uuid("radiobutton-group-");
    }
  },
  mounted: function mounted() {
    this.groupName = this.groupName || uuid("radiobutton-group-");
  }
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", mergeProps({
    "class": _ctx.cx("root")
  }, _ctx.ptmi("root")), [renderSlot(_ctx.$slots, "default")], 16);
}
script.render = render;
export {
  script as default
};
//# sourceMappingURL=index-8L59rRgo.js.map
