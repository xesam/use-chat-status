/**
 * 框架无关的核心功能测试
 * 测试状态树解析和验证功能
 */

// 直接引入核心模块
const { parseStatusTree, validateStatus } = require('../dist/utils/statusParser.js');

// 简单的断言工具
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function deepEqual(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${message || 'Deep equal failed'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

// 测试用例
const tests = {
  // 测试状态树解析
  '应该正确解析简单状态树': () => {
    const tree = ['idle', 'connecting', 'active'];
    const result = parseStatusTree(tree);
    
    assert(result.leafNodes instanceof Set, 'leafNodes 应该是 Set');
    assert(result.groupNodes instanceof Set, 'groupNodes 应该是 Set');
    assert(result.statusToPath instanceof Map, 'statusToPath 应该是 Map');
    assert(result.groupToPath instanceof Map, 'groupToPath 应该是 Map');
    
    deepEqual([...result.leafNodes], ['idle', 'connecting', 'active'], '叶子节点应该正确识别');
    deepEqual([...result.groupNodes], [], '组节点应该为空');
  },

  '应该正确解析嵌套状态树': () => {
    const tree = [
      'idle',
      {
        chat: [
          'active',
          {
            typing: ['user_typing', 'bot_typing']
          }
        ]
      }
    ];
    
    const result = parseStatusTree(tree);
    
    deepEqual(
      [...result.leafNodes].sort(), 
      ['idle', 'active', 'user_typing', 'bot_typing'].sort(), 
      '所有叶子节点应该被识别'
    );
    
    deepEqual(
      [...result.groupNodes].sort(),
      ['chat', 'typing'].sort(),
      '所有组节点应该被识别'
    );
    
    deepEqual(
      result.statusToPath.get('user_typing'),
      ['chat', 'typing', 'user_typing'],
      '状态路径应该正确'
    );
  },

  '应该正确处理空树': () => {
    const result = parseStatusTree([]);
    
    deepEqual([...result.leafNodes], [], '空树应该没有叶子节点');
    deepEqual([...result.groupNodes], [], '空树应该没有组节点');
    assert(result.statusToPath.size === 0, '空树应该没有状态映射');
    assert(result.groupToPath.size === 0, '空树应该没有组映射');
  },

  // 测试状态验证
  '应该正确验证存在的叶子状态': () => {
    const tree = ['idle', { chat: ['active'] }];
    const parsed = parseStatusTree(tree);
    
    assert(validateStatus(parsed, 'idle', 'leaf') === true, '存在的叶子状态应该验证通过');
    assert(validateStatus(parsed, 'active', 'leaf') === true, '嵌套的叶子状态应该验证通过');
    assert(validateStatus(parsed, 'chat', 'leaf') === false, '组状态验证为叶子应该失败');
  },

  '应该正确验证存在的组状态': () => {
    const tree = ['idle', { chat: ['active'] }];
    const parsed = parseStatusTree(tree);
    
    assert(validateStatus(parsed, 'chat', 'group') === true, '存在的组状态应该验证通过');
    assert(validateStatus(parsed, 'idle', 'group') === false, '叶子状态验证为组应该失败');
  },

  '应该拒绝不存在的状态': () => {
    const tree = ['idle', { chat: ['active'] }];
    const parsed = parseStatusTree(tree);
    
    assert(validateStatus(parsed, 'nonexistent', 'leaf') === false, '不存在的叶子状态应该验证失败');
    assert(validateStatus(parsed, 'nonexistent', 'group') === false, '不存在的组状态应该验证失败');
  },

  '应该处理深度嵌套': () => {
    const tree = [
      {
        level1: [
          {
            level2: [
              {
                level3: ['deep_state']
              }
            ]
          }
        ]
      }
    ];
    
    const result = parseStatusTree(tree);
    
    deepEqual(
      result.statusToPath.get('deep_state'),
      ['level1', 'level2', 'level3', 'deep_state'],
      '深度嵌套的状态路径应该正确'
    );
    
    deepEqual(
      [...result.groupNodes].sort(),
      ['level1', 'level2', 'level3'].sort(),
      '所有层级的组节点都应该被识别'
    );
  },

  '应该处理重复状态名': () => {
    const tree = [
      'state1',
      {
        group1: ['state1', 'state2']
      }
    ];
    
    const result = parseStatusTree(tree);
    
    // 状态名重复时，应该都能被识别
    assert(result.leafNodes.has('state1'), '重复的状态名应该被识别');
    assert(result.leafNodes.has('state2'), '状态应该被识别');
    assert(result.groupNodes.has('group1'), '组应该被识别');
  }
};

// 运行测试
console.log('🧪 开始框架无关的核心功能测试...\n');

let passed = 0;
let failed = 0;

for (const [testName, testFn] of Object.entries(tests)) {
  try {
    testFn();
    console.log(`✅ ${testName}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${testName}`);
    console.log(`   ${error.message}`);
    failed++;
  }
}

console.log(`\n📊 测试结果: ${passed} 通过, ${failed} 失败`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 所有测试通过!');
}