/**
 * @author mankowsj
 * @date 24/07/2019
 */

class WebpackCustomPublicPathPlugin {
  constructor(options) {
    this.options = options || {};

    this.hookName = 'require-extensions';
    this.paramName = 'href';
    this.pluginName = 'WebpackCustomCssPublicPathPlugin';
  }

  getPublicPathReplacement(path, pathType) {
    switch (pathType) {
      case 'function':
        return `${path.name}(${this.paramName})`;
      default:
        return `${path} + ${this.paramName}`;
    }
  }

  getPublicPathFunction(path, pathType) {
    switch (pathType) {
      case 'function':
        return path.toString();
      default:
        return '';
    }
  }

  applyCustomPublicPath(path, source) {
    const result = [];
    const pathType = typeof path;
    const regexp = /__webpack_require__\.p(\s|)\+(\s|)href/;

    if (regexp.test(source)) {
      result.push(this.getPublicPathFunction(path, pathType));
      result.push(
        source.replace(regexp, this.getPublicPathReplacement(path, pathType))
      );
    } else {
      result.push(source);
      console.error(this.pluginName, ' failed to change publicPath for css');
    }

    return result.join('\n');
  }

  apply(compiler) {
    const self = this;
    const publicPath = this.options.cssPublicPath;
    if (!publicPath) {
      console.error('RuntimePublicPath: no output.runtimePublicPath is specified.');
      return;
    }

    if (compiler.hooks && compiler.hooks.thisCompilation) {
      compiler.hooks.thisCompilation.tap(self.pluginName, function (compilation) {
        compilation.mainTemplate.plugin(self.hookName, function (source, chunk, hash) {
          return self.applyCustomPublicPath(publicPath, source);
        });
      });
    } else {
      compiler.plugin('this-compilation', function (compilation) {
        compilation.mainTemplate.plugin(self.hookName, function (source, chunk, hash) {
          return self.applyCustomPublicPath(publicPath, source);
        });
      });
    }
  }
}

module.exports = WebpackCustomPublicPathPlugin;
