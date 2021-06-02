<template>
  <main class="page">
    <slot name="top" />

    <DelegateDetail class="theme-default-content"/>

    <Content class="theme-default-content" />
   
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
.theme-default-content:not(.custom)>:first-child
  margin-top: 3.5rem
.page
  padding-bottom 2rem
  display block

.pagefooter
  padding 2rem 0rem 0rem 2rem
</style>