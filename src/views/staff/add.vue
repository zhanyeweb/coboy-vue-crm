<template>
  <staff-detail :is-edit="false" />
</template>

<script>
import StaffDetail from './components/StaffDetail'

export default {
  name: 'AddCustomer',
  components: { StaffDetail }
}
</script>

