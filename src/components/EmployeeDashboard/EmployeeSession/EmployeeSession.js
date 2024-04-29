/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import AgoraRTC, {
  AgoraRTCProvider,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
  RemoteUser,
  LocalVideoTrack,
} from "agora-rtc-react";
import { employeeAuth } from "../../../firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@mui/material";
import { DateTime } from "luxon";
const returnGrid = (remoteUsers) => {
  return {
    gridTemplateColumns:
      remoteUsers?.length > 8
        ? unit.repeat(4)
        : remoteUsers.length > 3
        ? unit.repeat(3)
        : remoteUsers.length > 0
        ? unit.repeat(2)
        : unit,
  };
};
const unit = "minmax(0, 1fr) ";
const styles = {
  grid: {
    width: "100%",
    height: "100%",
    display: "grid",
  },
  gridCell: { height: "100%", width: "100%" },
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
  },
};
const EmployeeSession = () => {
  const appId = "78de4173294f407d9d8312ee1a8ba1bd";
  const navigate = useNavigate();
  const { id } = useParams();

  const [inCall, setInCall] = useState(false);
  const [channelName, setChannelName] = useState(id);
  const [session, setSession] = useState("");
  const [user] = useAuthState(employeeAuth);
  const [rejoin, setRejoin] = useState(false);
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );
  const token = null;
  return (
    <div>
      {inCall ? (
        <AgoraRTCProvider client={client}>
          <VideoCall
            setInCall={setInCall}
            channelName={channelName}
            inCall={inCall}
            session={session}
            email={user?.email}
            setRejoin={setRejoin}
            appId={appId}
            token={token}
          ></VideoCall>
        </AgoraRTCProvider>
      ) : (
        <ChannelForm
          setInCall={setInCall}
          setChannelName={setChannelName}
          setSession={setSession}
          session={session}
          rejoin={rejoin}
          setRejoin={setRejoin}
          id={id}
          navigate={navigate}
        />
      )}
    </div>
  );
};
// video call component
const VideoCall = (props) => {
  const { setInCall, channelName, inCall, email, session, appId, token } =
    props;
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  audioTracks?.map((track) => track.play());
  usePublish([localMicrophoneTrack, localCameraTrack]);
  useJoin({
    appid: appId,
    channel: channelName,
    token: token === "" ? null : token,
  });
  const deviceLoading = isLoadingMic || isLoadingCam;
  if (deviceLoading) {
    return <div style={styles.grid}>Loading devices...</div>;
  } else {
    return (
      <div>
        <div style={{ ...styles.grid, ...returnGrid(remoteUsers) }}>
          <LocalVideoTrack
            track={localCameraTrack}
            play={true}
            style={styles.gridCell}
          />
          {remoteUsers?.map((user) => (
            <RemoteUser user={user} style={styles.gridCell} />
          ))}
        </div>
      </div>
    );
  }
};
//channel join form component
const ChannelForm = (props) => {
  const { setInCall, setChannelName, setSession, session, id, navigate } =
    props;
  localStorage.setItem("sessionId", id);

  //time converter to meridian
  const timeConverter = (time) => {
    let hours = time.split(":")[0];
    console.log(hours);
    let meridian;
    if (hours > 12) {
      meridian = "PM";
    } else if (hours < 12) {
      meridian = "AM";
      if (hours == 0) {
        hours = 12;
      }
    } else {
      meridian = "PM";
    }
    return time.concat(" ", meridian);
  };
  // time buffer
  const startTimeBuffer = (time) => {
    let hours = Number(time?.split(":")[0]);
    let minutes = Number(time?.split(":")[1]?.split(" ")[0]);
    if (minutes < 10 && minutes > 0) {
      hours = Number(hours) - 1;
      minutes = 50;
    } else {
      minutes = Number(minutes) - 10;
    }
    let meridian;
    if (hours > 12) {
      meridian = "PM";
    } else if (hours < 12) {
      meridian = "AM";
    } else {
      meridian = "PM";
    }

    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return hours + ":" + minutes + " " + meridian;
  };

  // date
  let today = DateTime.now().toFormat("yyyy-MM-dd");
  const now = new Date();
  const time = now.getHours() + ":" + now.getMinutes();

  let currentTime = timeConverter(time);

  const verifiedTime =
    startTimeBuffer(session?.startTime) <= currentTime &&
    session?.endTime >= currentTime;
  console.log(session?.startTime);
  console.log(currentTime);
  console.log(session?.endTime >= currentTime);

  // review
  const reviewDateConverter = (sessionDate) => {
    let day = Number(sessionDate?.split("-")[2]);
    let month = Number(sessionDate?.split("-")[1]);
    let year = Number(sessionDate?.split("-")[0]);

    if (day === 30 || day === 31) {
      day = 1;
      if (month !== 12) {
        month += 1;
      } else {
        month = 1;
        year = year + 1;
      }
    } else {
      day += 1;
    }

    day = day < 10 ? `0${day}` : day;
    month = month < 10 ? `0${month}` : month;
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/booking/by-time/${id}`)
      .then((data) => setSession(data.data));
  }, []);
  // verify the time if its today or passed
  const verified = session?.date === today;

  const verifiedPassed = session?.date < today;
  console.log(verifiedPassed);
  // console.log(verified, verifiedPassed);
  // console.log(today);
  /* useEffect(() => {
    if (
      (session?.date && reviewDateConverter(session?.date) == today) ||
      (session?.date &&
        reviewDateConverter(session?.date) >= session?.date &&
        session?.endTime < currentTime)
    ) {
      navigate(`/Dashboard/review/${session._id}`);
    }
  }, [verifiedPassed, session]); */
  return (
    <>
      {verified && verifiedTime ? (
        <Button
          onClick={(e) => {
            e.preventDefault();
            setInCall(true);
          }}
          style={{
            backgroundColor: "#31C75A",
            marginTop: "1rem",
            padding: "10px 20px",
            borderRadius: "10px",
            color: "white",
            textAlign: "center",
          }}
        >
          Join
        </Button>
      ) : verifiedPassed ? (
        <Button
          style={{
            backgroundColor: "#31C75A",
            marginTop: "1rem",
            padding: "10px 20px",
            borderRadius: "10px",
            color: "white",
            textAlign: "center",
          }}
        >
          Your session has been completed
        </Button>
      ) : (
        <Button
          style={{
            backgroundColor: "lightblue",
            marginTop: "1rem",
            padding: "10px 20px",
            borderRadius: "10px",
            color: "white",
            textAlign: "center",
          }}
        >
          Join button will be visible in your session time
        </Button>
      )}
    </>
  );
};
export default EmployeeSession;
