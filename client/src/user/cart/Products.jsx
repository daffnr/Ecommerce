import React, { useEffect, useState } from "react";

const Products = ({ product, onSelect }) => {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(product.price);
  const [weight, setWeight] = useState(product.weight);
  const [isChecked, setIsChecked] = useState(false);

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
    setPrice(quantity * product.price);
    setWeight(quantity * product.weight);
  }, [quantity]);

  const handleCheckboxChange = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    onSelect(product, quantity, weight, price, newCheckedState);
  };

  return (
    <div className="row align-items-center bg-white p-2 rounded border shadow">
      <div className="col-lg-3 col-6 mb-2">
        <div className="d-flex gap-2">
          <input
            type="checkbox"
            name="check"
            id="check"
            className="form-check-input pointer"
            onChange={handleCheckboxChange}
          />
          <div className="overflow-hidden" style={{ height: 80, width: 80 }}>
            <img
              src={product.images[0].link}
              width="100%"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
      <div className="col-lg-6 col-6">
        <p className="m-0">{product.name}</p>
        <p className="m-0 text-muted">{`${weight} gram`}</p>
        <p className="h6">{`Rp ${parseFloat(price).toLocaleString(
          "id-ID"
        )}`}</p>
      </div>
      <div className="col-lg-3 col-6">
        <div className="d-flex gap-1 align-items-center justify-content-between border rounded p-1">
          <button className="btn btn-pill btn-light" onClick={decreaseQuantity}>
            -
          </button>
          <p className="m-0 text-center text-secondary" style={{ width: 50 }}>
            {quantity}
          </p>
          <button className="btn btn-pill btn-light" onClick={increaseQuantity}>
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
