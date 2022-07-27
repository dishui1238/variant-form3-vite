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
      @click.stop="selectWidget(widget)"
    >
      <el-form label-position="top" :validate-on-rule-change="false">
        <div class="sub-form-table">
          <draggable
            :list="widget.widgetList"
            item-key="id"
            v-bind="{
              group: 'dragGroup',
              ghostClass: 'vertical-ghost',
              animation: 200,
            }"
            tag="transition-group"
            :component-data="{ name: 'fade' }"
            handle=".drag-handler"
            @add="(evt) => onFormItemDragAdd(evt, widget.widgetList)"
            @update="onFormItemDragUpdate"
            :move="checkContainerMove"
          >
            <template #item="{ element: subWidget, index: swIdx }">
              <div class="form-widget-list">
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
import containerMixin from "@/components/form-designer/form-widget/container-widget/containerMixin";
import ContainerWrapper from "@/components/form-designer/form-widget/container-widget/container-wrapper";
import refMixinDesign from "@/components/form-designer/refMixinDesign";
import FieldComponents from "@/components/form-designer/form-widget/field-widget/index";

export default {
  name: "sub-form-widget",
  componentName: "ContainerWidget",
  mixins: [i18n, containerMixin, refMixinDesign],
  inject: ["refList"],
  components: {
    ContainerWrapper,
    ...FieldComponents,
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
    console.log("this.widget", this.widget);
    this.initRefList();
  },
  mounted() {
    //
  },
  methods: {
    checkContainerMove(evt) {
      return this.designer.checkWidgetMove(evt);
    },

    onFormItemDragAdd(evt, subList) {
      const newIndex = evt.newIndex;
      if (!!subList[newIndex]) {
        this.designer.setSelected(subList[newIndex]);
      }
      this.designer.emitHistoryChange();
    },

    onFormItemDragUpdate() {
      this.designer.emitHistoryChange();
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
    display: flex;
  }
  .form-widget-list {
    // border: 1px dashed #336699;
    min-height: 36px;
    min-width: 100px;
  }
}
.sub-form-container.selected {
  outline: 2px solid $--color-primary !important;
}
</style>
