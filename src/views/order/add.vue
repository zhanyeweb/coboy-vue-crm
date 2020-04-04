<template>
  <order-detail :is-edit="false" />
</template>

<script>
import OrderDetail from './components/OrderDetail'

export default {
  name: 'AddOrderDetail',
  components: { OrderDetail }
}
</script>

