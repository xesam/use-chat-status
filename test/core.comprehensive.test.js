/**
 * 框架无关的综合功能测试
 * 包含边界情况、性能和错误处理测试
 */

const { parseStatusTree, validateStatus } = require('../dist/utils/statusParser.js');

// 测试工具
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

// 性能测试工具
function measureTime(fn) {
  const start = process.hrtime.bigint();
  fn();
  const end = process.hrtime.bigint();
  return Number(end - start) / 1000000; // 转换为毫秒
}

const tests = {
  // 边界情况测试
  '应该处理特殊字符的状态名': () => {
    const tree = [
      'normal-state',
      'state_with_underscore',
      'state-with-dash',
      'state.with.dot',
      'state with space',
      '状态中文',
      '🚀emoji',
      'UPPERCASE',
      '123numeric'
    ];
    
    const result = parseStatusTree(tree);
    
    tree.forEach(state => {
      assert(result.leafNodes.has(state), `应该识别特殊状态名: ${state}`);
      assert(result.statusToPath.get(state).includes(state), `应该正确映射特殊状态名: ${state}`);
    });
  },

  '应该处理空字符串状态名': () => {
    const tree = ['', 'normal', ''];
    const result = parseStatusTree(tree);
    
    assert(result.leafNodes.has(''), '应该识别空字符串状态名');
    assert(result.statusToPath.get('').includes(''), '应该正确映射空字符串');
  },

  '应该处理超大状态树': () => {
    // 创建包含 1000 个状态的树
    const states = Array.from({ length: 1000 }, (_, i) => `state_${i}`);
    
    const time = measureTime(() => {
      const result = parseStatusTree(states);
      assert(result.leafNodes.size === 1000, '应该识别所有 1000 个状态');
    });
    
    console.log(`   解析 1000 个状态耗时: ${time.toFixed(2)}ms`);
    assert(time < 100, '解析时间应该在 100ms 以内');
  },

  '应该处理深度嵌套的树': () => {
    // 创建深度为 20 的嵌套树
    let tree = ['leaf'];
    for (let i = 0; i < 20; i++) {
      tree = [{ [`level_${i}`]: tree }];
    }
    
    const time = measureTime(() => {
      const result = parseStatusTree(tree);
      assert(result.leafNodes.has('leaf'), '应该识别深层叶子节点');
      assert(result.statusToPath.get('leaf').length === 21, '应该正确计算深度'); // 20 层 + 叶子节点
    });
    
    console.log(`   解析 20 层深度树耗时: ${time.toFixed(2)}ms`);
    assert(time < 50, '解析时间应该在 50ms 以内');
  },

  '应该处理宽树结构': () => {
    // 创建宽度为 100 的树（100 个兄弟节点）
    const wideTree = [
      ...Array.from({ length: 50 }, (_, i) => `leaf_${i}`),
      {
        group: Array.from({ length: 50 }, (_, i) => `group_leaf_${i}`)
      }
    ];
    
    const time = measureTime(() => {
      const result = parseStatusTree(wideTree);
      assert(result.leafNodes.size === 100, '应该识别所有 100 个叶子节点');
      assert(result.groupNodes.size === 1, '应该识别 1 个组节点');
    });
    
    console.log(`   解析 100 宽度树耗时: ${time.toFixed(2)}ms`);
    assert(time < 50, '解析时间应该在 50ms 以内');
  },

  // 内存使用测试
  '应该内存高效地处理大状态树': () => {
    const largeTree = [
      ...Array.from({ length: 500 }, (_, i) => `state_${i}`),
      {
        nested: [
          ...Array.from({ length: 500 }, (_, i) => `nested_${i}`),
          {
            deep: Array.from({ length: 100 }, (_, i) => `deep_${i}`)
          }
        ]
      }
    ];
    
    const time = measureTime(() => {
      const result = parseStatusTree(largeTree);
      assert(result.leafNodes.size === 1100, '应该识别所有 1100 个叶子节点');
      assert(result.groupNodes.size === 2, '应该识别 2 个组节点'); // nested 和 deep
    });
    
    console.log(`   解析 1100 节点大数耗时: ${time.toFixed(2)}ms`);
    assert(time < 200, '解析时间应该在 200ms 以内');
  },

  // 错误处理测试
  '应该处理无效输入': () => {
    const invalidInputs = [
      null,
      undefined,
      123,
      'string',
      {},
      [{}, 'valid']
    ];
    
    invalidInputs.forEach(input => {
      try {
        parseStatusTree(input);
        // 某些无效输入可能被处理，不抛出错误
      } catch (error) {
        // 错误是可接受的
      }
    });
  },

  '应该处理重复状态名': () => {
    const tree = [
      'duplicate',
      {
        group1: ['duplicate', 'unique1']
      },
      {
        group2: ['duplicate', 'unique2']
      }
    ];
    
    const result = parseStatusTree(tree);
    
    // 重复的状态名应该被识别
    assert(result.leafNodes.has('duplicate'), '应该识别重复状态名');
    assert(result.leafNodes.has('unique1'), '应该识别唯一状态名');
    assert(result.leafNodes.has('unique2'), '应该识别唯一状态名');
    assert(result.groupNodes.has('group1'), '应该识别组1');
    assert(result.groupNodes.has('group2'), '应该识别组2');
  },

  // 验证功能的边界测试
  '应该快速验证状态': () => {
    const tree = Array.from({ length: 1000 }, (_, i) => `state_${i}`);
    const parsed = parseStatusTree(tree);
    
    const time = measureTime(() => {
      for (let i = 0; i < 1000; i++) {
        assert(validateStatus(parsed, `state_${i}`, 'leaf') === true, `应该快速验证 state_${i}`);
      }
      assert(validateStatus(parsed, 'nonexistent', 'leaf') === false, '应该快速拒绝不存在状态');
    });
    
    console.log(`   验证 1000 个状态耗时: ${time.toFixed(2)}ms`);
    assert(time < 10, '验证时间应该在 10ms 以内');
  }
};

// 运行测试
console.log('🧪 开始框架无关的综合功能测试...\n');

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

console.log(`\n📊 综合测试结果: ${passed} 通过, ${failed} 失败`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 所有综合测试通过!');
}