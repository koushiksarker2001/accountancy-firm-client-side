import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import React from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { employeeAuth, publicUserAuth } from "../../../firebase.config";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const UserCreate = () => {
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(publicUserAuth);
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
        .post("http://localhost:8080/public-user", {
          email: email,
        })
        .then((res) => {
          if (res.data) {
            toast.success("Successfully created client account");
          } else {
            toast.error("Internal database error");
          }
        })
        .catch((err) => console.log(err));
    } else {
      toast.error("Already exists");
    }
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <Box component="section">
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "50%",
          gap: "10px",
        }}
      >
        <Typography variant="h4" style={{ textAlign: "center" }}>
          Create client account
        </Typography>
        {/* register your input into the hook by invoking the "register" function */}
        <TextField
          {...register("email", { required: true })}
          placeholder="Client email"
        />
        {errors.email && (
          <span style={{ color: "red" }}>This field is required</span>
        )}
        {/* include validation with required or other standard HTML validation rules */}
        <TextField
          {...register("password", { required: true })}
          placeholder="Client password"
          type="password"
        />
        {/* errors will return when field validation fails  */}

        {errors.password && (
          <span style={{ color: "red" }}>This field is required</span>
        )}

        {loading ? (
          <div style={{ textAlign: "center" }}>
            <CircularProgress />
          </div>
        ) : (
          <input
            type="submit"
            className="employee-input-button employee-input"
          />
        )}
      </form>
      <ToastContainer />
    </Box>
  );
};

export default UserCreate;
