import React, { useState, useEffect } from "react";
import classes from "./videoCss.css";
import { createChannel, createClient, RtmMessage } from "agora-rtm-react";

import ChatIcon from "@mui/icons-material/Chat";
const useClient = createClient("78de4173294f407d9d8312ee1a8ba1bd");
console.log(localStorage.getItem("sessionId"));
const useChannel = createChannel(localStorage.getItem("sessionId"));

export default function Messaging({
  email,
  showMessage,
  msgForVideo,
  setMsgForVideo,
  setRemoteUserVideo,
  setRemoteUserAudio,
  users,
}) {
  const client = useClient();
  const testChannel = useChannel(client);
  const [texts, setTexts] = useState([]);
  // const [uid, setUid] = useState('')
  const uid = email;
  const [textInput, setTextInput] = useState("");
  const [videoInput, setVideoInput] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);

  let login = async () => {
    await client.login({ uid });
    await testChannel.join();
    client.on("ConnectionStateChanged", async (state, reason) => {
      let loginState = state;
      let loginReason = reason;
    });
    testChannel.on("ChannelMessage", (msg, uid) => {
      if (msg.text == "PERMISSION_VIDEO_DISABLE") {
        setRemoteUserVideo(false);
      }
      if (msg.text == "PERMISSION_VIDEO_ENABLE") {
        setRemoteUserVideo(true);
      }
      if (msg.text == "PERMISSION_AUDIO_DISABLE") {
        users[0]._audio_enabled_ = false;
        users[0]._audio_muted_ = true;
        // setRemoteUserVideo(false);
      }
      if (msg.text == "PERMISSION_VIDEO_ENABLE") {
        // setRemoteUserVideo(true);
        users[0]._audio_enabled_ = true;
        users[0]._audio_muted_ = false;
      }

      if (
        msg.text !== "PERMISSION_VIDEO_DISABLE" &&
        msg.text !== "PERMISSION_VIDEO_ENABLE" &&
        msg.text !== "PERMISSION_AUDIO_DISABLE" &&
        msg.text !== "PERMISSION_VIDEO_ENABLE"
      ) {
        setTexts((previous) => {
          return [...previous, { msg, uid }];
        });
      }
    });
    testChannel.on("MemberJoined", (memberId) => {
      let loginMemberId = memberId;
    });
    setLoggedIn(true);
  };

  let [inputSet, setInputSet] = useState(false);

  useEffect(() => {
    if (msgForVideo !== "") {
      setVideoInput(msgForVideo);
      setInputSet(true);
    }

    // setMsgForVideo("")
  }, [msgForVideo]);

  useEffect(() => {
    if (inputSet) {
      sendMessageFromButton();
      setInputSet(false);
      setMsgForVideo("");
    }
  }, [inputSet]);

  let logout = async () => {
    await testChannel.leave();
    await client.logout();
    testChannel.removeAllListeners();
    client.removeAllListeners();
    setLoggedIn(false);
  };

  useEffect(() => {
    // setTimeout(() => {
    // }, 2000);
    login();
  }, []);

  // useEffect(() => {
  //     setTimeout(() => {
  //         if (showMessage) {
  //             logout();
  //         }
  //     }, 1000)
  // }, [showMessage])

  // if(inCall && uid) {
  //     login()
  // }

  const sendMsg = async (e) => {
    e.preventDefault();

    if (textInput) {
      let message = client.createMessage({
        text: textInput,
        messageType: "TEXT",
      });
      await testChannel.sendMessage(message);

      setTexts((previous) => {
        return [...previous, { msg: { text: textInput }, uid }];
      });

      setTextInput("");
    } else {
      alert("nothing here");
    }
  };

  const sendMessageFromButton = async () => {
    if (videoInput) {
      let message = client.createMessage({
        text: videoInput,
        messageType: "TEXT",
      });
      await testChannel.sendMessage(message);
      if (
        videoInput !== "PERMISSION_VIDEO_DISABLE" &&
        videoInput !== "PERMISSION_VIDEO_ENABLE" &&
        videoInput !== "PERMISSION_AUDIO_DISABLE" &&
        videoInput !== "PERMISSION_VIDEO_ENABLE"
      ) {
        setTexts((previous) => {
          return [...previous, { msg: { text: videoInput }, uid }];
        });
      }
      setTextInput("");
    } else {
      alert("nothing here");
    }
  };

  return (
    <div
      className={
        showMessage ? classes.message_container : classes.message_container_two
      }
    >
      <div className={classes.chat_heading}>
        {/* <img src={chatIcon} alt="chat icon" />
         */}
        <ChatIcon />
        <h2> Chat</h2>
      </div>
      {/* {
                !isLoggedIn ? <div className={classes.user}>
                    <p>Enter your Name </p>
                    <input style={{ marginRight: 5 }} type='text' disabled={isLoggedIn} value={uid} onChange={e => setUid(e.target.value)} />
                    <button disabled={!uid} className={classes.btn} onClick={!isLoggedIn ? login : ""}>{!isLoggedIn ? 'Join' : ''}</button>
                    </div> : ""
                } */}

      {/* <button disabled={!uid} className={classes.btn} onClick={!isLoggedIn ? login : logout}>{!isLoggedIn ? 'Join' : 'Logout'}</button> */}
      {isLoggedIn ? (
        <div className={classes.messages}>
          {texts.map((text, i) => (
            <div
              key={i}
              className={text.uid === uid ? classes.sending : classes.comming}
            >
              {/* <div style={{ fontSize: 12, opacity: 0.5 }}>{text.uid}</div> */}
              <div className={classes.text}>{text.msg["text"]}</div>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}

      {isLoggedIn ? (
        <form onSubmit={sendMsg} className={classes.form}>
          <input
            type="text"
            placeholder="message"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
        </form>
      ) : (
        ""
      )}
    </div>
  );
}
