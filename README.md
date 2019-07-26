# webpack-custom-public-path-plugin

This plugin is supposed to solve the problematic thing which is inability to change publicPath for css files only when lazy loading them using MiniCssExtractPlugin.

# Comnpatibility

Tested only with Webpack@4.28.4 and MiniCssExtractPlugin@0.8.0.
Please bear in mind that this plugin heavily relies on code generated by MiniCssExtractPlugin. If the code responsible for lazy loading css chunks changes, this plugin will probably stop working till next update.


# Example usage

```javascript
config.plugins = [
  new CustomPublicPath({
    cssPublicPath: function doPath(href, webpackPublicPath) {
      return 'custom/path/to/lazy/css/' + href;
    }
  })
];
```

```javascript
config.plugins = [
  new CustomPublicPath({
    cssPublicPath: 'custom/path/'
  })
];
```
