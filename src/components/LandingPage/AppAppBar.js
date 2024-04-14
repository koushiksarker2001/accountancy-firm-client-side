import * as React from "react";
import PropTypes from "prop-types";
import "./AppAppBar.css";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import ToggleColorMode from "./ToggleColorMode";
import logo from "../../assets/images/logo-transparent.png";
import { Link } from "react-router-dom";
import { CircularProgress, Modal, TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { publicUserAuth } from "../../firebase.config";
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import axios from "axios";
import AccountMenu from "../PublicUserDashboard/AccountMenu/AccountMenu";
const logoStyle = {
  width: "100px",
  padding: "0 10px",
  height: "auto",
  cursor: "pointer",
};
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
function AppAppBar({ mode, toggleColorMode }) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: "smooth" });
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
      setOpen(false);
    }
  };

  // sign up model
  const [modalOpen, setModal] = useState(false);
  const handleOpen = () => setModal(true);
  const handleClose = () => {
    setModal(false);
    setAlreadyInUse(false);
  };
  // sign up modal ends

  // sign in modal
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const handleSignInModalOpen = () => setSignInModalOpen(true);
  const handleSignInModalClose = () => setSignInModalOpen(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(publicUserAuth);
  const [signInWithEmailAndPassword, signInUser, signInLoading] =
    useSignInWithEmailAndPassword(publicUserAuth);
  const [loggedUser] = useAuthState(publicUserAuth);
  const [alreadyInUse, setAlreadyInUse] = useState(false);
  // sign up function
  const onSubmit = async (data) => {
    const { email, password } = data;
    await axios
      .get(`http://localhost:8080/public-user/${email}`)
      .then(async (data) => {
        if (data.data?.email) {
          setAlreadyInUse(true);
        } else {
          const response = await createUserWithEmailAndPassword(
            email,
            password
          );
          console.log(response);
          if (response?.user?.email) {
            await axios
              .post("http://localhost:8080/public-user", {
                email: response?.user?.email,
              })
              .then((data) => {
                if (data) {
                  handleClose();
                  setAlreadyInUse(false);
                }
              })
              .catch((err) => console.log(err));
          }
        }
      });
  };
  // sign up function ends

  // sign in function starts
  const onSignInSubmit = async (data) => {
    const { email, password } = data;

    await axios
      .get(`http://localhost:8080/public-user/${email}`)
      .then(async (data) => {
        console.log(data);
        if (data?.data) {
          const response = await signInWithEmailAndPassword(email, password);

          if (response?.user?.email) {
            handleSignInModalClose();
          }
        }
      });
  };

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              borderRadius: "999px",
              bgcolor:
                theme.palette.mode === "light"
                  ? "rgba(255, 255, 255, 0.4)"
                  : "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(24px)",
              maxHeight: 40,
              border: "1px solid",
              borderColor: "divider",
              boxShadow:
                theme.palette.mode === "light"
                  ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                  : "0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)",
            })}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                ml: "-18px",
                px: 0,
              }}
            >
              <Link to="/">
                <img src={logo} style={logoStyle} alt="logo of sitemark" />
              </Link>
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <MenuItem
                  onClick={() => scrollToSection("features")}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography variant="body2" color="text.primary">
                    Features
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection("testimonials")}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography variant="body2" color="text.primary">
                    Testimonials
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection("highlights")}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Link to="/book-session">
                    <Typography variant="body2" color="text.primary">
                      Contact Us
                    </Typography>
                  </Link>
                </MenuItem>
                <MenuItem
                  // onClick={() => scrollToSection("pricing")}
                  as={Link}
                  to="/services"
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography variant="body2" color="text.primary">
                    Services
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection("faq")}
                  sx={{ py: "6px", px: "12px" }}
                >
                  <Typography variant="body2" color="text.primary">
                    FAQ
                  </Typography>
                </MenuItem>
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 0.5,
                alignItems: "center",
              }}
            >
              <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
              {!loggedUser && (
                <Button
                  color="primary"
                  variant="text"
                  size="small"
                  component="button"
                  onClick={handleOpen}
                >
                  Sign up
                </Button>
              )}
              {!loggedUser ? (
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  onClick={handleSignInModalOpen}
                >
                  Sign In
                </Button>
              ) : (
                <AccountMenu />
              )}
            </Box>
            <Box sx={{ display: { sm: "", md: "none" } }}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: "30px", p: "4px" }}
              >
                <MenuIcon />
              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: "60dvw",
                    p: 2,
                    backgroundColor: "background.paper",
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "end",
                      flexGrow: 1,
                    }}
                  >
                    <ToggleColorMode
                      mode={mode}
                      toggleColorMode={toggleColorMode}
                    />
                  </Box>
                  <MenuItem onClick={() => scrollToSection("features")}>
                    Features
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection("testimonials")}>
                    Testimonials
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection("highlights")}>
                    Highlights
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection("pricing")}>
                    Pricing
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection("faq")}>
                    FAQ
                  </MenuItem>
                  <Divider />
                  <MenuItem>
                    <Button
                      color="primary"
                      variant="contained"
                      component="button"
                      sx={{ width: "100%" }}
                    >
                      Sign up
                    </Button>
                  </MenuItem>
                  <MenuItem>
                    <Button
                      color="primary"
                      variant="outlined"
                      component="button"
                      sx={{ width: "100%" }}
                      onClick={handleOpen}
                    >
                      Sign Up
                    </Button>
                  </MenuItem>
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
        <div>
          {/* <Button onClick={handleOpen}>Open modal</Button> */}
          <Modal
            open={modalOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography variant="h4" sx={{ textAlign: "center" }}>
                Sign Up
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                  "& > :not(style)": { m: 1, width: "100%" },
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="outlined-basic"
                  label="Email"
                  type="email"
                  variant="outlined"
                  placeholder="Please provide a valid email"
                  {...register("email", { required: true })}
                  required
                />
                {errors?.email && (
                  <span style={{ color: "red" }}>This is required</span>
                )}

                <TextField
                  id="outlined-basic"
                  label="Password"
                  variant="outlined"
                  type="password"
                  placeholder="Please provide a password"
                  {...register("password", { required: true })}
                  required
                />
                {errors?.password && (
                  <span style={{ color: "red" }}>This is required</span>
                )}
                {alreadyInUse && !loading && (
                  <Typography sx={{ color: "red", textAlign: "center" }}>
                    Already in use
                  </Typography>
                )}
                {!loading ? (
                  <input className="submit-button-login-signup" type="submit" />
                ) : (
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                  </Box>
                )}
              </Box>
            </Box>
          </Modal>
        </div>
        {/* sign up procedure ends */}
        {/* sign in procedure */}
        <div>
          {/* <Button onClick={handleOpen}>Open modal</Button> */}
          <Modal
            open={signInModalOpen}
            onClose={handleSignInModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography variant="h4" sx={{ textAlign: "center" }}>
                Sign In
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit(onSignInSubmit)}
                sx={{
                  "& > :not(style)": { m: 1, width: "100%" },
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="outlined-basic"
                  label="Email"
                  type="email"
                  variant="outlined"
                  placeholder="Please provide a valid email"
                  {...register("email", { required: true })}
                  required
                />
                {errors?.email && (
                  <span style={{ color: "red" }}>This is required</span>
                )}

                <TextField
                  id="outlined-basic"
                  label="Password"
                  variant="outlined"
                  type="password"
                  placeholder="Please provide a password"
                  {...register("password", { required: true })}
                  required
                />
                {errors?.password && (
                  <span style={{ color: "red" }}>This is required</span>
                )}

                {!signInLoading ? (
                  <input className="submit-button-login-signup" type="submit" />
                ) : (
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                  </Box>
                )}
              </Box>
            </Box>
          </Modal>
        </div>
      </AppBar>
    </div>
  );
}

AppAppBar.propTypes = {
  mode: PropTypes.oneOf(["dark", "light"]).isRequired,
  toggleColorMode: PropTypes.func.isRequired,
};

export default AppAppBar;
