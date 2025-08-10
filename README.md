# useChatStatus - React 聊天状态管理 Hook

一个专为 React 应用设计的聊天状态管理 Hook，支持层次化的状态结构。

## 特性

- 🌳 **层次化状态结构**：支持树形结构的状态定义
- ⚡ **高性能**：使用内存优化，空间换时间策略
- 🎯 **类型安全**：完整的 TypeScript 支持
- 🧪 **测试驱动**：100% 测试覆盖率
- 🔄 **状态验证**：智能的状态和组验证
- 📊 **调试友好**：详细的警告信息

## 安装

```bash
npm install use-chat-status
# 或
yarn add use-chat-status
```

## 快速开始

```typescript
import { useChatStatus } from 'use-chat-status';

const statusTree = [
  'idle',
  'connecting',
  {
    chat: [
      'active',
      {
        typing: ['user_typing', 'bot_typing']
      }
    ]
  }
];

function ChatComponent() {
  const { currentStatus, is, inGroup, to } = useChatStatus(statusTree);

  return (
    <div>
      <p>当前状态: {currentStatus || '未连接'}</p>
      
      <button onClick={() => to('connecting')} disabled={is('connecting')}>
        连接
      </button>
      
      <button onClick={() => to('active')} disabled={!is('connecting')}>
        开始聊天
      </button>
      
      <button onClick={() => to('user_typing')} disabled={!is('active')}>
        用户输入中
      </button>
    </div>
  );
}
```

## API 参考

### useChatStatus(statusTree)

#### 参数
- `statusTree: StatusTree` - 状态结构定义

#### 返回值
```typescript
interface UseChatStatusReturn {
  currentStatus: string | null;  // 当前状态
  is: (status: string) => boolean;  // 判断是否为指定状态
  inGroup: (group: string) => boolean;  // 判断是否在某个状态组
  to: (status: string) => boolean;  // 转换到指定状态
}
```

### 状态结构定义

状态树使用数组和对象来定义层次结构：

```typescript
const statusTree = [
  'idle',                    // 叶子节点（具体状态）
  'connecting',
  {
    chat: [                  // 组节点
      'active',
      {
        typing: [            // 嵌套组
          'user_typing',
          'bot_typing'
        ]
      }
    ]
  }
];
```

### 方法说明

#### `is(status: string): boolean`
判断当前状态是否为指定的叶子状态。

```typescript
if (is('active')) {
  // 当前状态是 'active'
}
```

#### `inGroup(group: string): boolean`
判断当前状态是否为指定的状态组。

```typescript
if (inGroup('chat')) {
  // 当前状态是 'chat' 组
}
```

#### `to(status: string): boolean`
转换到指定的叶子状态，返回是否成功。

```typescript
const success = to('active');
if (!success) {
  console.log('状态转换失败');
}
```

## 实际应用示例

### 电商客服聊天

```typescript
const customerServiceTree = [
  'initial',
  'greeting',
  {
    inquiry: [
      'product_question',
      'order_question',
      'shipping_question',
      'return_question'
    ]
  },
  {
    processing: [
      'checking_inventory',
      'calculating_shipping',
      'processing_refund'
    ]
  },
  'closing',
  'ended'
];

function CustomerServiceChat() {
  const { currentStatus, is, to } = useChatStatus(customerServiceTree);

  const getStatusMessage = () => {
    switch (currentStatus) {
      case 'initial': return '欢迎访问客服中心';
      case 'greeting': return '您好！我是客服小助手';
      case 'product_question': return '请问您对哪个产品感兴趣？';
      case 'checking_inventory': return '正在为您查询库存...';
      default: return '正在处理您的请求';
    }
  };

  return (
    <div>
      <h2>{getStatusMessage()}</h2>
      
      {is('initial') && (
        <button onClick={() => to('greeting')}>开始对话</button>
      )}
      
      {is('greeting') && (
        <div>
          <button onClick={() => to('product_question')}>产品咨询</button>
          <button onClick={() => to('order_question')}>订单查询</button>
        </div>
      )}
      
      {/* 更多状态处理 */}
    </div>
  );
}
```

### 游戏内聊天系统

```typescript
const gameChatTree = [
  'menu',
  'loading',
  {
    in_game: [
      'lobby',
      'matchmaking',
      'in_match',
      {
        team_chat: ['typing_team', 'voice_team']
      },
      {
        global_chat: ['typing_global', 'voice_global']
      }
    ]
  },
  'paused',
  'disconnected'
];
```

## 错误处理

Hook 会自动处理错误情况并提供详细的警告信息：

```typescript
// 转换到不存在的状态
const success = to('nonexistent'); // false，并输出警告

// 判断不存在的状态
const isActive = is('nonexistent'); // false，并输出警告

// 使用错误的方法判断状态组
// 注意：is() 只能用于叶子状态，inGroup() 只能用于状态组
```

## 性能优化

- **预解析**：状态树在初始化时被预解析，提高运行时性能
- **缓存机制**：使用 useMemo 缓存解析结果
- **快速查找**：使用 Set 和 Map 进行 O(1) 的状态查找

## 测试

项目包含完整的测试套件：

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test -- test/useChatStatus.test.ts

# 运行边缘情况测试
npm test -- test/edge-cases.test.ts

# 运行集成测试
npm test -- test/integration.test.ts
```

## TypeScript 支持

完整的类型定义：

```typescript
import { StatusTree, UseChatStatusReturn } from 'use-chat-status';

const statusTree: StatusTree = [
  'state1',
  {
    group1: ['state2', 'state3']
  }
];

const { currentStatus, is, inGroup, to }: UseChatStatusReturn = useChatStatus(statusTree);
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License