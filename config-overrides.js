const { override, addWebpackAlias, fixBabelImports, addDecoratorsLegacy, disableEsLint, addLessLoader } = require('customize-cra');
const darkTheme = require('quant-ui/es/styles/dark.js').default;

const path = require("path");
module.exports = override(
    addDecoratorsLegacy(),
    disableEsLint(),
    fixBabelImports("lodash", {
        libraryDirectory: "",
        camel2DashComponentName: false
    }),
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true
    }),
    fixBabelImports('quant-ui', {
        libraryDirectory: 'es',
        style: true
    }),
    addWebpackAlias({
        ["@"]: path.resolve(__dirname, "src")
    }),
    addLessLoader({
        lessOptions: {
            javascriptEnabled: true,
            modifyVars: {
                "@body-background": "#F5F6F7"
            }
        }
    })
);