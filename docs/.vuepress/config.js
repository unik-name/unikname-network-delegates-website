const { slugify: vuePressSlugify, path } = require("@vuepress/shared-utils");
const axios = require("axios");

function customSlugifyToHandleBadges(str) {
  // Remove badges
  return vuePressSlugify(str.replace(/<Badge[^>]*\/>/, ""));
}

const DOMAIN = "delegates.unikname.network";
const HOSTNAME = `https://${DOMAIN}`;

module.exports = {
  title: "unikname.network delegates",
  description:
    "Explore the delegate's profiles of the unikname.network blockchain",
  plugins: [
    [
      "@vuepress/last-updated",
      {
        transformer: (timestamp, lang) => {
          // UTC date (without time) as ISO format: 2019-09-17
          return new Date(timestamp).toISOString().split("T")[0];
        },
      },
    ],
    ["@vuepress/back-to-top", {}],
    [
      "vuepress-plugin-container",
      {
        type: "information",
        defaultTitle: "",
        before: '<div class="information">',
        after: "</div>",
      },
    ],
    [
      "@spacelephantlabs/vuepress-plugin-matomo-spacelephant",
      {
        siteId: 18,
      },
    ],
    [require("./my-plugin")],
    [
      "seo",
      {
        // your options
        author: ($page, $site) => {
          // delegate twitter account or by default @UniknameNetwork
          const twitterHandle = $page.frontmatter.twitter
            ? `@${$page.frontmatter.twitter}`
            : "@UniknameNetwork";
          return {
            name: $site.themeConfig.author,
            twitter: twitterHandle,
          };
        },
        description: ($page) => {
          return "Explore the delegate's profile of the unikname.network blockchain";
        },
        image: ($page, $site) =>
          $site.themeConfig.domain +
          "/" +
          ($page.frontmatter.image || "opengraph-v2.png"),
      },
    ],
    [
      "sitemap",
      {
        hostname: HOSTNAME,
      },
    ],
  ],
  head: [
    ["link", { rel: "icon", href: "/logo.png" }],
    [
      "meta",
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    ],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black-translucent",
      },
    ],
  ],
  themeConfig: {
    logo: "/logo.png",
    repo: "unik-name/uns-delegates-website",
    hostname: HOSTNAME,
    domain: HOSTNAME,
    author: "unikname.network Team",
    repoLabel: "Contribute!",
    editLinks: true,
    editLinkText: "",
    docsDir: "docs",
    lastUpdated: true,
    activeHeaderLinks: true,
    nav: [
      { text: "Get my @unikname ID", link: "https://my.unikname.app" },
      { text: "unikname.network", link: "https://www.unikname.network" },
      {
        text: "Explorer",
        link: "https://explorer.unikname.network",
      },
      { text: "Docs", link: "https://docs.unikname.network" },
    ],
  },
  markdown: {
    slugify: customSlugifyToHandleBadges,
    toc: {
      slugify: customSlugifyToHandleBadges,
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@delegates": "/docs/delegates/",
        "@assets": "/docs/assets/",
      },
    },
  },
};
