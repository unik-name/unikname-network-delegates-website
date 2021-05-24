<template>
<div>
    <div class="top">
        <div v-if="delegate.title">
            <img height="100" width="100" alt="logo" :src="require(`@assets/${delegate.title}/logo.png`)"/>
            <h2>{{ delegate.title }}</h2>
        </div>
        
        <div v-if="delegate.username">
            <a target="_blank" :href="`https://explorer.uns.network/uniks/${delegate.username}`">check on explorer</a>
        </div>
        <div class="socials">
            <p v-if="delegate.twitter"><a target="_blank" :href="delegate.twitter"><i class="fa fa-twitter" />twitter</a></p>
            <p v-if="delegate.github"><a target="_blank" :href="delegate.github"><i class="fa fa-github" />github</a></p>
            <p v-if="delegate.email"><a target="_blank" :href="`mailto:${delegate.email}`"><i class="fa fa-envelope" />email</a></p>
            <p v-if="delegate.website"><a target="_blank" :href="delegate.website"><i class="fa fa-globe" />website</a></p>
        </div>
    </div>
    <div class="details">
        <p>live: {{ delegate.isLive }}</p>
        <p>type: {{ delegate.type }}</p>
        <p>rank: {{ delegate.rank }}</p>
        <p>votes: {{ (delegate.votes/10**8).toFixed(0) }} ({{ delegate.votes_percent}}%)</p>
    </div>
<script src="https://kit.fontawesome.com/ab9d8096cd.js" crossorigin="anonymous" />     
</div>
</template>

<script>
export default {
    async beforeMount() {
        const res = await fetch("https://api.uns.network/api/v2/delegates?limit=23").then(res => res.json())
        const stat = res.data.find(el => el.username === this.$page.frontmatter.username)
        console.log(stat)
        this.$page.frontmatter.rank = stat.rank 
        this.$page.frontmatter.votes = stat.votes
        this.$page.frontmatter.votes_percent = stat.production.approval
        this.$page.frontmatter.type = stat.type
        this.$page.frontmatter.isResigned = stat.isResigned
        this.$page.frontmatter.isLive = (Date.now() - stat.blocks.last.timestamp.unix*1000) / 1000 < 600 ? true : no
        this.$data.delegate = this.$page.frontmatter        
    },
    data() {
        return {
            delegate: {},
        }
    },
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
        border-bottom: 0
    .socials
        padding-top: 10px
        i
            padding-right: 6px
        p
            padding: 5px;
            display: inline


.details
    p
        margin: 1px
</style>