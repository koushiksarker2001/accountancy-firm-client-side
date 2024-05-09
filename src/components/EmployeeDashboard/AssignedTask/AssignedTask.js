import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { employeeAuth } from "../../../firebase.config";
import axios from "axios";
import "./asssignedTask.css";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

function createData(taskName, taskDescription, taskDeadline, status) {
  return { taskName, taskDescription, taskDeadline, status };
}
function createCompletedData(taskName, taskDescription, taskDeadline, status) {
  return { taskName, taskDescription, taskDeadline, status };
}
function createPostponedData(taskName, taskDescription, taskDeadline, status) {
  return { taskName, taskDescription, taskDeadline, status };
}

const AssignedTask = () => {
  const [user] = useAuthState(employeeAuth);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [postponedTasks, setPostponedTasks] = useState([]);
  const [sort, setSort] = useState();
  const [reloader, setReloader] = useState(false);
  const [pendingRows, setPendingRows] = useState([]);
  const [completeRows, setCompleteRows] = useState([]);
  const [postponedRows, setPostponedRows] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:8080/employee-task/${user?.email}`)
      .then((data) => {
        setTasks(data.data.filter((data) => data.status === "pending"));
        const sortedArray = data?.data?.sort(
          (a, b) =>
            new Date(a.taskDeadline?.split("+")[0]).getTime() -
            new Date(b.taskDeadline?.split("+")[0]).getTime()
        );
        const pendingTasks = sortedArray.filter(
          (data) =>
            data.status === "pending" &&
            createData(
              data.taskName,
              data.taskDescription,
              data.taskDeadline,
              data.status
            )
        );
        setPendingRows(pendingTasks);

        // completed tasks
        setCompletedTasks(
          data.data.filter((data) => data.status === "completed")
        );
        const completedTasks = data.data.filter(
          (data) =>
            data.status === "completed" &&
            createCompletedData(
              data.taskName,
              data.taskDescription,
              data.taskDeadline,
              data.status
            )
        );
        setCompleteRows(completedTasks);

        // postponed tasks
        setPostponedTasks(
          data.data.filter((data) => data.status === "postponed")
        );
        const postponedTaskRows = data.data.filter(
          (data) =>
            data.status === "postponed" &&
            createPostponedData(
              data.taskName,
              data.taskDescription,
              data.taskDeadline,
              data.status
            )
        );
        setPostponedRows(postponedTaskRows);
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
    /* const sortedArray = tasks?.sort(
      (a, b) =>
        new Date(a.taskDeadline?.split("+")[0]).getTime() -
        new Date(b.taskDeadline?.split("+")[0]).getTime()
    );
    setTasks(sortedArray); */
  }, [sort, tasks]);
  return (
    <div>
      {/*    <Box>
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
          </Select>
        </FormControl>
      </Box> */}
      {/* pending tasks */}
      <TableContainer component={Paper} sx={{ margin: "5% 0" }}>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Pending Tasks
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task Name</TableCell>
              <TableCell>Task Description</TableCell>
              <TableCell>Task Deadline</TableCell>
              <TableCell>Task Status</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingRows.map((task) => (
              <TableRow>
                <TableCell>{task?.taskName}</TableCell>
                <TableCell>{task?.taskDescription}</TableCell>
                <TableCell>{task?.taskDeadline}</TableCell>
                <TableCell>{task?.status}</TableCell>

                <TableCell
                  className="completed-task"
                  onClick={() => {
                    setHandleApprove(task?._id);
                    setReloader(!reloader);
                  }}
                >
                  <Button color="success">Complete</Button>
                </TableCell>
                <TableCell
                  onClick={() => {
                    handlePostpone(task?._id);
                    setReloader(!reloader);
                  }}
                  className="postponed-task"
                >
                  <Button color="error">Postpone</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* completed tasks */}
      <TableContainer component={Paper} sx={{ margin: "5% 0" }}>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Completed Tasks
        </Typography>
        <Table>
          <TableHead>
            <TableCell>Task Name</TableCell>
            <TableCell>Task Description</TableCell>
            <TableCell>Task Deadline</TableCell>
            <TableCell>Task Status</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Action</TableCell>
          </TableHead>
          <tbody>
            {completeRows.map((task) => (
              <TableRow>
                <TableCell>{task?.taskName}</TableCell>
                <TableCell>{task?.taskDescription}</TableCell>
                <TableCell>{task?.taskDeadline}</TableCell>
                <TableCell>{task?.status}</TableCell>

                <TableCell
                  className="completed-task"
                  onClick={() => {
                    setHandleApprove(task?._id);
                    setReloader(!reloader);
                  }}
                >
                  <Button color="success">Complete</Button>
                </TableCell>
                <TableCell
                  onClick={() => {
                    handlePostpone(task?._id);
                    setReloader(!reloader);
                  }}
                  className="postponed-task"
                >
                  <Button color="error">Postpone</Button>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
      {/* postponed */}
      <TableContainer component={Paper} sx={{ margin: "5% 0" }}>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Postponed Tasks
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task Name</TableCell>
              <TableCell>Task Description</TableCell>
              <TableCell>Task Deadline</TableCell>
              <TableCell>Task Status</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {postponedRows.map((task) => (
              <TableRow>
                <TableCell>{task?.taskName}</TableCell>
                <TableCell>{task?.taskDescription}</TableCell>
                <TableCell>{task?.taskDeadline}</TableCell>
                <TableCell>{task?.status}</TableCell>

                <TableCell
                  className="completed-task"
                  onClick={() => {
                    setHandleApprove(task?._id);
                    setReloader(!reloader);
                  }}
                >
                  <Button color="success">Complete</Button>
                </TableCell>
                <TableCell
                  onClick={() => {
                    handlePostpone(task?._id);
                    setReloader(!reloader);
                  }}
                  className="postponed-task"
                >
                  <Button color="error">Postpone</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AssignedTask;
