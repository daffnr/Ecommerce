// import React, { Fragment, useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Category from "./Category";
import Filters from "./Filters";
import Product from "./Product";
import Footer from "../components/footer/Footer";
import { useGetProductsQuery } from "../api/request/ApiProduct";
import { useGetCategoriesQuery } from "../api/request/ApiCategory";
import { useState } from "react";

const Index = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(14);
  const [categoryId, setCategoryId] = useState("");

  const { data: rawData = {}, isLoading: loadProduct } = useGetProductsQuery({
    search,
    page,
    limit,
    categoryId,
  });
  const { data: categories, isLoading: loadCategory } = useGetCategoriesQuery();

  const { products = [], totalPages, totalProducts } = rawData;

  const handleReset = () => {
    setSearch("");
    setCategoryId("");
    setLimit(14);
  };

  return (
    <div className="bg-light">
      <Navbar setSearch={(e) => setSearch(e)} />
      <div
        className="container-fluid d-flex flex-column gap-2"
        style={{ paddingTop: 80, minHeight: "100vh" }}
      >
        <div className="container overflow-auto d-flex gap-3 p-1">
          <button className="btn btn-secondary" onClick={handleReset}>Reset</button>
          {categories?.map((category, index) => (
            <Category
              key={index}
              name={category.name}
              icon={category.icon}
              id={category.id}
              setCategory={(e) => setCategoryId(e)}
            />
          ))}
        </div>
        <div className="container overflow-auto">
          <Filters setLimit={(e) => setLimit(e)} />
        </div>
        <div
          className={`container overflow-auto d-flex flex-wrap gap-1 justify-content-center p-2`}
        >
          {products?.map((product, index) => (
            <Product key={index} product={product} />
          ))}
        </div>
      </div>

      <Footer categories={categories} />
    </div>
  );
};

export default Index;
