/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import {
  AgoraVideoPlayer,
  createClient,
  createMicrophoneAndCameraTracks,
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
import Messaging from "./Messaging";
const config = {
  mode: "rtc",
  codec: "vp8",
};
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
  return (
    <div>
      {inCall ? (
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
const useClient = createClient(config);
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
const VideoCall = (props) => {
  const { setInCall, channelName, inCall, email, session, appId, token } =
    props;
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate("");
  const [isLoading, setIsLoading] = useState(false);

  const [remoteuserVideo, setRemoteUserVideo] = useState(false);
  const [remoteuserAudio, setRemoteUserAudio] = useState(true);

  const [msgForVideo, setMsgForVideo] = useState("");
  const [msgForAudio, setMsgForAudio] = useState("");

  // using the hook to get access to the client object
  const client = useClient();

  // ready is a state variable, which returns true when the local tracks are initialized, untill then tracks variable is null
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  const handleShow = () => {
    setShowMessage(!showMessage);
  };
  useEffect(() => {
    // function to initialise the SDK
    let init = async (name) => {
      setIsLoading(true);

      console.log("users", users);

      client.on("user-published", async (user, mediaType) => {
        if (users.length < 1) {
          await client.subscribe(user, mediaType);
          if (mediaType === "video") {
            setUsers((prevUsers) => {
              return [...prevUsers, user];
            });
          }
          if (mediaType === "audio") {
            user.audioTrack?.play();
          }
        }
      });

      client.on("user-unpublished", (user, type) => {
        if (type === "audio") {
          user.audioTrack?.stop();
        }
        if (type === "video") {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
      });

      client.on("user-left", (user) => {
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
        // client.leave();
        // client.removeAllListeners();

        // we close the tracks to perform cleanup
        // tracks[0].close();
        // tracks[1].close();
        // setRejoin(true);
        // navigate(`/Dashboard/review/${session._id}`);
      });

      await client.join(appId, name, token, null);

      // await client.
      // tracks[1].setEnabled(false)
      if (tracks) await client.publish([tracks[0], tracks[1]]);
      setIsLoading(false);
      setStart(true);
    };

    if (ready && tracks) {
      init(channelName);
    }
  }, [channelName, client, ready, tracks]);
  return isLoading ? (
    <div className={classes.video_container_double_blank}></div>
  ) : (
    <div className={classes.video_container_double}>
      {start && tracks && (
        <Videos
          remoteuserAudio={remoteuserAudio}
          remoteuserVideo={remoteuserVideo}
          users={users}
          tracks={tracks}
          showMessage={showMessage}
          totalUser={client?._users}
        />
      )}
      {ready && tracks && (
        <Controls
          setMsgForAudio={setMsgForAudio}
          setMsgForVideo={setMsgForVideo}
          msgForVideo={msgForVideo}
          tracks={tracks}
          users={users}
          setStart={setStart}
          setInCall={setInCall}
          setShowMessage={handleShow}
          showMessage={showMessage}
          session={session}
          setUsers={setUsers}
        />
      )}
      {/*    {start && tracks && (
        <Messaging
          setRemoteUserAudio={setRemoteUserAudio}
          setRemoteUserVideo={setRemoteUserVideo}
          setMsgForVideo={setMsgForVideo}
          msgForVideo={msgForVideo}
          channelName={channelName}
          users={users}
          inCall={inCall}
          email={email}
          showMessage={showMessage}
        />
      )} */}
    </div>
  );
};

const Videos = (props) => {
  const { totalUser, users, tracks, showMessage } = props;
  let remoteUi = null;

  console.log("tracks", tracks);

  if (totalUser?.length <= 0) {
    remoteUi = <div className={classes.vid}>No one joined yet</div>;
  } else if (totalUser?.length > 0 && users.length > 0) {
    remoteUi = (
      <AgoraVideoPlayer
        className={classes.vid}
        videoTrack={users[0]?.videoTrack}
        key={users[0]?.uid}
      />
    );
  } else if (totalUser?.length > 0 && users.length <= 0) {
    remoteUi = (
      <div className={classes.vid}>
        <PersonIcon style={{ width: "100px", height: "100px" }} />
      </div>
    );
  }
  return (
    <div className={!showMessage ? classes.relative : classes.relative_two}>
      <Grid id="videos" className={classes.videos} spacing={3} container>
        <Grid
          className={classes.video}
          justifyContent="center"
          item
          md={12}
          xs={12}
        >
          {remoteUi}
        </Grid>
      </Grid>
      <div className={classes.patient}>
        <AgoraVideoPlayer className={classes.myself} videoTrack={tracks[1]} />
      </div>
    </div>
  );
};

export const Controls = (props) => {
  const client = useClient();
  const {
    tracks,
    users,
    setStart,
    setInCall,
    setShowMessage,
    showMessage,
    session,
    setMsgForVideo,
    msgForVideo,
    setMsgForAudio,
    setUsers,
  } = props;
  const [trackState, setTrackState] = useState({ video: false, audio: true });
  const navigate = useNavigate("");

  const mute = async (type) => {
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);
      if (trackState.audio) {
        setMsgForAudio("PERMISSION_AUDIO_DISABLE");
      }
      if (!trackState.video) {
        setMsgForAudio("PERMISSION_AUDIO_ENABLE");
      }
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      // tracks[1].video.disable = false;

      if (trackState.video) {
        setMsgForVideo("PERMISSION_VIDEO_DISABLE");
      }
      if (!trackState.video) {
        setMsgForVideo("PERMISSION_VIDEO_ENABLE");
      }
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  useEffect(() => {
    mute("video");
    // if (tracks[1]?._id) {
    // tracks[1].setEnabled(!trackState.video)
    // setTrackState({ video: false, audio: true })
    // }
  }, []);

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();

    // we close the tracks to perform cleanup
    tracks[0].close();
    tracks[1].close();
    setTrackState({ video: false, audio: false });
    setStart(false);
    setInCall(false);
    window.location.reload();

    // navigate(`/Dashboard/review/${session._id}`);
  };

  return (
    <>
      <div style={{ margin: "0", padding: "0", display: "none" }}>
        {/* <Header /> */}
      </div>

      <div className={classes.controls}>
        <p
          className={trackState.audio ? "on" : ""}
          style={{ backgroundColor: !trackState.audio ? "#EA5044" : "" }}
          onClick={() => mute("audio")}
        >
          {trackState.audio ? <KeyboardVoiceIcon /> : <MicOffIcon />}
        </p>
        <p
          className={trackState.video ? "on" : ""}
          style={{ backgroundColor: !trackState.video ? "#EA5044" : "" }}
          onClick={() => mute("video")}
        >
          {trackState.video ? <VideocamIcon /> : <VideocamOffIcon />}
        </p>
        <p
          onClick={setShowMessage}
          style={{ backgroundColor: showMessage ? "#31C75A" : "" }}
        >
          {showMessage ? <ModeCommentIcon /> : <ChatIcon />}
        </p>
        {
          <p
            onClick={() => leaveChannel()}
            style={{ backgroundColor: "#EA5044" }}
          >
            <CallEndIcon />
          </p>
        }
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
  console.log(currentTime);
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
