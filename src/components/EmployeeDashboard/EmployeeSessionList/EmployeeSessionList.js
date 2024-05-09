import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { employeeAuth } from "../../../firebase.config";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

function createData(userEmail, date, startTime, fullName, _id) {
  return { userEmail, date, startTime, fullName, _id };
}
const EmployeeSessionList = () => {
  const [session, setSession] = useState([]);
  const [user] = useAuthState(employeeAuth);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:8080/booking/${user?.email}`)
      .then((data) => {
        setSession(data.data);
        const sortedArray = data.data?.sort(
          (a, b) =>
            new Date(a?.originalDate?.split("+")[0]).getTime() -
            new Date(b?.originalDate?.split("+")[0]).getTime()
        );
        const sessionRows = sortedArray.map((data) =>
          createData(
            data.userEmail,
            data.date,
            data.startTime,
            data.fullName,
            data._id
          )
        );
        setRows(sessionRows);
      })
      .catch((err) => console.log(err));
  }, [user]);

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" sx={{ textAlign: "center" }}>
        Session list
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Client Session Email</TableCell>
            <TableCell>Session date</TableCell>
            <TableCell>Session Time</TableCell>
            <TableCell>Full Name</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((session) => (
            <TableRow key={session?._id}>
              <TableCell>{session?.userEmail}</TableCell>
              <TableCell>{session?.date}</TableCell>
              <TableCell>{session?.startTime}</TableCell>
              <TableCell>{session?.fullName}</TableCell>
              <TableCell>
                {" "}
                <Link to={`${session?._id}`}>
                  <Button>Join</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmployeeSessionList;
