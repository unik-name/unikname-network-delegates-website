<template>
  <main class="page">
    <slot name="top" />

    <DelegateDetail class="theme-default-content"/>

    <Content class="theme-default-content" />

    <Footer class="pagefooter" />
    
  </main>
</template>

<script>
import PageEdit from '@theme/components/PageEdit.vue'
import PageNav from '@theme/components/PageNav.vue'

export default {
  components: { PageEdit, PageNav },
  props: ['sidebarItems']
}
</script>

<style lang="stylus">
@require '../styles/wrapper.styl'

.page
  padding-bottom 2rem
  display block
</style>