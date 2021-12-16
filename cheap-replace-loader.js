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
 * import { compileToString } from "../lib/compile-to-string";
 *
 * exists and replaces calls to `compileToString`
 *
 * compileToString("../inline/index.ts");
 *
 * with this
 *
 * compileToString(require("compile-to-string-loader.js!../inline/index.ts"));
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
