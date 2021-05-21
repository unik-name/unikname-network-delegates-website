<template>
<div>
    <span class="card-container">
            <div v-for="delegate in delegates">
                <a :href="`/delegates/${delegate.title}`">
                    <div class="card">
                        <div class="card-header">
                            <img height="100" width="100" alt="logo" :src="require(`@assets/${delegate.title}/logo.png`)">
                        </div>
                        <div class="text-content">
                            <h3 style="color: black"> {{ delegate.title }} </h3>
                            <div class="socials">
                                <p v-if="delegate.twitter"><a target="_blank" :href="delegate.twitter"><i class="fa fa-twitter" />twitter</a></p>
                                <p v-if="delegate.github"><a target="_blank" :href="delegate.github"><i class="fa fa-github" />github</a></p>
                                <p v-if="delegate.email"><a target="_blank" :href="`mailto:${delegate.email}`"><i class="fa fa-envelope" />email</a></p>
                                <p v-if="delegate.website"><a target="_blank" :href="delegate.website"><i class="fa fa-globe" />website</a></p>
                                <p v-if="delegate.forum"><a target="_blank" :href="delegate.forum"><i class="fa fa-globe" />forum</a></p>
                            </div>
                            <div class="description">
                                <span v-if="delegate.stat">
                                    <p>votes: {{(delegate.stat.votes/10**8).toFixed(2)}}</p>
                                    <p>more details here?</p>
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
        const res = await fetch("https://api.uns.network/api/v2/delegates?limit=23").then(res => res.json())
        const delegates = this.$site.headTags.find(el => el[0] === 'delegateData')[1]
        
        delegates.forEach(delegate => {
            const stat = res.data.find(el => el.username === delegate.username)
            console.log(stat)
            delegate.stat = stat ? stat : null
        })
        this.$data.delegates = delegates.sort((a, b) => a.title.localeCompare(b.title))
        console.log(delegates)
    },
    data() {
        return {
            iscardhover: false,
            delegates: [],
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
  height 19em
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
    img
        padding-top: 10px;
    p
        color: black
        text-decoration: none
  .text-content
    padding-left: 10px
    padding-right 10px
    font-size 0.9rem
    .description
        color #000
        font-weight 400
        margin-top 10px
        p
            margin: 1px
    .socials
        i
            padding-right: 6px
        p
            padding: 5px;
            display: inline
</style>