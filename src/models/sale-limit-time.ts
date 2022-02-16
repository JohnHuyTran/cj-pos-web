export interface STProductDetail {
  id: string;
  index: number;
  barcode: string;
  skuCode: string;
  unitName: string;
  barcodeName: string;
  categoryTypeCode: string;
}

export interface Payload {
  id?: string;
  stStartTime: string;
  stEndTime: string;
  remark: string;
  description: string;
  stDetail: {
    isAllBranches: boolean;
    appliedBranches?: {
      branchList: branchLists[];
      province: provinces[];
    };
    appliedProduct: {
      appliedProducts: appliedProducts[];
      appliedCategories?: appliedCategories[];
    };
  };
}

interface branchLists {
  code: string;
}

interface provinces {
  code: number;
  name: string;
}
interface appliedProducts {
  name: string;
  skuCode: string;
}
interface appliedCategories {
  code: string;
  name: string;
}
