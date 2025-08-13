import React from 'react';
import { useChatStatus } from '../use-chat-status/index';

const simpleStatusTree = [
  'offline',
  'connecting',
  'online',
  'busy',
  'away'
];

export const SimpleChatDemo: React.FC = () => {
  const { currentStatus, is, to } = useChatStatus(simpleStatusTree);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>简单聊天状态演示</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <strong>当前状态: </strong>
        <span style={{
          color: currentStatus === 'online' ? 'green' : 
                 currentStatus === 'offline' ? 'red' : 
                 currentStatus === 'connecting' ? 'blue' : 'orange'
        }}>
          {currentStatus || '未设置'}
        </span>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <strong>是否在线: </strong>
        <span>{is('online') ? '✅' : '❌'}</span>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <strong>切换状态: </strong>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          {simpleStatusTree.map(status => (
            <button
              key={status}
              onClick={() => to(status)}
              disabled={is(status)}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: is(status) ? '#e0e0e0' : '#f5f5f5',
                cursor: is(status) ? 'not-allowed' : 'pointer'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};