"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/snakecase-keys@8.0.1";
exports.ids = ["vendor-chunks/snakecase-keys@8.0.1"];
exports.modules = {

/***/ "(action-browser)/./node_modules/.pnpm/snakecase-keys@8.0.1/node_modules/snakecase-keys/index.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/.pnpm/snakecase-keys@8.0.1/node_modules/snakecase-keys/index.js ***!
  \**************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nconst map = __webpack_require__(/*! map-obj */ \"(action-browser)/./node_modules/.pnpm/map-obj@4.3.0/node_modules/map-obj/index.js\")\nconst { snakeCase } = __webpack_require__(/*! snake-case */ \"(action-browser)/./node_modules/.pnpm/snake-case@3.0.4/node_modules/snake-case/dist.es2015/index.js\")\n\nconst PlainObjectConstructor = {}.constructor\n\nmodule.exports = function (obj, options) {\n  if (Array.isArray(obj)) {\n    if (obj.some(item => item.constructor !== PlainObjectConstructor)) {\n      throw new Error('obj must be array of plain objects')\n    }\n  } else {\n    if (obj.constructor !== PlainObjectConstructor) {\n      throw new Error('obj must be an plain object')\n    }\n  }\n\n  options = Object.assign({ deep: true, exclude: [], parsingOptions: {} }, options)\n\n  return map(obj, function (key, val) {\n    return [\n      matches(options.exclude, key) ? key : snakeCase(key, options.parsingOptions),\n      val,\n      mapperOptions(key, val, options)\n    ]\n  }, options)\n}\n\nfunction matches (patterns, value) {\n  return patterns.some(function (pattern) {\n    return typeof pattern === 'string'\n      ? pattern === value\n      : pattern.test(value)\n  })\n}\n\nfunction mapperOptions (key, val, options) {\n  return options.shouldRecurse\n    ? { shouldRecurse: options.shouldRecurse(key, val) }\n    : undefined\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFjdGlvbi1icm93c2VyKS8uL25vZGVfbW9kdWxlcy8ucG5wbS9zbmFrZWNhc2Uta2V5c0A4LjAuMS9ub2RlX21vZHVsZXMvc25ha2VjYXNlLWtleXMvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQVk7O0FBRVosWUFBWSxtQkFBTyxDQUFDLGtHQUFTO0FBQzdCLFFBQVEsWUFBWSxFQUFFLG1CQUFPLENBQUMsdUhBQVk7O0FBRTFDLGlDQUFpQzs7QUFFakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw0QkFBNEIsNkNBQTZDOztBQUV6RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcaW5mb1xcRG9jdW1lbnRzXFxEaXNjb3JkIEJvdFxcUHlyb0JvdFBvbHlSZXBvXFxEYXNoYm9hcmRcXG5vZGVfbW9kdWxlc1xcLnBucG1cXHNuYWtlY2FzZS1rZXlzQDguMC4xXFxub2RlX21vZHVsZXNcXHNuYWtlY2FzZS1rZXlzXFxpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuY29uc3QgbWFwID0gcmVxdWlyZSgnbWFwLW9iaicpXG5jb25zdCB7IHNuYWtlQ2FzZSB9ID0gcmVxdWlyZSgnc25ha2UtY2FzZScpXG5cbmNvbnN0IFBsYWluT2JqZWN0Q29uc3RydWN0b3IgPSB7fS5jb25zdHJ1Y3RvclxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmosIG9wdGlvbnMpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgIGlmIChvYmouc29tZShpdGVtID0+IGl0ZW0uY29uc3RydWN0b3IgIT09IFBsYWluT2JqZWN0Q29uc3RydWN0b3IpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ29iaiBtdXN0IGJlIGFycmF5IG9mIHBsYWluIG9iamVjdHMnKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAob2JqLmNvbnN0cnVjdG9yICE9PSBQbGFpbk9iamVjdENvbnN0cnVjdG9yKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ29iaiBtdXN0IGJlIGFuIHBsYWluIG9iamVjdCcpXG4gICAgfVxuICB9XG5cbiAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oeyBkZWVwOiB0cnVlLCBleGNsdWRlOiBbXSwgcGFyc2luZ09wdGlvbnM6IHt9IH0sIG9wdGlvbnMpXG5cbiAgcmV0dXJuIG1hcChvYmosIGZ1bmN0aW9uIChrZXksIHZhbCkge1xuICAgIHJldHVybiBbXG4gICAgICBtYXRjaGVzKG9wdGlvbnMuZXhjbHVkZSwga2V5KSA/IGtleSA6IHNuYWtlQ2FzZShrZXksIG9wdGlvbnMucGFyc2luZ09wdGlvbnMpLFxuICAgICAgdmFsLFxuICAgICAgbWFwcGVyT3B0aW9ucyhrZXksIHZhbCwgb3B0aW9ucylcbiAgICBdXG4gIH0sIG9wdGlvbnMpXG59XG5cbmZ1bmN0aW9uIG1hdGNoZXMgKHBhdHRlcm5zLCB2YWx1ZSkge1xuICByZXR1cm4gcGF0dGVybnMuc29tZShmdW5jdGlvbiAocGF0dGVybikge1xuICAgIHJldHVybiB0eXBlb2YgcGF0dGVybiA9PT0gJ3N0cmluZydcbiAgICAgID8gcGF0dGVybiA9PT0gdmFsdWVcbiAgICAgIDogcGF0dGVybi50ZXN0KHZhbHVlKVxuICB9KVxufVxuXG5mdW5jdGlvbiBtYXBwZXJPcHRpb25zIChrZXksIHZhbCwgb3B0aW9ucykge1xuICByZXR1cm4gb3B0aW9ucy5zaG91bGRSZWN1cnNlXG4gICAgPyB7IHNob3VsZFJlY3Vyc2U6IG9wdGlvbnMuc2hvdWxkUmVjdXJzZShrZXksIHZhbCkgfVxuICAgIDogdW5kZWZpbmVkXG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(action-browser)/./node_modules/.pnpm/snakecase-keys@8.0.1/node_modules/snakecase-keys/index.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/.pnpm/snakecase-keys@8.0.1/node_modules/snakecase-keys/index.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/.pnpm/snakecase-keys@8.0.1/node_modules/snakecase-keys/index.js ***!
  \**************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nconst map = __webpack_require__(/*! map-obj */ \"(rsc)/./node_modules/.pnpm/map-obj@4.3.0/node_modules/map-obj/index.js\")\nconst { snakeCase } = __webpack_require__(/*! snake-case */ \"(rsc)/./node_modules/.pnpm/snake-case@3.0.4/node_modules/snake-case/dist.es2015/index.js\")\n\nconst PlainObjectConstructor = {}.constructor\n\nmodule.exports = function (obj, options) {\n  if (Array.isArray(obj)) {\n    if (obj.some(item => item.constructor !== PlainObjectConstructor)) {\n      throw new Error('obj must be array of plain objects')\n    }\n  } else {\n    if (obj.constructor !== PlainObjectConstructor) {\n      throw new Error('obj must be an plain object')\n    }\n  }\n\n  options = Object.assign({ deep: true, exclude: [], parsingOptions: {} }, options)\n\n  return map(obj, function (key, val) {\n    return [\n      matches(options.exclude, key) ? key : snakeCase(key, options.parsingOptions),\n      val,\n      mapperOptions(key, val, options)\n    ]\n  }, options)\n}\n\nfunction matches (patterns, value) {\n  return patterns.some(function (pattern) {\n    return typeof pattern === 'string'\n      ? pattern === value\n      : pattern.test(value)\n  })\n}\n\nfunction mapperOptions (key, val, options) {\n  return options.shouldRecurse\n    ? { shouldRecurse: options.shouldRecurse(key, val) }\n    : undefined\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvLnBucG0vc25ha2VjYXNlLWtleXNAOC4wLjEvbm9kZV9tb2R1bGVzL3NuYWtlY2FzZS1rZXlzL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFZOztBQUVaLFlBQVksbUJBQU8sQ0FBQyx1RkFBUztBQUM3QixRQUFRLFlBQVksRUFBRSxtQkFBTyxDQUFDLDRHQUFZOztBQUUxQyxpQ0FBaUM7O0FBRWpDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNEJBQTRCLDZDQUE2Qzs7QUFFekU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXGluZm9cXERvY3VtZW50c1xcRGlzY29yZCBCb3RcXFB5cm9Cb3RQb2x5UmVwb1xcRGFzaGJvYXJkXFxub2RlX21vZHVsZXNcXC5wbnBtXFxzbmFrZWNhc2Uta2V5c0A4LjAuMVxcbm9kZV9tb2R1bGVzXFxzbmFrZWNhc2Uta2V5c1xcaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IG1hcCA9IHJlcXVpcmUoJ21hcC1vYmonKVxuY29uc3QgeyBzbmFrZUNhc2UgfSA9IHJlcXVpcmUoJ3NuYWtlLWNhc2UnKVxuXG5jb25zdCBQbGFpbk9iamVjdENvbnN0cnVjdG9yID0ge30uY29uc3RydWN0b3JcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqLCBvcHRpb25zKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICBpZiAob2JqLnNvbWUoaXRlbSA9PiBpdGVtLmNvbnN0cnVjdG9yICE9PSBQbGFpbk9iamVjdENvbnN0cnVjdG9yKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdvYmogbXVzdCBiZSBhcnJheSBvZiBwbGFpbiBvYmplY3RzJylcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9iai5jb25zdHJ1Y3RvciAhPT0gUGxhaW5PYmplY3RDb25zdHJ1Y3Rvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdvYmogbXVzdCBiZSBhbiBwbGFpbiBvYmplY3QnKVxuICAgIH1cbiAgfVxuXG4gIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHsgZGVlcDogdHJ1ZSwgZXhjbHVkZTogW10sIHBhcnNpbmdPcHRpb25zOiB7fSB9LCBvcHRpb25zKVxuXG4gIHJldHVybiBtYXAob2JqLCBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcbiAgICByZXR1cm4gW1xuICAgICAgbWF0Y2hlcyhvcHRpb25zLmV4Y2x1ZGUsIGtleSkgPyBrZXkgOiBzbmFrZUNhc2Uoa2V5LCBvcHRpb25zLnBhcnNpbmdPcHRpb25zKSxcbiAgICAgIHZhbCxcbiAgICAgIG1hcHBlck9wdGlvbnMoa2V5LCB2YWwsIG9wdGlvbnMpXG4gICAgXVxuICB9LCBvcHRpb25zKVxufVxuXG5mdW5jdGlvbiBtYXRjaGVzIChwYXR0ZXJucywgdmFsdWUpIHtcbiAgcmV0dXJuIHBhdHRlcm5zLnNvbWUoZnVuY3Rpb24gKHBhdHRlcm4pIHtcbiAgICByZXR1cm4gdHlwZW9mIHBhdHRlcm4gPT09ICdzdHJpbmcnXG4gICAgICA/IHBhdHRlcm4gPT09IHZhbHVlXG4gICAgICA6IHBhdHRlcm4udGVzdCh2YWx1ZSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gbWFwcGVyT3B0aW9ucyAoa2V5LCB2YWwsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIG9wdGlvbnMuc2hvdWxkUmVjdXJzZVxuICAgID8geyBzaG91bGRSZWN1cnNlOiBvcHRpb25zLnNob3VsZFJlY3Vyc2Uoa2V5LCB2YWwpIH1cbiAgICA6IHVuZGVmaW5lZFxufVxuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/.pnpm/snakecase-keys@8.0.1/node_modules/snakecase-keys/index.js\n");

/***/ })

};
;