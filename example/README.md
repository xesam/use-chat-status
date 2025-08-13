# useChatStatus 功能演示

这个示例项目展示了 `useChatStatus` React Hook 的各种功能和用法。

## 功能特性

### 1. 简单演示 (Simple Demo)
展示 `useChatStatus` 的基本用法：
- 基本状态管理
- 状态切换
- 状态检查

状态树：
```javascript
['offline', 'connecting', 'online', 'busy', 'away']
```

### 2. 高级演示 (Advanced Demo)
展示复杂的状态树结构：
- 嵌套状态组
- 状态分组检查
- 错误状态处理

状态树：
```javascript
[
  'idle',
  'connecting',
  {
    chatting: [
      'listening',
      'thinking',
      'responding',
      {
        error: [
          'network_error',
          'timeout_error',
          'api_error'
        ]
      }
    ]
  },
  'disconnected'
]
```

## 使用方法

### 安装依赖
```bash
pnpm install
```

### 启动开发服务器
```bash
pnpm dev
```

### 构建生产版本
```bash
pnpm build
```

## API 演示

### useChatStatus Hook
```typescript
const { currentStatus, is, inGroup, to } = useChatStatus(statusTree);
```

#### 返回值
- `currentStatus`: 当前状态字符串
- `is(status)`: 检查是否处于指定状态
- `inGroup(group)`: 检查是否处于指定状态组
- `to(status)`: 切换到指定状态

### 使用示例

#### 基本状态检查
```typescript
if (is('online')) {
  console.log('用户在线');
}

if (inGroup('chatting')) {
  console.log('正在对话中');
}
```

#### 状态切换
```typescript
// 切换到在线状态
to('online');

// 切换到思考状态
to('thinking');
```

## 开发

项目使用 Vite + React + TypeScript 构建，支持热重载。

### 文件结构
```
src/
├── components/
│   ├── SimpleChatDemo.tsx    # 简单演示组件
│   └── ChatStatusDemo.tsx    # 高级演示组件
├── App.tsx                   # 主应用组件
└── use-chat-status/          # useChatStatus 源码链接
```

---

## 原始模板信息

这个示例项目基于 Vite + React + TypeScript 模板创建。

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
