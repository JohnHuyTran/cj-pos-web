import React, { useEffect } from "react";

import { useAppSelector, useAppDispatch } from "../../store/store";
import { fetchGetProductList } from "../../store/slices/productSlice";

function ProductListComponent() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchGetProductList());
  }, []);

  const items = useAppSelector((state) => state.product);
  console.log("items == ", items.item);

  return <div>productList test</div>;
}

export default ProductListComponent;
