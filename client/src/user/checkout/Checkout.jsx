import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetShippingCostMutation } from "../../api/request/ApiAddress";
import { useCreateOrderMutation } from "../../api/request/ApiOrder";
import {toast} from "react-toastify"

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="p-2 bg-white shadow">
      <div className="container">
        <div
          className="overflow-hidden"
          style={{ height: 50, width: 50 }}
          onClick={() => navigate("/")}
          role="button"
        >
          <img
            src="/image/logo.png"
            width="100%"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
};

const AddressSection = () => (
  <div className="rounded border shadow p-3 bg-white">
    <div className="d-flex justify-content-between align-items-center">
      <p className="h5 text-muted">Alamat Pengiriman</p>
      <button className="btn btn-info">Ganti</button>
    </div>
    <p className="h6">Nama User</p>
    <p className="fst-italic">Jln Merdeka Finansial, Jawa Barat</p>
  </div>
);

const ProductItem = ({
  product,
  updateQuantity,
  courier,
  setCourier,
  isLoading,
  services,
  service,
  setService,
  error,
}) => (
  <div className="row align-items-center">
    <div className="col-lg-3 col-6 mb-2">
      <div className="overflow-hidden" style={{ height: 80, width: 80 }}>
        <img src={product.img} width="100%" style={{ objectFit: "cover" }} />
      </div>
    </div>
    <div className="col-lg-6 col-6">
      <p className="m-0">{product.name}</p>
      <p className="m-0 text-muted">{`${
        product.totalWeight || product.weight
      } gram`}</p>
      <p className="h6">{`Rp ${parseFloat(product.subtotal).toLocaleString(
        "id-ID",
      )}`}</p>
    </div>
    <div className="col-lg-3 col-6">
      <div className="d-flex gap-1 align-items-center justify-content-center">
        <button
          className="btn btn-pill btn-light"
          onClick={() => updateQuantity(product.id, "decrease")}
        >
          -
        </button>
        <p className="m-0 text-center text-secondary" style={{ width: 60 }}>
          {product.quantity}
        </p>
        <button
          className="btn btn-pill btn-light"
          onClick={() => updateQuantity(product.id, "increase")}
        >
          +
        </button>
      </div>
    </div>
    <div className="col-lg-12 col-6 mt-2">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <select
          name="shipping"
          id="shipping"
          className="form-select"
          value={courier}
          onChange={(e) => setCourier(e.target.value)}
        >
          <option value="" hidden>
            Pilih Pengiriman
          </option>
          <option value="jne">JNE</option>
          <option value="tiki">TIKI</option>
          <option value="jnt">J&T</option>
        </select>
      )}

      {error ? (
        <p className="text-danger m-2 mt-2">Layanan Tidak Tersedia</p>
      ) : service == null ? (
        <p className="text-danger m-2 mt-2">Layanan Tidak Tersedia</p>
      ) : services?.length > 0 ? (
        <select
          name="shipping"
          id="shipping"
          className="form-select mt-2"
          value={service}
          onChange={(e) => setService(e.target.value)}
        >
          <option value="" hidden>
            Pilih Ongkir
          </option>
          {services?.map((item, i) => (
            <option
              key={i}
              value={item.cost}
            >{`Rp ${parseFloat(item.cost).toLocaleString("id-ID")} - ${item.etd} - ${item.description}`}</option>
          ))}
        </select>
      ) : null}
    </div>
  </div>
);

const ProductList = ({
  checkoutProduct,
  updateQuantity,
  courier,
  setCourier,
  isLoading,
  services,
  service,
  setService,
  error,
}) => (
  <div className="rounded border shadow bg-white p-2 mb-3 d-flex flex-column gap-2">
    {checkoutProduct.map((product) => (
      <ProductItem
        key={product.id}
        product={product}
        updateQuantity={updateQuantity}
        courier={courier}
        setCourier={setCourier}
        isLoading={isLoading}
        services={services}
        service={service}
        setService={setService}
        error={error}
      />
    ))}
  </div>
);

