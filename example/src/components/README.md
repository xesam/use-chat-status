# useChatStatus 演示组件

这个目录包含了展示 `useChatStatus` Hook 功能的 React 组件。

## 组件列表

### 1. SimpleChatDemo.tsx
**功能**: 展示基本的状态管理功能
- 使用简单的状态树：['offline', 'connecting', 'online', 'busy', 'away']
- 展示 `is()` 和 `to()` 方法的基本用法
- 适合初学者理解 Hook 的基本概念

### 2. ChatStatusDemo.tsx
**功能**: 展示复杂的状态树结构和高级功能
- 使用嵌套状态组结构
- 展示 `inGroup()` 方法的使用
- 包含状态颜色编码和中文翻译
- 展示完整的状态树可视化

## 使用方法

### 在组件中导入
```typescript
import { useChatStatus } from '../use-chat-status';
```

### 定义状态树
```typescript
const statusTree = [
  'idle',
  'connecting',
  {
    chatting: [
      'listening',
      'thinking',
      'responding'
    ]
  }
];
```

### 使用 Hook
```typescript
const { currentStatus, is, inGroup, to } = useChatStatus(statusTree);

// 检查状态
if (is('online')) {
  // 处理在线状态
}

// 检查组状态
if (inGroup('chatting')) {
  // 处理对话中的状态
}

// 切换状态
to('thinking');
```

## 运行示例

1. 确保已安装依赖：
   ```bash
   pnpm install
   ```

2. 启动开发服务器：
   ```bash
   pnpm dev
   ```

3. 在浏览器中访问 `http://localhost:5173`

4. 使用页面上的切换按钮在简单演示和高级演示之间切换