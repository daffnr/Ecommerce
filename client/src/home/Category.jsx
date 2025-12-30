import React from "react";

const Category = ({ name, icon }) => {
  return (
    <div className="d-flex gap-2 p-2 rounded bg-white border">
      <div>{icon}</div>
      <p className="m-0">{name}</p>
    </div>
  );
};

export default Category;
