const { resolve } = require("path");

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack(config, options) {
    config.module.rules.unshift({
      test: /\.(ts|tsx)$/,
      use: [resolve(__dirname, "cheap-replace-loader.js"), options.defaultLoaders.babel],
    });

    return config;
  },
};
