const {defineConfig} = require('@vue/cli-service')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
//
module.exports = defineConfig({
    transpileDependencies: true,
    configureWebpack: {
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'node_modules/cesium/Build/Cesium/Workers',
                        to: 'Workers'
                    },
                    {
                        from: 'node_modules/cesium/Build/Cesium/ThirdParty',
                        to: 'ThirdParty'
                    },

                    {from: 'node_modules/cesium/Build/Cesium/Assets', to: 'Assets'},

                    {
                        from: 'node_modules/cesium/Build/Cesium/Widgets',
                        to: 'Widgets'
                    }
                ]
            }),
            new webpack.DefinePlugin({
                // Define relative base path in cesium for loading assets
                CESIUM_BASE_URL: JSON.stringify('./')
            }),
            new NodePolyfillPlugin()
        ],

        resolve: {
            alias: {
                cesium: 'cesium'
            }
        },
        module: {
            unknownContextCritical: false,
            rules: [
                {
                    test: /\.(gltf)|.(glb)$/,
                    loader: 'url-loader'
                },
            ],
        }
    }
})
