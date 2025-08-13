export type StatusNode = string | { [key: string]: StatusTree };
export type StatusTree = StatusNode[];

// 从状态树中提取所有叶子状态
export type ExtractLeafStates<T extends StatusTree> = string;

// 从状态树中提取所有组状态  
export type ExtractGroupStates<T extends StatusTree> = string;

export interface StatusInfo {
  isLeaf: boolean;
  fullPath: string[];
  groupPath: string[];
}

export interface UseChatStatusReturn<
  T extends StatusTree,
  LeafStates = ExtractLeafStates<T>,
  GroupStates = ExtractGroupStates<T>
> {
  currentStatus: string | null;
  is: (status: LeafStates) => boolean;
  inGroup: (group: GroupStates) => boolean;
  to: (status: LeafStates) => void;
}