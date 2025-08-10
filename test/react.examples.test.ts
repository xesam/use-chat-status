/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react';
import { useChatStatus } from '../src/useChatStatus';

// 示例：电商客服聊天状态
describe('使用示例 - 电商客服聊天', () => {
  const customerServiceTree = [
    'initial',
    'greeting',
    {
      inquiry: [
        'product_question',
        'order_question',
        'shipping_question',
        'return_question',
      ]
    },
    {
      processing: [
        'checking_inventory',
        'calculating_shipping',
        'processing_refund',
        'updating_order',
      ]
    },
    {
      escalation: [
        'transferring_to_human',
        'escalating_to_manager',
      ]
    },
    'closing',
    'ended',
  ];

  it('应该处理典型的客服对话流程', () => {
    const { result } = renderHook(() => useChatStatus(customerServiceTree));
    
    // 1. 客户进入聊天
    act(() => {
      result.current.to('initial');
    });
    expect(result.current.currentStatus).toBe('initial');
    
    // 2. 机器人问候
    act(() => {
      result.current.to('greeting');
    });
    expect(result.current.currentStatus).toBe('greeting');
    
    // 3. 客户询问产品
    act(() => {
      result.current.to('product_question');
    });
    expect(result.current.currentStatus).toBe('product_question');
    
    // 4. 机器人检查库存
    act(() => {
      result.current.to('checking_inventory');
    });
    expect(result.current.currentStatus).toBe('checking_inventory');
    
    // 5. 提供答案
    act(() => {
      result.current.to('closing');
    });
    expect(result.current.currentStatus).toBe('closing');
    
    // 6. 结束对话
    act(() => {
      result.current.to('ended');
    });
    expect(result.current.currentStatus).toBe('ended');
  });

  it('应该处理复杂的查询场景', () => {
    const { result } = renderHook(() => useChatStatus(customerServiceTree));
    
    // 模拟复杂的对话流程
    const conversationFlow = [
      'initial',
      'greeting',
      'order_question',
      'calculating_shipping',
      'shipping_question',
      'checking_inventory',
      'product_question',
      'processing_refund',
      'escalating_to_manager',
      'closing',
      'ended'
    ];
    
    conversationFlow.forEach(state => {
      act(() => {
        const success = result.current.to(state);
        expect(success).toBe(true);
      });
      
      expect(result.current.currentStatus).toBe(state);
      expect(result.current.is(state)).toBe(true);
    });
  });
});

// 示例：社交媒体聊天应用
describe('使用示例 - 社交媒体私信', () => {
  const socialChatTree = [
    'offline',
    'online',
    {
      active_chat: [
        'reading_messages',
        'composing_message',
        'sending_message',
        'message_sent',
        'receiving_message',
      ]
    },
    {
      media_sharing: [
        'uploading_image',
        'uploading_video',
        'processing_media',
        'media_shared',
      ]
    },
    {
      voice_chat: [
        'connecting_call',
        'in_call',
        'call_ended',
      ]
    },
    'away',
    'busy',
    'do_not_disturb',
  ];

  it('应该处理多媒体消息流程', () => {
    const { result } = renderHook(() => useChatStatus(socialChatTree));
    
    // 用户上线
    act(() => {
      result.current.to('online');
    });
    expect(result.current.currentStatus).toBe('online');
    
    // 开始聊天
    act(() => {
      result.current.to('reading_messages');
    });
    expect(result.current.currentStatus).toBe('reading_messages');
    
    // 发送图片
    act(() => {
      result.current.to('uploading_image');
    });
    expect(result.current.currentStatus).toBe('uploading_image');
    
    act(() => {
      result.current.to('processing_media');
    });
    expect(result.current.currentStatus).toBe('processing_media');
    
    act(() => {
      result.current.to('media_shared');
    });
    expect(result.current.currentStatus).toBe('media_shared');
    
    // 返回聊天
    act(() => {
      result.current.to('composing_message');
    });
    expect(result.current.currentStatus).toBe('composing_message');
  });

  it('应该处理语音通话场景', () => {
    const { result } = renderHook(() => useChatStatus(socialChatTree));
    
    const voiceCallFlow = [
      'online',
      'connecting_call',
      'in_call',
      'call_ended',
      'online'
    ];
    
    voiceCallFlow.forEach(state => {
      act(() => {
        const success = result.current.to(state);
        expect(success).toBe(true);
      });
      
      expect(result.current.currentStatus).toBe(state);
    });
  });
});

// 示例：游戏内聊天系统
describe('使用示例 - 游戏内聊天', () => {
  const gameChatTree = [
    'menu',
    'loading',
    {
      in_game: [
        'lobby',
        'matchmaking',
        'in_match',
        {
          team_chat: [
            'typing_team',
            'voice_team',
          ]
        },
        {
          global_chat: [
            'typing_global',
            'voice_global',
          ]
        },
        'spectating',
      ]
    },
    'paused',
    'settings',
    'disconnected',
  ];

  it('应该处理游戏内聊天状态', () => {
    const { result } = renderHook(() => useChatStatus(gameChatTree));
    
    // 游戏流程
    act(() => {
      result.current.to('loading');
    });
    expect(result.current.currentStatus).toBe('loading');
    
    act(() => {
      result.current.to('lobby');
    });
    expect(result.current.currentStatus).toBe('lobby');
    
    act(() => {
      result.current.to('matchmaking');
    });
    expect(result.current.currentStatus).toBe('matchmaking');
    
    act(() => {
      result.current.to('in_match');
    });
    expect(result.current.currentStatus).toBe('in_match');
    
    // 团队聊天
    act(() => {
      result.current.to('typing_team');
    });
    expect(result.current.currentStatus).toBe('typing_team');
    
    act(() => {
      result.current.to('voice_team');
    });
    expect(result.current.currentStatus).toBe('voice_team');
    
    // 全局聊天
    act(() => {
      result.current.to('typing_global');
    });
    expect(result.current.currentStatus).toBe('typing_global');
  });
});