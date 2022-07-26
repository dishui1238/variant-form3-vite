## 1. vueDraggable 库

v2 : https://juejin.cn/post/6844904150350692366
v3 : https://juejin.cn/post/6975153687056351263
https://www.itxst.com/vue-draggable/yvq3mifz.html
https://github.com/SortableJS/Vue.Draggable

1. 安装
   `npm install vuedraggable`

2. 引入
   `import draggable from 'vuedraggable'`

3. 基础用法
   定义一个 json 串 list，实现它的拖拽排序。

   ```html
   <draggable v-model="list">
     <transition-group>
       <div v-for="element in list" :key="element.id">{{element.name}}</div>
     </transition-group>
   </draggable>
   ```

4. 属性

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
      <th>类型</th>
      <th>默认值</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td>用于实现拖拽的list，通常和内部v-for循环的数组为同一数组</td>
      <td>Array</td>
      <td>null</td>
    </tr>
    <tr>
      <td>list</td>
      <td>效果同value的。和v-model不能共用</td>
      <td>Array</td>
      <td>null</td>
    </tr>
    <tr>
      <td>tag</td>
      <td>draggable 标签在渲染后展现出来的标签类型</td>
      <td>String</td>
      <td>div</td>
    </tr>
    <tr>
      <td>options</td>
      <td>draggable 列表配置项</td>
      <td>Object</td>
      <td>null</td>
    </tr>
    <tr>
      <td>emptyInsertThreshold</td>
      <td>拖动时，鼠标必须与空的可排序对象之间的距离</td>
      <td>Number</td>
      <td>5</td>
    </tr>
    <tr>
      <td>clone</td>
      <td>
        返回值为true时克隆，可以理解为正常的拖拽变成了复制。当pull:'clone时的拖拽的回调函数’
      </td>
      <td>Function</td>
      <td>无处理</td>
    </tr>
    <tr>
      <td>move</td>
      <td>
        如果不为空，这个函数将以类似于Sortable
        onMove回调的方式调用。返回false将取消拖动操作。
      </td>
      <td>Function</td>
      <td>null</td>
    </tr>
    <tr>
      <td>componentData</td>
      <td>用来结合UI组件的，可以理解为代理了UI组件的定制信息</td>
      <td>Object</td>
      <td>null</td>
    </tr>
  </tbody>
</table>

5. 属性

https://debug.itxst.com/js/nyfmnvub

`:group="{ name: 'dragGroup', pull: 'clone', put: false }"`

pull: 是否准许被拖走
put: 是否准许被拖入

## 2. 配置

### 1. 组件添加

1. widget-panel 组件创建后会触发 loadWidgets，加载 widgetsConfig 文件中的配置，并过滤出符合条件的数据

```js
loadWidgets() {
      this.containers = CONS.map((con) => {
        return {
          key: generateId(),
          ...con,
          displayName: this.i18n2t(
            `designer.widgetLabel.${con.type}`,
            `extension.widgetLabel.${con.type}`
          ),
        };
      }).filter((con) => {
        return !con.internal && !this.isBanned(con.type);
      });

      this.basicFields = BFS.map((fld) => {
        return {
          key: generateId(),
          ...fld,
          displayName: this.i18n2t(
            `designer.widgetLabel.${fld.type}`,
            `extension.widgetLabel.${fld.type}`
          ),
        };
      }).filter((fld) => {
        return !this.isBanned(fld.type);
      });

      this.advancedFields = AFS.map((fld) => {
        return {
          key: generateId(),
          ...fld,
          displayName: this.i18n2t(
            `designer.widgetLabel.${fld.type}`,
            `extension.widgetLabel.${fld.type}`
          ),
        };
      }).filter((fld) => {
        return !this.isBanned(fld.type);
      });

      this.customFields = CFS.map((fld) => {
        return {
          key: generateId(),
          ...fld,
          displayName: this.i18n2t(
            `designer.widgetLabel.${fld.type}`,
            `extension.widgetLabel.${fld.type}`
          ),
        };
      }).filter((fld) => {
        return !this.isBanned(fld.type);
      });
    },
```

2. widget-panel 拖动组件会触发 clone 事件，该事件调用 designer 上的 `copyNewContainerWidget`or`copyNewFieldWidget` 事件，向 designer.widgetList 追加新元素

### 1. 联动

1. onChange 配置

```js
drinkRadio.onChange(value, oldValue, subFormData, rowId) {
  var alcoholChkWidget = this.getWidgetRef('alcoholChk')
  var drinkChkWidget = this.getWidgetRef('drinkChk')

  if (value === 1) {
    alcoholChkWidget.setHidden(false)
    drinkChkWidget.setHidden(true)
  } else {
    alcoholChkWidget.setHidden(true)
    drinkChkWidget.setHidden(false)
  }
}
```

2. 事件绑定逻辑

   1. `setting-panel`(注册组件)：

   - 订阅 `editEventHandler` 事件

   2. `onChange-editor`(展示为 button 组件)

   - 点击触发 editEventHandler 事件，展示模态框
     ```js
     dispatch("SettingPanel", "editEventHandler", [
       "onChange",
       ["value", "oldValue", "subFormData", "rowId"],
     ]);
     ```

- 模态框保存：检查代码错误，将数据同步到 options 配置内

3. 事件触发逻辑（渲染层）

- 可以通过 `getWidgetRef(widgetName)` 获取容器或字段组件
- 组件上绑定 change 事件，触发 fieldMixin 文件中的 `handleChangeEvent` 事件
- `handleChangeEvent` 中会
  - 触发 `field-value-changed`, 即触发 options.onChange 中的自定义事件
  - 父表单的 `fieldChange` 事件、`fieldValidation`单个字段变更的校验事件

### 2. 数据远程加载

在表单 onFormMounted 事件中通过 axios 调用后端接口，动态加载数据
