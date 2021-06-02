<template>
<div>
    <div v-if="delegate.unikname" class="top" :class="delegate.format">
        <div v-if="delegate.notCompleted">
            <p>
                <a target="_blank" href="https://github.com/unik-name/uns-delegates-website/blob/master/README.md">
                👉 Claim this delegate profile</a>
            </p>
            <img class="logo" height="100" width="100" alt="logo" :src="require(`@assets/default-logo.png`)">
        </div>
        <div v-else>
            <img height="100" class="logo" width="100" alt="logo" :src="require(`@delegates/${delegate.unikid}/logo.png`)">
        </div>

        <h2 v-if="delegate.unikname">@{{ delegate.unikname }}</h2>
        <span v-if="delegate.type" :class="`unik-badge unik-badge-${delegate.type}`">
            <img :src="require(`@assets/logo-${delegate.type}.png`)" alt="" class="unik-view-logo" />
            {{delegate.type}}
        </span>
        
        <div class="socials">
            <a target="_blank" :href="`https://explorer.uns.network/uniks/${delegate.unikid}`"><i class="fa fa-globe" />explorer</a>
            <p v-if="delegate.twitter"><a target="_blank" :href="`https://twitter.com/${delegate.twitter}`"><i class="fa fa-twitter" />twitter</a></p>
            <p v-if="delegate.github"><a target="_blank" :href="`https://github.com/${delegate.github}`"><i class="fa fa-github" />github</a></p>
            <p v-if="delegate.email"><a target="_blank" :href="`mailto:${delegate.email}`"><i class="fa fa-envelope" />email</a></p>
            <p v-if="delegate.website"><a target="_blank" :href="delegate.website"><i class="fa fa-globe" />website</a></p>
            <p v-if="delegate.forum"><a target="_blank" :href="`https://forum.unikname.com/u/${delegate.forum}/summary`"><i class="fa fa-globe" />forum</a></p>
        </div>
    </div>
    <div v-if="!loading" class="details">
        <p>rank: {{ delegate.rank }}</p>
        <p>votes: {{ delegate.votes_percent}}%</p>
        <span v-if="delegate.forger">elected: 
            <img :src="require(`@assets/check.svg`)" height="15px" width="15px" alt="status"/>
            <p>status:<span :class="`status-${delegate.isLive}`">{{delegate.isLive}}</span></p>
        </span>
        <span v-else>elected: 
            <img :src="require(`@assets/cross.svg`)" height="15px" width="15px" alt="status"/>
        </span>                        
    </div>
    <div v-else class="placeholder shimmer">
        <div class="fake-text short"/>
        <div class="fake-text medium"/>
        <div class="fake-text medium"/>
        <div class="fake-text"/>
    </div>
<script src="https://kit.fontawesome.com/ab9d8096cd.js" crossorigin="anonymous" />     
</div>
</template>

<script>
export default {
    created() {
        this.$data.delegate = this.$page.frontmatter

    },
    async mounted() {
        const delegatesAPI = await fetch("https://api.uns.network/api/v2/delegates").then(res => res.json())
        const stat = delegatesAPI.data.find(el => el.username === this.$page.frontmatter.unikid)
        this.delegate.rank = stat.rank
        this.delegate.votes = stat.votes
        this.delegate.votes_percent = stat.production.approval
        this.delegate.forger = stat.rank < 24 ? true : false
        if (this.delegate.forger) {
            this.delegate.isLive = (Date.now() - stat.blocks.last.timestamp.unix*1000)/1000 < 600 ? 'active' : 'not active'
        }    
        this.loading = false
    },
    data() {
        return {
            delegate: {},
            loading: true
        }
    },
}
</script>

<style lang="stylus" scoped>
.embedded
    margin-top: 0!important
.top
    overflow: hidden;
    .logo
        margin-right: 15px;
        float: left;
    .not-claimed
        color: red
        margin: 0
        a
            text-decoration: underline
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
    .status-active
        margin-left: 5px
        color: green
    .status-not-active
        margin-left: 5px
        color: red
.unik-badge
  width: 110px
  padding: 0.25em 1em
  border-radius: 20px
  color: #fff
  display: flex
  flex-direction: row
  margin-right: 0.5em
.unik-badge img
  margin-right: 0.5em
  width: 1.2em
  height: 1.2em
.unik-badge.unik-badge-individual
  background-color: #c6c6ff
.unik-badge.unik-badge-organization
  background-color: #6263b1
.unik-badge.unik-badge-network
  background-color: #16c8c0
/* https://codesandbox.io/s/skeleton-placeholder-forked-9i8f7?file=/index.html:1365-1392 */ 
.placeholder
        padding: 20px
        max-width: 150px
    .fake-text
        background: #dddddd
        border-radius: 4px
        height: 20px
        margin-bottom: 5px
    .fake-text.short
        width: 25%
    .fake-text.medium
        width: 60%
    .shimmer
        overflow: hidden
        position: relative
    .shimmer::before
        content: ""
        position: absolute
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.4) 50%,
          rgba(255, 255, 255, 0) 100%
        )
        height: 100%
        width: 100%
        z-index: 1
        animation: shimmer 1s infinite
    @keyframes shimmer
        0%
            transform: translateX(-100%)
        100%
            transform: translateX(100%)
</style>