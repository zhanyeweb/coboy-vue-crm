<template>
  <staff-detail :is-edit="true" />
</template>

<script>
import StaffDetail from './components/StaffDetail'

export default {
  name: 'EditForm',
  components: { StaffDetail }
}
</script>

