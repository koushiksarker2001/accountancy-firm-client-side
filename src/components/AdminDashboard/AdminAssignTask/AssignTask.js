import { Autocomplete, Button, TextField } from "@mui/material";
import {
  DateTimePicker,
  LocalizationProvider,
  StaticDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";

const AssignTask = () => {
  const [employee, setEmployee] = useState([]);
  const [assign, setAssign] = useState("");
  const [deadline, setDeadline] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [successStatus, setSuccessStatus] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:8080/employee")
      .then((data) => setEmployee(data.data))
      .catch((err) => console.log(err));
  }, []);
  const handleDateTime = (dateTime) => {
    const isoDate = new Date(dateTime).toISOString();
    const formatted = DateTime.fromISO(isoDate).toString();
    setDeadline(formatted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      employee: assign,
      taskName: taskName,
      taskDescription: taskDescription,
      taskDeadline: deadline,
      status: "pending",
    };
    axios
      .post("http://localhost:8080/create-task", body)
      .then((data) => console.log(data.data))
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={handleSubmit}
      >
        <label>Assign to: </label>
        <Autocomplete
          fullWidth
          disablePortal
          getOptionLabel={(employee) => employee.email}
          options={employee}
          inputValue={assign}
          onInputChange={(event, newInputValue) => {
            setAssign(newInputValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Employee List" required />
          )}
        />
        <TextField
          id="outlined-basic"
          label="Task Name"
          variant="outlined"
          required
          onChange={(e) => setTaskName(e.target.value)}
        />
        <TextField
          id="outlined-basic"
          label="Task Description"
          variant="outlined"
          required
          onChange={(e) => setTaskDescription(e.target.value)}
        />
        <label>Task deadline</label>
        <LocalizationProvider dateAdapter={AdapterDateFns} required>
          <DateTimePicker
            required
            minDate={new Date().now}
            onChange={handleDateTime}
          />
        </LocalizationProvider>
        <Button type="submit">Assign Task</Button>
      </form>
    </div>
  );
};

export default AssignTask;
