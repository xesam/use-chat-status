/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react';
import { useChatStatus } from '../src/useChatStatus';

const testTree: import('../src/types').StatusTree = [
  'idle',
  'connecting',
  {
    chatting: [
      'listening',
      'thinking',
      'responding'
    ]
  },
  {
    error: [
      'network_error',
      'timeout_error',
      'api_error'
    ]
  }
];

describe('inGroup 功能测试', () => {
  it('应该正确判断状态是否属于指定组', () => {
    const { result } = renderHook(() => useChatStatus(testTree));

    // 测试 idle 状态 - 不属于任何组
    act(() => {
      result.current.to('idle');
    });
    expect(result.current.inGroup('chatting')).toBe(false);
    expect(result.current.inGroup('error')).toBe(false);

    // 测试 connecting 状态 - 不属于任何组
    act(() => {
      result.current.to('connecting');
    });
    expect(result.current.inGroup('chatting')).toBe(false);
    expect(result.current.inGroup('error')).toBe(false);

    // 测试 listening 状态 - 属于 chatting 组
    act(() => {
      result.current.to('listening');
    });
    expect(result.current.inGroup('chatting')).toBe(true);
    expect(result.current.inGroup('error')).toBe(false);

    // 测试 thinking 状态 - 属于 chatting 组
    act(() => {
      result.current.to('thinking');
    });
    expect(result.current.inGroup('chatting')).toBe(true);
    expect(result.current.inGroup('error')).toBe(false);

    // 测试 responding 状态 - 属于 chatting 组
    act(() => {
      result.current.to('responding');
    });
    expect(result.current.inGroup('chatting')).toBe(true);
    expect(result.current.inGroup('error')).toBe(false);

    // 测试 network_error 状态 - 属于 error 组
    act(() => {
      result.current.to('network_error');
    });
    expect(result.current.inGroup('chatting')).toBe(false);
    expect(result.current.inGroup('error')).toBe(true);

    // 测试 timeout_error 状态 - 属于 error 组
    act(() => {
      result.current.to('timeout_error');
    });
    expect(result.current.inGroup('chatting')).toBe(false);
    expect(result.current.inGroup('error')).toBe(true);

    // 测试 api_error 状态 - 属于 error 组
    act(() => {
      result.current.to('api_error');
    });
    expect(result.current.inGroup('chatting')).toBe(false);
    expect(result.current.inGroup('error')).toBe(true);
  });

  it('应该处理嵌套组的情况', () => {
    const nestedTree: import('../src/types').StatusTree = [
      {
        level1: [
          {
            level2: [
              'deep_state'
            ]
          }
        ]
      }
    ];

    const { result } = renderHook(() => useChatStatus(nestedTree));

    act(() => {
      result.current.to('deep_state');
    });
    
    expect(result.current.inGroup('level1')).toBe(true);
    expect(result.current.inGroup('level2')).toBe(true);
  });

  it('应该返回 false 当组不存在', () => {
    const { result } = renderHook(() => useChatStatus(testTree));

    act(() => {
      result.current.to('idle');
    });
    
    expect(result.current.inGroup('nonexistent')).toBe(false);
  });
});