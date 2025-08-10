export type StatusNode = string | { [key: string]: StatusTree };
export type StatusTree = StatusNode[];

export interface StatusInfo {
  isLeaf: boolean;
  fullPath: string[];
  groupPath: string[];
}

export interface UseChatStatusReturn {
  currentStatus: string | null;
  is: (status: string) => boolean;
  inGroup: (group: string) => boolean;
  to: (status: string) => boolean;
}