<template>
  <div class="paternalCell">
    <div class="cell">
      <edit-cell v-if="items.isEdit" :item="items" />
      <item-cell v-else :item="items" />
    </div>
    <template v-if="items.children">
      <div v-show="items.isVisible" class="childrenCell">
        <cell v-for="(item, k) of items.children" :key="k" :items="item" />
      </div>
    </template>
  </div>
</template>
<script>
import EditCell from './EditCell'
import ItemCell from './ItemCell'
export default {
  name: 'Cell',
  components: {
    EditCell,
    ItemCell
  },
  props: {
    items: {
      type: Object,
      default: null
    }
  },
  computed: {
    // children: function() {
    //   console.log('items.children', this.items.children);
    //   return this.items.children;
    // }
  },
  created() {
    console.log('this.items', this.items, 'dept', this.items.dept);
  },
  beforeUpdate() {
    console.log('beforeUpdate');
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
    .cell{
        border-bottom: 1px solid #f7f7f7;
        padding: 23px 20px;
        &:hover{
            background-color: #fbfbfb;
        }
    }
</style>
