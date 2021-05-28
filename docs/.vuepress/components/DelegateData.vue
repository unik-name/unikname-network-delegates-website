<template>
<div>

    <span v-if="loading">
        loading...
    </span>

    <span class="card-container">
            <div v-for="delegate in delegates">
                <a :href="`/delegates/${delegate.unikid}`">
                    <div class="card">
                        <div class="card-header">
                            <div v-if="delegate.notCompleted">
                                <p class="not-claimed">card not claimed</p>
                                <img height="100" width="100" alt="logo" :src="require(`@assets/default-logo.png`)">
                            </div>
                            <div v-else>
                                <img height="100" width="100" alt="logo" :src="require(`@delegates/${delegate.unikid}/logo.png`)">
                            </div>
                        </div>
                        <div class="text-content">
                            <div class="unikid">
                                <h3 style="color: black"> @{{ delegate.unikname }} </h3>
                                <span v-if="delegate.type" :class="`unik-badge unik-badge-${delegate.type}`">
                                        <img :src="require(`@assets/logo-${delegate.type}.png`)" alt="" class="unik-view-logo" />
                                        {{ delegate.type }}
                                </span>
                            </div>
                            <div class="socials">
                                <p v-if="delegate.twitter"><a target="_blank" :href="`https://twitter.com/${delegate.twitter}`"><i class="fa fa-twitter" />twitter</a></p>
                                <p v-if="delegate.github"><a target="_blank" :href="`https://github.com/${delegate.github}`"><i class="fa fa-github" />github</a></p>
                                <p v-if="delegate.email"><a target="_blank" :href="`mailto:${delegate.email}`"><i class="fa fa-envelope" />email</a></p>
                                <p v-if="delegate.website"><a target="_blank" :href="delegate.website"><i class="fa fa-globe" />website</a></p>
                                <p v-if="delegate.forum"><a target="_blank" :href="`https://forum.unikname.com/u/${delegate.forum}/summary`"><i class="fa fa-globe" />forum</a></p>
                            </div>
                            <div class="description">
                                <p class="resigned" v-if="delegate.isResigned">delegate resigned</p>
                                <p>rank: {{delegate.rank}} / votes: {{delegate.votes}}%</p>
                                <span v-if="delegate.forger">elected: 
                                    <img :src="require(`@assets/check.svg`)" height="15px" width="15px" alt="status"/>
                                    <p>status:<span :class="`status-${delegate.isLive}`">{{delegate.isLive}}</span></p>
                                </span>
                                <span v-else>elected: 
                                    <img :src="require(`@assets/cross.svg`)" height="15px" width="15px" alt="status"/>
                                </span>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
    </span>
    
    <script src="https://kit.fontawesome.com/ab9d8096cd.js" crossorigin="anonymous" />
</div>
</template>

<script>
export default {
    async beforeMount() {
        const delegatesAPI = await fetch("https://api.uns.network/api/v2/delegates").then(res => res.json())
        let delegates = this.$site.headTags.find(el => el[0] === 'delegateData')[1]
        
        delegates.forEach(delegate => {
            const delegateStat = delegatesAPI.data.find(el => el.username === delegate.unikid)
            delegate.unikname = delegate.unikname
            delegate.rank = delegateStat.rank
            delegate.votes = delegateStat.production.approval
            delegate.isResigned = delegateStat.isResigned
            delegate.type = delegateStat.type
            delegate.forger = delegateStat.rank < 24 ? true : false
            if (delegate.forger) {
                delegate.isLive = (Date.now() - delegateStat.blocks.last.timestamp.unix*1000)/1000 < 600 ? 'active' : 'not active'
            }
            delegate.notCompleted = delegate.notCompleted ? true : false
        })
        delegates = delegates.sort((a, b) => b.forger - a.forger || a.unikname.localeCompare(b.unikname))
        delegates = delegates.sort((a, b) => a.notCompleted - b.notCompleted)
        this.$data.delegates = delegates.filter(delegate => delegate.type === 'individual')
        this.$data.loading = false
    },
    data() {
        return {
            delegates: [],
            loading: true
        }
    },
}
</script>

<style lang="stylus" scoped>
.card-container
  display flex
  flex-wrap wrap
  -webkit-box-orient horizontal
  -webkit-box-direction normal
  -ms-flex-direction row
  flex-direction row
  justify-content center
  margin 40px -20px 20px 0
.card
  height 21em
  width 17em
  min-width 17em
  display -webkit-box
  display -ms-flexbox
  display flex
  -webkit-box-orient vertical
  -webkit-box-direction normal
  -ms-flex-direction column
  flex-direction column
  position relative
  -webkit-transition all 0.4s cubic-bezier(0.645, 0.045, 0.355, 1)
  -o-transition all 0.4s cubic-bezier(0.645, 0.045, 0.355, 1)
  transition all 0.4s cubic-bezier(0.645, 0.045, 0.355, 1)
  border-radius 16px
  overflow hidden
  text-align center
  margin 0px 10px 10px 0px
  background-color #EFF6F6    
  .card-header
    .not-claimed
        color: red
        margin: 0
    img
        padding-top: 10px;
    p
        color: black
        text-decoration: none
  .text-content
    .unikid
        h3
            margin-top: 7px
            margin-bottom: 5px
        margin-bottom: 15px
    padding-left: 10px
    padding-right 10px
    font-size 0.9rem
    .resigned
        color: red
    .description
        color #000
        font-weight 400
        margin-top 10px
        .status-active
            margin-left: 5px
            color: green
        .status-not-active
            margin-left: 5px
            color: red
        p
            margin: 1px
            font-size: 1rem
    .socials
        i
            padding-right: 6px
        p
            padding: 5px;
            display: inline
.unik-badge
  padding: 0.4em 1em
  border-radius: 20px
  color: #fff
  align-items: center
.unik-badge img
  margin-right: 0.5em
  margin-right: 0.5em
  width: 1.2em
  height: 1.2em
.unik-badge.unik-badge-individual
  background-color: #c6c6ff
.unik-badge.unik-badge-organization
  background-color: #6263b1
.unik-badge.unik-badge-network
  background-color: #16c8c0
</style>