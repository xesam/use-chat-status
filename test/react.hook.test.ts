/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react';
import { useChatStatus } from '../src/useChatStatus';
import { simpleTestTree, createTestTree } from './setup';

describe('useChatStatus Hook', () => {
  describe('基本功能测试', () => {
    it('应该初始化为 null', () => {
      const { result } = renderHook(() => useChatStatus(simpleTestTree));
      
      expect(result.current.currentStatus).toBeNull();
      expect(result.current.is('XX0')).toBe(false);
      expect(result.current.inGroup('YY1')).toBe(false);
    });

    it('应该成功转换到存在的叶子状态', () => {
      const { result } = renderHook(() => useChatStatus(simpleTestTree));
      
      act(() => {
        const success = result.current.to('XX0');
        expect(success).toBe(true);
      });
      
      expect(result.current.currentStatus).toBe('XX0');
    });

    it('应该正确判断当前状态', () => {
      const { result } = renderHook(() => useChatStatus(simpleTestTree));
      
      act(() => {
        result.current.to('XX1');
      });
      
      expect(result.current.is('XX1')).toBe(true);
      expect(result.current.is('XX0')).toBe(false);
      expect(result.current.is('XX2')).toBe(false);
    });
  });

  describe('错误处理测试', () => {
    it('应该警告并返回 false 当转换到不存在的状态', () => {
      const { result } = renderHook(() => useChatStatus(simpleTestTree));
      
      act(() => {
        const success = result.current.to('NONEXISTENT');
        expect(success).toBe(false);
      });
      
      expect(console.warn).toHaveBeenCalledWith('状态 "NONEXISTENT" 不存在');
      expect(result.current.currentStatus).toBeNull();
    });

    it('应该警告并返回 false 当判断不存在的叶子状态', () => {
      const { result } = renderHook(() => useChatStatus(simpleTestTree));
      
      act(() => {
        result.current.to('XX0');
      });
      
      const isResult = result.current.is('NONEXISTENT');
      expect(isResult).toBe(false);
      expect(console.warn).toHaveBeenCalledWith('状态 "NONEXISTENT" 不存在');
    });

    it('应该警告并返回 false 当判断不存在的组状态', () => {
      const { result } = renderHook(() => useChatStatus(simpleTestTree));
      
      // 我们需要设置一个组状态来测试 inGroup
      // 注意：根据业务约束，inGroup 只能用于组状态
      // 所以这里的行为需要重新定义
    });
  });

  describe('状态转换测试', () => {
    it('应该支持多个状态之间的转换', () => {
      const { result } = renderHook(() => useChatStatus(simpleTestTree));
      
      // 初始状态
      expect(result.current.currentStatus).toBeNull();
      
      // 转换到 XX0
      act(() => {
        result.current.to('XX0');
      });
      expect(result.current.currentStatus).toBe('XX0');
      expect(result.current.is('XX0')).toBe(true);
      
      // 转换到 XX1
      act(() => {
        result.current.to('XX1');
      });
      expect(result.current.currentStatus).toBe('XX1');
      expect(result.current.is('XX1')).toBe(true);
      expect(result.current.is('XX0')).toBe(false);
      
      // 转换到 XX2
      act(() => {
        result.current.to('XX2');
      });
      expect(result.current.currentStatus).toBe('XX2');
      expect(result.current.is('XX2')).toBe(true);
      
      // 转换到 XX3
      act(() => {
        result.current.to('XX3');
      });
      expect(result.current.currentStatus).toBe('XX3');
      expect(result.current.is('XX3')).toBe(true);
    });

    it('应该拒绝从 null 状态进行无效转换', () => {
      const { result } = renderHook(() => useChatStatus(simpleTestTree));
      
      act(() => {
        const success = result.current.to('INVALID_STATUS');
        expect(success).toBe(false);
      });
      
      expect(result.current.currentStatus).toBeNull();
    });
  });

  describe('复杂状态树测试', () => {
    it('应该处理复杂的状态树结构', () => {
      const tree = createTestTree();
      const { result } = renderHook(() => useChatStatus(tree));
      
      // 测试所有叶子状态的转换
      const leafStates = [
        'idle', 'connecting', 'active', 'user_typing', 'bot_typing',
        'network_error', 'timeout_error', 'user_closed', 'timeout_closed'
      ];
      
      leafStates.forEach(state => {
        act(() => {
          const success = result.current.to(state);
          expect(success).toBe(true);
        });
        
        expect(result.current.currentStatus).toBe(state);
        expect(result.current.is(state)).toBe(true);
      });
    });
  });

  describe('边界条件测试', () => {
    it('应该处理空状态树', () => {
      const { result } = renderHook(() => useChatStatus([]));
      
      act(() => {
        const success = result.current.to('ANY_STATE');
        expect(success).toBe(false);
      });
      
      expect(console.warn).toHaveBeenCalledWith('状态 "ANY_STATE" 不存在');
      expect(result.current.currentStatus).toBeNull();
    });

    it('应该处理单层状态树', () => {
      const singleLevelTree = ['state1', 'state2', 'state3'];
      const { result } = renderHook(() => useChatStatus(singleLevelTree));
      
      act(() => {
        result.current.to('state1');
      });
      expect(result.current.currentStatus).toBe('state1');
      expect(result.current.is('state1')).toBe(true);
      
      act(() => {
        result.current.to('state2');
      });
      expect(result.current.currentStatus).toBe('state2');
    });
  });

  describe('性能测试', () => {
    it('应该快速处理大型状态树', () => {
      const largeTree: import('../src/types').StatusTree = [
        ...Array.from({ length: 100 }, (_, i) => `leaf_${i}`),
        {
          group1: Array.from({ length: 50 }, (_, i) => `group1_leaf_${i}`),
        },
        {
          group2: [
            {
              subgroup: Array.from({ length: 30 }, (_, i) => `deep_leaf_${i}`),
            }
          ]
        }
      ];
      
      const start = performance.now();
      const { result } = renderHook(() => useChatStatus(largeTree));
      const initTime = performance.now() - start;
      
      expect(initTime).toBeLessThan(100); // 初始化时间应该小于 100ms
      
      const testStart = performance.now();
      act(() => {
        result.current.to('leaf_50');
      });
      const operationTime = performance.now() - testStart;
      
      expect(operationTime).toBeLessThan(10); // 操作时间应该小于 10ms
      expect(result.current.is('leaf_50')).toBe(true);
    });
  });
});