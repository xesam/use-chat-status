import React from 'react';
import { useChatStatus } from './src';

// 示例：简单的聊天应用状态管理
const chatStatusTree = [
  'idle',
  'connecting',
  'connected',
  {
    chat: [
      'user_typing',
      'bot_typing',
      'sending_message',
      'message_sent'
    ]
  },
  'network_error',
  'disconnected'
];

export function ChatExample() {
  const { currentStatus, is, to } = useChatStatus(chatStatusTree);

  const getStatusColor = () => {
    switch (currentStatus) {
      case 'idle': return 'text-gray-500';
      case 'connecting': return 'text-yellow-500';
      case 'connected': return 'text-green-500';
      case 'user_typing': return 'text-blue-500';
      case 'bot_typing': return 'text-purple-500';
      case 'network_error': return 'text-red-500';
      case 'disconnected': return 'text-gray-400';
      default: return 'text-gray-500';
    }
  };

  const getStatusMessage = () => {
    switch (currentStatus) {
      case 'idle': return '点击开始聊天';
      case 'connecting': return '正在连接服务器...';
      case 'connected': return '已连接，可以开始聊天';
      case 'user_typing': return '用户正在输入...';
      case 'bot_typing': return '机器人正在回复...';
      case 'sending_message': return '正在发送消息...';
      case 'message_sent': return '消息已发送';
      case 'network_error': return '网络连接错误';
      case 'disconnected': return '已断开连接';
      default: return '未知状态';
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">聊天状态演示</h2>
        
        <div className="mb-4">
          <span className={`font-semibold ${getStatusColor()}`}>
            状态: {getStatusMessage()}
          </span>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => to('connecting')}
            disabled={!is('idle')}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            开始连接
          </button>

          <button
            onClick={() => to('connected')}
            disabled={!is('connecting')}
            className="w-full px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            连接成功
          </button>

          <button
            onClick={() => to('user_typing')}
            disabled={!is('connected') && !is('message_sent')}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            用户输入
          </button>

          <button
            onClick={() => to('bot_typing')}
            disabled={!is('user_typing')}
            className="w-full px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
          >
            机器人回复
          </button>

          <button
            onClick={() => to('sending_message')}
            disabled={!is('bot_typing')}
            className="w-full px-4 py-2 bg-yellow-500 text-white rounded disabled:opacity-50"
          >
            发送消息
          </button>

          <button
            onClick={() => to('message_sent')}
            disabled={!is('sending_message')}
            className="w-full px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            消息发送成功
          </button>

          <button
            onClick={() => to('network_error')}
            disabled={!currentStatus}
            className="w-full px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
          >
            模拟网络错误
          </button>

          <button
            onClick={() => to('disconnected')}
            disabled={!currentStatus}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
          >
            断开连接
          </button>

          <button
            onClick={() => to('idle')}
            disabled={!is('disconnected')}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
          >
            重置
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>当前状态: <strong>{currentStatus || 'null'}</strong></p>
          <p>是否为 connected: <strong>{is('connected') ? '是' : '否'}</strong></p>
        </div>
      </div>
    </div>
  );
}

// 示例：客服聊天系统
const customerServiceTree = [
  'waiting',
  'greeting',
  {
    inquiry: [
      'product_inquiry',
      'order_issue',
      'shipping_question',
      'return_request'
    ]
  },
  {
    processing: [
      'checking_inventory',
      'calculating_refund',
      'updating_order',
      'contacting_warehouse'
    ]
  },
  'escalating',
  'closing',
  'ended'
];

export function CustomerServiceExample() {
  const { currentStatus, is, to } = useChatStatus(customerServiceTree);

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">客服聊天系统</h2>
        
        <div className="mb-6">
          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="font-semibold text-gray-700 mb-2">当前状态</h3>
            <p className="text-lg font-medium text-blue-600">{currentStatus || '等待开始'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {is('waiting') && (
            <button
              onClick={() => to('greeting')}
              className="col-span-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              开始问候
            </button>
          )}

          {is('greeting') && (
            <>
              <button
                onClick={() => to('product_inquiry')}
                className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                产品咨询
              </button>
              <button
                onClick={() => to('order_issue')}
                className="px-3 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
              >
                订单问题
              </button>
              <button
                onClick={() => to('shipping_question')}
                className="px-3 py-2 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
              >
                物流查询
              </button>
              <button
                onClick={() => to('return_request')}
                className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                退货申请
              </button>
            </>
          )}

          {(is('product_inquiry') || is('order_issue') || is('shipping_question') || is('return_request')) && (
            <>
              <button
                onClick={() => to('checking_inventory')}
                className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                查询库存
              </button>
              <button
                onClick={() => to('calculating_refund')}
                className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                计算退款
              </button>
              <button
                onClick={() => to('updating_order')}
                className="px-3 py-2 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
              >
                更新订单
              </button>
              <button
                onClick={() => to('contacting_warehouse')}
                className="px-3 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
              >
                联系仓库
              </button>
            </>
          )}

          {(is('checking_inventory') || is('calculating_refund') || is('updating_order') || is('contacting_warehouse')) && (
            <>
              <button
                onClick={() => to('closing')}
                className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                解决问题
              </button>
              <button
                onClick={() => to('escalating')}
                className="px-3 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
              >
                升级处理
              </button>
            </>
          )}

          {is('escalating') && (
            <button
              onClick={() => to('closing')}
              className="col-span-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              转接完成
            </button>
          )}

          {is('closing') && (
            <button
              onClick={() => to('ended')}
              className="col-span-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              结束对话
            </button>
          )}

          {is('ended') && (
            <button
              onClick={() => to('waiting')}
              className="col-span-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              重新开始
            </button>
          )}
        </div>
      </div>
    </div>
  );
}