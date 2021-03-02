/**
 * "off" 或 0 - 关闭规则
 * "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
 * "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
 */
module.exports = {
    // 此项是用来告诉eslint找当前配置文件不能往父级查找
    root: true,
    // 环境配置
    env: {
        browser: true,
        node: true,
        es6: true,
        es2017:true
    },
    parserOptions: {
        // parser: 'babel-eslint',
        // sourceType: 'module'	// 指定来源的类型
    },
    overrides: [
        {
            env: {
                es6: false,
                es2017:false
            },
            parserOptions: {
                sourceType: 'script'
            },
            files: ['./public/**/*.js', './static/**/*.js'], // public目录采用另外的规则
            rules: {
                'no-var': 'off', // 禁用var，用let和const代替
                'no-undef': 'off', // 不能有未定义的变量
                'prefer-arrow-callback': 'off' // 要求回调函数使用箭头函数
            }
        }
    ],
    plugins: [],
    rules: {
        'new-cap': ['error', { 'capIsNew': false }],
        'arrow-spacing': 'error', // 强制箭头函数的箭头前后使用一致的空格
        'no-caller': 'warn', // 禁止使用arguments.caller或arguments.callee
        'no-catch-shadow': 'error', // 禁止catch子句参数与外部作用域变量同名
        'no-cond-assign': 'error', // 禁止在条件表达式中使用赋值语句
        'no-const-assign': 'error', // 禁止修改 const 声明的变量
        'no-dupe-keys': 'error', // 在创建对象字面量时不允许键重复 {a:1,a:1}
        'no-dupe-class-members': 'error', // 禁止类成员中出现重复的名称
        'no-duplicate-imports': 'error', // 禁止重复模块导入
        'no-delete-var': 'error', // 不能对var声明的变量使用delete操作符
        'no-dupe-args': 'error', // 函数参数不能重复
        'no-duplicate-case': 'error', // switch中的case标签不能重复
        'no-empty': 'warn', // todo 后续整改 块语句中的内容不能为空
        'no-empty-character-class': 'error', // 正则表达式中的[]内容不能为空
        'no-eval': 'warn', // 禁止使用eval
        'no-ex-assign': 'error', // 禁止给catch语句中的异常参数赋值
        'no-extra-bind': 'error', // 禁止不必要的函数绑定
        'no-extra-boolean-cast': 'error', // todo 待确认后台数据类型是否唯一 禁止不必要的bool转换
        'no-extra-parens': 'warn', // 禁止非必要的括号
        'no-extra-semi': 'error', // 禁止多余的冒号
        'no-floating-decimal': 'error', // 禁止省略浮点数中的0 .5 3.
        'no-func-assign': 'error', // 禁止重复的函数声明
        'no-implicit-coercion': 'warn', // 禁止隐式转换
        'no-implied-eval': 'error', // 禁止使用隐式eval
        'no-inner-declarations': ['error', 'functions'], // 禁止在块语句中使用声明（函数）
        'no-irregular-whitespace': 'error', // 不能有不规则的空格
        'no-multi-spaces': 'warn', // 不能用多余的空格
        'no-multiple-empty-lines': ['warn', { 'max': 2 }], // 空行最多不能超过2行
        'no-redeclare': 'error', // 禁止重复声明变量
        'no-self-compare': 'error', // 不能比较自身
        'no-shadow': 'warn', // 外部作用域中的变量不能与它所包含的作用域中的变量或参数同名
        'no-shadow-restricted-names': 'error', // 严格模式中规定的限制标识符不能作为声明时的变量名使用
        'no-spaced-func': 'error', // 函数调用时 函数名与()之间不能有空格
        'no-this-before-super': 'error', // 禁止在构造函数中，在调用 super() 之前使用 this 或 super
        'no-trailing-spaces': 'warn', // 一行结束后面不要有空格
        'no-undef': 'warn', // 不能有未定义的变量
        // 'no-undef-init': 'error', // 变量初始化时不能直接给它赋值为undefined
        'no-underscore-dangle': 'warn', // 标识符不能以_开头或结尾
        // 'no-unneeded-ternary': 'error', // 禁止不必要的嵌套 var isYes = answer === 1 ? true : false;
        'no-unreachable': 'error', // 不能有无法执行的代码
        // 'no-unused-expressions': 'warn', // 禁止无用的表达式
        'no-unused-vars': ['warn', { 'vars': 'all', 'args': 'after-used' }], // 不能有声明后未被使用的变量或参数
        'no-use-before-define': 'warn', // 未定义前不能使用
        'no-var': 'error', // 禁用var，用let和const代替
        // 'no-warning-comments': ['warn', {'terms': ['todo', 'fixme'], 'location': 'start'}], // 不能有警告备注
        'no-with': 'error', // 禁用with
        'array-bracket-spacing': ['error', 'never'], // 是否允许非空数组里面有多余的空格
        // 'brace-style': ['warn', '1tbs'], // 大括号风格
        'callback-return': 'warn', // 避免多次调用回调什么的
        'camelcase': 'warn', // 强制驼峰法命名
        'comma-dangle': ['warn', 'never'], // 对象字面量项尾不能有逗号
        'comma-spacing': 'warn', // 逗号前后的空格
        'comma-style': ['error', 'last'], // 逗号风格，换行时在行首还是行尾
        // 'complexity': ['off', 6], // 循环复杂度
        'consistent-this': ['warn', 'that'], // this别名
        'indent': ['error', 4, {
            'VariableDeclarator': 1,
            'SwitchCase': 1,
            'MemberExpression': 1
        }], // 缩进规则
        'key-spacing': ['off', { 'beforeColon': false, 'afterColon': true }], // 对象字面量中冒号的前后空格
        // 'new-cap': '["error", { "properties": false }]', // 函数名首行大写必须使用new方式调用，首行小写必须用不带new方式调用
        'new-parens': 'error', // new时必须加小括号
        'operator-linebreak': ['error', 'after'], // 换行时运算符在行尾还是行首
        'prefer-arrow-callback': 'warn', // 要求回调函数使用箭头函数
        'prefer-const': 'error', // 要求使用 const 声明那些声明后不再被修改的变量
        'prefer-rest-params': 'error', // 要求使用剩余参数而不是 arguments
        'quotes': ['warn', 'single'], // 引号类型 `` "" ''
        'id-match': 'off', // 命名检测
        'semi': ['error', 'always'], // 语句强制分号结尾
        'semi-spacing': ['warn', { 'before': false, 'after': true }], // 分号前后空格
        'spaced-comment': 'warn', // 注释风格要不要有空格什么的
        'use-isnan': 'error', // 禁止比较时使用NaN，只能用isNaN()
        'yoda': ['error', 'never'] // 禁止尤达条件
    }
};
