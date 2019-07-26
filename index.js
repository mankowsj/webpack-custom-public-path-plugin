/**
 * @author mankowsj
 * @date 24/07/2019
 */

class WebpackCustomPublicPathPlugin {
  static getPublicPathFunction(path, pathType) {
    switch (pathType) {
      case 'function':
        return path.toString();
      default:
        return '';
    }
  }

  constructor(options) {
    this.options = options || {};

    this.hookName = 'require-extensions';
    this.paramName = 'href';
    this.pluginName = 'WebpackCustomCssPublicPathPlugin';

    this.webpackRequireName = '__webpack_require__';
    this.publicPathName = 'p';
  }

  getPublicPathReplacement(path, pathType) {
    switch (pathType) {
      case 'function':
        return `${path.name}(${this.paramName}, ${this.webpackRequireName}.${this.publicPathName})`;
      default:
        return `'${path}' + ${this.paramName}`;
    }
  }

  applyCustomPublicPath(path, source) {
    const result = [];
    const pathType = typeof path;
    const regexp = new RegExp(`${this.webpackRequireName}\\.${this.publicPathName}(\\s|)\\+(\\s|)${this.paramName}`);

    if (regexp.test(source)) {
      result.push(WebpackCustomPublicPathPlugin.getPublicPathFunction(path, pathType));
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
