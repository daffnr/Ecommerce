import React from "react";
import Navbar from "../components/navbar/Navbar";
import Desc from "./Desc";
import Images from "./Images";
import Counter from "./Counter";
import Footer from "../components/footer/Footer";
import Layout from "../components/layout/Layout";
import { useParams } from "react-router-dom";
import { useGetProductQuery } from "../api/request/ApiProduct";

const Detail = () => {
  const params = useParams();
  const { id } = params;

  const { data: product = {}, isLoading } = useGetProductQuery(id, {
    skip: !id,
  });

  console.log(product);
  return (
    <Layout>
      <div className="container-fluid">
        <div className="container">
          <div className="row align-items-start">
            <div className="col-lg-3 col-md-4 col-sm-12 mb-3">
              <Images product={product} />
            </div>
            <div className="col-lg-6 col-md-8 col-sm-12 mb-3">
              <Desc product={product} />
            </div>
            <div className="col-lg-3 col-md-4 col-sm-12">
              <Counter product={product} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Detail;
