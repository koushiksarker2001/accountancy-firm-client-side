import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import axios from "axios";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const CreateCompany = () => {
  const [clientEmail, setClientEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyRegistration, setCompanyRegistration] = useState("");
  const [assign, setAssign] = useState("");
  const [annualReturnDone, setAnnualReturnDone] = useState("");
  const [annualReturnDue, setAnnualReturnDue] = useState("");
  const [annualAccountsDone, setAnnualAccountsDone] = useState("");
  const [annualAccountsDue, setAnnualAccountsDue] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [successStatus, setSuccessStatus] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:8080/employee")
      .then((data) => {
        setEmployeeList(data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // annual return done
    const isoAnnualReturnDone = new Date(annualReturnDone).toISOString();
    const formattedAnnualReturnDone =
      DateTime.fromISO(isoAnnualReturnDone).toISO();
    // annual return due
    const isoAnnualReturnDue = new Date(annualReturnDue).toISOString();
    const formattedAnnualReturnDue =
      DateTime.fromISO(isoAnnualReturnDue).toISO();
    // annual accounts done
    const isoAnnualAccountsDone = new Date(annualAccountsDone).toISOString();
    const formattedAnnualAccountsDone = DateTime.fromISO(
      isoAnnualAccountsDone
    ).toISO();
    // annual accounts due
    const isoAnnualAccountsDue = new Date(annualAccountsDue).toISOString();
    const formattedAnnualAccountsDue =
      DateTime.fromISO(isoAnnualAccountsDue).toISO();
    const body = {
      clientEmail: clientEmail,
      companyRegistration: companyRegistration,
      companyName: companyName,
      annualReturnDone: formattedAnnualReturnDone,
      annualReturnDue: formattedAnnualReturnDue,
      annualAccountsDone: formattedAnnualAccountsDone,
      annualAccountsDue: formattedAnnualAccountsDue,
      assign: assign,
    };
    await axios
      .post("http://localhost:8080/create-company", body)
      .then((data) => {
        setSuccessStatus(data.data);
        data.data == "Successful"
          ? toast.success("Company created successfully")
          : toast.warn("Failed to create");
      })
      .catch((err) => toast.error("Server offline"));
  };

  return (
    <div>
      <Box>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "50%",
          }}
        >
          <Typography variant="h5" style={{ textAlign: "center" }}>
            Create a new company
          </Typography>
          {/* Client email */}
          <TextField
            id="outlined-basic"
            label="Client Email"
            variant="outlined"
            type="email"
            onChange={(e) => setClientEmail(e.target.value)}
            required
          />
          {/* company name */}
          <TextField
            id="outlined-basic"
            label="Company Name"
            variant="outlined"
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
          {/* company reg */}
          <TextField
            id="outlined-basic"
            label="Company Registration Number"
            variant="outlined"
            onChange={(e) => setCompanyRegistration(e.target.value)}
            required
          />
          {/* annual return done */}

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <label>Annual Return Done</label>
            <DatePicker
              value={annualReturnDone}
              onChange={(newValue) => setAnnualReturnDone(newValue)}
              required
            />
          </LocalizationProvider>
          {/* annual return due */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <label>Annual Return Due</label>
            <DatePicker
              value={annualReturnDue}
              onChange={(newValue) => setAnnualReturnDue(newValue)}
              required
            />
          </LocalizationProvider>
          {/* annual accounts done */}

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <label>Annual Accounts Done</label>
            <DatePicker
              value={annualAccountsDone}
              onChange={(newValue) => setAnnualAccountsDone(newValue)}
              required
            />
          </LocalizationProvider>
          {/* annual accounts due */}

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <label>Annual Accounts Due</label>
            <DatePicker
              value={annualAccountsDue}
              onChange={(newValue) => setAnnualAccountsDue(newValue)}
              required
            />
          </LocalizationProvider>
          {/* assign to */}
          <label>Assign to: </label>
          <Autocomplete
            disablePortal
            getOptionLabel={(employee) => employee.email}
            options={employeeList}
            inputValue={assign}
            onInputChange={(event, newInputValue) => {
              setAssign(newInputValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Employee List" required />
            )}
          />
          {successStatus && (
            <Typography
              sx={{
                color: `${successStatus === "Successful" ? "green" : "red"}`,
              }}
            >
              {successStatus}
            </Typography>
          )}
          <button
            type="submit"
            className="employee-input employee-input-button"
          >
            Submit
          </button>
        </form>
      </Box>
      <ToastContainer />
    </div>
  );
};

export default CreateCompany;
