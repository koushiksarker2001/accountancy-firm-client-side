import { Box, Grid, Typography } from "@mui/material";
// import deleteIcon from "./../../../assets/images/Delete.png";
// import "./PsychologistDetails.css";
import React from "react";

export default function SelectedDateAndTime({ details, handleDelete }) {
  return (
    <Grid
      item
      md={6}
      className="scroollbar"
      style={{ maxHeight: "450px", width: "100%", overflowY: "scroll" }}
    >
      <Box style={{ background: "#F5F5F5", padding: "2rem" }}>
        <Typography
          variant="h4"
          style={{ textAlign: "center" }}
          sx={{
            fontSize: {
              xs: "5vw",
              sm: "3vw",
              md: "2vw",
            },
          }}
        >
          Schedule
        </Typography>

        {details?.availableDateTimes?.length
          ? details?.availableDateTimes?.map((dateTimes) =>
              dateTimes?.date && dateTimes?.times?.length ? (
                <>
                  <Box key={dateTimes.id}>
                    <p>
                      <span style={{ color: "#31C75A" }}>Day:</span>{" "}
                      {dateTimes.date}
                    </p>
                    <Grid container>
                      <Grid item xs={5}>
                        <Typography>Start Time</Typography>
                      </Grid>
                      <Grid item xs={5}>
                        <Typography>End Time</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography></Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box>
                    <Grid container>
                      {dateTimes.times.map((time) => (
                        <>
                          <Grid item xs={5}>
                            <Typography>{time.startTime}</Typography>
                          </Grid>
                          <Grid item xs={5}>
                            <Typography>{time.endTime}</Typography>
                          </Grid>
                          {/* <Grid item xs={2}>
                            <img
                              onClick={() => handleDelete(dateTimes.date, time)}
                              src={deleteIcon}
                              alt="deleteicon"
                              style={{
                                width: "1.5rem",
                                height: "1.5rem",
                                cursor: "pointer",
                              }}
                            />
                          </Grid> */}
                        </>
                      ))}
                    </Grid>
                  </Box>
                </>
              ) : (
                ""
              )
            )
          : ""}
      </Box>
    </Grid>
  );
}
