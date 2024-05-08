import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import SelectedDateAndTime from "./SelectedDateAndTime";

import { useAuthState } from "react-firebase-hooks/auth";
import { employeeAuth } from "../../../firebase.config";
import axios from "axios";
import { Delete } from "@mui/icons-material";

const boxStyle = {
  padding: "2rem",
  marginTop: "8rem",
  "@media (max-width: 500px)": {
    padding: "0rem",
  },
};
function createData(day, startTime, endTime, index) {
  return { day, startTime, endTime, index };
}
const EmployeeCreateSlots = ({}) => {
  const [details, setDetails] = useState({
    availableDateTimes: [],
  });

  let [dates, setDates] = useState([]);
  let [timeObj, setTimeObj] = useState({
    startTime: "",
    endTime: "",
  });
  let [selectedDate, setSelectedDate] = useState("");
  let [error, setError] = useState("");

  let navigate = useNavigate();
  const [user] = useAuthState(employeeAuth);

  const handleAdd = () => {
    if (
      selectedDate !== "" &&
      timeObj.startTime !== "" &&
      timeObj.endTime !== ""
    ) {
      let filteredDates = dates?.filter((date) => date.date == selectedDate);
      console.log(filteredDates);
      if (filteredDates.length) {
        filteredDates[0].times.push(timeObj);
      } else {
        let dateObj = {
          date: selectedDate,
          times: [timeObj],
        };
        setDates([...dates, dateObj]);
      }

      setSelectedDate("");
      setTimeObj({
        startTime: "",
        endTime: "",
      });
    }

    setDetails({ ...details, email: user?.email });
    console.log(details);
  };

  useEffect(() => {
    setDetails({ ...details, availableDateTimes: dates });
  }, [dates]);

  const timeConverter = (time) => {
    let hours = time.split(":")[0];
    let minutes = time.split(":")[1];
    let meridian;
    if (hours > 12) {
      meridian = "PM";
      hours -= 12;
    } else if (hours < 12) {
      meridian = "AM";
      if (hours == 0) {
        hours = 12;
      }
    } else {
      meridian = "PM";
    }
    console.log(time);
    return time.concat(" ", meridian);
  };

  const handleTime = (e) => {
    let time = e.target.value;
    let startTime = timeConverter(time);

    let endTime = handleEndTime(startTime);
    setTimeObj({ startTime, endTime });
  };

  const handleEndTime = (endTime) => {
    let hours = +endTime.split(":")[0];
    let minutes = endTime.split(":")[1].split(" ")[0];
    let timeZone = endTime.split(":")[1].split(" ")[1];
    hours++;
    if (hours >= 24) {
      hours = 0;
      timeZone = "AM";
    }
    if (hours >= 12) {
      timeZone = "PM";
    }
    let end = hours.toString().concat(":", minutes, " ", timeZone);
    return end;
  };
  const [successStatus, setSuccessStatus] = useState(false);

  // delete slots
  const handleDelete = (index, date, indexDate) => {
    axios
      .put("http://localhost:8080/employee-slot-update", {
        email: user?.email,
        indexDate: indexDate,
        index: index,
      })
      .then(
        (data) => data.data == "Successful" && setSuccessStatus(!successStatus)
      )
      .catch((err) => console.log(err));
  };

  const today = new Date().toISOString().slice(0, 10);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (details.availableDateTimes.length <= 0) {
      setError("Please fill all required input field");
      return;
    }
    const response = await fetch("http://localhost:8080/employee-create-slot", {
      method: "POST",
      body: JSON.stringify({
        ...details,
        createdAt: today,
        email: user?.email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    console.log(json);

    if (json !== "Successful") {
      alert("Something Went Wrong");
    }
    if (json == "Successful") {
      setDetails({
        availableDateTimes: [],
      });
      /*  setDates({
        date: "",
        times: [],
      }); */
      setDates([]);
      setTimeObj({
        startTime: "",
        endTime: "",
      });
    }
  };
  const [employee, setEmployee] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:8080/employee/find-by/${user?.email}`)
      .then((data) => setEmployee(data.data.availableDateTimes))
      .catch((err) => console.log(err));
  }, [details, user, successStatus]);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    const availableDateTimeRows = employee?.map((employee, index) =>
      createData(
        employee?.date,
        employee?.times[0]?.startTime,
        employee?.times[0]?.endTime,
        index
      )
    );
    setRows(availableDateTimeRows);
  }, [employee, successStatus]);

  return (
    <Box>
      <Container
        sx={{
          flexGrow: 1,
        }}
      >
        <Box style={boxStyle}>
          <Grid
            columns={{ md: 12 }}
            container
            sx={{ width: "900px" }}
            spacing={4}
          >
            <Grid item md={4} style={{ width: "100%" }}>
              <Box style={{ background: "#F5F5F5", padding: "2rem" }}>
                <Typography variant="h4" style={{ textAlign: "center" }}>
                  Date Selector
                </Typography>
                <Box style={{ display: "flex", flexDirection: "column" }}>
                  <FormControl
                    fullWidth
                    disabled={dates.length > 0 ? true : false}
                  >
                    <InputLabel id="cateogory">Select Available Day</InputLabel>
                    <Select
                      labelId="cateogory"
                      label="Select Doctor Category"
                      onChange={(e) => setSelectedDate(e.target.value)}
                      value={selectedDate}
                    >
                      {/* var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']; */}
                      <MenuItem
                        style={{
                          display: "block",
                          padding: "10px",
                          paddingLeft: "20px",
                        }}
                        value=""
                      >
                        Select available Day
                      </MenuItem>
                      <MenuItem
                        style={{
                          display: "block",
                          padding: "10px",
                          paddingLeft: "20px",
                        }}
                        value="Sunday"
                      >
                        Sunday
                      </MenuItem>
                      <MenuItem
                        style={{
                          display: "block",
                          padding: "10px",
                          paddingLeft: "20px",
                        }}
                        value="Monday"
                      >
                        Monday
                      </MenuItem>
                      <MenuItem
                        style={{
                          display: "block",
                          padding: "10px",
                          paddingLeft: "20px",
                        }}
                        value="Tuesday"
                      >
                        Tuesday
                      </MenuItem>
                      <MenuItem
                        style={{
                          display: "block",
                          padding: "10px",
                          paddingLeft: "20px",
                        }}
                        value="Wednesday"
                      >
                        Wednesday
                      </MenuItem>
                      <MenuItem
                        style={{
                          display: "block",
                          padding: "10px",
                          paddingLeft: "20px",
                        }}
                        value="Thursday"
                      >
                        Thursday
                      </MenuItem>
                      <MenuItem
                        style={{
                          display: "block",
                          padding: "10px",
                          paddingLeft: "20px",
                        }}
                        value="Friday"
                      >
                        Friday
                      </MenuItem>
                      <MenuItem
                        style={{
                          display: "block",
                          padding: "10px",
                          paddingLeft: "20px",
                        }}
                        value="Saturday"
                      >
                        Saturday
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box style={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="p">Start Time</Typography>
                  <TextField
                    id="standard-basic"
                    name="name"
                    type="time"
                    variant="outlined"
                    value={timeObj.startTime.split(" ")[0]}
                    onChange={handleTime}
                    disabled={dates.length > 0 ? true : false}
                  />
                </Box>

                <Box style={{ marginTop: "2rem" }}>
                  <Button
                    onClick={handleAdd}
                    style={{ background: "#074785", color: "#fff" }}
                  >
                    Add
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* Showing selected Time */}
            <SelectedDateAndTime
              details={details}
              handleDelete={handleDelete}
            />
            <Grid item md={4}>
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
                  Current Schedule
                </Typography>

                {employee?.length
                  ? employee?.map((dateTimes, indexDate) =>
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
                              {dateTimes.times.map((time, index) => (
                                <>
                                  <Grid item xs={5}>
                                    <Typography>{time.startTime}</Typography>
                                  </Grid>
                                  <Grid item xs={5}>
                                    <Typography>{time.endTime}</Typography>
                                  </Grid>
                                  <Grid item xs={2}>
                                    <Delete
                                      onClick={() =>
                                        handleDelete(
                                          index,
                                          dateTimes.date,
                                          indexDate
                                        )
                                      }
                                    ></Delete>
                                  </Grid>
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
          </Grid>

          {/* Submitting Button */}
          <Box style={{ textAlign: "center" }}>
            <Button
              onClick={handleSubmit}
              style={{
                backgroundColor: "#074785",
                marginTop: "1rem",
                padding: "20px 30px",
                borderRadius: "15px",
                color: "white",
              }}
            >
              Submit
            </Button>
          </Box>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </Box>
      </Container>
    </Box>
  );
};

export default EmployeeCreateSlots;
