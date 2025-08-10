import { useState, useCallback, useMemo } from 'react';
import { StatusTree, UseChatStatusReturn } from './types';
import { parseStatusTree, validateStatus } from './utils/statusParser';

export function useChatStatus(statusTree: StatusTree): UseChatStatusReturn {
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  
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

    if (parsedStatus.leafNodes.has(currentStatus)) {
      console.warn(`当前状态 "${currentStatus}" 是一个具体状态，不能使用 inGroup 方法判断`);
      return false;
    }

    return currentStatus === group;
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