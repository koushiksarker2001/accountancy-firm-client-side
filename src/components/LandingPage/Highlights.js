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

const items = [
  {
    icon: <SettingsSuggestRoundedIcon />,
    title: "Individuals",
    description:
      "We will take care of your tax filings and assets in efficient and timely manner.",
  },
  {
    icon: <ConstructionRoundedIcon />,
    title: "StartUps",
    description:
      "Bring us your novel ideas, and we will do everything to make it a reality!",
  },
  {
    icon: <ThumbUpAltRoundedIcon />,
    title: "Retailers",
    description:
      "Your E-commerce or retail business, regarless of how big or small, is dear to us.",
  },
  {
    icon: <AutoFixHighRoundedIcon />,
    title: "Partnerships",
    description:
      "We will assist you in all your financial matters and will give you the right advice.",
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: "Landlords",
    description:
      "Ensuring that your property income is declared in the way its most benificial to you.",
  },
  {
    icon: <QueryStatsRoundedIcon />,
    title: "Businesses",
    description:
      "Limited companys or sole proprietors are given the right advice at the right time.",
  },
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: "white",
        bgcolor: "#06090a",
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
            Who We Work With
          </Typography>
          <Typography variant="body1" sx={{ color: "grey.400" }}>
            Whether you're a sole trader, a startup business, a limited company,
            a partnership, or an individual seeking self-assessment services,
            our solutions will meet your needs.
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
    </Box>
  );
}
