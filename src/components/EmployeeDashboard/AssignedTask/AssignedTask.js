import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { employeeAuth } from "../../../firebase.config";
import axios from "axios";
import "./asssignedTask.css";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const AssignedTask = () => {
  const [user] = useAuthState(employeeAuth);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [postponedTasks, setPostponedTasks] = useState([]);
  const [sort, setSort] = useState();
  const [reloader, setReloader] = useState(false);
  useEffect(() => {
    axios
      .get(`http://localhost:8080/employee-task/${user?.email}`)
      .then((data) => {
        // const tempData = data.data;
        setTasks(data.data.filter((data) => data.status === "pending"));

        setCompletedTasks(
          data.data.filter((data) => data.status === "completed")
        );
        setPostponedTasks(
          data.data.filter((data) => data.status === "postponed")
        );
      })
      .catch((err) => console.log(err));
  }, [user, reloader]);
  const setHandleApprove = (id) => {
    axios
      .put(`http://localhost:8080/employee-task/status/${id}`, {
        status: "completed",
      })
      .then((data) => console.log(data.data))
      .catch((err) => console.log(err));
  };
  const handlePostpone = (id) => {
    axios
      .put(`http://localhost:8080/employee-task/status/${id}`, {
        status: "postponed",
      })
      .then((data) => console.log(data.data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    const sortedArray = tasks?.sort(
      (a, b) =>
        new Date(a.taskDeadline?.split("+")[0]).getTime() -
        new Date(b.taskDeadline?.split("+")[0]).getTime()
    );
    setTasks(sortedArray);
  }, [sort, tasks]);
  return (
    <div>
      <Box>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sort}
            label="Sort By"
            onChange={(e) => setSort(e.target.value)}
          >
            <MenuItem value={1}>Sort By Deadline</MenuItem>
            <MenuItem value={2}>Sort By Status</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <table border="1" style={{ borderSpacing: "10px" }}>
        <caption style={{ fontSize: "20px" }}>Pending Tasks</caption>
        <thead>
          <th>Task Name</th>
          <th>Task Description</th>
          <th>Task Deadline</th>
          <th>Task Status</th>
          <th>Action</th>
          <th>Action</th>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr>
              <td>{task?.taskName}</td>
              <td>{task?.taskDescription}</td>
              <td>{task?.taskDeadline}</td>
              <td>{task?.status}</td>

              <td
                className="completed-task"
                onClick={() => {
                  setHandleApprove(task?._id);
                  setReloader(!reloader);
                }}
              >
                Complete
              </td>
              <td
                onClick={() => {
                  handlePostpone(task?._id);
                  setReloader(!reloader);
                }}
                className="postponed-task"
              >
                Postpone
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* completed tasks */}
      <table border="1" style={{ borderSpacing: "10px" }}>
        <caption style={{ fontSize: "20px" }}>Completed Tasks</caption>
        <thead>
          <th>Task Name</th>
          <th>Task Description</th>
          <th>Task Deadline</th>
          <th>Task Status</th>
          <th>Action</th>
          <th>Action</th>
        </thead>
        <tbody>
          {completedTasks.map((task) => (
            <tr>
              <td>{task?.taskName}</td>
              <td>{task?.taskDescription}</td>
              <td>{task?.taskDeadline}</td>
              <td>{task?.status}</td>

              <td
                className="completed-task"
                onClick={() => {
                  setHandleApprove(task?._id);
                  setReloader(!reloader);
                }}
              >
                Complete
              </td>
              <td
                onClick={() => {
                  handlePostpone(task?._id);
                  setReloader(!reloader);
                }}
                className="postponed-task"
              >
                Postpone
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* postponed */}
      <table border="1" style={{ borderSpacing: "10px" }}>
        <caption style={{ fontSize: "20px" }}>Postponed Tasks</caption>
        <thead>
          <th>Task Name</th>
          <th>Task Description</th>
          <th>Task Deadline</th>
          <th>Task Status</th>
          <th>Action</th>
          <th>Action</th>
        </thead>
        <tbody>
          {postponedTasks.map((task) => (
            <tr>
              <td>{task?.taskName}</td>
              <td>{task?.taskDescription}</td>
              <td>{task?.taskDeadline}</td>
              <td>{task?.status}</td>

              <td
                className="completed-task"
                onClick={() => {
                  setHandleApprove(task?._id);
                  setReloader(!reloader);
                }}
              >
                Complete
              </td>
              <td
                onClick={() => {
                  handlePostpone(task?._id);
                  setReloader(!reloader);
                }}
                className="postponed-task"
              >
                Postpone
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignedTask;
