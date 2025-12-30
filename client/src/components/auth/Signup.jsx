import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShow, setShow] = useState(false);

  const loginHandler = (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      alert("Data wajib diisi");
    }

    const data = { username, email, password };

    console.log(data);
  };

  return (
    <div className="bg-info d-flex align-items-center justify-content-center min-vh-100">
      <form
        style={{ width: 350 }}
        className="rounded p-4 border shadow d-flex flex-column gap-2 bg-white"
        onSubmit={loginHandler}
      >
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Nama Lengkap"
          className="form-control"
          value={email || ""}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          className="form-control"
          value={email || ""}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type={isShow ? "text" : "password"}
          name="email"
          id="password"
          placeholder="password"
          className="form-control"
          value={password || ""}
          onChange={(e) => setPassword(e.target.value)}
          required
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

          <p className="m-0 pointer" onClick={() => navigate("/signin")}>
            Sudah Punya Akun?
          </p>
        </div>

        <div className="text-end">
          <button type="submit" className="btn btn-primary">
            Daftar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
