import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import ThumbUpAltRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import AppAppBar from "./AppAppBar";
import getLPTheme from "./getLPTheme";
import Footer from "./Footer";
import {
  AutorenewRounded,
  BusinessRounded,
  CalculateRounded,
  CurrencyPoundRounded,
  HandshakeRounded,
} from "@mui/icons-material";

const items = [
  {
    icon: <BusinessRounded />,
    title: "Taxation",
    description:
      "Our goal is to ensure that you pay the bare minimum of tax needed by law. We will assist you to plan ahead and conduct your business in the most tax-effective manner possible.",
  },
  {
    icon: <CalculateRounded />,
    title: "Accounting",
    description:
      "Whether you're just getting started or already have a running business, we have a variety of accounting solutions to help you develop while keeping your finances in order.",
  },
  {
    icon: <AutorenewRounded />,
    title: "Pensions & Auto-Enrolment",
    description:
      "Setting up a workplace pension plan may be complicated, time-consuming, and costly. At YM, we will make it simple, easy and efficient for you.",
  },
  {
    icon: <CurrencyPoundRounded />,
    title: "Pay roll",
    description:
      " Every business, no matter how big or small, has to deal with the difficulties of finding the right payroll solution. Worry not! we are here to help.",
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: "Business Support",
    description:
      "We provide a broad range of services to assess your company's risk and potential, as well as support services to assist you in pursuing them.",
  },
  {
    icon: <HandshakeRounded />,
    title: "Consultation & Advice",
    description:
      "We use our knowledge to investigate opportunities and detect potential problems before they develop in a swift and accurate manner.",
  },
];

export default function Services() {
  const [mode, setMode] = React.useState("dark");
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };
  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Box
        id="highlights"
        sx={{
          pt: { xs: 4, sm: 12 },
          pb: { xs: 8, sm: 16 },
          color: "white",
          bgcolor: "#06090a",
          marginTop: "50px",
        }}
      >
        <Container
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: { xs: 3, sm: 6 },
          }}
        >
          <Box
            sx={{
              width: { sm: "100%", md: "60%" },
              textAlign: { sm: "left", md: "center" },
            }}
          >
            <Typography component="h2" variant="h4">
              Services
            </Typography>
            <Typography variant="body1" sx={{ color: "grey.400" }}>
              Over the years, we've assisted many of our clients in expanding
              and developing their assests and businesses. Providing a full
              variety of financial and business support services, as well as
              ongoing strategic guidance.
            </Typography>
          </Box>
          <Grid container spacing={2.5}>
            {items.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Stack
                  direction="column"
                  color="inherit"
                  component={Card}
                  spacing={1}
                  useFlexGap
                  sx={{
                    p: 3,
                    height: "100%",
                    border: "1px solid",
                    borderColor: "grey.800",
                    background: "transparent",
                    backgroundColor: "grey.900",
                  }}
                >
                  <Box sx={{ opacity: "50%" }}>{item.icon}</Box>
                  <div>
                    <Typography fontWeight="medium" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "grey.400" }}>
                      {item.description}
                    </Typography>
                  </div>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
