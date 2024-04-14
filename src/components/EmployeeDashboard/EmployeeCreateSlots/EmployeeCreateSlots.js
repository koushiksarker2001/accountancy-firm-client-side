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
  TextField,
  Typography,
} from "@mui/material";
import SelectedDateAndTime from "./SelectedDateAndTime";

import { useAuthState } from "react-firebase-hooks/auth";
import { employeeAuth } from "../../../firebase.config";

const boxStyle = {
  padding: "2rem",
  marginTop: "8rem",
  "@media (max-width: 500px)": {
    padding: "0rem",
  },
};

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
      let filteredDates = dates.filter((date) => date.date == selectedDate);
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

  const handleDelete = (date, time) => {
    let selectedArr = details.availableDateTimes.filter(
      (dateTimes) => dateTimes.date === date
    );
    let filteredDate = selectedArr[0].times.filter((obj) => obj !== time);

    let filteredDateObj = dates.filter((data) => data.date == date);
    filteredDateObj[0].times = filteredDate;
    setDates([...dates]);
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

    if (!response.ok) {
      alert("Something Went Wrong");
    }
    if (response.ok) {
      // setError(null);
      // setSuccess("Session boked successfully");
      setDetails({
        availableDateTimes: [],
      });
      setDates({
        date: "",
        times: [],
      });
      setTimeObj({
        startTime: "",
        endTime: "",
      });
      // navigate("/psychologist-dashboard");
    }
  };

  return (
    <Box>
      <Container
        sx={{
          flexGrow: 1,
        }}
      >
        <Box style={boxStyle}>
          <Grid container spacing={4}>
            <Grid item md={6} style={{ width: "100%" }}>
              <Box style={{ background: "#F5F5F5", padding: "2rem" }}>
                <Typography variant="h4" style={{ textAlign: "center" }}>
                  Date Selector
                </Typography>
                <Box style={{ display: "flex", flexDirection: "column" }}>
                  {/* <Typography variant="p">Date</Typography>
                                    <TextField
                                        id="standard-basic"
                                        name='name'
                                        type='date'
                                        variant="outlined"
                                        value={selectedDate}
                                        onChange={e => setSelectedDate(e.target.value)}
                                    /> */}

                  <FormControl fullWidth>
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
                  />
                </Box>

                {/* <Box style={{ display: "flex", flexDirection: "column" }}>
                                    <Typography variant="p">End Time</Typography>
                                    <TextField
                                        id="standard-basic"
                                        // label="End Time"
                                        name='name'
                                        type='time'
                                        variant="outlined"
                                        value={timeObj.endTime.split(" ")[0]}
                                        onChange={handleEndTime}
                                    />
                                </Box> */}
                <Box style={{ marginTop: "2rem" }}>
                  <Button
                    onClick={handleAdd}
                    style={{ background: "#31C75A", color: "#fff" }}
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
          </Grid>

          {/* Submitting Button */}
          <Box style={{ textAlign: "right" }}>
            <Button
              onClick={handleSubmit}
              style={{
                backgroundColor: "#31C75A",
                marginTop: "1rem",
                padding: "20px 30px",
                borderRadius: "15px",
                color: "white",
                marginRight: "20px",
              }}
            >
              Submit
            </Button>
            {/* <Button onClick={() => setPage(1)} style={{ backgroundColor: '#31C75A', marginTop: '1rem', padding: '20px 30px', borderRadius: '15px', color: 'white', float: 'right', marginRight: '20px' }}>Back</Button> */}
          </Box>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </Box>
      </Container>
    </Box>
  );
};

export default EmployeeCreateSlots;
