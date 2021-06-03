const { slugify: vuePressSlugify, path } = require("@vuepress/shared-utils");

function customSlugifyToHandleBadges(str) {
  // Remove badges
  return vuePressSlugify(str.replace(/<Badge[^>]*\/>/, ""));
}

const DOMAIN = "delegates.uns.network";
const HOSTNAME = `https://${DOMAIN}`;

module.exports = {
  title: "uns.network delegates",
  description: "Explore the delegate's profile of the uns.network blockchain",
  plugins: [
    [
      "sitemap",
      {
        hostname: HOSTNAME,
      },
    ],
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
    ["tabs", {}],
    ["@goy/svg-icons", {}],
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
      "@spacelephantlabs/vuepress-plugin-matomo",
      {
        siteId: 18,
      },
    ],
    [
      "seo",
      {
        // your options
        author: (_, $site) => {
          return {
            name: $site.themeConfig.author,
            twitter: "@Uns_Network",
          };
        },
        image: ($page, $site) =>
          $site.themeConfig.domain +
          "/" +
          ($page.frontmatter.image || "opengraph-v1.png"),
      },
    ],
    [require("./my-plugin")],
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
    author: "UNS.network Team",
    repoLabel: "Contribute!",
    editLinks: true,
    editLinkText: "",
    docsDir: "docs",
    lastUpdated: true,
    activeHeaderLinks: true,
    nav: [
      { text: "Get my @unikname ID", link: "https://my.unikname.app" },
      { text: "UNS Home", link: "https://uns.network" },
      { text: "UNS Explorer", link: "https://explorer.uns.network" },
      { text: "UNS Docs", link: "https://docs.uns.network" },
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
