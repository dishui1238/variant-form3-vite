## vueDraggable 库

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
