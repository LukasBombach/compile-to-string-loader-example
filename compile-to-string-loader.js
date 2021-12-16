/**  * @type {import("webpack").LoaderDefinition} */
module.exports = async function cheapReplaceLoader(content, map, meta) {
  const callback = this.async();

  const result = await this.importModule(this.resourcePath);

  // here i am just returning the original content, but what I really want to do is return
  // the compiled contents of the requested file as a string, so kind of like
  //
  // callback(null, `module.exports = ${JSON.stringify(result)}`);

  callback(null, content, map, meta);
};
