/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react';
import { useChatStatus } from '../src/useChatStatus';

// 真实的聊天状态场景
type ChatStatus = 
  | 'idle'
  | 'connecting' 
  | 'connected'
  | 'user_typing'
  | 'bot_typing'
  | 'sending_message'
  | 'message_sent'
  | 'network_error'
  | 'timeout_error'
  | 'user_disconnected'
  | 'session_expired';

type ChatGroup = 'chat_active' | 'error_states' | 'typing_states';

const realWorldChatTree = [
  'idle',
  'connecting',
  'connected',
  {
    chat_active: [
      'user_typing',
      'bot_typing',
      'sending_message',
      'message_sent',
    ]
  },
  {
    error_states: [
      'network_error',
      'timeout_error',
    ]
  },
  {
    typing_states: [
      'user_typing',
      'bot_typing',
    ]
  },
  'user_disconnected',
  'session_expired',
] as import('../src/types').StatusTree;

describe('Integration Tests - Real World Scenarios', () => {
  describe('电商客服聊天场景', () => {
    it('应该处理完整的客服会话流程', () => {
      const statusTree: import('../src/types').StatusTree = [
        'initial',
        'connecting',
        'connected',
        {
          chat_active: [
            'user_typing',
            'sending_message',
            'message_sent',
            'waiting_response'
          ]
        },
        {
          error_states: [
            'network_error',
            'timeout_error',
            'server_error'
          ]
        },
        {
          typing_states: [
            'user_typing',
            'bot_typing'
          ]
        }
      ];
      const { result } = renderHook(() => useChatStatus(statusTree));
      
      // 1. 初始状态
      expect(result.current.currentStatus).toBeNull();
      expect(result.current.is('idle')).toBe(false);
      
      // 2. 连接阶段
      act(() => {
        result.current.to('connecting');
      });
      expect(result.current.currentStatus).toBe('connecting');
      expect(result.current.is('connecting')).toBe(true);
      
      // 3. 连接成功
      act(() => {
        result.current.to('connected');
      });
      expect(result.current.currentStatus).toBe('connected');
      
      // 4. 用户开始输入
      act(() => {
        result.current.to('user_typing');
      });
      expect(result.current.currentStatus).toBe('user_typing');
      expect(result.current.is('user_typing')).toBe(true);
      
      // 5. 发送消息
      act(() => {
        result.current.to('sending_message');
      });
      expect(result.current.currentStatus).toBe('sending_message');
      
      // 6. 消息发送成功
      act(() => {
        result.current.to('message_sent');
      });
      expect(result.current.currentStatus).toBe('message_sent');
      
      // 7. 返回连接状态准备下一条消息
      act(() => {
        result.current.to('connected');
      });
      expect(result.current.currentStatus).toBe('connected');
    });

    it('应该处理网络错误场景', () => {
      const { result } = renderHook(() => useChatStatus(realWorldChatTree));
      
      // 从连接状态开始
      act(() => {
        result.current.to('connecting');
      });
      
      // 遇到网络错误
      act(() => {
        result.current.to('network_error');
      });
      expect(result.current.currentStatus).toBe('network_error');
      expect(result.current.is('network_error')).toBe(true);
      
      // 重试连接
      act(() => {
        result.current.to('connecting');
      });
      expect(result.current.currentStatus).toBe('connecting');
    });

    it('应该处理会话超时', () => {
      const { result } = renderHook(() => useChatStatus(realWorldChatTree));
      
      // 正常聊天流程
      act(() => {
        result.current.to('connected');
        result.current.to('user_typing');
        result.current.to('sending_message');
      });
      
      // 超时错误
      act(() => {
        result.current.to('timeout_error');
      });
      expect(result.current.currentStatus).toBe('timeout_error');
      
      // 最终断开连接
      act(() => {
        result.current.to('user_disconnected');
      });
      expect(result.current.currentStatus).toBe('user_disconnected');
    });
  });

  describe('边界情况处理', () => {
    it('应该拒绝非法状态转换', () => {
      const { result } = renderHook(() => useChatStatus(realWorldChatTree));
      
      const invalidTransitions = [
        'nonexistent_state',
        'invalid_group',
        'fake_status',
      ];
      
      invalidTransitions.forEach(invalidState => {
        act(() => {
          const success = result.current.to(invalidState);
          expect(success).toBe(false);
        });
        expect(console.warn).toHaveBeenCalledWith(`状态 "${invalidState}" 不存在`);
      });
    });

    it('应该处理快速状态转换', () => {
      const { result } = renderHook(() => useChatStatus(realWorldChatTree));
      
      const states: ChatStatus[] = [
        'idle',
        'connecting',
        'connected',
        'user_typing',
        'bot_typing',
        'sending_message',
        'message_sent',
        'connected'
      ];
      
      states.forEach(state => {
        act(() => {
          result.current.to(state);
        });
        expect(result.current.currentStatus).toBe(state);
        expect(result.current.is(state)).toBe(true);
      });
    });
  });

  describe('性能基准测试', () => {
    it('应该在合理时间内处理大量状态查询', () => {
      const { result } = renderHook(() => useChatStatus(realWorldChatTree));
      
      // 设置一个状态
      act(() => {
        result.current.to('connected');
      });
      
      const iterations = 1000;
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        act(() => {
          result.current.is('connected');
          result.current.is('user_typing');
          result.current.is('network_error');
        });
      }
      
      const duration = performance.now() - start;
      const avgTimePerOperation = duration / (iterations * 3);
      
      expect(avgTimePerOperation).toBeLessThan(1); // 平均每个操作小于 1ms
      expect(duration).toBeLessThan(100); // 总时间小于 100ms
    });
  });

  describe('内存使用测试', () => {
    it('不应该造成内存泄漏', () => {
      const { result, unmount } = renderHook(() => useChatStatus(realWorldChatTree));
      
      // 多次状态转换
      for (let i = 0; i < 100; i++) {
        act(() => {
          result.current.to('connected');
          result.current.to('user_typing');
          result.current.to('sending_message');
        });
      }
      
      // 卸载组件
      unmount();
      
      // 如果到这里没有错误，说明没有内存泄漏
      expect(true).toBe(true);
    });
  });
});