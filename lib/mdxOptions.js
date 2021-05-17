const reHypePrism = require("@mapbox/rehype-prism");

const mdxOptions = {
  xdmOptions(options) {
    options.rehypePlugins = [...(options.rehypePlugins ?? []), reHypePrism];
    return options;
  },
};

export default mdxOptions;
