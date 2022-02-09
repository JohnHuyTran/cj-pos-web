export interface ItemProps {
  label: string;
  onDelete: any;
}
export interface ListBranches {
  branches: Object[];
  provinces: Object[];
}

export interface Payload {
  name: string;
  province: string;
}

export type Params = { [key: string]: string };
