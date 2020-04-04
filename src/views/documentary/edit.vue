<template>
  <documentary-detail :is-edit="true" />
</template>

<script>
import DocumentaryDetail from './components/DocumentaryDetail'

export default {
  name: 'EditForm',
  components: { DocumentaryDetail }
}
</script>

