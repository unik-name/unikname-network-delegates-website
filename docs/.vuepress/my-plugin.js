module.exports = (options, context) => {  
    return {
      async generated(pagePaths) {
        console.log('generating...')
  
        const { pages } = context.getSiteData ? context.getSiteData() : context
        let homePageIndex = -1

        pages.forEach((page, id) => {
            if (page.regularPath.includes('delegates')) {
              console.log(page.title)
              console.log(page.frontmatter, '\n')
            } else if (page.frontmatter.title === 'home') {
                homePageIndex = id
            }
        })
        
        // add content to home page
        console.log(homePageIndex)
        console.log(pages[homePageIndex])

        // but files aldreay generated

      }
    }
}