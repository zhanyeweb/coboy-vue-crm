<template>
  <purchases-detail :is-edit="true" />
</template>

<script>
import PurchasesDetail from './components/PurchasesDetail'

export default {
  name: 'EditForm',
  components: { PurchasesDetail }
}
</script>

