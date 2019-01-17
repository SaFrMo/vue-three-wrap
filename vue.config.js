module.exports = {
    configureWebpack: {
        externals:
            process.env.NODE_ENV == 'production'
                ? {
                      three: {
                          commonjs: 'three',
                          commonjs2: 'three'
                      }
                  }
                : {}
    }
}
