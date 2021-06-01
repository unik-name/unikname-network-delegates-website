const axios = require('axios')

module.exports = (options, context) => {
  const pages = []
  let uniks = []
  let delegates = []

  return {
    extendPageData($page) {
      if ($page.regularPath.includes("delegates") && !$page.regularPath.includes("embedded") && !$page.regularPath.includes('_')) {
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
      await axios.get('https://api.uns.network/api/v2/delegates').then(res => delegates = res.data.data)
      const unikids = delegates.filter(delegate => !delegate.username.includes('genesis')).map(delegate => delegate.username)
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
        const unik = uniks.find(unik => unik.id === page.regularPath.split('/')[2])
        const delegate = delegates.find(delegate => delegate.username === page.regularPath.split('/')[2])
        if (Object.keys(page.frontmatter).length === 0) {
          page.frontmatter = {
            unikid: page.regularPath.split('/')[2],
            ownerId: unik.ownerId,
            unikname: unik.defaultExplicitValue,
            notCompleted: true,
            type: delegate.type,
            forger: delegate.rank < 24 ? true : false
          }
        } else {
          page.frontmatter.ownerId = unik.ownerId
          page.frontmatter.unikname = unik.defaultExplicitValue,
          page.frontmatter.notCompleted =  false,
          page.frontmatter.type = delegate.type
          page.frontmatter.forger = delegate.rank < 24 ? true : false
        }
        if (page.regularPath.includes('embedded')) {
          page.frontmatter.layout = 'DelegateEmbeddedLayout'
        } else {
          page.frontmatter.layout = 'DelegateLayout'
        }
      })

      const pagesWithoutFrontmatter = pages.filter(page => Object.keys(page.frontmatter).length === 0)
      pagesWithoutFrontmatter.forEach(page => page.frontmatter = {unikid: page.regularPath.split('/')[2], notCompleted: true})
      const delegatesPages = pages.filter(page => !page.regularPath.includes('embedded'))

      let finalData = delegatesPages.map(page => page.frontmatter)

      // keep only delegates of type individual
      finalData = finalData.filter(delegate => delegate.type === 'individual')
      // sort by forger status and alphabetically
      finalData = finalData.sort((a, b) => b.forger - a.forger || a.unikname.localeCompare(b.unikname))
      // sort if delegate completed his profile
      finalData = finalData.sort((a, b) => a.notCompleted - b.notCompleted)

      siteConfig.head.push(['delegateData', finalData])
    }
  }
}