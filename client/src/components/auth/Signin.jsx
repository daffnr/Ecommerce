import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSigninMutation } from "../../api/request/ApiAuth";
import { setLogin } from "../../api/slice/AuthSlice";
import { toast } from "react-toastify";

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signin, { isLoading, error }] = useSigninMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShow, setShow] = useState(false);

  const loginHandler = async (e) => {
    e.preventDefault();

    const data = { email, password };

    try {
      const response = await signin(data).unwrap();
      dispatch(setLogin(response.user));

      navigate("/user-dashboard");
      
    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
    }
  };

  return (
    <div className="bg-info d-flex align-items-center justify-content-center min-vh-100">
      <form
        style={{ width: 350 }}
        className="rounded p-4 border shadow d-flex flex-column gap-2 bg-white"
        onSubmit={loginHandler}
      >
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          className="form-control"
          value={email || ""}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type={isShow ? "text" : "password"}
          name="email"
          id="password"
          placeholder="password"
          className="form-control"
          value={password || ""}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="d-flex justify-content-between">
          <div className="form-check">
            <input
              type="checkbox"
              name="check"
              id="check"
              className="form-check-input pointer"
              onChange={() => setShow(!isShow)}
            />
            <label htmlFor="check" className="form-check-label">
              Lihat Password
            </label>
          </div>

          <p className="m-0 pointer" onClick={() => navigate("/signup")}>
            Belum Punya Akun?
          </p>
        </div>

        <div className="text-end">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            Masuk
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signin;
