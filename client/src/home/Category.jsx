import React from "react";

const Category = ({ name, icon, id, setCategory }) => {
  const handleCatgeory = (id) => {
    setCategory(id);
  };
  return (
    <div
      className="d-flex gap-2 p-2 rounded bg-white border pointer"
      onClick={() => handleCatgeory(id)}
    >
      <img src={icon} alt={name} className="circle"/>
      <p className="m-0">{name}</p>
    </div>
  );
};

export default Category;
