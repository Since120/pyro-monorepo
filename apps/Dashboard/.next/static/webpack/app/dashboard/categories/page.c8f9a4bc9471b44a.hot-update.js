"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/dashboard/categories/page",{

/***/ "(app-pages-browser)/./src/components/dashboard/categories/categories-view.tsx":
/*!*****************************************************************!*\
  !*** ./src/components/dashboard/categories/categories-view.tsx ***!
  \*****************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CategoriesView: () => (/* binding */ CategoriesView)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/../../node_modules/.pnpm/next@15.1.4_@babel+core@7.26.7_babel-plugin-macros@3.1.0_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/../../node_modules/.pnpm/next@15.1.4_@babel+core@7.26.7_babel-plugin-macros@3.1.0_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _mui_material_Box__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @mui/material/Box */ \"(app-pages-browser)/../../node_modules/.pnpm/@mui+material@6.3.1_@emotion+react@11.14.0_@types+react@19.0.4_react@19.0.0__@emotion+styled@_xk4ycxdkkzbkbh3cx737ylwvye/node_modules/@mui/material/Box/Box.js\");\n/* harmony import */ var _mui_material_IconButton__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @mui/material/IconButton */ \"(app-pages-browser)/../../node_modules/.pnpm/@mui+material@6.3.1_@emotion+react@11.14.0_@types+react@19.0.4_react@19.0.0__@emotion+styled@_xk4ycxdkkzbkbh3cx737ylwvye/node_modules/@mui/material/IconButton/IconButton.js\");\n/* harmony import */ var _mui_material_Stack__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @mui/material/Stack */ \"(app-pages-browser)/../../node_modules/.pnpm/@mui+material@6.3.1_@emotion+react@11.14.0_@types+react@19.0.4_react@19.0.0__@emotion+styled@_xk4ycxdkkzbkbh3cx737ylwvye/node_modules/@mui/material/Stack/Stack.js\");\n/* harmony import */ var _phosphor_icons_react_dist_ssr_DotsThree__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @phosphor-icons/react/dist/ssr/DotsThree */ \"(app-pages-browser)/../../node_modules/.pnpm/@phosphor-icons+react@2.1.7_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/@phosphor-icons/react/dist/ssr/DotsThree.mjs\");\n/* harmony import */ var _phosphor_icons_react_dist_ssr_List__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @phosphor-icons/react/dist/ssr/List */ \"(app-pages-browser)/../../node_modules/.pnpm/@phosphor-icons+react@2.1.7_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/@phosphor-icons/react/dist/ssr/List.mjs\");\n/* harmony import */ var _sidebar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sidebar */ \"(app-pages-browser)/./src/components/dashboard/categories/sidebar.tsx\");\n/* harmony import */ var _zones_zones_page_client__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./zones/zones-page-client */ \"(app-pages-browser)/./src/components/dashboard/categories/zones/zones-page-client.tsx\");\n// apps/dashboard/src/components/dashboard/categories/categories-view.tsx\n/* __next_internal_client_entry_do_not_use__ CategoriesView auto */ \nvar _s = $RefreshSig$();\n\n\n\n\n\n\n\n\nfunction CategoriesView(param) {\n    let { categories } = param;\n    _s();\n    const [openSidebar, setOpenSidebar] = react__WEBPACK_IMPORTED_MODULE_1__.useState(false);\n    // 2) Merke dir die aktuell ausgewählte Kategorie-ID\n    const [selectedCatId, setSelectedCatId] = react__WEBPACK_IMPORTED_MODULE_1__.useState(null);\n    // Drawer\n    const handleSidebarOpen = react__WEBPACK_IMPORTED_MODULE_1__.useCallback({\n        \"CategoriesView.useCallback[handleSidebarOpen]\": ()=>{\n            setOpenSidebar(true);\n        }\n    }[\"CategoriesView.useCallback[handleSidebarOpen]\"], []);\n    const handleSidebarClose = react__WEBPACK_IMPORTED_MODULE_1__.useCallback({\n        \"CategoriesView.useCallback[handleSidebarClose]\": ()=>{\n            setOpenSidebar(false);\n        }\n    }[\"CategoriesView.useCallback[handleSidebarClose]\"], []);\n    // Klick auf Kategorie => Toggle\n    const handleCategorySelect = react__WEBPACK_IMPORTED_MODULE_1__.useCallback({\n        \"CategoriesView.useCallback[handleCategorySelect]\": (catId)=>{\n            setSelectedCatId(catId);\n        }\n    }[\"CategoriesView.useCallback[handleCategorySelect]\"], []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_mui_material_Box__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n        sx: {\n            display: \"flex\",\n            flex: \"1 1 0\",\n            minHeight: 0\n        },\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_sidebar__WEBPACK_IMPORTED_MODULE_2__.Sidebar, {\n                categories: categories,\n                selectedCatId: selectedCatId,\n                onSelectCategory: handleCategorySelect,\n                open: openSidebar,\n                onClose: handleSidebarClose\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\info\\\\Documents\\\\Discord Bot\\\\pyro-monorepo\\\\apps\\\\Dashboard\\\\src\\\\components\\\\dashboard\\\\categories\\\\categories-view.tsx\",\n                lineNumber: 39,\n                columnNumber: 4\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_mui_material_Box__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n                sx: {\n                    display: \"flex\",\n                    flex: \"1 1 auto\",\n                    flexDirection: \"column\",\n                    overflow: \"hidden\"\n                },\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_mui_material_Box__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n                        sx: {\n                            borderBottom: \"1px solid var(--mui-palette-divider)\",\n                            display: \"flex\",\n                            flex: \"0 0 auto\",\n                            p: 2\n                        },\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_mui_material_Stack__WEBPACK_IMPORTED_MODULE_5__[\"default\"], {\n                                direction: \"row\",\n                                spacing: 1,\n                                sx: {\n                                    flex: \"1 1 auto\"\n                                },\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_mui_material_IconButton__WEBPACK_IMPORTED_MODULE_6__[\"default\"], {\n                                    onClick: handleSidebarOpen,\n                                    sx: {\n                                        display: {\n                                            md: \"none\"\n                                        }\n                                    },\n                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_phosphor_icons_react_dist_ssr_List__WEBPACK_IMPORTED_MODULE_7__.List, {}, void 0, false, {\n                                        fileName: \"C:\\\\Users\\\\info\\\\Documents\\\\Discord Bot\\\\pyro-monorepo\\\\apps\\\\Dashboard\\\\src\\\\components\\\\dashboard\\\\categories\\\\categories-view.tsx\",\n                                        lineNumber: 67,\n                                        columnNumber: 8\n                                    }, this)\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\Users\\\\info\\\\Documents\\\\Discord Bot\\\\pyro-monorepo\\\\apps\\\\Dashboard\\\\src\\\\components\\\\dashboard\\\\categories\\\\categories-view.tsx\",\n                                    lineNumber: 66,\n                                    columnNumber: 7\n                                }, this)\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\info\\\\Documents\\\\Discord Bot\\\\pyro-monorepo\\\\apps\\\\Dashboard\\\\src\\\\components\\\\dashboard\\\\categories\\\\categories-view.tsx\",\n                                lineNumber: 65,\n                                columnNumber: 6\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_mui_material_Stack__WEBPACK_IMPORTED_MODULE_5__[\"default\"], {\n                                direction: \"row\",\n                                spacing: 1,\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_mui_material_IconButton__WEBPACK_IMPORTED_MODULE_6__[\"default\"], {\n                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_phosphor_icons_react_dist_ssr_DotsThree__WEBPACK_IMPORTED_MODULE_8__.DotsThree, {\n                                        weight: \"bold\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\Users\\\\info\\\\Documents\\\\Discord Bot\\\\pyro-monorepo\\\\apps\\\\Dashboard\\\\src\\\\components\\\\dashboard\\\\categories\\\\categories-view.tsx\",\n                                        lineNumber: 72,\n                                        columnNumber: 8\n                                    }, this)\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\Users\\\\info\\\\Documents\\\\Discord Bot\\\\pyro-monorepo\\\\apps\\\\Dashboard\\\\src\\\\components\\\\dashboard\\\\categories\\\\categories-view.tsx\",\n                                    lineNumber: 71,\n                                    columnNumber: 7\n                                }, this)\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\info\\\\Documents\\\\Discord Bot\\\\pyro-monorepo\\\\apps\\\\Dashboard\\\\src\\\\components\\\\dashboard\\\\categories\\\\categories-view.tsx\",\n                                lineNumber: 70,\n                                columnNumber: 6\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"C:\\\\Users\\\\info\\\\Documents\\\\Discord Bot\\\\pyro-monorepo\\\\apps\\\\Dashboard\\\\src\\\\components\\\\dashboard\\\\categories\\\\categories-view.tsx\",\n                        lineNumber: 57,\n                        columnNumber: 5\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_mui_material_Box__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n                        sx: {\n                            flex: \"1 1 auto\",\n                            p: 3\n                        },\n                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_zones_zones_page_client__WEBPACK_IMPORTED_MODULE_3__.ZonesPageClient, {}, void 0, false, {\n                            fileName: \"C:\\\\Users\\\\info\\\\Documents\\\\Discord Bot\\\\pyro-monorepo\\\\apps\\\\Dashboard\\\\src\\\\components\\\\dashboard\\\\categories\\\\categories-view.tsx\",\n                            lineNumber: 79,\n                            columnNumber: 6\n                        }, this)\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\info\\\\Documents\\\\Discord Bot\\\\pyro-monorepo\\\\apps\\\\Dashboard\\\\src\\\\components\\\\dashboard\\\\categories\\\\categories-view.tsx\",\n                        lineNumber: 78,\n                        columnNumber: 5\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\Users\\\\info\\\\Documents\\\\Discord Bot\\\\pyro-monorepo\\\\apps\\\\Dashboard\\\\src\\\\components\\\\dashboard\\\\categories\\\\categories-view.tsx\",\n                lineNumber: 48,\n                columnNumber: 4\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\info\\\\Documents\\\\Discord Bot\\\\pyro-monorepo\\\\apps\\\\Dashboard\\\\src\\\\components\\\\dashboard\\\\categories\\\\categories-view.tsx\",\n        lineNumber: 37,\n        columnNumber: 3\n    }, this);\n}\n_s(CategoriesView, \"L34hfZNUx5F+3HUeWnYFFGXsIbk=\");\n_c = CategoriesView;\nvar _c;\n$RefreshReg$(_c, \"CategoriesView\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9jb21wb25lbnRzL2Rhc2hib2FyZC9jYXRlZ29yaWVzL2NhdGVnb3JpZXMtdmlldy50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5RUFBeUU7OztBQUcxQztBQUNLO0FBQ2M7QUFDVjtBQUM4QztBQUNmO0FBRW5DO0FBRXdCO0FBTXJELFNBQVNVLGVBQWUsS0FBbUM7UUFBbkMsRUFBRUMsVUFBVSxFQUF1QixHQUFuQzs7SUFBdUMsTUFBTSxDQUFDQyxhQUFhQyxlQUFlLEdBQUdiLDJDQUFjLENBQVU7SUFDbkksb0RBQW9EO0lBQ3BELE1BQU0sQ0FBQ2UsZUFBZUMsaUJBQWlCLEdBQUdoQiwyQ0FBYyxDQUFnQjtJQUV4RSxTQUFTO0lBQ1QsTUFBTWlCLG9CQUFvQmpCLDhDQUFpQjt5REFBQztZQUMzQ2EsZUFBZTtRQUNoQjt3REFBRyxFQUFFO0lBQ0wsTUFBTU0scUJBQXFCbkIsOENBQWlCOzBEQUFDO1lBQzVDYSxlQUFlO1FBQ2hCO3lEQUFHLEVBQUU7SUFFTCxnQ0FBZ0M7SUFDaEMsTUFBTU8sdUJBQXVCcEIsOENBQWlCOzREQUFDLENBQUNxQjtZQUMvQ0wsaUJBQWlCSztRQUNsQjsyREFBRyxFQUFFO0lBRUwscUJBQ0MsOERBQUNwQix5REFBR0E7UUFBQ3FCLElBQUk7WUFBRUMsU0FBUztZQUFRQyxNQUFNO1lBQVNDLFdBQVc7UUFBRTs7MEJBRXZELDhEQUFDakIsNkNBQU9BO2dCQUNQRyxZQUFZQTtnQkFDWkksZUFBZUE7Z0JBQ2ZXLGtCQUFrQk47Z0JBQ2xCTyxNQUFNZjtnQkFDTmdCLFNBQVNUOzs7Ozs7MEJBSVYsOERBQUNsQix5REFBR0E7Z0JBQ0hxQixJQUFJO29CQUNIQyxTQUFTO29CQUNUQyxNQUFNO29CQUNOSyxlQUFlO29CQUNmQyxVQUFVO2dCQUNYOztrQ0FHQSw4REFBQzdCLHlEQUFHQTt3QkFDSHFCLElBQUk7NEJBQ0hTLGNBQWM7NEJBQ2RSLFNBQVM7NEJBQ1RDLE1BQU07NEJBQ05RLEdBQUc7d0JBQ0o7OzBDQUVBLDhEQUFDN0IsMkRBQUtBO2dDQUFDOEIsV0FBVTtnQ0FBTUMsU0FBUztnQ0FBR1osSUFBSTtvQ0FBRUUsTUFBTTtnQ0FBVzswQ0FDekQsNEVBQUN0QixnRUFBVUE7b0NBQUNpQyxTQUFTbEI7b0NBQW1CSyxJQUFJO3dDQUFFQyxTQUFTOzRDQUFFYSxJQUFJO3dDQUFPO29DQUFFOzhDQUNyRSw0RUFBQzdCLHFFQUFRQTs7Ozs7Ozs7Ozs7Ozs7OzBDQUdYLDhEQUFDSiwyREFBS0E7Z0NBQUM4QixXQUFVO2dDQUFNQyxTQUFTOzBDQUMvQiw0RUFBQ2hDLGdFQUFVQTs4Q0FDViw0RUFBQ0csK0VBQWFBO3dDQUFDZ0MsUUFBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrQ0FNekIsOERBQUNwQyx5REFBR0E7d0JBQUNxQixJQUFJOzRCQUFFRSxNQUFNOzRCQUFZUSxHQUFHO3dCQUFFO2tDQUNqQyw0RUFBQ3ZCLHFFQUFlQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtyQjtHQWpFZ0JDO0tBQUFBIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXGluZm9cXERvY3VtZW50c1xcRGlzY29yZCBCb3RcXHB5cm8tbW9ub3JlcG9cXGFwcHNcXERhc2hib2FyZFxcc3JjXFxjb21wb25lbnRzXFxkYXNoYm9hcmRcXGNhdGVnb3JpZXNcXGNhdGVnb3JpZXMtdmlldy50c3giXSwic291cmNlc0NvbnRlbnQiOlsiLy8gYXBwcy9kYXNoYm9hcmQvc3JjL2NvbXBvbmVudHMvZGFzaGJvYXJkL2NhdGVnb3JpZXMvY2F0ZWdvcmllcy12aWV3LnRzeFxuXCJ1c2UgY2xpZW50XCI7XG5cbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IEJveCBmcm9tIFwiQG11aS9tYXRlcmlhbC9Cb3hcIjtcbmltcG9ydCBJY29uQnV0dG9uIGZyb20gXCJAbXVpL21hdGVyaWFsL0ljb25CdXR0b25cIjtcbmltcG9ydCBTdGFjayBmcm9tIFwiQG11aS9tYXRlcmlhbC9TdGFja1wiO1xuaW1wb3J0IHsgRG90c1RocmVlIGFzIERvdHNUaHJlZUljb24gfSBmcm9tIFwiQHBob3NwaG9yLWljb25zL3JlYWN0L2Rpc3Qvc3NyL0RvdHNUaHJlZVwiO1xuaW1wb3J0IHsgTGlzdCBhcyBMaXN0SWNvbiB9IGZyb20gXCJAcGhvc3Bob3ItaWNvbnMvcmVhY3QvZGlzdC9zc3IvTGlzdFwiO1xuXG5pbXBvcnQgeyBTaWRlYmFyIH0gZnJvbSBcIi4vc2lkZWJhclwiO1xuaW1wb3J0IHR5cGUgeyBDYXRlZ29yeUl0ZW0gfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgWm9uZXNQYWdlQ2xpZW50IH0gZnJvbSBcIi4vem9uZXMvem9uZXMtcGFnZS1jbGllbnRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBDYXRlZ29yaWVzVmlld1Byb3BzIHtcblx0Y2F0ZWdvcmllczogQ2F0ZWdvcnlJdGVtW107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDYXRlZ29yaWVzVmlldyh7IGNhdGVnb3JpZXMgfTogQ2F0ZWdvcmllc1ZpZXdQcm9wcykge1x0Y29uc3QgW29wZW5TaWRlYmFyLCBzZXRPcGVuU2lkZWJhcl0gPSBSZWFjdC51c2VTdGF0ZTxib29sZWFuPihmYWxzZSk7XG5cdC8vIDIpIE1lcmtlIGRpciBkaWUgYWt0dWVsbCBhdXNnZXfDpGhsdGUgS2F0ZWdvcmllLUlEXG5cdGNvbnN0IFtzZWxlY3RlZENhdElkLCBzZXRTZWxlY3RlZENhdElkXSA9IFJlYWN0LnVzZVN0YXRlPHN0cmluZyB8IG51bGw+KG51bGwpO1xuXG5cdC8vIERyYXdlclxuXHRjb25zdCBoYW5kbGVTaWRlYmFyT3BlbiA9IFJlYWN0LnVzZUNhbGxiYWNrKCgpID0+IHtcblx0XHRzZXRPcGVuU2lkZWJhcih0cnVlKTtcblx0fSwgW10pO1xuXHRjb25zdCBoYW5kbGVTaWRlYmFyQ2xvc2UgPSBSZWFjdC51c2VDYWxsYmFjaygoKSA9PiB7XG5cdFx0c2V0T3BlblNpZGViYXIoZmFsc2UpO1xuXHR9LCBbXSk7XG5cblx0Ly8gS2xpY2sgYXVmIEthdGVnb3JpZSA9PiBUb2dnbGVcblx0Y29uc3QgaGFuZGxlQ2F0ZWdvcnlTZWxlY3QgPSBSZWFjdC51c2VDYWxsYmFjaygoY2F0SWQ6IHN0cmluZyB8IG51bGwpID0+IHtcblx0XHRzZXRTZWxlY3RlZENhdElkKGNhdElkKTtcblx0fSwgW10pO1xuXG5cdHJldHVybiAoXG5cdFx0PEJveCBzeD17eyBkaXNwbGF5OiBcImZsZXhcIiwgZmxleDogXCIxIDEgMFwiLCBtaW5IZWlnaHQ6IDAgfX0+XG5cdFx0XHR7LyogTGlua2UgU2lkZWJhciAqL31cblx0XHRcdDxTaWRlYmFyXG5cdFx0XHRcdGNhdGVnb3JpZXM9e2NhdGVnb3JpZXN9XG5cdFx0XHRcdHNlbGVjdGVkQ2F0SWQ9e3NlbGVjdGVkQ2F0SWR9XG5cdFx0XHRcdG9uU2VsZWN0Q2F0ZWdvcnk9e2hhbmRsZUNhdGVnb3J5U2VsZWN0fVxuXHRcdFx0XHRvcGVuPXtvcGVuU2lkZWJhcn1cblx0XHRcdFx0b25DbG9zZT17aGFuZGxlU2lkZWJhckNsb3NlfVxuXHRcdFx0Lz5cblxuXHRcdFx0ey8qIEhhdXB0YmVyZWljaCByZWNodHMgKi99XG5cdFx0XHQ8Qm94XG5cdFx0XHRcdHN4PXt7XG5cdFx0XHRcdFx0ZGlzcGxheTogXCJmbGV4XCIsXG5cdFx0XHRcdFx0ZmxleDogXCIxIDEgYXV0b1wiLFxuXHRcdFx0XHRcdGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsXG5cdFx0XHRcdFx0b3ZlcmZsb3c6IFwiaGlkZGVuXCIsXG5cdFx0XHRcdH19XG5cdFx0XHQ+XG5cdFx0XHRcdHsvKiBLb3BmemVpbGUgKi99XG5cdFx0XHRcdDxCb3hcblx0XHRcdFx0XHRzeD17e1xuXHRcdFx0XHRcdFx0Ym9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCB2YXIoLS1tdWktcGFsZXR0ZS1kaXZpZGVyKVwiLFxuXHRcdFx0XHRcdFx0ZGlzcGxheTogXCJmbGV4XCIsXG5cdFx0XHRcdFx0XHRmbGV4OiBcIjAgMCBhdXRvXCIsXG5cdFx0XHRcdFx0XHRwOiAyLFxuXHRcdFx0XHRcdH19XG5cdFx0XHRcdD5cblx0XHRcdFx0XHQ8U3RhY2sgZGlyZWN0aW9uPVwicm93XCIgc3BhY2luZz17MX0gc3g9e3sgZmxleDogXCIxIDEgYXV0b1wiIH19PlxuXHRcdFx0XHRcdFx0PEljb25CdXR0b24gb25DbGljaz17aGFuZGxlU2lkZWJhck9wZW59IHN4PXt7IGRpc3BsYXk6IHsgbWQ6IFwibm9uZVwiIH0gfX0+XG5cdFx0XHRcdFx0XHRcdDxMaXN0SWNvbiAvPlxuXHRcdFx0XHRcdFx0PC9JY29uQnV0dG9uPlxuXHRcdFx0XHRcdDwvU3RhY2s+XG5cdFx0XHRcdFx0PFN0YWNrIGRpcmVjdGlvbj1cInJvd1wiIHNwYWNpbmc9ezF9PlxuXHRcdFx0XHRcdFx0PEljb25CdXR0b24+XG5cdFx0XHRcdFx0XHRcdDxEb3RzVGhyZWVJY29uIHdlaWdodD1cImJvbGRcIiAvPlxuXHRcdFx0XHRcdFx0PC9JY29uQnV0dG9uPlxuXHRcdFx0XHRcdDwvU3RhY2s+XG5cdFx0XHRcdDwvQm94PlxuXG5cdFx0XHRcdHsvKiBORVU6IEhpZXIga29tbXQgZGllIFwiWm9uZW5cIi1UYWJlbGxlICovfVxuXHRcdFx0XHQ8Qm94IHN4PXt7IGZsZXg6IFwiMSAxIGF1dG9cIiwgcDogMyB9fT5cblx0XHRcdFx0XHQ8Wm9uZXNQYWdlQ2xpZW50IC8+XG5cdFx0XHRcdDwvQm94PlxuXHRcdFx0PC9Cb3g+XG5cdFx0PC9Cb3g+XG5cdCk7XG59XG4iXSwibmFtZXMiOlsiUmVhY3QiLCJCb3giLCJJY29uQnV0dG9uIiwiU3RhY2siLCJEb3RzVGhyZWUiLCJEb3RzVGhyZWVJY29uIiwiTGlzdCIsIkxpc3RJY29uIiwiU2lkZWJhciIsIlpvbmVzUGFnZUNsaWVudCIsIkNhdGVnb3JpZXNWaWV3IiwiY2F0ZWdvcmllcyIsIm9wZW5TaWRlYmFyIiwic2V0T3BlblNpZGViYXIiLCJ1c2VTdGF0ZSIsInNlbGVjdGVkQ2F0SWQiLCJzZXRTZWxlY3RlZENhdElkIiwiaGFuZGxlU2lkZWJhck9wZW4iLCJ1c2VDYWxsYmFjayIsImhhbmRsZVNpZGViYXJDbG9zZSIsImhhbmRsZUNhdGVnb3J5U2VsZWN0IiwiY2F0SWQiLCJzeCIsImRpc3BsYXkiLCJmbGV4IiwibWluSGVpZ2h0Iiwib25TZWxlY3RDYXRlZ29yeSIsIm9wZW4iLCJvbkNsb3NlIiwiZmxleERpcmVjdGlvbiIsIm92ZXJmbG93IiwiYm9yZGVyQm90dG9tIiwicCIsImRpcmVjdGlvbiIsInNwYWNpbmciLCJvbkNsaWNrIiwibWQiLCJ3ZWlnaHQiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/components/dashboard/categories/categories-view.tsx\n"));

/***/ })

});