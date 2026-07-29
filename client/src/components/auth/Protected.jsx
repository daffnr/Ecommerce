import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Protected = ({ roles }) => {
  const navigate = useNavigate();
  const { user, isSignin } = useSelector((state) => state.auth);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!user || !roles.includes(user.level) || !isSignin) {
        navigate("/signin");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [user, isSignin, roles]);

  return null;
};

export default Protected;
