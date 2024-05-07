import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { publicUserAuth } from "../../../firebase.config";
import axios from "axios";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
function createData(
  companyName,
  companyRegistration,
  annualAccountsDone,
  annualAccountsDue,
  annualReturnDone,
  annualReturnDue,
  assigned
) {
  return {
    companyName,
    companyRegistration,
    annualAccountsDone,
    annualAccountsDue,
    annualReturnDone,
    annualReturnDue,
    assigned,
  };
}
const PublicUserCompany = () => {
  const [user] = useAuthState(publicUserAuth);
  const [company, setCompany] = useState([]);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:8080/public-user/company/${user?.email}`)
      .then((data) => setCompany(data.data))
      .catch((err) => console.log(err));
  }, [user]);
  useEffect(() => {
    const companyRows = company?.map((company) =>
      createData(
        company?.companyName,
        company?.companyRegistration,
        company?.annualAccountsDone,
        company?.annualAccountsDue,
        company?.annualReturnDone,
        company?.annualReturnDue,
        company?.assign
      )
    );
    setRows(companyRows);
  }, [company]);
  return (
    <div>
      {company.length > 0 ? (
        <TableContainer>
          <TableHead>
            <TableRow>
              <TableCell>Company Name</TableCell>
              <TableCell>Company Registration</TableCell>
              <TableCell>Annual Accounts Done</TableCell>
              <TableCell>Annual Accounts Due</TableCell>
              <TableCell>Annual Return Done</TableCell>
              <TableCell>Annual Return Due</TableCell>
              <TableCell>Assigned To</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow>
                <TableCell>{row?.companyName}</TableCell>
                <TableCell>{row?.companyRegistration}</TableCell>
                <TableCell>{row?.annualAccountsDone}</TableCell>
                <TableCell>{row?.annualAccountsDue}</TableCell>
                <TableCell>{row?.annualReturnDone}</TableCell>
                <TableCell>{row?.annualReturnDue}</TableCell>
                <TableCell>{row?.assigned}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>
      ) : (
        <Typography>No company found</Typography>
      )}
    </div>
  );
};

export default PublicUserCompany;
