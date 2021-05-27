module.exports = (options, context) => {
  const pages = []

  return {
    extendPageData($page) {
      if ($page.regularPath.includes("delegates") && !$page.regularPath.includes("embedded")) {
        pages.push($page)
      }
      if ($page.regularPath.includes("embedded")) {
        const frontmatter = pages.find(page => page.regularPath.includes($page.regularPath.split('/')[2])).frontmatter
        // simple copy of frontmatter doesn't work??
        for (const [key, value] of Object.entries(frontmatter)) {
          $page.frontmatter[key] = value
        }
        $page.frontmatter.layout = 'DelegateLayout'
      }
    },

    async ready() {
      const { siteConfig } = context;
      if (!siteConfig.head) siteConfig.head = [];
      const delegatesPages = pages.filter(page => !page.regularPath.includes('embedded'))
      console.log(delegatesPages.length)
      siteConfig.head.push(['delegateData', delegatesPages.map(page => page.frontmatter)])
    },

    generated(pagePaths) {},

    async additionalPages () {
      return pages.map(page => {return {path: `${page.regularPath}embedded`, content: page._strippedContent}})
    }
  }
}