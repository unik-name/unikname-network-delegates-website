const axios = require('axios')

module.exports = (options, context) => {
  const pages = []
  let uniks = []

  return {
    extendPageData($page) {
      if ($page.regularPath.includes("delegates") && !$page.regularPath.includes("embedded")) {
        pages.push($page)
      }
      if ($page.regularPath.includes("embedded")) {
        const page = pages.find(page => page.regularPath.includes($page.regularPath.split('/')[2]))
        if (page) {
          for (const [key, value] of Object.entries(page.frontmatter)) {
            $page.frontmatter[key] = value
          }
        }
        pages.push($page)
      }
    },

    async additionalPages () {
      const delegatesAPI = await axios.get('https://api.uns.network/api/v2/delegates')
      const unikids = delegatesAPI.data.data.filter(delegate => !delegate.username.includes('genesis')).map(delegate => delegate.username)
      await axios.post('https://api.uns.network/api/v2/uniks/search', {id: unikids}).then(res => uniks = res.data.data)

      const additionalPages = pages.map(page => {return {path: `${page.regularPath}embedded.html`, content: page._strippedContent}})
      unikids.forEach(unikid => {
        if (!pages.find(page => page.regularPath.includes(unikid))) {
          additionalPages.push({path: `/delegates/${unikid}/`, content: '\n## Summary\n\n## Contributions\n'})
          additionalPages.push({path: `/delegates/${unikid}/embedded.html`, content: '\n## Summary\n\n## Contributions\n'})
        }
      })
      return additionalPages
    },

    async ready() {
      const { siteConfig } = context;
      if (!siteConfig.head) siteConfig.head = [];
      pages.forEach(page => {
        const data = uniks.find(unikid => unikid.id === page.regularPath.split('/')[2])
        if (Object.keys(page.frontmatter).length === 0) {
          page.frontmatter = {unikid: page.regularPath.split('/')[2], ownerId: data.ownerId, unikname: data.defaultExplicitValue, notCompleted: true}
        } else {
          page.frontmatter.ownerId = data.ownerId
          page.frontmatter.unikname = data.defaultExplicitValue
        }
        if (page.regularPath.includes('embedded')) {
          page.frontmatter.layout = 'DelegateLayout'
        }
      })

      const pagesWithoutFrontmatter = pages.filter(page => Object.keys(page.frontmatter).length === 0)
      pagesWithoutFrontmatter.forEach(page => page.frontmatter = {unikid: page.regularPath.split('/')[2], notCompleted: true})
      const delegatesPages = pages.filter(page => !page.regularPath.includes('embedded'))
      siteConfig.head.push(['delegateData', delegatesPages.map(page => page.frontmatter)])
    },

    generated(pagePaths) {},
  }
}