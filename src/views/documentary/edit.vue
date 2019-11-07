<template>
  <customer-detail :is-edit="true" />
</template>

<script>
import CustomerDetail from './components/CustomerDetail'

export default {
  name: 'EditForm',
  components: { CustomerDetail }
}
</script>

