import script$2 from "./index-IoILXe0H.js";
import { style } from "@primeuix/styles/overlaybadge";
import { B as BaseStyle } from "../server.mjs";
import { resolveComponent, openBlock, createElementBlock, mergeProps, renderSlot, createVNode } from "vue";
import "@primeuix/utils";
import "./index-DI7ROuCk.js";
import "@primeuix/styled";
import "@primeuix/utils/dom";
import "@primeuix/utils/object";
import "@primeuix/styles/badge";
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
  root: "p-overlaybadge"
};
var OverlayBadgeStyle = BaseStyle.extend({
  name: "overlaybadge",
  style,
  classes
});
var script$1 = {
  name: "OverlayBadge",
  "extends": script$2,
  style: OverlayBadgeStyle,
  provide: function provide() {
    return {
      $pcOverlayBadge: this,
      $parentInstance: this
    };
  }
};
var script = {
  name: "OverlayBadge",
  "extends": script$1,
  inheritAttrs: false,
  components: {
    Badge: script$2
  }
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_Badge = resolveComponent("Badge");
  return openBlock(), createElementBlock("div", mergeProps({
    "class": _ctx.cx("root")
  }, _ctx.ptmi("root")), [renderSlot(_ctx.$slots, "default"), createVNode(_component_Badge, mergeProps(_ctx.$props, {
    pt: _ctx.ptm("pcBadge")
  }), null, 16, ["pt"])], 16);
}
script.render = render;
export {
  script as default
};
//# sourceMappingURL=index-B9MCoCO6.js.map
