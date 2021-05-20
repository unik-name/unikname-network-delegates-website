module.exports = (options, context) => {
  const pages = []

  return {
    extendPageData($page) {
      if($page.regularPath.includes("delegates")) {
        pages.push($page.frontmatter)
      }
    },

    async ready() {
      const { siteConfig } = context;
      if (!siteConfig.head) siteConfig.head = [];
      siteConfig.head.push(['delegateData', pages])
    },

    generated(pagePaths) {
      console.log('generated')
    }
  }
}