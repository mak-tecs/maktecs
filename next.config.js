const path = require("path");

module.exports = {
  swcMinify: false, // Disable SWC minification
  webpack: (config) => {
    config.experiments = {
      asyncWebAssembly: true,
      syncWebAssembly: true,
      layers: true, // Enable layers feature
    };

    // Modify the rules to handle WebAssembly files
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async", // or "webassembly/sync" based on your preference
    });

    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
    };
    return config;
  },
};
