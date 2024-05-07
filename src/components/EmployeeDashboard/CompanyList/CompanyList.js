import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  DateField,
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { type } from "@testing-library/user-event/dist/type";
import axios from "axios";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
function createData(
  clientEmail,
  companyName,
  companyRegistration,
  annualAccountsDone,
  annualAccountsDue,
  annualReturnDone,
  annualReturnDue,
  assign,
  companyId,
  action
) {
  return {
    clientEmail,
    companyName,
    companyRegistration,
    annualAccountsDone,
    annualAccountsDue,
    annualReturnDone,
    annualReturnDue,
    assign,
    companyId,
    action,
  };
}
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const CompanyList = () => {
  const [company, setCompany] = useState([]);
  const [tempCompany, setTempCompany] = useState([]);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [sort, setSort] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    axios
      .get("http://localhost:8080/company")
      .then((data) => {
        setCompany(data?.data);

        setTempCompany(data.data);

        const companyDay = data?.data?.filter((company) => {
          var end = DateTime.fromISO(company?.annualReturnDue);
          var start = DateTime.fromISO(DateTime.now().toISO());
          var diffInDays = end?.diff(start, "days");
          const difference = Math.round(diffInDays.toObject().days);
          if (difference == 15) {
            return company;
          }
        });
        if (companyDay.length > 0) {
          axios
            .post("http://localhost:8080/send-email", companyDay)
            .then((data) => console.log(data.data))
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }, [updateStatus]);
  const [rows, setRows] = useState([]);
  const [companySearch, setCompanySearch] = useState("");
  useEffect(() => {
    if (sort === 5) {
      const sortedArray = company?.sort(
        (a, b) =>
          new Date(a.annualAccountsDone?.split("+")[0]).getTime() -
          new Date(b.annualAccountsDone?.split("+")[0]).getTime()
      );
      const companyRows = sortedArray?.map((company) =>
        createData(
          company?.clientEmail,
          company?.companyName,
          company?.companyRegistration,
          company?.annualAccountsDone,
          company?.annualAccountsDue,
          company?.annualReturnDone,
          company?.annualReturnDue,
          company?.assign,
          company?._id
        )
      );
      setRows(companyRows);
    } else if (sort === 1) {
      const sortedArray = company?.sort(
        (a, b) =>
          new Date(a.annualAccountsDue?.split("+")[0]).getTime() -
          new Date(b.annualAccountsDue?.split("+")[0]).getTime()
      );
      const companyRows = sortedArray?.map((company) =>
        createData(
          company?.clientEmail,
          company?.companyName,
          company?.companyRegistration,
          company?.annualAccountsDone,
          company?.annualAccountsDue,
          company?.annualReturnDone,
          company?.annualReturnDue,
          company?.assign,
          company?._id
        )
      );
      setRows(companyRows);
    } else if (sort === 2) {
      const sortedArray = company?.sort(
        (a, b) =>
          new Date(a.annualReturnDone?.split("+")[0]).getTime() -
          new Date(b.annualReturnDone?.split("+")[0]).getTime()
      );
      const companyRows = sortedArray?.map((company) =>
        createData(
          company?.clientEmail,
          company?.companyName,
          company?.companyRegistration,
          company?.annualAccountsDone,
          company?.annualAccountsDue,
          company?.annualReturnDone,
          company?.annualReturnDue,
          company?.assign,
          company?._id
        )
      );
      setRows(companyRows);
    } else if (sort === 3) {
      const sortedArray = company?.sort(
        (a, b) =>
          new Date(a.annualReturnDue?.split("+")[0]).getTime() -
          new Date(b.annualReturnDue?.split("+")[0]).getTime()
      );
      const companyRows = sortedArray?.map((company) =>
        createData(
          company?.clientEmail,
          company?.companyName,
          company?.companyRegistration,
          company?.annualAccountsDone,
          company?.annualAccountsDue,
          company?.annualReturnDone,
          company?.annualReturnDue,
          company?.assign,
          company?._id
        )
      );
      setRows(companyRows);
    } else if (sort === 4 || sort === "") {
      const companyRows = company?.map((company) =>
        createData(
          company?.clientEmail,
          company?.companyName,
          company?.companyRegistration,
          company?.annualAccountsDone,
          company?.annualAccountsDue,
          company?.annualReturnDone,
          company?.annualReturnDue,
          company?.assign,
          company?._id
        )
      );
      setRows(companyRows);
    }
  }, [company, sort]);
  // accounts modal
  const [annualAccountsDoneModal, setAnnualAccountsDoneModal] = useState("");
  const [annualAccountsDueModal, setAnnualAccountsDueModal] = useState("");
  // return modal
  const [annualReturnDoneModal, setAnnualReturnDoneModal] = useState("");
  const [annualReturnDueModal, setAnnualReturnDueModal] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const filteredCompany = tempCompany?.filter((company) =>
      company?.companyRegistration.includes(companySearch)
    );
    setCompany(filteredCompany);
  };
  const handleExportToExcel = () => {
    const workBook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workBook, sheet, "Sheet 1");
    const excelBuffer = XLSX.write(workBook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "table.xlsx");
  };
  // const [companyReturnDue, setCompanyReturnDue] = useState([]);
  const [id, setId] = useState("");
  const handleUpdate = async (e) => {
    e.preventDefault();

    const annualAccountsDone = DateTime.fromISO(
      new Date(annualAccountsDoneModal).toISOString()
    ).toString();
    const annualAccountsDue = DateTime.fromISO(
      new Date(annualAccountsDueModal).toISOString()
    ).toString();
    const annualReturnDone = DateTime.fromISO(
      new Date(annualReturnDoneModal).toISOString()
    ).toString();
    const annualReturnDue = DateTime.fromISO(
      new Date(annualReturnDueModal).toISOString()
    ).toString();
    await axios
      .put("http://localhost:8080/company-update", {
        id: id,
        annualAccountsDone: annualAccountsDone,
        annualAccountsDue: annualAccountsDue,
        annualReturnDone: annualReturnDone,
        annualReturnDue: annualReturnDue,
      })
      .then(
        (data) => data.data == "Successful" && setUpdateStatus(!updateStatus)
      )
      .catch((err) => console.log(err));
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleExportToExcel}>Export as excel</Button>
      <Box>
        <form onSubmit={handleSearch}>
          <TextField
            id="outlined-basic"
            label="Search by company reg"
            variant="outlined"
            onChange={(e) => setCompanySearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </Box>
      <Box>
        <form>
          <FormControl sx={{ width: "200px" }}>
            <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={sort}
              label="Sort By"
              onChange={(e) => setSort(e.target.value)}
            >
              <MenuItem value={5}>Annual accounts done</MenuItem>
              <MenuItem value={1}>Annual accounts due</MenuItem>
              <MenuItem value={2}>Annual return done</MenuItem>
              <MenuItem value={3}>Annual return due</MenuItem>
              <MenuItem value={4}>Clear</MenuItem>
            </Select>
          </FormControl>
        </form>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Client Email</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Company Registration</TableCell>
              <TableCell align="right">Annual Accounts Done</TableCell>
              <TableCell align="right">Annual Accounts Due</TableCell>
              <TableCell align="right">Annual Return Done</TableCell>
              <TableCell align="right">Annual Return Due</TableCell>
              <TableCell align="right">Assigned to</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row) => (
              <TableRow
                key={row?.email}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row?.clientEmail}
                </TableCell>
                <TableCell align="right">{row?.companyName}</TableCell>
                <TableCell align="right">{row?.companyRegistration}</TableCell>
                <TableCell align="right">{row?.annualAccountsDone}</TableCell>
                <TableCell align="right">{row?.annualAccountsDue}</TableCell>
                <TableCell align="right">{row?.annualReturnDone}</TableCell>
                <TableCell align="right">{row?.annualReturnDue}</TableCell>
                <TableCell align="right">{row?.assign}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      handleOpen();
                      setAnnualAccountsDoneModal(row?.annualAccountsDone);
                      setAnnualAccountsDueModal(row?.annualAccountsDue);
                      setAnnualReturnDoneModal(row?.annualReturnDone);
                      setAnnualReturnDueModal(row?.annualReturnDue);
                      setId(row?.companyId);
                    }}
                  >
                    <TableCell align="right">Update</TableCell>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <form onSubmit={handleUpdate}>
              {/* annual return done */}
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Update Company Dates
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <label>Annual Return Done</label>
                <DateField
                  defaultValue={dayjs(annualReturnDoneModal)}
                  onChange={(newValue) => setAnnualReturnDoneModal(newValue)}
                  required
                />
              </LocalizationProvider>
              {/* annual return due */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <label>Annual Return Due</label>
                <DateField
                  defaultValue={dayjs(annualReturnDueModal)}
                  onChange={(newValue) => setAnnualReturnDueModal(newValue)}
                  required
                />
              </LocalizationProvider>
              {/* annual accounts done */}

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <label>Annual Accounts Done</label>
                <DateField
                  defaultValue={dayjs(annualAccountsDoneModal)}
                  onChange={(newValue) => setAnnualAccountsDoneModal(newValue)}
                  required
                />
              </LocalizationProvider>
              {/* annual accounts due */}

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <label>Annual Accounts Due</label>
                <DateField
                  defaultValue={dayjs(annualAccountsDueModal)}
                  onChange={(newValue) => setAnnualAccountsDueModal(newValue)}
                  required
                />
              </LocalizationProvider>
              <Button type="submit">Update</Button>
            </form>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default CompanyList;
