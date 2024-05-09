import React from "react";
import {
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  Typography,
  createTheme,
} from "@mui/material";
import getLPTheme from "../../LandingPage/getLPTheme";
import { ThemeProvider } from "@emotion/react";
import AppAppBar from "../../LandingPage/AppAppBar";
import Footer from "../../LandingPage/Footer";
import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { useLocation, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { auth } from "../../../firebase.config";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const [mode, setMode] = React.useState("dark");
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };
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
  /* if (loggedLoading || loading) {
    return <p>Loading...</p>;
  } */
  const onSubmit = async (data) => {
    console.log(data);
    const response = await signInWithEmailAndPassword(
      data.email,
      data.password
    );
    if (response?.user?.email) {
      navigate(from, { replace: true });
    } else {
      toast.warn("Admin Email/Password is not valid");
    }
  };
  return (
    <>
      <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
        <CssBaseline />
        <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
        <Box
          component="div"
          sx={{ marginTop: "10%", display: "flex", justifyContent: "center" }}
        >
          <Typography variant="h4">Admin Signin</Typography>
        </Box>

        <Box
          component="section"
          sx={{
            display: "flex",
            //   height: "100vh",
            width: "50%",
            justifyItems: "center",
            margin: "0 auto",
            alignItems: "center",
          }}
        >
          <Container>
            <form
              style={{
                width: "100%",

                display: "flex",
                gap: "20px",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: ``,
                padding: "20px",
              }}
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* register your input into the hook by invoking the "register" function */}
              <input
                className="employee-input"
                style={{ width: "80%" }}
                type="text"
                placeholder="Admin email"
                {...register("email", { required: true })}
              />

              {/* include validation with required or other standard HTML validation rules */}
              <input
                placeholder="Admin password"
                className="employee-input"
                type="password"
                style={{ width: "80%" }}
                {...register("password", { required: true })}
              />
              {/* errors will return when field validation fails  */}
              {errors.email && (
                <span style={{ color: "red" }}>Email field is required</span>
              )}
              {errors.password && (
                <span style={{ color: "red" }}>Password field is required</span>
              )}

              {loggedLoading || loading ? (
                <CircularProgress />
              ) : (
                <input
                  className="employee-input employee-input-button"
                  type="submit"
                  style={{ width: "80%" }}
                />
              )}
            </form>
          </Container>
        </Box>
        <Footer />
      </ThemeProvider>
    </>
  );
};

export default AdminLogin;
