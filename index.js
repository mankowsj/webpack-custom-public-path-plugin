/**
 * @author mankowsj
 * @date 24/07/2019
 */

const hookName = 'require-extensions';

function createPublicPathFunction(pathType, pathParam) {
    switch (pathType) {
        case 'function':
            return pathParam.toString();
        default:
            return '';
    }
}

function createPublicPathCall(pathType, pathParam) {
    switch (pathType) {
        case 'function':
            return `${pathParam.name}(href)`;
        default:
            return pathParam;
    }
}

function applyCustomPublicPath(path, source) {
    const pathType = typeof path;
    const code = [];
    code.push(source);
    code.push(createPublicPathFunction(pathType, path));
    code.push('__webpack_require__.p = ' + createPublicPathCall(pathType, path) + ' || __webpack_require__.p;');
    return code.join('\n');
}

class WebpackCustomPublicPathPlugin {
    constructor(options) {
        this.options = options || {};
        this.pluginName = 'WebpackCustomPublicPathPlugin';
    }

    apply(compiler) {
        const publicPath = this.options.publicPath;
        if (!publicPath) {
            console.error('RuntimePublicPath: no output.runtimePublicPath is specified.');
            return;
        }

        if (compiler.hooks && compiler.hooks.thisCompilation) {
            compiler.hooks.thisCompilation.tap(this.pluginName, function (compilation) {
                compilation.mainTemplate.plugin(hookName, function (source, chunk, hash) {
                    return applyCustomPublicPath(publicPath, source)
                });
            });
        } else {
            compiler.plugin('this-compilation', function (compilation) {
                compilation.mainTemplate.plugin(hookName, function (source, chunk, hash) {
                    return applyCustomPublicPath(publicPath, source)
                });
            });
        }
    }
}

module.exports = WebpackCustomPublicPathPlugin;