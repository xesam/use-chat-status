import { parseStatusTree, validateStatus } from '../src/utils/statusParser';
import { simpleTestTree, createTestTree } from './setup';

describe('StatusParser', () => {
  describe('parseStatusTree', () => {
    it('应该正确解析简单状态树', () => {
      const result = parseStatusTree(simpleTestTree);
      
      expect(result.leafNodes).toEqual(new Set(['XX0', 'XX1', 'XX2', 'XX3']));
      expect(result.groupNodes).toEqual(new Set(['YY1', 'name']));
    });

    it('应该正确解析复杂状态树', () => {
      const tree = createTestTree();
      const result = parseStatusTree(tree);
      
      expect(result.leafNodes).toEqual(new Set([
        'idle', 'connecting', 'active', 'user_typing', 'bot_typing', 
        'network_error', 'timeout_error', 'user_closed', 'timeout_closed'
      ]));
      
      expect(result.groupNodes).toEqual(new Set(['chat', 'typing', 'error', 'closed']));
    });

    it('应该正确建立状态到路径的映射', () => {
      const result = parseStatusTree(simpleTestTree);
      
      expect(result.statusToPath.get('XX0')).toEqual(['XX0']);
      expect(result.statusToPath.get('XX1')).toEqual(['YY1', 'XX1']);
      expect(result.statusToPath.get('XX2')).toEqual(['YY1', 'name', 'XX2']);
      expect(result.statusToPath.get('XX3')).toEqual(['YY1', 'name', 'XX3']);
    });

    it('应该正确建立组到路径的映射', () => {
      const result = parseStatusTree(simpleTestTree);
      
      expect(result.groupToPath.get('YY1')).toEqual(['YY1']);
      expect(result.groupToPath.get('name')).toEqual(['YY1', 'name']);
    });

    it('应该正确处理嵌套层次结构', () => {
      const deepTree = [
        {
          level1: [
            {
              level2: [
                {
                  level3: [
                    'deep_status'
                  ]
                }
              ]
            }
          ]
        }
      ];
      
      const result = parseStatusTree(deepTree);
      
      expect(result.leafNodes).toEqual(new Set(['deep_status']));
      expect(result.groupNodes).toEqual(new Set(['level1', 'level2', 'level3']));
      expect(result.statusToPath.get('deep_status')).toEqual(['level1', 'level2', 'level3', 'deep_status']);
    });

    it('应该正确处理空树', () => {
      const result = parseStatusTree([]);
      
      expect(result.leafNodes).toEqual(new Set());
      expect(result.groupNodes).toEqual(new Set());
      expect(result.statusToPath.size).toBe(0);
      expect(result.groupToPath.size).toBe(0);
    });
  });

  describe('validateStatus', () => {
    const parsedStatus = parseStatusTree(simpleTestTree);

    it('应该正确验证存在的叶子状态', () => {
      expect(validateStatus(parsedStatus, 'XX0', 'leaf')).toBe(true);
      expect(validateStatus(parsedStatus, 'XX1', 'leaf')).toBe(true);
      expect(validateStatus(parsedStatus, 'XX2', 'leaf')).toBe(true);
      expect(validateStatus(parsedStatus, 'XX3', 'leaf')).toBe(true);
    });

    it('应该正确验证存在的组状态', () => {
      expect(validateStatus(parsedStatus, 'YY1', 'group')).toBe(true);
      expect(validateStatus(parsedStatus, 'name', 'group')).toBe(true);
    });

    it('应该拒绝不存在的叶子状态', () => {
      expect(validateStatus(parsedStatus, 'NONEXISTENT', 'leaf')).toBe(false);
      expect(validateStatus(parsedStatus, 'YY1', 'leaf')).toBe(false);
    });

    it('应该拒绝不存在的组状态', () => {
      expect(validateStatus(parsedStatus, 'NONEXISTENT', 'group')).toBe(false);
      expect(validateStatus(parsedStatus, 'XX0', 'group')).toBe(false);
    });
  });
});