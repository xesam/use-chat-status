/**
 * @jest-environment jsdom
 */

import { renderHook } from '@testing-library/react';
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

describe('初始状态功能测试', () => {
  it('应该接受有效的初始状态', () => {
    const { result } = renderHook(() => 
      useChatStatus(testTree, 'idle')
    );
    
    expect(result.current.currentStatus).toBe('idle');
  });

  it('应该接受有效的初始状态为对话状态', () => {
    const { result } = renderHook(() => 
      useChatStatus(testTree, 'listening')
    );
    
    expect(result.current.currentStatus).toBe('listening');
  });

  it('应该警告并忽略无效的初始状态', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    const { result } = renderHook(() => 
      useChatStatus(testTree, 'invalid' as any)
    );
    
    expect(result.current.currentStatus).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('初始状态 "invalid" 无效，将使用 null 作为初始状态');
    
    consoleSpy.mockRestore();
  });

  it('应该默认使用 null 作为初始状态', () => {
    const { result } = renderHook(() => useChatStatus(testTree));
    
    expect(result.current.currentStatus).toBeNull();
  });

  it('应该正确判断初始状态的组归属', () => {
    const { result } = renderHook(() => 
      useChatStatus(testTree, 'listening')
    );
    
    expect(result.current.inGroup('chatting')).toBe(true);
    expect(result.current.inGroup('error')).toBe(false);
  });

  it('应该正确判断初始状态的具体状态', () => {
    const { result } = renderHook(() => 
      useChatStatus(testTree, 'idle')
    );
    
    expect(result.current.is('idle')).toBe(true);
    expect(result.current.is('connecting')).toBe(false);
  });
});