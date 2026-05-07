/**
 * @jest-environment node
 */

// 这个文件测试 TypeScript 编译期类型推断。
// 每个 @ts-expect-error 行表示"这一行应该产生类型错误"。
// 如果没有产生错误，ts-jest 会报告"Unused '@ts-expect-error' directive"失败。

import { useChatStatus } from '../src/useChatStatus';

const tree = [
  'idle',
  'connecting',
  {
    chat: [
      'active',
      {
        typing: ['user_typing', 'bot_typing']
      }
    ]
  }
] as const;

describe('TypeScript 字面量类型推断', () => {
  it('is() 只接受合法叶子状态', () => {
    type HookReturn = ReturnType<typeof useChatStatus<typeof tree>>;
    type IsParam = Parameters<HookReturn['is']>[0];

    const _valid: IsParam = 'idle';
    const _valid2: IsParam = 'user_typing';

    // @ts-expect-error 'chat' 是组，不是叶子
    const _invalid1: IsParam = 'chat';
    // @ts-expect-error 'wrong' 不存在
    const _invalid2: IsParam = 'wrong';
  });

  it('inGroup() 只接受合法组名', () => {
    type HookReturn = ReturnType<typeof useChatStatus<typeof tree>>;
    type InGroupParam = Parameters<HookReturn['inGroup']>[0];

    const _valid: InGroupParam = 'chat';
    const _valid2: InGroupParam = 'typing';

    // @ts-expect-error 'idle' 是叶子，不是组
    const _invalid1: InGroupParam = 'idle';
    // @ts-expect-error 'wrong' 不存在
    const _invalid2: InGroupParam = 'wrong';
  });

  it('to() 只接受合法叶子状态', () => {
    type HookReturn = ReturnType<typeof useChatStatus<typeof tree>>;
    type ToParam = Parameters<HookReturn['to']>[0];

    const _valid: ToParam = 'active';

    // @ts-expect-error 'chat' 是组
    const _invalid1: ToParam = 'chat';
    // @ts-expect-error 不存在
    const _invalid2: ToParam = 'nonexistent';
  });

  it('to() 返回 boolean', () => {
    type HookReturn = ReturnType<typeof useChatStatus<typeof tree>>;
    type ToReturn = ReturnType<HookReturn['to']>;
    const _check: ToReturn = true;
  });
});
