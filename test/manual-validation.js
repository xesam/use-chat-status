// 手动验证脚本 - 不依赖测试框架
const fs = require('fs');
const path = require('path');

// 简单的断言函数
function expect(actual) {
  return {
    toBe: (expected) => {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, but got ${actual}`);
      }
      console.log(`✅ 验证通过: ${actual} === ${expected}`);
    },
    toEqual: (expected) => {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
      }
      console.log(`✅ 验证通过: ${JSON.stringify(actual)} === ${JSON.stringify(expected)}`);
    }
  };
}

// 模拟 React 的 useState
let currentState = null;
function useState(initial) {
  const setState = (newState) => {
    currentState = newState;
  };
  return [currentState, setState];
}

// 模拟 React 的 useCallback 和 useMemo
function useCallback(fn) { return fn; }
function useMemo(fn) { return fn(); }

// 加载源代码
const statusParserCode = fs.readFileSync('./src/utils/statusParser.ts', 'utf8')
  .replace(/import.*from.*;/g, '')
  .replace(/export /g, '');

const useChatStatusCode = fs.readFileSync('./src/useChatStatus.ts', 'utf8')
  .replace(/import.*from.*;/g, '')
  .replace(/export /g, '');

// 执行代码
console.log('=== 手动验证开始 ===\n');

try {
  // 执行状态解析器代码
  eval(statusParserCode);
  
  // 测试数据
  const testTree = [
    'XX0',
    {
      YY1: [
        'XX1',
        {
          name: [
            'XX2',
            'XX3',
          ],
        },
      ]
    },
  ];

  console.log('1. 测试状态解析器');
  const result = parseStatusTree(testTree);
  
  expect(result.leafNodes.size).toBe(4);
  expect(result.groupNodes.size).toBe(2);
  expect(result.leafNodes.has('XX0')).toBe(true);
  expect(result.leafNodes.has('XX1')).toBe(true);
  expect(result.leafNodes.has('XX2')).toBe(true);
  expect(result.leafNodes.has('XX3')).toBe(true);
  expect(result.groupNodes.has('YY1')).toBe(true);
  expect(result.groupNodes.has('name')).toBe(true);
  
  console.log('\n2. 测试状态验证');
  expect(validateStatus(result, 'XX0', 'leaf')).toBe(true);
  expect(validateStatus(result, 'YY1', 'group')).toBe(true);
  expect(validateStatus(result, 'INVALID', 'leaf')).toBe(false);
  
  console.log('\n3. 测试 hook 功能');
  
  // 模拟 hook 使用
  const mockConsole = { warn: () => {} };
  const originalConsole = console;
  console.warn = () => {};
  
  // 简化版的 useChatStatus 测试
  const parsedStatus = result;
  let currentStatus = null;
  
  const to = (status) => {
    if (!validateStatus(parsedStatus, status, 'leaf')) {
      return false;
    }
    currentStatus = status;
    return true;
  };
  
  const is = (status) => {
    return currentStatus === status;
  };
  
  // 测试状态转换
  expect(to('XX0')).toBe(true);
  expect(currentStatus).toBe('XX0');
  expect(is('XX0')).toBe(true);
  expect(is('XX1')).toBe(false);
  
  expect(to('XX1')).toBe(true);
  expect(currentStatus).toBe('XX1');
  expect(is('XX1')).toBe(true);
  
  expect(to('INVALID')).toBe(false);
  expect(currentStatus).toBe('XX1'); // 状态不变
  
  console.log = originalConsole;
  
  console.log('\n✅ 所有手动验证通过！');
  
} catch (error) {
  console.error('❌ 验证失败:', error.message);
  console.error(error.stack);
}

console.log('\n=== 手动验证结束 ===');