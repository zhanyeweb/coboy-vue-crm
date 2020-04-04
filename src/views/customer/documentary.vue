<template>
  <documentary-customer-detail :is-edit="false" />
</template>

<script>
import DocumentaryCustomerDetail from './components/DocumentaryCustomerDetail'

export default {
  name: 'DocumentaryCustomer',
  components: { DocumentaryCustomerDetail }
}
</script>

