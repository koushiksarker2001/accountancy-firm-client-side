import { Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import axios from "axios";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";

const AdminStatistics = () => {
  const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
  // return done
  const [annualReturnDone, setAnnualReturnDone] = useState([]);
  const [annualReturnDoneCount, setAnnualReturnDoneCount] = useState([]);
  // return due
  const [annualReturnDue, setAnnualReturnDue] = useState([]);
  const [annualReturnDueCount, setAnnualReturnDueCount] = useState([]);

  // accounts done
  const [annualAccountsDone, setAnnualAccountsDone] = useState([]);
  const [annualAccountsDoneCount, setAnnualAccountsDoneCount] = useState([]);

  // accounts due
  const [annualAccountsDue, setAnnualAccountsDue] = useState([]);
  const [annualAccountsDueCount, setAnnualAccountsDueCount] = useState([]);
  const xLabels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "Jun",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  useEffect(() => {
    axios.get("http://localhost:8080/company").then((data) => {
      const filter = [];
      const filterReturnDue = [];

      const filterAccountsDone = [];
      const filterAccountsDue = [];
      // return done
      xLabels.map((xLabel) => {
        const annualReturnDoneFilter = data?.data.filter(
          (data) =>
            DateTime.fromISO(data.annualReturnDone).toFormat("LLLL") == xLabel
        );
        filter.push(annualReturnDoneFilter);
      });
      // return due
      xLabels.map((xLabel) => {
        const annualReturnDueFilter = data?.data.filter(
          (data) =>
            DateTime.fromISO(data.annualReturnDue).toFormat("LLLL") == xLabel
        );
        filterReturnDue.push(annualReturnDueFilter);
      });
      // accounts done
      xLabels.map((xLabel) => {
        const annualAccountsDoneFilter = data?.data.filter(
          (data) =>
            DateTime.fromISO(data.annualAccountsDone).toFormat("LLLL") == xLabel
        );
        filterAccountsDone.push(annualAccountsDoneFilter);
      });
      // accounts due
      xLabels.map((xLabel) => {
        const annualAccountsDueFilter = data?.data.filter(
          (data) =>
            DateTime.fromISO(data.annualAccountsDue).toFormat("LLLL") == xLabel
        );
        filterAccountsDue.push(annualAccountsDueFilter);
      });
      setAnnualReturnDone(filter);
      setAnnualReturnDue(filterReturnDue);
      setAnnualAccountsDone(filterAccountsDone);
      setAnnualAccountsDue(filterAccountsDue);
    });
  }, []);

  useEffect(() => {
    const count = [];
    const returnDueCount = [];
    const annualDoneCount = [];
    const annualDueCount = [];
    annualReturnDone?.map((annualReturnDone) => {
      count.push(annualReturnDone.length);
    });
    annualReturnDue?.map((annualReturnDone) => {
      returnDueCount.push(annualReturnDone.length);
    });
    annualAccountsDone?.map((annualAccountsDone) => {
      annualDoneCount.push(annualAccountsDone.length);
    });
    annualAccountsDue?.map((annualAccountsDue) => {
      annualDueCount.push(annualAccountsDue.length);
    });
    setAnnualReturnDoneCount(count);
    setAnnualReturnDueCount(returnDueCount);
    setAnnualAccountsDoneCount(annualDoneCount);
    setAnnualAccountsDueCount(annualDueCount);
  }, [
    annualReturnDone,
    annualReturnDue,
    annualAccountsDone,
    annualAccountsDue,
  ]);

  return (
    <div>
      <Typography>Annual return due statistics</Typography>
      <BarChart
        width={1000}
        height={300}
        series={[
          {
            data: annualReturnDoneCount,
            label: "annual_return_done",
            id: "annual_return_doneId",
          },
          {
            data: annualReturnDueCount,
            label: "annual_return_due",
            id: "annual_return_dueId",
          },
          {
            data: annualAccountsDoneCount,
            label: "annual_accounts_done",
            id: "annual_accounts_doneId",
          },
          {
            data: annualAccountsDueCount,
            label: "annual_accounts_due",
            id: "annual_accounts_dueId",
          },
        ]}
        xAxis={[{ data: xLabels, scaleType: "band" }]}
      />
    </div>
  );
};

export default AdminStatistics;
