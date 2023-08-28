const {defineConfig} = require('@vue/cli-service')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
//
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        client: {
            overlay: false

        }
    },
    configureWebpack: {
        plugins: [
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
