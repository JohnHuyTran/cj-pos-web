import { getEncodeBarcode } from "../../utils/utils";

describe("getEncodeBarcode", () => {
    it("barcode:'8850800990016' , price:25.22 -> checkdigit = 5", () => {
      expect(getEncodeBarcode({barcode:'8850800990016' , price:25.22})).toEqual('A400252258850800990016');
    });
  });