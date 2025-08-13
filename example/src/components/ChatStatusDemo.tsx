import React from 'react';
import { useChatStatus } from '../use-chat-status/index';

const statusTree = [
  'idle',
  'connecting',
  {
    chatting: [
      'listening',
      'thinking',
      'responding',
      {
        error: [
          'network_error',
          'timeout_error',
          'api_error'
        ]
      }
    ]
  },
  'disconnected'
];

export const ChatStatusDemo: React.FC = () => {
  const { currentStatus, is, inGroup, to } = useChatStatus(statusTree, 'idle');

  const getStatusColor = (status: string | null) => {
    if (!status) return '#6b7280';
    
    if (status === 'idle') return '#10b981';
    if (status === 'connecting') return '#3b82f6';
    if (status === 'disconnected') return '#ef4444';
    if (status === 'listening' || status === 'thinking' || status === 'responding') return '#8b5cf6';
    if (status === 'network_error' || status === 'timeout_error' || status === 'api_error') return '#dc2626';
    
    return '#6b7280';
  };

  const getStatusText = (status: string | null) => {
    if (!status) return '未设置状态';
    
    const statusMap: Record<string, string> = {
      'idle': '空闲',
      'connecting': '连接中',
      'listening': '倾听中',
      'thinking': '思考中',
      'responding': '回复中',
      'disconnected': '已断开',
      'network_error': '网络错误',
      'timeout_error': '超时错误',
      'api_error': 'API错误'
    };
    
    return statusMap[status] || status;
  };



  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#1f2937', marginBottom: '2rem', textAlign: 'center' }}>
        useChatStatus 功能演示
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* 左侧：状态显示和检查 */}
        <div>
          {/* 当前状态显示 */}
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ marginTop: 0, color: '#374151' }}>当前状态</h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '1rem'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: getStatusColor(currentStatus)
              }} />
              <div>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  {getStatusText(currentStatus)}
                </div>
                <code style={{
                  backgroundColor: '#e5e7eb',
                  padding: '0.125rem 0.25rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem'
                }}>
                  {currentStatus || 'null'}
                </code>
              </div>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
              状态组: 
              <code>
                {inGroup('chatting') ? 'chatting' : 
                 inGroup('error') ? 'error' : '无'}
              </code>
            </div>
          </div>

          {/* 状态检查演示 */}
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ marginTop: 0, color: '#374151' }}>状态检查</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', backgroundColor: '#ffffff', borderRadius: '0.25rem' }}>
                <span>是否空闲:</span>
                <span style={{ color: is('idle') ? '#10b981' : '#6b7280', fontWeight: '600' }}>
                  {is('idle') ? '✅ 是' : '❌ 否'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', backgroundColor: '#ffffff', borderRadius: '0.25rem' }}>
                <span>是否连接中:</span>
                <span style={{ color: is('connecting') ? '#3b82f6' : '#6b7280', fontWeight: '600' }}>
                  {is('connecting') ? '✅ 是' : '❌ 否'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', backgroundColor: '#ffffff', borderRadius: '0.25rem' }}>
                <span>是否在对话中:</span>
                <span style={{ color: inGroup('chatting') ? '#8b5cf6' : '#6b7280', fontWeight: '600' }}>
                  {inGroup('chatting') ? '✅ 是' : '❌ 否'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', backgroundColor: '#ffffff', borderRadius: '0.25rem' }}>
                <span>是否错误状态:</span>
                <span style={{ color: inGroup('error') ? '#dc2626' : '#6b7280', fontWeight: '600' }}>
                  {inGroup('error') ? '✅ 是' : '❌ 否'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：状态转换控制 */}
        <div>
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ marginTop: 0, color: '#374151' }}>状态转换控制</h3>
            
            {/* 基础状态 */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#374151', marginBottom: '0.5rem' }}>基础状态</h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['idle', 'connecting', 'disconnected'].map(status => (
                  <button
                    key={status}
                    onClick={() => to(status)}
                    disabled={is(status)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #d1d5db',
                      backgroundColor: is(status) ? '#e5e7eb' : '#ffffff',
                      color: is(status) ? '#6b7280' : '#374151',
                      cursor: is(status) ? 'not-allowed' : 'pointer',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    {getStatusText(status)}
                  </button>
                ))}
              </div>
            </div>

            {/* 对话状态 */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#374151', marginBottom: '0.5rem' }}>对话状态</h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['listening', 'thinking', 'responding'].map(status => (
                  <button
                    key={status}
                    onClick={() => to(status)}
                    disabled={is(status)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #d1d5db',
                      backgroundColor: is(status) ? '#e5e7eb' : '#ffffff',
                      color: is(status) ? '#6b7280' : '#374151',
                      cursor: is(status) ? 'not-allowed' : 'pointer',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    {getStatusText(status)}
                  </button>
                ))}
              </div>
            </div>

            {/* 错误状态 */}
            <div>
              <h4 style={{ color: '#374151', marginBottom: '0.5rem' }}>错误状态</h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['network_error', 'timeout_error', 'api_error'].map(status => (
                  <button
                    key={status}
                    onClick={() => to(status)}
                    disabled={is(status)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #fecaca',
                      backgroundColor: is(status) ? '#fee2e2' : '#fef2f2',
                      color: '#dc2626',
                      cursor: is(status) ? 'not-allowed' : 'pointer',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    {getStatusText(status)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 状态树结构 */}
      <div style={{
        backgroundColor: '#f9fafb',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        marginTop: '2rem',
        border: '1px solid #e5e7eb',
        gridColumn: '1 / -1'
      }}>
        <h3 style={{ marginTop: 0, color: '#374151' }}>状态树结构</h3>
        <pre style={{
          backgroundColor: '#1f2937',
          color: '#f9fafb',
          padding: '1rem',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          overflow: 'auto',
          lineHeight: '1.4'
        }}>
{`[
  "idle",
  "connecting",
  {
    chatting: [
      "listening",
      "thinking", 
      "responding",
      {
        error: [
          "network_error",
          "timeout_error",
          "api_error"
        ]
      }
    ]
  },
  "disconnected"
]`}
        </pre>
      </div>
    </div>
  );
};