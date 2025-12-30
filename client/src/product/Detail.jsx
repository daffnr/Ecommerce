import React from "react";
import Navbar from "../components/navbar/Navbar";
import Desc from "./Desc";
import Images from "./Images";
import Counter from "./Counter";
import Footer from "../components/footer/Footer";
import Layout from "../components/layout/Layout";

const product = {
  id: 8,
  category_id: 4,
  name: "Kue Lapis Update",
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  price: "150000.00",
  capital: "50000.00",
  profit: "100000.00",
  stock: 74,
  weight: "500.00",
  createdat: "2025-02-02T14:34:30.053Z",
  rating: "5.0",
  images: [
    {
      id: 14,
      product_id: 8,
      link: "http://localhost:1001/assets/img-2-85520f61-23a1-4c26-bba2-4cc2402c1950.jpg",
    },
    {
      id: 15,
      product_id: 8,
      link: "http://localhost:1001/assets/img-3-8c9f844a-0040-49ca-a9aa-e030444b0c19.png",
    },
    {
      id: 16,
      product_id: 8,
      link: "http://localhost:1001/assets/img-4-eb458466-e743-44d6-9308-86168eee9fc3.png",
    },
    {
      id: 17,
      product_id: 8,
      link: "http://localhost:1001/assets/img-5-f8c0d717-7667-4c98-b34d-02aa6e3b34ae.png",
    },
    {
      id: 18,
      product_id: 8,
      link: "http://localhost:1001/assets/img-6-57bd44ed-9d37-43ee-93e3-624d5da6ec1c.png",
    },
  ],
  reviews: [
    {
      user: "User 1",
      rating: 4,
      comment: "Keran bang",
    },
    {
      user: "User 1",
      rating: 5,
      comment: "Keran bang",
    },
    {
      user: "User 1",
      rating: 4,
      comment: "Keran bang",
    },
    {
      user: "User 1",
      rating: 4,
      comment: "Keran bang",
    },
    {
      user: "User 1",
      rating: 4,
      comment: "Keran bang",
    },
    {
      user: "User 1",
      rating: 4,
      comment: "Keran bang",
    },
  ],
};

const Detail = () => {
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
