const path = require("path");

module.exports = {
    experiments: {
        asyncWebAssembly: true, // Enable WebAssembly support
    },
    module: {
        rules: [
            {
                test: /\.wasm$/,
                type: "webassembly/async", // Specify the WebAssembly module type
            },
        ],
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./"), // Map @/ to the root directory
        },
    },
};
