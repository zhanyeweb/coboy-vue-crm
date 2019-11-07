<template>
  <documentary-detail :is-edit="false" />
</template>

<script>
import DocumentaryDetail from './components/DocumentaryDetail'

export default {
  name: 'AddDocumentary',
  components: { DocumentaryDetail }
}
</script>
