import React, { Fragment, useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import { categories, products } from "../Data";
import Category from "./Category";
import Filters from "./Filters";
import Product from "./Product";
import Footer from "../components/footer/Footer";

const Index = () => {
  const [isSmall, setSmall] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      setSmall(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className="bg-light">
      <Navbar />
      <div
        className="container-fluid d-flex flex-column gap-2"
        style={{ paddingTop: 80, minHeight: "100vh" }}
      >
        <div className="container overflow-auto d-flex gap-3 p-1">
          {categories?.map((category, index) => (
            <Category key={index} name={category.name} icon={category.icon} />
          ))}
        </div>
        <div className="container overflow-auto">
          <Filters />
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
