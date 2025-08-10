// 设置测试环境
const consoleWarn = console.warn;

beforeEach(() => {
  console.warn = jest.fn();
});

afterEach(() => {
  console.warn = consoleWarn;
});

// 测试工具函数
export function createTestTree() {
  return [
    'idle',
    'connecting',
    {
      chat: [
        'active',
        {
          typing: [
            'user_typing',
            'bot_typing'
          ]
        },
        {
          error: [
            'network_error',
            'timeout_error'
          ]
        }
      ]
    },
    {
      closed: [
        'user_closed',
        'timeout_closed'
      ]
    }
  ];
}

export const simpleTestTree = [
  'XX0',
  {
    YY1: [
      'XX1',
      {
        name: [
          'XX2',
          'XX3'
        ]
      }
    ]
  }
];