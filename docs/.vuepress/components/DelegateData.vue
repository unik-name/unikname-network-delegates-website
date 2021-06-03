<template>
  <div class="card-container">
    <div v-for="delegate in delegates">
      <a :href="`/delegates/${delegate.unikid}`" class="card">
        <div class="card-header">
          <img
            v-if="delegate.notCompleted"
            :src="require(`@assets/default-logo.png`)"
          />
          <img
            v-else
            :src="require(`@delegates/${delegate.unikid}/logo.png`)"
          />
        </div>

        <div class="unikid">
          <h3>@{{ delegate.unikname }}</h3>
          <span
            v-if="delegate.type"
            :class="`unik-badge unik-badge-${delegate.type}`"
          >
            <span class="unik-view-logo individualLogo">&nbsp;</span>
            {{ delegate.type }}
          </span>
        </div>

        <div v-if="!delegate.notCompleted" class="socials">
          <a
            v-if="delegate.twitter"
            target="_blank"
            :href="`https://twitter.com/${delegate.twitter}`"
            ><i class="fa fa-twitter" />twitter</a
          >
          <a
            v-if="delegate.email"
            target="_blank"
            :href="`mailto:${delegate.email}`"
            ><i class="fa fa-envelope" />email</a
          >
          <a
            v-if="delegate.forum"
            target="_blank"
            :href="`https://forum.unikname.com/u/${delegate.forum}/summary`"
          >
            <i class="fa fa-globe" />forum</a
          >
          <a
            v-if="delegate.github"
            target="_blank"
            :href="`https://github.com/${delegate.github}`"
            ><i class="fa fa-github" />github</a
          >
          <a v-if="delegate.website" target="_blank" :href="delegate.website"
            ><i class="fa fa-globe" />website</a
          >
        </div>

        <div v-else>
          <a
            target="_blank"
            href="https://github.com/unik-name/uns-delegates-website/blob/master/README.md"
          >
            👉 Claim this delegate profile</a
          >
        </div>

        <div v-if="!loading" class="description">
          <div>rank: {{ delegate.rank }} / votes: {{ delegate.votes }}%</div>
          <span v-if="delegate.forger"
            >elected:
            <img
              :src="require(`@assets/check.svg`)"
              class="elected"
              alt="status"
            />
            <div>
              status:<span :class="`status-${delegate.isLive}`">{{
                delegate.isLive
              }}</span>
            </div>
          </span>
          <span v-else
            >elected:
            <img
              :src="require(`@assets/cross.svg`)"
              class="elected"
              alt="status"
            />
          </span>
        </div>

        <div v-else class="placeholder shimmer">
          <div class="fake-text medium" />
          <div class="fake-text short" />
          <div class="fake-text" />
        </div>
      </a>
    </div>
    <script
      src="https://kit.fontawesome.com/ab9d8096cd.js"
      crossorigin="anonymous"
    />
  </div>
</template>

<script>
export default {
  created() {
    this.$data.delegates = this.$site.headTags.find(
      (el) => el[0] === "delegateData"
    )[1];
  },
  async mounted() {
    const res = await fetch(
      "https://api.uns.network/api/v2/delegates"
    ).then((res) => res.json());
    const delegates = this.delegates;
    this.delegates.forEach((delegate) => {
      const data = res.data.find((el) => el.username === delegate.unikid);
      delegate.rank = data.rank;
      delegate.votes = data.production.approval;
      if (delegate.forger) {
        delegate.isLive =
          (Date.now() - data.blocks.last.timestamp.unix * 1000) / 1000 < 600
            ? "active"
            : "not active";
      }
    });
    this.loading = false;
  },
  data() {
    return {
      delegates: [],
      loading: true,
    };
  },
};
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
.card
    height 18.5em
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
            padding-top: 10px
            height: 100px
            width: 100px
  .unikid
        padding-left: 10px
        padding-right 10px
        font-size 0.9rem
        margin-bottom: 10px
        h3
            color: black
            margin-top: 7px
            margin-bottom: 10px
        .unik-badge
            padding: 0.4em 1em
            border-radius: 20px
            color: #fff
            align-items: center
            .individualLogo
                background: url('~@assets/logo-individual.png')
                background-repeat: no-repeat
                height: 17px
                width: 17px
                background-size: cover
                display: inline-block
        .unik-badge.unik-badge-individual
            background-color: #c6c6ff
        .unik-badge.unik-badge-organization
            background-color: #6263b1
        .unik-badge.unik-badge-network
            background-color: #16c8c0
  .resigned
        color: red
  .description
        color #000
        font-weight 400
        margin-top 10px
        .elected
            height: 15px
            width: 15px
        .status-active
            margin-left: 5px
            color: green
        .status-not.active
            margin-left: 5px
            color: red
        p
            margin: 1px
            font-size: 1rem
  .socials
        i
            padding-right: 6px
        a
            padding: 6px

/* https://codesandbox.io/s/skeleton-placeholder-forked-9i8f7?file=/index.html:1365-1392 */
.placeholder
        padding: 20px
        max-width: 300px
    .fake-text
        background: #dddddd
        border-radius: 4px
        height: 12px
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
