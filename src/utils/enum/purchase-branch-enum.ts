export const purchaseBranchStatus = [
  { key: 'DRAFT', value: 'DRAFT', stepperGrp: 1 },
  { key: 'SUBMITTED', value: 'SUBMITTED', stepperGrp: 2 },
  { key: 'CREATED_PO', value: 'CREATED_PO', stepperGrp: 2 },
  { key: 'WAITING_BRANCH_EXAMINE', value: 'WAITING_BRANCH_EXAMINE', stepperGrp: 2 },
  { key: 'CLOSED', value: 'CLOSED', stepperGrp: 3 },
];
export const getPurchaseBranchStatusInfo = (key: string) => purchaseBranchStatus.find((item) => item.key === key);

export const getPurchaseBranchList = () => {
  return purchaseBranchStatus;
};
