<template>
  <contract-detail :is-edit="false" />
</template>

<script>
import ContractDetail from './components/ContractDetail'

export default {
  name: 'AddContractDetail',
  components: { ContractDetail }
}
</script>

