import { Box, Typography } from "@mui/material";
import React from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { employeeAuth } from "../../../firebase.config";
import axios from "axios";

const AdminCreateEmployee = () => {
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(employeeAuth);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    const { email, password } = data;
    const response = await createUserWithEmailAndPassword(email, password);
    if (response?.user?.email) {
      await axios
        .post("http://localhost:8080/admin/employee", {
          email: email,
        })
        .then((res) => console.log(res.data));
    }
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <Box component="section">
      <Typography variant="h4">Create employee account</Typography>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* register your input into the hook by invoking the "register" function */}
        <input {...register("email")} placeholder="employee email" />

        {/* include validation with required or other standard HTML validation rules */}
        <input {...register("password", { required: true })} />
        {/* errors will return when field validation fails  */}
        {errors.email && <span>This field is required</span>}
        {errors.password && <span>This field is required</span>}

        <input type="submit" />
      </form>
    </Box>
  );
};

export default AdminCreateEmployee;
