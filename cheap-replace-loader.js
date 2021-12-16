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
 * This loader searches for calls to `compileToString` and wraps its path param
 * with a require() call and prepeds the call with the compiled-loader.
 *
 * It uses a very cheap method of finding calls to `compileToString` by just
 * searching for them using regular expressions.
 *
 * 📌 This approach fails when the imported method is being renamed or assigned to
 * another variable, but this keeps things stupid and simple without the overhead
 * of using a AST parser
 *
 * It works as follows:
 *
 * As a quick method of knowing if we can skip doing anything with file we test if
 * compile-to-string has been imported at all and quickly return otherwise
 *
 * We will the find all function calls to compileToString and replace its path param
 * with the same path parameter wrapped in `require('compiled-loader!${originalPath}')`
 * so now that file will be imported (as a compiled string of its sources) using the
 * compiled-loader
 *
 * todo use import() instead of require to create an code-split chunk on the client
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
