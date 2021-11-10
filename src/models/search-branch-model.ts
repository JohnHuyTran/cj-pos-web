export interface BranchResponse {
  ref: string;
  code: number;
  message: string;
  data: BranchInfo[];
}

export interface BranchInfo {
  code: string;
  name: string;
}
