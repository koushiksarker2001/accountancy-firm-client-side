import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

const AdminTaskStatus = () => {
  const [employee, setEmployee] = useState([]);
  const [select, setSelect] = useState("");
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8080/employee")
      .then((data) => setEmployee(data.data))
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    axios
      .get(`http://localhost:8080/employee-task/${select}`)
      .then((data) => setTasks(data.data))
      .catch((err) => console.log(err));
  }, [select]);
  return (
    <div style={{ width: "500px" }}>
      <label>Select Employee: </label>
      <Autocomplete
        fullWidth
        disablePortal
        getOptionLabel={(employee) => employee.email}
        options={employee}
        inputValue={select}
        onInputChange={(event, newInputValue) => {
          setSelect(newInputValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Employee List" required />
        )}
      />
      <table border="1" style={{ borderSpacing: "10px" }}>
        <caption style={{ fontSize: "20px" }}>Tasks Status</caption>
        <thead>
          <th>Task Name</th>
          <th>Task Description</th>
          <th>Task Deadline</th>
          <th>Task Status</th>
        </thead>
        <tbody>
          {tasks?.map((task) => (
            <tr>
              <td>{task?.taskName}</td>
              <td>{task?.taskDescription}</td>
              <td>{task?.taskDeadline}</td>
              <td>{task?.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTaskStatus;
