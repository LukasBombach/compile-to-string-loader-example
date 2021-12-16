module.exports = function compileToStringLoader() {
  const COMPILER_NAME = "vanillaExtractJsCompiler";
  const outputOptions = { filename: "[id].js" };
  const loaderCallback = this.async();

  const childCompiler = this._compilation.createChildCompiler(COMPILER_NAME, outputOptions, [
    new this._compiler.webpack.EntryPlugin(this._compiler.context, this.resourcePath),
  ]);

  childCompiler.runAsChild(async (error, entries, childCompilation) => {
    const { warnings, errors } = childCompilation?.getStats().toJson() ?? {};
    const source = childCompilation?.assets[`${entries[0].id}.js`]?.source();

    if (warnings.length) {
      warnings.forEach(warning => console.warn(warning));
    }

    if (error) {
      loaderCallback(error);
      return;
    }

    if (errors.length) {
      loaderCallback(new Error(errors[0].message));
      return;
    }

    if (!source) {
      loaderCallback(new Error("Failed to get source in vanilla extract loader"));
      return;
    }

    if (error) {
      loaderCallback(error);
      return;
    }

    loaderCallback(null, `module.exports = ${JSON.stringify(source)};`);
  });
};
