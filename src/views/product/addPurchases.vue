<template>
  <purchases-detail :is-edit="false" />
</template>

<script>
import PurchasesDetail from './components/PurchasesDetail'

export default {
  name: 'AddPurchases',
  components: { PurchasesDetail }
}
</script>

