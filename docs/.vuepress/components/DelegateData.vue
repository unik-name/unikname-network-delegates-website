<template>
  <div class="card-container">
    <div v-for="delegate in delegates" :key="delegate.unikid">
      <a :href="`/delegates/${delegate.unikid}`">
        <div class="card" :style="`background-color: ${delegate.cardbg}`">
          <div class="card-header">
            <img
              v-if="delegate.notCompleted"
              loading="lazy"
              :src="require(`@assets/generated/default-logo.png`)"
            />
            <img
              v-else
              loading="lazy"
              :src="require(`@assets/generated/${delegate.unikid}.png`)"
            />
          </div>
          <div class="text-content">
            <div class="unikid">
              <h3>
                @{{ delegate.unikname }}
                <span
                  class="rewardsSharingDesktop"
                  v-if="delegate.rewardsSharing"
                  >💸
                  <span class="hovercard">
                    <div class="tooltiptext">
                      ➡️ This delegate shares his rewards with his supporters 🤑
                    </div>
                  </span></span
                >
              </h3>
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
                class="nobr"
                v-if="delegate.twitter"
                target="_blank"
                :href="`https://twitter.com/${delegate.twitter}`"
                ><i class="fa fa-twitter" />twitter</a
              >
              <a
                class="nobr"
                v-if="delegate.email"
                target="_blank"
                :href="`mailto:${delegate.email}`"
                ><i class="fa fa-envelope" />email</a
              >
              <a
                class="nobr"
                v-if="delegate.forum"
                target="_blank"
                :href="`https://forum.unikname.com/u/${delegate.forum}/summary`"
              >
                <i class="fa fa-globe" />forum</a
              >
              <a
                class="nobr"
                v-if="delegate.github"
                target="_blank"
                :href="`https://github.com/${delegate.github}`"
                ><i class="fa fa-github" />github</a
              >
              <a
                v-if="delegate.website"
                class="nobr"
                target="_blank"
                :href="delegate.website"
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

            <div v-if="!loading && !delegate.notActive" class="description">
              <div>
                rank: {{ delegate.rank }} / votes: {{ delegate.votes }}%
              </div>
              <span v-if="delegate.forger"
                >elected:
                <img
                  :src="require(`@assets/check.svg`)"
                  class="elected"
                  alt="status"
                />
              </span>
              <span v-else
                >elected:
                <img
                  :src="require(`@assets/cross.svg`)"
                  class="elected"
                  alt="status"
                />
              </span>
              <p class="rewardsSharingMobile" v-if="delegate.rewardsSharing">
                ➡️ This delegate shares his rewards with his supporters 🤑
              </p>
            </div>

            <div v-if="!loading && delegate.notActive" class="description">
              <div v-if="delegate.notActive" class="not-active">
                <p>
                  slowing down the network since
                  {{ delegate.notActive }}
                </p>
              </div>
            </div>

            <div v-if="loading" class="placeholder shimmer">
              <div class="fake-text medium" />
              <div class="fake-text short" />
              <div class="fake-text" />
            </div>
          </div>
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
  async mounted() {
    const res = await fetch(
      "https://api.uns.network/api/v2/delegates"
    ).then((res) => res.json());
    const delegates = this.delegates;
    this.delegates.forEach((delegate) => {
      const data = res.data.find((el) => el.username === delegate.unikid);
      delegate.rank = data.rank;
      delegate.votes = data.production.approval;
      delegate.forger = delegate.rank < 24 ? true : false;
      if (delegate.forger) {
        // has not forged for more than 10 minutes
        if (
          (Date.now() - data.blocks.last.timestamp.unix * 1000) / 1000 >
          60 * 10
        ) {
          delegate.cardbg = "#ffe8e2";
          const seconds =
            (Date.now() - data.blocks.last.timestamp.unix * 1000) / 1000;
          if (seconds / 3600 / 24 > 1) {
            delegate.notActive = `${(seconds / 3600 / 24).toFixed(0)} days`;
          } else if (seconds / 3600 > 1) {
            delegate.notActive = `${(seconds / 3600).toFixed(0)} hours`;
          } else {
            delegate.notActive = `${(seconds / 60).toFixed(0)} minutes`;
          }
        } else {
          delegate.notActive = false;
        }
      } else {
        delegate.cardbg = "#f9f9f9";
        delegate.notActive = false;
      }
    });
    this.loading = false;
  },
  data() {
    return {
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
    background-color #effcf0
  .card-header
        img
            padding-top: 10px
            height: 100px
            width: 100px
  .text-content
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
              margin-top: 5px
              height: 15px
              width: 15px
          p
              margin: 1px
              font-size: 1rem
          .not-active
              p
                padding-left: 5px
                padding-right: 5px
                line-height: 1
                font-size: 1.1rem
    .socials
        i
            padding-right: 6px
        a
            padding: 6px
        .nobr
              white-space: nowrap

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
.rewardsSharingDesktop
    padding-left: 10px
    font-size 1.3rem
.rewardsSharingDesktop:hover .hovercard
    opacity: 1
    transition: 0.5s
    transition-delay: 0.1s
.hovercard
    position: absolute
    opacity: 0
    z-index: 1
    left: 50%
    top: -5px;
    transform: translateX(-50%)
.tooltiptext
    display: flex
    flex-direction: column
    justify-content: flex-start
    background-color: #effcf0
    padding: 18px
    border-radius: 5px
    color: black
    transition: 1s
    width: 200px
    font-size: 1.1rem

.rewardsSharingMobile
    padding-top: 5px
    display: none

@media (any-pointer: coarse)
    .rewardsSharingDesktop
        display:none
    .rewardsSharingMobile
        display: block
    .card
        height: 22em
    
</style>
