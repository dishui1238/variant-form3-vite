<template>
  <el-form-item>
    <template #label>
      <span
        >依赖项
        <el-tooltip
          effect="light"
          content="输入需要监听的字段 name，可监听多个"
        >
          <svg-icon icon-class="el-info"
        /></el-tooltip>
      </span>
    </template>
    <el-select
      v-model="optionModel.dependency"
      multiple
      filterable
      allow-create
      :reserve-keyword="false"
      default-first-option
      placeholder="按下enter确认"
    >
      <el-option
        v-for="item in []"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </el-form-item>
</template>

<script>
import i18n from "@/utils/i18n";

export default {
  name: "dependency-editor",
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object,
  },
  computed: {},
};
</script>

<style lang="scss" scoped></style>
