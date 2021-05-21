const { slugify: vuePressSlugify, path } = require("@vuepress/shared-utils");

function customSlugifyToHandleBadges(str) {
  // Remove badges
  return vuePressSlugify(str.replace(/<Badge[^>]*\/>/, ""));
}

module.exports = {
  title: "The UNS Delegates Website!",
  title2: "UNS delegates (Universal-Name-System)",
  description:
    "description",
  plugins: [
    [
      "sitemap",
      {
        hostname: "#",
      }
    ],
    [
      "@vuepress/last-updated",
      {
        transformer: (timestamp, lang) => {
          // UTC date (without time) as ISO format: 2019-09-17
          return new Date(timestamp).toISOString().split("T")[0];
        }
      }
    ],
    [
      "@vuepress/back-to-top", {}
    ],
    [
      "tabs", {},
    ],
    [
      "@goy/svg-icons", {}
    ],
    [
      "vuepress-plugin-container",
      {
        type: "information",
        defaultTitle: "",
        before: '<div class="information">',
        after: "</div>",
      }
    ],
    [
      "@spacelephantlabs/vuepress-plugin-matomo",
      {
        siteId: 2,
      }
    ],
    [
      require("./my-plugin")
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
    repoLabel: "Contribute!",
    editLinks: true,
    editLinkText: "",
    docsDir: "docs",
    lastUpdated: true,
    activeHeaderLinks: true,
    algolia: {
      apiKey: "da7366c200b21f0ae27f6c29edaff5fe",
      indexName: "uns-network",
    },
    nav: [
      { text: "Get my @unikname ID", link: "https://my.unikname.app" },
      { text: "UNS Home", link: "https://uns.network" },
      { text: "UNS Explorer", link: "https://explorer.uns.network" },
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
        '@assets': '/docs/delegates/'
      }
    }
  }
};
