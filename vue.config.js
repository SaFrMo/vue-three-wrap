module.exports = {
    configureWebpack: {
        externals: {
            three: {
                commonjs: 'three',
                commonjs2: 'three'
            }
        }
    }
}
