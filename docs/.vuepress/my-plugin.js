const axios = require("axios");
const sharp = require("sharp");
const fs = require("fs");

  // https://www.codegrepper.com/code-examples/javascript/split+string+without+cutting+words+typescript
  const truncate = (str, max, suffix) =>
    str.length < max
      ? str
      : `${str.substr(
          0,
          str.substr(0, max - suffix.length).lastIndexOf(" ")
        )}${suffix}`;

module.exports = (options, context) => {
  const pages = [];
  let uniks = [];
  let delegates = [];
  const unikidsClaimed = [];

  return {
    extendPageData($page) {
      if (
        $page.regularPath.includes("delegates") &&
        !$page.regularPath.includes("embedded") &&
        !$page.regularPath.includes("_")
      ) {
        pages.push($page);
      }
      if ($page.regularPath.includes("embedded")) {
        const page = pages.find((page) =>
          page.regularPath.includes($page.regularPath.split("/")[2])
        );
        if (page) {
          for (const [key, value] of Object.entries(page.frontmatter)) {
            $page.frontmatter[key] = value;
          }
        }
        pages.push($page);
      }
    },

    async additionalPages() {
      pages.forEach((page) =>
        unikidsClaimed.push(page.regularPath.split("/")[2])
      );

      delegates = await axios
        .get("https://api.uns.network/api/v2/delegates")
        .then((res) => res.data.data);
      const unikids = delegates
        .filter((delegate) => !delegate.username.includes("genesis"))
        .map((delegate) => delegate.username);
      uniks = await axios
        .post("https://api.uns.network/api/v2/uniks/search", { id: unikids })
        .then((res) => res.data.data);

      const additionalPages = pages.map((page) => {
        return {
          path: `${page.regularPath}embedded.html`,
          content: page._strippedContent,
        };
      });
      unikids.forEach((unikid) => {
        if (!pages.find((page) => page.regularPath.includes(unikid))) {
          additionalPages.push({
            path: `/delegates/${unikid}/`,
            content: "\n## Summary\n\n## Contributions\n",
          });
          additionalPages.push({
            path: `/delegates/${unikid}/embedded.html`,
            content: "\n## Summary\n\n## Contributions\n",
          });
        }
      });
      return additionalPages;
    },

    async ready() {
      const { siteConfig } = context;
      if (!siteConfig.head) siteConfig.head = [];
      pages.forEach((page) => {
        const unikid = page.regularPath.split("/")[2];
        const unik = uniks.find((unik) => unik.id === unikid);
        const delegate = delegates.find(
          (delegate) => delegate.username === unikid
        );

        // Allow to generate pages for delegate without contribution
        if (Object.keys(page.frontmatter).length === 0) {
          page.frontmatter = {};
        }

        if (unikidsClaimed.includes(unikid)) {
          page.frontmatter.notCompleted = false;
        } else {
          page.frontmatter.notCompleted = true;
        }
        page.title = `@${unik.defaultExplicitValue}'s delegate profile`;
        page.frontmatter.unikid = unikid;
        page.frontmatter.ownerId = unik.ownerId;
        page.frontmatter.unikname = unik.defaultExplicitValue;
        page.frontmatter.type = delegate.type;
        page.frontmatter.forger = delegate.rank < 24 ? true : false;

        // add custom description
        let description = page._strippedContent;
        description = description.replace(/^.*#.*$/gm, "");
        description = description.replace(/(\r\n|\n|\r)/gm, "");
        description = description.replace(/<!--.*?-->/g, "");

        if (description.length > 0) {
          description = truncate(description, 120, "...");
        } else {
          description = `See the profile of @${unik.defaultExplicitValue}, a delegate of the uns.network blockchain`;
        }
        page.frontmatter.description = description;

        // update SEO meta
        page.frontmatter.meta.forEach((meta) => {
          if (meta.property === "og:title") {
            meta.content = page.title;
          } else if (meta.name === "twitter:title") {
            meta.content = page.title;
          } else if (meta.name === "twitter:data1") {
            meta.content = page.frontmatter.unikname;
          } else if (
            meta.name === "twitter:description" ||
            meta.property === "og:description"
          ) {
            meta.content = description;
          }
        });

        if (page.regularPath.includes("embedded")) {
          page.frontmatter.layout = "DelegateLayout";
          page.frontmatter.format = "embedded";
        } else {
          page.frontmatter.format = "complete";
        }
      });

      const pagesWithoutFrontmatter = pages.filter(
        (page) => Object.keys(page.frontmatter).length === 0
      );
      pagesWithoutFrontmatter.forEach(
        (page) =>
          (page.frontmatter = {
            unikid: page.regularPath.split("/")[2],
            notCompleted: true,
          })
      );
      const delegatesPages = pages.filter(
        (page) => !page.regularPath.includes("embedded")
      );

      delegates = delegatesPages.map((page) => page.frontmatter);

      // keep only delegates of type individual
      delegates = delegates.filter(
        (delegate) => delegate.type === "individual"
      );
      // sort by forger status and alphabetically
      delegates = delegates.sort(
        (a, b) => b.forger - a.forger || a.unikname.localeCompare(b.unikname)
      );
      // sort if delegate completed his profile
      delegates = delegates.sort((a, b) => a.notCompleted - b.notCompleted);

      // create thumbnails for delegates logo
      const outputDir = "./docs/assets/generated";
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }
      unikidsClaimed.forEach(async (unikid) => {
        const logoPath = `./docs/delegates/${unikid}/logo.png`;
        const thumbnailPath = `${outputDir}/${unikid}.png`;
        generateThumbnail(logoPath, thumbnailPath, 100, 100);
      });
      // default logo
      const logoPath = `./docs/delegates/default-logo.png`;
      const thumbnailPath = `${outputDir}/default-logo.png`;
      generateThumbnail(logoPath, thumbnailPath, 100, 100);
    },

    async enhanceAppFiles() {
      return {
        name: "my-plugin",
        content: `
        export default ({ Vue }) => {
          Vue.mixin({
            data() {
              return {
                delegates: ${JSON.stringify(delegates)}
              };
            }
          });
        }
        `,
      };
    },
  };
};

const generateThumbnail = (logoPath, thumbnailPath, width, heigth) => {
  if (fs.existsSync(thumbnailPath)) {
    const logoBirthtime = fs.statSync(logoPath).birthtime;
    const thumbnailBirthTime = fs.statSync(thumbnailPath).birthtime;
    if (logoBirthtime > thumbnailBirthTime) {
      sharp(logoPath)
        .resize(width, heigth)
        .toFile(thumbnailPath),
        (err) => console.log(err);
    }
  } else {
    sharp(logoPath)
      .resize(width, heigth)
      .toFile(thumbnailPath),
      (err) => console.log(err);
  }
};