const Summary = ({ checkoutProduct, service, proceed, loading }) => (
  <div className="rounded border shadow p-3 bg-white">
    <p className="h5">Ringkasan Belanja</p>
    <table className="table">
      <tbody>
        <tr>
          <td>SubTotal</td>
          <td>:</td>
          <td>{`Rp${checkoutProduct
            .reduce((acc, product) => acc + Number(product.subtotal), 0)
            .toLocaleString("id-ID")}`}</td>
        </tr>
        <tr>
          <td>Ongkir</td>
          <td>:</td>
          <td>{`Rp ${parseFloat(service ? service : 0).toLocaleString("id-ID")}`}</td>
        </tr>
        <tr>
          <td>Total</td>
          <td>:</td>
          <td>{`Rp ${parseFloat(
            checkoutProduct.reduce(
              (acc, product) => acc + Number(product.subtotal),
              0,
            ) + Number(service),
          ).toLocaleString("id-ID")}`}</td>
        </tr>
      </tbody>
    </table>
    <button className="btn btn-primary w-100" onClick={proceed} disabled={loading}>Bayar Sekarang</button>
  </div>
);

const Checkout = () => {
  const navigate = useNavigate();
  const { isSignin, user } = useSelector((state) => state.auth);
  const [checkoutProduct, setCheckoutProduct] = useState([]);
  const [courier, setCourier] = useState("");
  const [service, setService] = useState("");
  const [getShippingCost, { data, isLoading, error: shippingError }] =
    useGetShippingCostMutation();

  const [createOrder, {data: token, isLoading: tokenLoad, error, isSuccess, reset}] = useCreateOrderMutation()

  const paymentProceed = () => {
    const data = {products: checkoutProduct, gross_amount:checkoutProduct.reduce(
              (acc, product) => acc + Number(product.subtotal),
              0,
            ) + Number(service),
            shipping: service,
          };

          createOrder(data)
  };

  useEffect(() => {
    if(isSuccess){
    console.log(token)
    window.location.href = token.redirect_url
    }
    if (error){
      toast.error(error?.data?.message || error?.message || "Terjadi kesalahan")
    }
  }, [token, isSuccess, error])

  useEffect(() => {
    const totalWeight = checkoutProduct?.reduce(
      (sum, product) => sum + (product.totalWeight || product.weight),
      0,
    );

    if (courier && user?.address?.data_id) {
      getShippingCost({
        courier,
        weight: totalWeight,
        destination: user?.address?.data_id,
      });
    }
  }, [courier, checkoutProduct, user, getShippingCost]);

  console.log(service);

  useEffect(() => {
    if (!isSignin) {
      navigate("/");
    }
  }, [isSignin]);

  useEffect(() => {
    const storedProduct = sessionStorage.getItem("checkout_product");
    if (storedProduct) {
      setCheckoutProduct(JSON.parse(storedProduct));
    }
  }, []);

  const updateQuantity = (id, action) => {
    setCheckoutProduct((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === id) {
          let newQuantity =
            action === "increase" ? product.quantity + 1 : product.quantity - 1;
          newQuantity = Math.max(1, Math.min(newQuantity, product.stock));
          return {
            ...product,
            quantity: newQuantity,
            subtotal: newQuantity * product.price,
            totalWeight: newQuantity * product.weight,
          };
        }
        return product;
      }),
    );
  };

  return (
    <div className="min-vh-100 bg-light">
      <Header />
      <div className="container mt-4">
        <p className="h3">Checkout</p>
        <div className="row">
          <div className="col-lg-8 col-12">
            <div className="d-flex flex-column gap-2">
              <AddressSection />
              <ProductList
                checkoutProduct={checkoutProduct}
                updateQuantity={updateQuantity}
                courier={courier}
                setCourier={setCourier}
                isLoading={isLoading}
                services={data && data}
                service={service}
                setService={setService}
                error={shippingError}
              />
            </div>
          </div>
          <div className="col-lg-4 col-12">
            <Summary checkoutProduct={checkoutProduct} service={service} proceed={paymentProceed} loading={tokenLoad} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
