# webpack-custom-public-path-plugin

This plugin is supposed to solve the problematic thing which is inability to change publicPath for css files only when lazy loading them.

# Example usage

```javascript
config.plugins = [
  new CustomPublicPath({
    cssPublicPath: function doPath(href) {
      return 'custom/path/to/lazy/css';
    }
];
```

```javascript
config.plugins = [
  new CustomPublicPath({
    cssPublicPath: 'cusotm/path'
];
```
