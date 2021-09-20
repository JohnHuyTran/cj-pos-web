import React, { useEffect } from "react";

import { fetchGetProductList } from "../../store/slices/productSlice";
import { useAppSelector, useAppDispatch } from "../../store/store";

function ProductListComponent() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchGetProductList());
  }, []);

  const items = useAppSelector((state) => state.product);
  console.log("items == ", items);

  return <div>productList test</div>;
}

export default ProductListComponent;
