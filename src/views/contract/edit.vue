<template>
  <contract-detail :is-edit="true" />
</template>

<script>
import ContractDetail from './components/ContractDetail'

export default {
  name: 'EditForm',
  components: { ContractDetail }
}
</script>

