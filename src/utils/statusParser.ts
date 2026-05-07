export interface ParsedStatus {
  leafNodes: Set<string>;
  groupNodes: Set<string>;
  statusToPath: Map<string, string[]>;
  groupToPath: Map<string, string[]>;
  parentMap: Map<string, string>;
}

export function parseStatusTree(tree: readonly unknown[]): ParsedStatus {
  const leafNodes = new Set<string>();
  const groupNodes = new Set<string>();
  const statusToPath = new Map<string, string[]>();
  const groupToPath = new Map<string, string[]>();
  const parentMap = new Map<string, string>();

  function traverse(nodes: readonly unknown[], currentPath: string[] = []): void {
    for (const node of nodes) {
      if (typeof node === 'string') {
        // 叶子节点
        const leafName = node;
        leafNodes.add(leafName);
        statusToPath.set(leafName, [...currentPath, leafName]);
        
        // 记录父关系
        if (currentPath.length > 0) {
          const parent = currentPath[currentPath.length - 1];
          parentMap.set(leafName, parent);
        }
      } else {
        // 组节点
        for (const [groupName, children] of Object.entries(node as Record<string, unknown>)) {
          groupNodes.add(groupName);
          groupToPath.set(groupName, [...currentPath, groupName]);

          // 记录父关系
          if (currentPath.length > 0) {
            const parent = currentPath[currentPath.length - 1];
            parentMap.set(groupName, parent);
          }

          // 递归处理子节点
          traverse(children as readonly unknown[], [...currentPath, groupName]);
        }
      }
    }
  }

  traverse(tree);

  return {
    leafNodes,
    groupNodes,
    statusToPath,
    groupToPath,
    parentMap,
  };
}

export function validateStatus(
  parsedStatus: ParsedStatus,
  status: string,
  type: 'leaf' | 'group'
): boolean {
  if (type === 'leaf') {
    return parsedStatus.leafNodes.has(status);
  } else {
    return parsedStatus.groupNodes.has(status);
  }
}