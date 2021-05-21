<template>
<div>
    <div class="top">
        <img height="100" width="100" alt="logo" :src="require(`@assets/${data.title}/logo.png`)"/>
        <h2>{{ data.title }}</h2>
        <a target="_blank" :href="`https://explorer.uns.network/uniks/${data.username}`">check on explorer</a>
        <div class="socials">
            <p v-if="data.twitter"><a target="_blank" :href="data.twitter"><i class="fa fa-twitter" />twitter</a></p>
            <p v-if="data.github"><a target="_blank" :href="data.github"><i class="fa fa-github" />github</a></p>
            <p v-if="data.email"><a target="_blank" :href="`mailto:${data.email}`"><i class="fa fa-envelope" />email</a></p>
            <p v-if="data.website"><a target="_blank" :href="data.website"><i class="fa fa-globe" />website</a></p>
        </div>
    </div>
    <div class="data">
        <p>type: individual | organisation</p>
        <p>votes: X</p>
        <p>percent share: X%</p>
    </div>
<script src="https://kit.fontawesome.com/ab9d8096cd.js" crossorigin="anonymous" />     
</div>
</template>

<script>
export default {
    computed: {
        data() {
            return this.$page.frontmatter
        },
    }
}
</script>

<style lang="stylus" scoped>
.top
    padding: 20px;
    overflow: hidden;
    img
        margin-right: 15px;
        float: left;
    h2, p
        margin-left: 15px;
        display: block;
        margin: 2px 0 0 0;
    .socials
        padding-top: 10px
        i
            padding-right: 6px
        p
            padding: 5px;
            display: inline


.data
    p
        margin: 1px
</style>