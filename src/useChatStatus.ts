import { useState, useCallback, useMemo } from 'react';
import { UseChatStatusReturn, ExtractLeafStates } from './types';
import { parseStatusTree, validateStatus } from './utils/statusParser';

export function useChatStatus<T extends readonly unknown[]>(
  statusTree: T,
  initialStatus?: ExtractLeafStates<T>
): UseChatStatusReturn<T> {
  
  const [currentStatus, setCurrentStatus] = useState<string | null>(() => {
    if (initialStatus) {
      const parsedStatus = parseStatusTree(statusTree);
      if (!validateStatus(parsedStatus, initialStatus as string, 'leaf')) {
        console.warn(`初始状态 "${initialStatus}" 无效，将使用 null 作为初始状态`);
        return null;
      }
      return initialStatus as string;
    }
    return null;
  });
  
  // 使用 useMemo 缓存解析结果，提高性能
  const parsedStatus = useMemo(() => parseStatusTree(statusTree), [statusTree]);

  const is = useCallback((status: string): boolean => {
    if (!validateStatus(parsedStatus, status, 'leaf')) {
      console.warn(`状态 "${status}" 不存在`);
      return false;
    }

    if (currentStatus === null) {
      return false;
    }

    if (parsedStatus.groupNodes.has(currentStatus)) {
      console.warn(`当前状态 "${currentStatus}" 是一个状态组，不能使用 is 方法判断`);
      return false;
    }

    return currentStatus === status;
  }, [currentStatus, parsedStatus]);

  const inGroup = useCallback((group: string): boolean => {
    if (!validateStatus(parsedStatus, group, 'group')) {
      console.warn(`状态组 "${group}" 不存在`);
      return false;
    }

    if (currentStatus === null) {
      return false;
    }

    // 检查当前状态是否在指定组内
    const statusPath = parsedStatus.statusToPath.get(currentStatus);
    if (!statusPath) {
      return false;
    }

    // 检查路径中是否包含指定的组
    return statusPath.includes(group);
  }, [currentStatus, parsedStatus]);

  const to = useCallback((status: string): boolean => {
    if (!validateStatus(parsedStatus, status, 'leaf')) {
      console.warn(`状态 "${status}" 不存在`);
      return false;
    }

    if (currentStatus !== null && parsedStatus.groupNodes.has(currentStatus)) {
      console.warn(`当前状态 "${currentStatus}" 是一个状态组，不能进行状态转换`);
      return false;
    }

    setCurrentStatus(status);
    return true;
  }, [currentStatus, parsedStatus]);

  return {
    currentStatus,
    is,
    inGroup,
    to,
  };
}