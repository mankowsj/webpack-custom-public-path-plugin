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

function WebpackCustomPublicPathPlugin(options) {
    this.options = options || {};
    this._name = 'WebpackCustomPublicPathPlugin';

    function applyCustomPublicPath(path, source) {
        const pathType = typeof path;
        const code = [];
        code.push(source);
        code.push('');
        code.push(createPublicPathFunction(pathType, path));
        code.push('__webpack_require__.p = ' + createPublicPathCall(pathType, path) + ' || __webpack_require__.p;');
        return code.join('\n');
    }

    this.callPlugin = function (plugin) {
        const publicPath = this.options.publicPath;
        if (!publicPath) {
            console.error('RuntimePublicPath: no output.runtimePublicPath is specified.');
            return;
        }

        plugin(hookName, function (source) {
            return applyCustomPublicPath(publicPath, source)
        });
    };

    this.apply = function (compiler) {
        if (compiler.hooks && compiler.hooks.thisCompilation) {
            compiler.hooks.thisCompilation.tap(this._name, function (compilation) {
                this.callPlugin(compilation.mainTemplate.plugin);
            });
        } else {
            compiler.plugin('this-compilation', function (compilation) {
                this.callPlugin(compilation.mainTemplate.plugin);
            });
        }
    };
}

module.exports = WebpackCustomPublicPathPlugin;