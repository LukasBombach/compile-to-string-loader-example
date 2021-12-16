const { resolve } = require("path");

/*
 * These regular expressions are hoisted outside of the loader
 * as a performance improvement
 */
const importsCompileToString = /import \{ compileToString \} from \"\.\.\/lib\/compile-to-string\";/;
const findCallToCompileToString = /(?<=compileToString\()\"(.+?)\"(?=\))/g;
const compiledLoader = resolve(__dirname, "compile-to-string-loader.js");
const replaceWithRequireArgument = `require('${compiledLoader}!$1')`;

/**
 * This is a cheap demo loader that just tests if an import to
 *
 * "../lib/compile-to-string";
 *
 * exists and replaces every call to
 *
 * compileToString("SOME_PATH");
 *
 * with this
 *
 * compileToString(require("compile-to-string-loader.js!SOME_PATH"));
 *
 * @type {import("webpack").LoaderDefinition}
 */
module.exports = function cheapReplaceLoader(content, map, meta) {
  const callback = this.async();

  if (importsCompileToString.test(content)) {
    content = content.replace(findCallToCompileToString, replaceWithRequireArgument);
  }

  callback(null, content, map, meta);
};
