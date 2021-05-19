---
layout: projects
---

- **[Compliments](https://github.com/adrhumphreys/compliments.jar.nz):** A quick react app to share compliments from the Reply All podcast. You can view it [here](https://compliments.jar.nz) (Protip, you can change the name).
- **[Fixtures](https://github.com/adrhumphreys/silverstripe-fixtures):** A module that allows users to create fixtures for automated testing. Silverstripe projects have traditionally loaded fixtures via yaml files. We had a need to create fixtures programmatically, so I made a module to achieve it. This supports dependencies using a very basic implementation of Kahn's algorithm.
- **[Impetuous](https://github.com/adrhumphreys/impetuous):** A module to statically cache responses via middleware in Silverstripe. Designed to be extended upon allowing projects to use it with different circumstances/context around cache lifetime and invalidation strategy.
- **[Telescope](https://github.com/adrhumphreys/telescope):** A reimplementation of Laravels Telescope in Silverstripe. Front end is written as a SPA in React.
- **[Recipes](https://github.com/adrhumphreys/recipes):** A recipe website built for my partner. Uses Gatsby for the frontend and stores files in markdown. Makes use of Netlify CMS for easy editing and free hosting. View it [here](http://jar.nz).
- **[Safezone](https://github.com/adrhumphreys/safe-zone):** Basic react app used to create "safe zones" for images based on ratios

## Some of the open source contributions I've made:
- [Silverstripe Assets (recursive performance issue)](https://github.com/silverstripe/silverstripe-assets/pull/415): Read more about it [here](/posts/silverstripe-assets/).
- [Silverstripe Assets (`Folder::find_or_make` bug fix)](https://github.com/silverstripe/silverstripe-assets/pull/364): This was found when trying to track down why folders were being duplicated in the database.
- [Silverstripe CMS (Increase performance of the CMS through caching)](https://github.com/silverstripe/silverstripe-cms/pull/2493): When profiling the CMS performance for a client web site, I found that 7ish% of the time taken for a request was generating CSS classes for page icons.
- [Silverstripe CMS (Reduce complexity)](https://github.com/silverstripe/silverstripe-cms/pull/2476): Removed code for checking if an item was archived that was implemented differently elsewhere.
- [Silverstripe Versioned (Fix incorrect state)](https://github.com/silverstripe/silverstripe-versioned/pull/243): When `DataObjects` were archived the instance of the `DataObject` would retain their previous version.
- [DNA Design Populate (Add support for Fluent)](https://github.com/dnadesign/silverstripe-populate/pull/32): Projects using fluent wouldn't have their data correctly purged which meant exceptions would be thrown when trying to rebuild the data
