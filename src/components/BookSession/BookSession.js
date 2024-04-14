import TextField from "@mui/material/TextField";
import { useAuthState } from "react-firebase-hooks/auth";
import { employeeAuth } from "../../firebase.config";
import AppAppBar from "../LandingPage/AppAppBar";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

import "./BookSession.css";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";

import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import spinner from "../../assets/images/spinner-loop.gif";

import style from "./styles.module.css";
import { Box, Button, Container, FormControl, Rating } from "@mui/material";
import Grid from "@mui/material/Grid";
import BookSessionForm from "./BookSessionForm";

/* const renderWeekPickerDay = (date, selectedDates, pickersDayProps) => {
  return (
    <PickersDay
      {...pickersDayProps}
      sx={{
        [`&&.${pickersDayClasses.selected}`]: {
          backgroundColor: "rgb(23, 216, 136)",
          borderRadius: "50%",
          border: "1px solid #fff",
          color: "#fff !important",
        },
      }}
    />
  );
}; */

//   MuiButtonBase-root MuiPickersDay-root MuiPickersDay-dayWithMargin css-m42gyj-MuiButtonBase-root-MuiPickersDay-root

const BookSession = () => {
  // the value of the search field

  const [name, setName] = useState("");
  const [employees, setEmployee] = useState([]);
  const [foundResults, setFoundResults] = useState(employees);
  const [selectedEmployees, setSelectedEmployees] = useState("");
  const [value, setValue] = React.useState("");
  const [selectedStartTime, setSelectedStartTime] = React.useState("");
  const [selectedEndTime, setSelectedEndTime] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [date, setDate] = useState("");
  const [allSession, setAllSession] = useState("");
  const [userDetail, setUserDetail] = useState({});
  const [availability, setAvailability] = useState();
  const [checkingDate, setCheckingDate] = useState();
  const [category, setCategory] = useState({
    category: "",
    sessionType: "",
  });

  // const classes = useStyles();
  const [item, setParsedItem] = useState();
  let [error, setError] = useState(null);
  let [success, setSuccess] = useState("");
  const [user] = useAuthState(employeeAuth);

  const bookingEndRef = useRef(null);

  const scrollToBottom = () => {
    bookingEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedStartTime, value]);

  let navigate = useNavigate();

  useLayoutEffect(() => {
    function updateScreen(time) {
      // Make visual updates here.
      if (employees?.length === 0) {
        setIsLoading(true);
        fetch("http://localhost:8080/employee")
          .then((res) => res.json())
          .then((data) => {
            const approvedEmployee = data?.sort(
              (a, b) => new Date(a?.createdAt) - new Date(b?.createdAt)
            );
            setEmployee(approvedEmployee);
            setFoundResults(approvedEmployee);
            setIsLoading(false);
          });
      }
    }

    requestAnimationFrame(updateScreen);
  }, [employees]);

  /* ======== Filter by Categories ====== */

  // the search result
  const filter = (e) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      const results = employees
        ?.filter((employee) => {
          return (
            employee.name.toLowerCase().includes(keyword.toLowerCase()) &&
            employee?.approved
          );
        })
        .sort((a, b) => new Date(a?.createdAt) - new Date(b?.createdAt));
      setFoundResults(results);
    } else {
      let sorted = employees
        ?.filter((employee) => employee?.approved === true)
        ?.sort((a, b) => new Date(a?.createdAt) - new Date(b?.createdAt));
      setFoundResults(sorted);
    }

    setName(keyword);
  };

  const handleSelectValue = (selectedEmployees) => {
    setSelectedEmployees(selectedEmployees);
  };

  useEffect(() => {
    fetch("https://api.thepsycure.com/session")
      .then((res) => res.json())
      .then((data) => {
        const filteredByDate = data.filter((d) => d.date == date.slice(0, 10));

        setAllSession(filteredByDate);
      });
  }, [date]);

  const handleValue = (newValue) => {
    const weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const addDate = newValue.toISOString().slice(8, 10);
    // console.log(addDate, newValue);
    const parseAddDate = parseInt(addDate) + 1;
    const actualDate = parseAddDate < 10 ? `0${parseAddDate}` : parseAddDate;
    // console.log(actualDate);
    const selectedDate = new Date(
      (
        newValue.toISOString().slice(0, 8) +
        actualDate +
        newValue.toISOString().slice(11)
      ).slice(0, 10)
    );

    console.log(selectedDate);
    setValue(weekday[selectedDate.getDay()]);
    setDate(
      newValue.toISOString().slice(0, 8) +
        parseAddDate +
        newValue.toISOString().slice(11)
    );

    setSelectedStartTime("");
    setSelectedEndTime("");
  };

  let employeeArray = employees.map((employee) => employee?.category).flat();
  const uniqueCategories = employeeArray.filter(
    (v, i, a) => a.indexOf(v) === i
  );

  let employeeSessionTypes = employees
    .map((employee) => employee?.sessionType)
    .flat();
  const uniqueCounselingTypes = employeeSessionTypes.filter(
    (v, i, a) => a.indexOf(v) === i
  );

  const weekday = [0, 1, 2, 3, 4, 5, 6];
  const availableDate = selectedEmployees?.availableDateTimes?.map((times) => {
    if (times.date === "Sunday") {
      return 0;
    } else if (times.date === "Monday") {
      return 1;
    } else if (times.date === "Tuesday") {
      return 2;
    } else if (times.date === "Wednesday") {
      return 3;
    } else if (times.date === "Thursday") {
      return 4;
    } else if (times.date === "Friday") {
      return 5;
    } else if (times.date === "Saturday") {
      return 6;
    }
  });
  const unAvailableDate = weekday.filter(
    (day) => !availableDate?.includes(day)
  );

  function isWeekendDay(date) {
    return unAvailableDate.includes(date.getDay());
  }

  const filteredSession = allSession?.length
    ? allSession?.filter(
        (session) =>
          session?.selectedEmployees?.email === selectedEmployees?.email
      )
    : [];

  useEffect(() => {
    fetch("http://localhost:8080/employee")
      .then((res) => res.json())
      .then((users) => {
        const email = user?.email;
        const actualUserDetail = users.filter((user) => user?.email == email);

        setUserDetail(actualUserDetail[0]);
      });
  }, [user]);

  useEffect(() => {
    setTimeout(() => {
      setSuccess(false);
      setError(null);
    }, 3000);
  }, [success, error]);

  const handleSelectedTime = (time) => {
    setSelectedStartTime(time.startTime);
    setSelectedEndTime(time.endTime);
    let sessionDetails = {
      userEmail: user?.email,
      employeeEmail: selectedEmployees?.email,
      startTime: time.startTime,
      endTime: time.endTime,
      date: date.slice(0, 10),
      day: value,
      status: "incomplete",
      selectedEmployees,
      userDetails: userDetail,
    };

    localStorage.setItem("selectedDetails", JSON.stringify(sessionDetails));
    setParsedItem(JSON.parse(localStorage?.getItem("selectedDetails")));
  };

  const handleChange = (e) => {
    const selectCategory = e.target.value;
    setCategory({ ...category, category: selectCategory });
  };

  const handleSessionChange = (e) => {
    const selectSession = e.target.value;
    setCategory({ ...category, sessionType: selectSession });
  };

  const values = foundResults?.map((employee) => {
    let totalReview, likedReview;
    totalReview = employee.reviews?.length;
    likedReview = employee.reviews?.filter(
      (review) => review.rating === "like"
    )?.length;

    return { totalReview, likedReview };
  });
  const [timeSelectionButton, setTimeSelectionButton] = useState(false);

  const { pathname } = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const mediaQuery = window.matchMedia("(max-width:768px)");
  // Function to handle media query changes
  const handleMediaQueryChange = (event) => {
    setIsMobile(event.matches);
  };

  // Attach event listener for media query changes
  useEffect(() => {
    mediaQuery.addListener(handleMediaQueryChange);

    // Initial check for the media query
    setIsMobile(mediaQuery.matches);

    // Cleanup the event listener when the component unmounts
    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, [mediaQuery]);
  return (
    <>
      {pathname !== "/Dashboard/choose-your-employee" ? <AppAppBar /> : null}

      <div style={{ marginBottom: "7rem" }}>
        <Container sx={{ flexGrow: 1 }}>
          <Box className="SelectPsychotherapist">
            <h2
              style={{ textAlign: "center", marginTop: "30px" }}
              variant="h4"
              gutterBottom
              component="div"
            >
              Select Agent
            </h2>
            <hr
              style={{
                display: "block",
                width: "10%",
                height: "3px",
                backgroundColor: "#31C75A",
                border: 0,
                marginBottom: "50px",
              }}
            />
          </Box>
          <div className="searching_container">
            <div>
              <Box style={{ textAlign: "center", widht: "100%" }}>
                {/* <p>Search by Name</p> */}
                <input
                  value={name}
                  onChange={filter}
                  type="Search"
                  placeholder="Search by Name"
                  style={{
                    width: "90%",
                    borderRadius: "25px",
                    padding: "10px 15px",
                    outline: "none",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                />
              </Box>
            </div>
            <div className="category_filter">
              <FormControl fullWidth>
                <div className="flex_center">
                  <p>Sort by Category</p>
                  <select
                    className="select"
                    value={category?.category}
                    onChange={handleChange}
                  >
                    <option value="all">All</option>
                    {uniqueCategories?.map(
                      (categories) =>
                        categories && (
                          <option
                            value={categories}
                            style={{ textTransform: "capitalize" }}
                          >
                            {categories}
                          </option>
                        )
                    )}
                  </select>
                </div>
              </FormControl>
            </div>
            <div className="category_filter">
              <FormControl fullWidth>
                <div className="flex_center">
                  <p>Sort by Time</p>
                  <select
                    className="select"
                    value={availability}
                    onChange={(e) => {
                      setAvailability(e.target.value);
                      setCheckingDate(new Date().toISOString().slice(0, 10));
                    }}
                  >
                    <option value="">All</option>
                    <option value="7">weekly</option>
                  </select>
                </div>
              </FormControl>
            </div>
            <div className="category_filter">
              <FormControl fullWidth style={{ display: "flex" }}>
                <div className="flex_center">
                  <p>Sort by Price</p>
                  <select
                    className="select"
                    value={category?.sessionType}
                    onChange={handleSessionChange}
                  >
                    <option value="all">All</option>
                    {uniqueCounselingTypes?.map(
                      (counseling) =>
                        counseling && (
                          <option
                            value={counseling}
                            style={{ textTransform: "capitalize" }}
                          >
                            {counseling}
                          </option>
                        )
                    )}
                  </select>
                </div>
              </FormControl>
            </div>
          </div>
          {/* card section  */}

          <div className="all_psychologist">
            {foundResults.map((employee, index) => (
              <div className="group-37417">
                <div
                  className="rectangle-59"
                  style={{
                    padding: "0px",
                    height: " 440px",
                  }}
                >
                  <div
                    className="image-main"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      className="employee-image-square"
                      style={{
                        marginTop: "10px",
                        height: "151px",
                        width: "151px",
                        borderRadius: "75.5px",
                      }}
                    >
                      <img
                        style={{
                          borderRadius: "75.5px",
                          width: "100%",
                          height: "100%",
                        }}
                        src={employee?.image}
                        alt=""
                        srcset=""
                      />
                    </div>
                  </div>
                  <div>
                    <p className="employee-name">{employee?.name}</p>
                  </div>
                  <div
                    className="review"
                    style={{
                      marginTop: "2px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Rating
                      className="rating-system"
                      size="large"
                      name="read-only"
                      value={
                        (((values[index].likedReview /
                          values[index].totalReview) *
                          100) /
                          100) *
                          5 ==
                        5
                          ? 5
                          : 4.5
                      }
                      sx={{
                        color: "black",
                      }}
                      precision={0.5}
                      readOnly
                    />
                  </div>
                  <div className="pricing">
                    <p className="pricing-text">{employee?.amount}৳</p>
                  </div>
                  <div className="details">
                    <div className="details-text">
                      {employee?.yourself?.slice(0, 10)}
                      <span className="faded-text">
                        {employee?.yourself?.slice(10, 70)}
                      </span>
                    </div>
                  </div>
                  <div className="group-btn">
                    <HashLink
                      to="#BookSession"
                      style={{ textDecoration: "none" }}
                    >
                      <div
                        className="booking-button-custom"
                        onClick={() => handleSelectValue(employee)}
                      >
                        <p> Book Session</p>
                      </div>
                    </HashLink>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* calender  */}

          {selectedEmployees ? (
            <>
              <Box id="BookSession" sx={{ paddingTop: "5rem" }}>
                <h2
                  style={{ textAlign: "center" }}
                  variant="h4"
                  gutterBottom
                  component="div"
                >
                  Book Session
                </h2>
                <hr
                  style={{
                    display: "block",
                    width: "10%",
                    height: "3px",
                    backgroundColor: "#31C75A",
                    border: 0,
                  }}
                />
              </Box>
              <Grid
                container
                spacing={2}
                style={{
                  marginTop: "2rem",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{ margin: ".5rem" }}
                  className={style.outlinedToday}
                >
                  <Box
                    style={{
                      boxShadow:
                        "0px 7px 8px -4px rgb(0 0 0 / 20%), 0px 12px 17px 2px rgb(0 0 0 / 14%), 0px 5px 22px 4px rgb(0 0 0 / 12%)",
                      borderRadius: "15px",
                      overflow: "hidden",
                    }}
                    sx={{
                      alignItems: "center",
                      borderRadius: "30px",
                      height: "100%",
                    }}
                    ref={value && !selectedStartTime ? bookingEndRef : null}
                  >
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <StaticDatePicker
                        displayStaticWrapperAs="desktop"
                        openTo="day"
                        // disabled
                        minDate={new Date()}
                        // timezone="Asia/Dhaka"
                        shouldDisableDate={isWeekendDay}
                        // renderDay={renderWeekPickerDay}
                        // value={value}
                        onChange={handleValue}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Box>
                </div>
                {value && !selectedStartTime ? (
                  <div ref={bookingEndRef}></div>
                ) : null}

                <div style={{ margin: ".5rem" }}>
                  <Box
                    style={{ textAlign: "center", borderRadius: "15px" }}
                    sx={{ alignItems: "center" }}
                  >
                    {value && (
                      <Box>
                        {selectedEmployees?.availableDateTimes?.map(
                          (pd) =>
                            pd.date == value && (
                              <>
                                <div className="time-button-parent">
                                  <div
                                    className="time-button"
                                    onClick={() =>
                                      setTimeSelectionButton(
                                        !timeSelectionButton
                                      )
                                    }
                                  >
                                    <button>Time</button>
                                    {timeSelectionButton ? (
                                      <span>⯆</span>
                                    ) : (
                                      <span>⯅</span>
                                    )}
                                  </div>
                                </div>
                                <div className="custom-box-parent">
                                  <div
                                    className="custom-box"
                                    style={{
                                      display: timeSelectionButton
                                        ? "block"
                                        : "none",
                                    }}
                                  >
                                    {selectedEmployees?.availableDateTimes.map(
                                      (adt) =>
                                        adt.date === value &&
                                        adt.times.map((time) =>
                                          (filteredSession[0]?.startTime ==
                                            time?.startTime &&
                                            filteredSession[0]?.endTime ==
                                              time?.endTime) ||
                                          (filteredSession[1]?.startTime ==
                                            time?.startTime &&
                                            filteredSession[1]?.endTime ==
                                              time?.endTime) ||
                                          (filteredSession[2]?.startTime ==
                                            time?.startTime &&
                                            filteredSession[2]?.endTime ==
                                              time?.endTime) ||
                                          (filteredSession[3]?.startTime ==
                                            time?.startTime &&
                                            filteredSession[3]?.endTime ==
                                              time?.endTime) ? (
                                            <div style={{ padding: "10px 0" }}>
                                              <Button
                                                style={{
                                                  background: "#31C75A",
                                                  color: "#fff",
                                                }}
                                              >
                                                Already Booked
                                              </Button>
                                            </div>
                                          ) : (
                                            <Box>
                                              <Button
                                                onClick={() =>
                                                  handleSelectedTime(time)
                                                }
                                                className="select-time"
                                                style={{
                                                  width: "90%",
                                                  margin: ".5rem",
                                                  fontSize: "14px",
                                                  background:
                                                    time.startTime ===
                                                    selectedStartTime
                                                      ? "#36CA5A"
                                                      : "transparent",
                                                  color:
                                                    time.startTime ===
                                                    selectedStartTime
                                                      ? "#fff"
                                                      : "#F2F2F2",
                                                }}
                                                variant="contained"
                                                color="success"
                                              >
                                                {time.startTime} -{" "}
                                                {time.endTime}
                                              </Button>
                                            </Box>
                                          )
                                        )
                                    )}
                                  </div>
                                </div>
                              </>
                            )
                        )}
                      </Box>
                    )}
                  </Box>
                </div>
                {value && selectedStartTime ? (
                  <div ref={bookingEndRef}></div>
                ) : null}
              </Grid>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "2rem 0 5rem 0",
                }}
              >
                {selectedEmployees?.availableDateTimes?.map(
                  (qtm) =>
                    qtm.date == value && (
                      <>{value && selectedStartTime && <BookSessionForm />}</>
                    )
                )}
              </div>
            </>
          ) : (
            <></>
          )}
        </Container>
      </div>
    </>
  );
};

export default BookSession;