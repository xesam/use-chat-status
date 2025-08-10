# 测试文件命名规范

## 📁 目录结构

```
test/
├── core.*.test.js          # 框架无关的核心功能测试
├── core.*.test.ts          # 框架无关的核心功能测试（TypeScript）
├── react.*.test.ts         # React 相关测试
├── *.runner.js            # 测试运行器
└── setup.ts               # 测试配置
```

## 🎯 文件分类

### 核心功能测试（框架无关）
- `core.parser.test.js` - 状态树解析基础功能测试
- `core.comprehensive.test.js` - 状态树解析综合测试（性能、边界情况）
- `core.statusParser.test.ts` - 状态解析器的 TypeScript 测试
- `core.runner.js` - 核心测试统一运行器

### React 相关测试
- `react.hook.test.ts` - useChatStatus Hook 功能测试
- `react.integration.test.ts` - React 集成测试
- `react.edge-cases.test.ts` - React 边界情况测试
- `react.examples.test.ts` - React 使用示例测试

### 其他文件
- `setup.ts` - Jest 测试环境配置
- `manual-validation.js` - 手动验证脚本

## 🚀 使用方式

### 运行框架无关的核心测试
```bash
npm run test:core
```

### 运行 React 相关测试（待修复 Jest 配置）
```bash
npm run test:react
```

### 运行所有测试
```bash
npm test
```

## 📋 命名规范

- **core.** 前缀：框架无关的核心功能
- **react.** 前缀：React 相关功能
- ***.test.js**：JavaScript 测试文件
- ***.test.ts**：TypeScript 测试文件
- ***.runner.js**：测试运行器脚本