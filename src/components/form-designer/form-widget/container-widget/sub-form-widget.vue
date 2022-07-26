<template>
  <container-wrapper
    :designer="designer"
    :widget="widget"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
  >
    <div
      :key="widget.id"
      class="sub-form-container"
      :class="[selected ? 'selected' : '', customClass]"
      v-show="!widget.options.hidden"
      @click.stop="selectWidget(widget)"
    >
      <el-form label-position="top" :validate-on-rule-change="false">
        <!-- onAdd Element is dropped into the list from another list -->
        <div class="sub-form-table">
          <draggable
            :list="widget.widgetList"
            item-key="id"
            v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 200 }"
            handle=".drag-handler"
            tag="transition-group"
            :component-data="{ name: 'fade' }"
            @update="onContainerDragUpdate"
            :move="checkContainerMove"
            @add="(evt) => onContainerDragAdd(evt, widget.widgetList)"
          >
            <template #item="{ element: subWidget, index: swIdx }">
              <div
                class="sub-form-table-column hide-label"
                :style="{ width: subWidget.options.columnWidth }"
              >
                <template v-if="'container' !== subWidget.category">
                  <component
                    :is="subWidget.type + '-widget'"
                    :field="subWidget"
                    :designer="designer"
                    :key="subWidget.id"
                    :parent-list="widget.widgetList"
                    :index-of-parent-list="swIdx"
                    :parent-widget="widget"
                    :design-state="true"
                  ></component>
                </template>
              </div>
            </template>
          </draggable>
        </div>
      </el-form>
    </div>
  </container-wrapper>
</template>

<script>
import i18n from "@/utils/i18n";
import GridColWidget from "@/components/form-designer/form-widget/container-widget/grid-col-widget";
import containerMixin from "@/components/form-designer/form-widget/container-widget/containerMixin";
import ContainerWrapper from "@/components/form-designer/form-widget/container-widget/container-wrapper";
import refMixinDesign from "@/components/form-designer/refMixinDesign";

export default {
  name: "sub-form-widget",
  componentName: "ContainerWidget",
  mixins: [i18n, containerMixin, refMixinDesign],
  inject: ["refList"],
  components: {
    ContainerWrapper,
    GridColWidget,
  },
  props: {
    widget: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,
  },
  computed: {
    selected() {
      return this.widget.id === this.designer.selectedId;
    },

    customClass() {
      return this.widget.options.customClass || "";
    },
  },
  watch: {
    //
  },
  created() {
    this.initRefList();
  },
  mounted() {
    console.log("parentWidget", this.parentWidget);
    //
  },
  methods: {
    getWidgetName(widget) {
      return widget.type + "-widget";
    },
    // 容器移动
    checkContainerMove(evt) {
      return this.designer.checkWidgetMove(evt);
    },
  },
};
</script>

<style lang="scss" scoped>
.sub-form-container {
  margin-bottom: 8px;
  text-align: left; //IE浏览器强制居左对齐
  padding: 8px;
  border: 1px dashed #336699;

  :deep(.el-row.header-row) {
    padding-bottom: 0;
  }

  :deep(.el-row.sub-form-row) {
    padding-top: 3px;
    padding-bottom: 3px;

    .row-number-span {
      margin-left: 16px;
    }
  }
  .sub-form-table {
    min-height: 68px;
  }
}
div.sub-form-table-column {
  display: inline-block;
  // width: 200px;

  :deep(.el-form-item) {
    margin-left: 4px;
    margin-right: 4px;
    margin-bottom: 0;
  }

  :deep(.el-form-item__content) {
    margin-left: 0 !important;
  }
}

div.sub-form-table-column.hide-label {
  :deep(.el-form-item__label) {
    display: none;
  }
}

.sub-form-container.selected {
  outline: 2px solid $--color-primary !important;
}
</style>
