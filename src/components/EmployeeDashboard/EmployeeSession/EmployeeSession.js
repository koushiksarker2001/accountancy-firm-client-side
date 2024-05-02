/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import AgoraRTC, {
  AgoraRTCProvider,
  AgoraVideoPlayer,
  LocalAudioTrack,
  LocalUser,
  RemoteUser,
  createClient,
  createMicrophoneAndCameraTracks,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";
import { employeeAuth } from "../../../firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button, Grid } from "@mui/material";
import { DateTime } from "luxon";
import classes from "./videoCss.css";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicOffIcon from "@mui/icons-material/MicOff";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";

import VideocamOffIcon from "@mui/icons-material/VideocamOff";

import VideocamIcon from "@mui/icons-material/Videocam";

const appId = "78de4173294f407d9d8312ee1a8ba1bd";

const EmployeeSession = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [inCall, setInCall] = useState(false);
  const [channelName, setChannelName] = useState(id);
  const [session, setSession] = useState("");
  const [user] = useAuthState(employeeAuth);
  const [rejoin, setRejoin] = useState(false);

  const token = null;
  const config = {
    mode: "rtc",
    codec: "vp8",
  };
  const agoraClient = useRTCClient(AgoraRTC.createClient(config));
  return (
    <div>
      {inCall ? (
        <AgoraRTCProvider client={agoraClient}>
          <VideoCall
            setInCall={setInCall}
            channelName={channelName}
            inCall={inCall}
            session={session}
            email={user?.email}
            setRejoin={setRejoin}
            appId={appId}
            token={token}
            agoraClient={agoraClient}
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
  const { appId, channelName, agoraClient } = props;
  // const agoraEngine = useRTCClient( AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })); // Initialize Agora Client
  //pull the channel name from the param

  // set the connection state
  const [activeConnection, setActiveConnection] = useState(true);

  // track the mic/video state - Turn on Mic and Camera On
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);

  // get local video and mic tracks
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  // to leave the call
  const navigate = useNavigate();

  // Join the channel
  useJoin(
    {
      appid: appId,
      channel: channelName,
      token: null,
    },
    activeConnection
  );

  usePublish([localMicrophoneTrack, localCameraTrack]);

  //remote users
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  console.log(remoteUsers);
  // play the remote user audio tracks
  audioTracks.forEach((track) => track.play());

  return (
    <>
      <div id="remoteVideoGrid">
        {
          // Initialize each remote stream using RemoteUser component
          remoteUsers?.length > 0 ? (
            remoteUsers.map((user) => (
              <div
                key={user.uid}
                className="remote-video-container"
                style={{ width: "500px", height: "500px" }}
              >
                <RemoteUser user={user} />
              </div>
            ))
          ) : (
            <p>No user joined yet</p>
          )
        }
      </div>
      <div id="localVideo" style={{ height: "500px", width: "500px" }}>
        <LocalUser
          audioTrack={localMicrophoneTrack}
          videoTrack={localCameraTrack}
          cameraOn={cameraOn}
          micOn={micOn}
          playAudio={false}
          playVideo={cameraOn}
          style={{ height: "500px", width: "500px" }}
        />
        <div>
          {/* media-controls toolbar component - UI controling mic, camera, & connection state  */}
          <div id="controlsToolbar">
            <div id="mediaControls">
              <button
                className="btn"
                onClick={() => {
                  setMic(!micOn);
                }}
              >
                Mic
              </button>
              <button className="btn" onClick={() => setCamera((a) => !a)}>
                Camera
              </button>
            </div>
            <button
              id="endConnection"
              onClick={() => {
                setActiveConnection(false);
                navigate("/employee-dashboard/session/");
              }}
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </>
  );
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
  // currentTime = "4:9 AM";

  const splittedTime = currentTime.split(" ");
  const meridian = currentTime.split(" ")[1];
  let minutes = splittedTime[0].split(":")[1];
  if (minutes < 10) {
    minutes = "0" + minutes;
    currentTime =
      splittedTime[0].split(":")[0] + ":" + minutes + " " + meridian;
    console.log(currentTime);
  }
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
  console.log(verifiedTime);
  const verifiedPassed = session?.date < today;
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
