import React from "react";
import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { useLocation, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { auth } from "../../../firebase.config";

const AdminLogin = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  let navigate = useNavigate();
  let location = useLocation();
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const [loggedUser, loggedLoading, loggedError] = useAuthState(auth);

  let from = location.state?.from?.pathname || "/admin-dashboard";
  if (loggedUser) {
    navigate(from, { replace: true });
  }
  if (loggedLoading || loading) {
    return <p>Loading...</p>;
  }
  const onSubmit = async (data) => {
    console.log(data);
    const response = await signInWithEmailAndPassword(
      data.email,
      data.password
    );
    if (response?.user?.email) {
      navigate(from, { replace: true });
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* register your input into the hook by invoking the "register" function */}
        <input type="text" placeholder="admin email" {...register("email")} />

        {/* include validation with required or other standard HTML validation rules */}
        <input
          type="password"
          placeholder="admin pass"
          {...register("password", { required: true })}
        />
        {/* errors will return when field validation fails  */}
        {errors.email && <span>Email field is required</span>}
        {errors.password && <span>Password field is required</span>}

        <input type="submit" />
      </form>
    </>
  );
};

export default AdminLogin;
