// module.exports = {
//     "env": {
//         "browser": true
//     },
//     "globals": {
//         "$": false,
//         "UI": false,
//         "tutorial": false,
//         "svg4everybody": false,
//         "RS": false,
//         "ChainInput": false
//     },
//     "extends": "eslint:recommended",
//     "rules": {
//         "accessor-pairs": [
//             "error",
//             {
//                 "getWithoutSet": false,
//                 "setWithoutGet": false
//             }
//         ],
//         "array-bracket-newline": "off",
//         "array-bracket-spacing": [
//             "error",
//             "never"
//         ],
//         "array-callback-return": "off",
//         "array-element-newline": "off",
//         "arrow-body-style": "error",
//         "arrow-parens": "error",
//         "arrow-spacing": "error",
//         "block-scoped-var": "off",
//         "block-spacing": "off",
//         "brace-style": "off",
//         "callback-return": "off",
//         "camelcase": "off",
//         "capitalized-comments": "off",
//         "class-methods-use-this": "error",
//         "comma-dangle": "error",
//         "comma-spacing": "off",
//         "comma-style": [
//             "error",
//             "last"
//         ],
//         "complexity": "off",
//         "computed-property-spacing": [
//             "error",
//             "never"
//         ],
//         "consistent-return": "off",
//         "consistent-this": "off",
//         "curly": "off",
//         "default-case": "off",
//         "dot-location": "error",
//         "dot-notation": "off",
//         "eol-last": "off",
//         "eqeqeq": "off",
//         "for-direction": "error",
//         "func-call-spacing": "error",
//         "func-name-matching": "error",
//         "func-names": [
//             "error",
//             "never"
//         ],
//         "func-style": "off",
//         "function-paren-newline": "off",
//         "generator-star-spacing": "error",
//         "getter-return": "off",
//         "global-require": "error",
//         "guard-for-in": "off",
//         "handle-callback-err": "error",
//         "id-blacklist": "error",
//         "id-length": "off",
//         "id-match": "error",
//         "indent": "off",
//         "indent-legacy": "off",
//         "init-declarations": "off",
//         "jsx-quotes": "error",
//         "key-spacing": "off",
//         "keyword-spacing": "off",
//         "line-comment-position": "off",
//         "linebreak-style": "off",
//         "lines-around-comment": "error",
//         "lines-around-directive": "off",
//         "lines-between-class-members": "error",
//         "max-depth": "off",
//         "max-len": "off",
//         "max-lines": "off",
//         "max-nested-callbacks": "error",
//         "max-params": "off",
//         "max-statements": "off",
//         "max-statements-per-line": "off",
//         "multiline-comment-style": "off",
//         "multiline-ternary": "off",
//         "new-parens": "off",
//         "newline-after-var": "off",
//         "newline-before-return": "off",
//         "newline-per-chained-call": "off",
//         "no-alert": "error",
//         "no-array-constructor": "error",
//         "no-await-in-loop": "error",
//         "no-bitwise": "off",
//         "no-buffer-constructor": "error",
//         "no-caller": "error",
//         "no-catch-shadow": "off",
//         "no-confusing-arrow": "error",
//         "no-continue": "off",
//         "no-div-regex": "error",
//         "no-duplicate-imports": "error",
//         "no-else-return": "error",
//         "no-empty-function": "off",
//         "no-eq-null": "off",
//         "no-eval": "off",
//         "no-extend-native": "off",
//         "no-extra-bind": "error",
//         "no-extra-label": "error",
//         "no-extra-parens": "off",
//         "no-floating-decimal": "off",
//         "no-implicit-coercion": [
//             "error",
//             {
//                 "boolean": false,
//                 "number": false,
//                 "string": false
//             }
//         ],
//         "no-implicit-globals": "off",
//         "no-implied-eval": "error",
//         "no-inline-comments": "off",
//         "no-inner-declarations": [
//             "error",
//             "functions"
//         ],
//         "no-invalid-this": "off",
//         "no-iterator": "error",
//         "no-label-var": "off",
//         "no-labels": "off",
//         "no-lone-blocks": "off",
//         "no-lonely-if": "error",
//         "no-loop-func": "off",
//         "no-magic-numbers": "off",
//         "no-mixed-operators": "off",
//         "no-mixed-requires": "error",
//         "no-multi-assign": "off",
//         "no-multi-spaces": [
//             "error",
//             {
//                 "ignoreEOLComments": true
//             }
//         ],
//         "no-multi-str": "off",
//         "no-multiple-empty-lines": "error",
//         "no-native-reassign": "error",
//         "no-negated-condition": "off",
//         "no-negated-in-lhs": "error",
//         "no-nested-ternary": "off",
//         "no-new": "off",
//         "no-new-func": "off",
//         "no-new-object": "error",
//         "no-new-require": "error",
//         "no-new-wrappers": "error",
//         "no-octal-escape": "error",
//         "no-param-reassign": "off",
//         "no-path-concat": "error",
//         "no-plusplus": "off",
//         "no-process-env": "error",
//         "no-process-exit": "error",
//         "no-proto": "error",
//         "no-prototype-builtins": "off",
//         "no-restricted-globals": "error",
//         "no-restricted-imports": "error",
//         "no-restricted-modules": "error",
//         "no-restricted-properties": "error",
//         "no-restricted-syntax": "error",
//         "no-return-assign": "off",
//         "no-return-await": "error",
//         "no-script-url": "off",
//         "no-self-assign": [
//             "error",
//             {
//                 "props": false
//             }
//         ],
//         "no-self-compare": "off",
//         "no-sequences": "off",
//         "no-shadow": "off",
//         "no-shadow-restricted-names": "error",
//         "no-spaced-func": "error",
//         "no-sync": "error",
//         "no-tabs": "error",
//         "no-template-curly-in-string": "error",
//         "no-ternary": "off",
//         "no-throw-literal": "off",
//         "no-trailing-spaces": "off",
//         "no-undef-init": "error",
//         "no-undefined": "off",
//         "no-underscore-dangle": "off",
//         "no-unmodified-loop-condition": "error",
//         "no-unneeded-ternary": [
//             "error",
//             {
//                 "defaultAssignment": true
//             }
//         ],
//         "no-unused-expressions": "off",
//         "no-use-before-define": "off",
//         "no-useless-call": "off",
//         "no-useless-computed-key": "error",
//         "no-useless-concat": "off",
//         "no-useless-constructor": "error",
//         "no-useless-rename": "error",
//         "no-useless-return": "error",
//         "no-var": "off",
//         "no-void": "off",
//         "no-warning-comments": "error",
//         "no-whitespace-before-property": "error",
//         "no-with": "error",
//         "nonblock-statement-body-position": [
//             "error",
//             "any"
//         ],
//         "object-curly-newline": "off",
//         "object-curly-spacing": "off",
//         "object-property-newline": "off",
//         "object-shorthand": "off",
//         "one-var": "off",
//         "one-var-declaration-per-line": "off",
//         "operator-assignment": [
//             "error",
//             "always"
//         ],
//         "operator-linebreak": [
//             "error",
//             "after"
//         ],
//         "padded-blocks": "off",
//         "padding-line-between-statements": "error",
//         "prefer-arrow-callback": "off",
//         "prefer-const": "error",
//         "prefer-destructuring": "off",
//         "prefer-numeric-literals": "error",
//         "prefer-promise-reject-errors": [
//             "error",
//             {
//                 "allowEmptyReject": true
//             }
//         ],
//         "prefer-reflect": "off",
//         "prefer-rest-params": "off",
//         "prefer-spread": "off",
//         "prefer-template": "off",
//         "quote-props": "off",
//         "quotes": ["error", "single"],
//         "radix": "off",
//         "require-await": "error",
//         "require-jsdoc": "off",
//         "rest-spread-spacing": "error",
//         "semi": "error",
//         "semi-spacing": "off",
//         "semi-style": [
//             "error",
//             "last"
//         ],
//         "sort-imports": "error",
//         "sort-keys": "off",
//         "sort-vars": "off",
//         "space-before-blocks": "off",
//         "space-before-function-paren": "off",
//         "space-in-parens": [
//             "error",
//             "never"
//         ],
//         "space-infix-ops": "off",
//         "space-unary-ops": [
//             "error",
//             {
//                 "nonwords": false,
//                 "words": false
//             }
//         ],
//         "spaced-comment": "off",
//         "strict": "off",
//         "switch-colon-spacing": [
//             "error",
//             {
//                 "after": false,
//                 "before": false
//             }
//         ],
//         "symbol-description": "error",
//         "template-curly-spacing": "error",
//         "template-tag-spacing": "error",
//         "unicode-bom": [
//             "error",
//             "never"
//         ],
//         "valid-jsdoc": "error",
//         "vars-on-top": "off",
//         "wrap-iife": "off",
//         "wrap-regex": "off",
//         "yield-star-spacing": "error",
//         "yoda": "off",
//         "no-console": 0
//     }
// };