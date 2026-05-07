export type StatusNode = string | { [key: string]: StatusTree | readonly unknown[] };
export type StatusTree = StatusNode[];

// 从 as const 状态树中提取所有叶子状态名的联合类型（仅对 readonly 数组生效，普通数组退化为 string）
export type ExtractLeafStates<T> =
  // Only extract literals from readonly (as const) arrays; mutable arrays degrade to string
  [T] extends [readonly (infer _Item)[]]
    ? T extends readonly unknown[] // is it actually readonly?
      ? T extends unknown[] // is it also mutable? (if yes, it's a normal array → string)
        ? string
        : _ExtractLeafStatesReadonly<T>
      : string
    : string;

type _ExtractLeafStatesReadonly<T> =
  T extends readonly (infer Item)[]
    ? Item extends string
      ? Item
      : Item extends { [K in infer _K extends string]: infer Children }
        ? _ExtractLeafStatesReadonly<Children>
        : never
    : never;

// 从 as const 状态树中提取所有组名的联合类型（仅对 readonly 数组生效，普通数组退化为 string）
export type ExtractGroupStates<T> =
  [T] extends [readonly (infer _Item)[]]
    ? T extends readonly unknown[]
      ? T extends unknown[]
        ? string
        : _ExtractGroupStatesReadonly<T>
      : string
    : string;

type _ExtractGroupStatesReadonly<T> =
  T extends readonly (infer Item)[]
    ? Item extends string
      ? never
      : Item extends { [K in infer K extends string]: infer Children }
        ? K | _ExtractGroupStatesReadonly<Children>
        : never
    : never;

export interface StatusInfo {
  isLeaf: boolean;
  fullPath: string[];
  groupPath: string[];
}

export interface UseChatStatusReturn<
  T,
  LeafStates extends string = ExtractLeafStates<T>,
  GroupStates extends string = ExtractGroupStates<T>
> {
  currentStatus: string | null;
  is: (status: LeafStates) => boolean;
  inGroup: (group: GroupStates) => boolean;
  to: (status: LeafStates) => boolean;
}
