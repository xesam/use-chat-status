/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react';
import { useChatStatus } from '../src/useChatStatus';

describe('Edge Cases', () => {
  describe('空和最小状态树', () => {
    it('应该处理空状态树', () => {
      const { result } = renderHook(() => useChatStatus([]));
      
      expect(result.current.currentStatus).toBeNull();
      
      act(() => {
        const success = result.current.to('any_state');
        expect(success).toBe(false);
      });
      
      expect(console.warn).toHaveBeenCalledWith('状态 "any_state" 不存在');
    });

    it('应该处理只有一个状态的状态树', () => {
      const { result } = renderHook(() => useChatStatus(['single_state']));
      
      expect(result.current.currentStatus).toBeNull();
      
      act(() => {
        const success = result.current.to('single_state');
        expect(success).toBe(true);
      });
      
      expect(result.current.currentStatus).toBe('single_state');
      expect(result.current.is('single_state')).toBe(true);
    });

    it('应该处理只有组的状态树', () => {
      const { result } = renderHook(() => useChatStatus([
        {
          group1: ['state1', 'state2']
        }
      ]));
      
      act(() => {
        const success = result.current.to('state1');
        expect(success).toBe(true);
      });
      
      expect(result.current.currentStatus).toBe('state1');
    });
  });

  describe('特殊字符和命名', () => {
    it('应该处理包含特殊字符的状态名', () => {
      const specialTree: import('../src/types').StatusTree = [
        'state-with-dash',
        'state_with_underscore',
        'state.with.dot',
        'state with space',
        'state123',
        'UPPERCASE',
        'mixedCase_State-123.abc',
        {
          'group-with-dash': ['child-state'],
        },
        {
          'group_with_underscore': ['child_state'],
        },
      ];
      
      const { result } = renderHook(() => useChatStatus(specialTree));
      
      const testCases = [
        'state-with-dash',
        'state_with_underscore',
        'state.with.dot',
        'state with space',
        'UPPERCASE',
        'child-state',
        'child_state',
      ];
      
      testCases.forEach(state => {
        act(() => {
          const success = result.current.to(state);
          expect(success).toBe(true);
        });
        
        expect(result.current.currentStatus).toBe(state);
        expect(result.current.is(state)).toBe(true);
      });
    });

    it('应该处理重复的状态名（应该只保留最后一个）', () => {
      const duplicateTree: import('../src/types').StatusTree = [
        'state1',
        {
          group1: ['state1', 'state2'] // state1 重复出现
        },
        {
          group2: ['state2', 'state3']
        }
      ];
      
      const { result } = renderHook(() => useChatStatus(duplicateTree));
      
      // 应该能够转换到所有唯一的状态
      const uniqueStates = ['state1', 'state2', 'state3'];
      
      uniqueStates.forEach(state => {
        act(() => {
          const success = result.current.to(state);
          expect(success).toBe(true);
        });
        
        expect(result.current.currentStatus).toBe(state);
      });
    });
  });

  describe('深度嵌套结构', () => {
    it('应该处理深度嵌套的状态树', () => {
      const deepTree: import('../src/types').StatusTree = [
        {
          level1: [
            {
              level2: [
                {
                  level3: [
                    {
                      level4: [
                        {
                          level5: [
                            'deep_state'
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ];
      
      const { result } = renderHook(() => useChatStatus(deepTree));
      
      act(() => {
        const success = result.current.to('deep_state');
        expect(success).toBe(true);
      });
      
      expect(result.current.currentStatus).toBe('deep_state');
      expect(result.current.is('deep_state')).toBe(true);
    });

    it('应该处理宽状态树（多个兄弟节点）', () => {
      const wideTree: import('../src/types').StatusTree = [
        'state1',
        'state2',
        'state3',
        {
          group1: [
            'child1',
            'child2',
            'child3',
            'child4',
            'child5'
          ]
        },
        {
          group2: [
            'child6',
            'child7',
            'child8'
          ]
        }
      ];
      
      const { result } = renderHook(() => useChatStatus(wideTree));
      
      const allStates = [
        'state1', 'state2', 'state3',
        'child1', 'child2', 'child3', 'child4', 'child5',
        'child6', 'child7', 'child8'
      ];
      
      allStates.forEach(state => {
        act(() => {
          const success = result.current.to(state);
          expect(success).toBe(true);
        });
        
        expect(result.current.currentStatus).toBe(state);
      });
    });
  });

  describe('并发操作', () => {
    it('应该处理快速连续的状态转换', () => {
      const { result } = renderHook(() => useChatStatus([
        'fast1', 'fast2', 'fast3', 'fast4', 'fast5'
      ]));
      
      const states = ['fast1', 'fast2', 'fast3', 'fast4', 'fast5'];
      
      // 快速连续转换
      states.forEach(state => {
        act(() => {
          result.current.to(state);
        });
      });
      
      // 最终状态应该是最后一个
      expect(result.current.currentStatus).toBe('fast5');
      expect(result.current.is('fast5')).toBe(true);
    });

    it('应该处理相同状态的重复转换', () => {
      const { result } = renderHook(() => useChatStatus(['repeat_state']));
      
      // 多次转换到相同状态
      for (let i = 0; i < 10; i++) {
        act(() => {
          const success = result.current.to('repeat_state');
          expect(success).toBe(true);
        });
        
        expect(result.current.currentStatus).toBe('repeat_state');
      }
    });
  });

  describe('内存和性能边界', () => {
    it('应该处理包含大量状态的状态树', () => {
      const manyStates: import('../src/types').StatusTree = Array.from({ length: 1000 }, (_, i) => `state_${i}`);
      
      const { result } = renderHook(() => useChatStatus(manyStates));
      
      // 测试前几个和后几个状态
      const testStates = ['state_0', 'state_500', 'state_999'];
      
      testStates.forEach(state => {
        act(() => {
          const success = result.current.to(state);
          expect(success).toBe(true);
        });
        
        expect(result.current.currentStatus).toBe(state);
        expect(result.current.is(state)).toBe(true);
      });
    });

    it('应该处理复杂嵌套的性能', () => {
      const complexTree: import('../src/types').StatusTree = [
        ...Array.from({ length: 100 }, (_, i) => `flat_${i}`),
        {
          nested: [
            ...Array.from({ length: 50 }, (_, i) => `nested_${i}`),
            {
              deeper: [
                ...Array.from({ length: 25 }, (_, i) => `deep_${i}`),
                {
                  deepest: Array.from({ length: 10 }, (_, i) => `deepest_${i}`)
                }
              ]
            }
          ]
        }
      ];
      
      const startTime = performance.now();
      const { result } = renderHook(() => useChatStatus(complexTree));
      const initTime = performance.now() - startTime;
      
      expect(initTime).toBeLessThan(500); // 复杂树初始化时间应该小于 500ms
      
      // 测试深层状态
      act(() => {
        const success = result.current.to('deepest_5');
        expect(success).toBe(true);
      });
      
      expect(result.current.currentStatus).toBe('deepest_5');
    });
  });
});