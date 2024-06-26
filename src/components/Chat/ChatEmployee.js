import {
  doc,
  setDoc,
  getFirestore,
  collection,
  orderBy,
  query,
  serverTimestamp,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

import { useAuthState } from "react-firebase-hooks/auth";
import pdfFileImage from "../../assets/images/file-type/pdf file.png";
import docFileImage from "../../assets/images/file-type/doc icon.png";
import docxFileImage from "../../assets/images/file-type/docx icon.png";
import {
  chatApp,
  employeeAuth,
  publicUserAuth,
  publicUserStorage,
} from "../../firebase.config";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { LinearProgress, Typography } from "@mui/material";
const db = getFirestore(chatApp);
const ChatEmployee = () => {
  const [user] = useAuthState(employeeAuth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [publicUser, setPublicUser] = useState();
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [progress, setProgress] = useState();
  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`http://localhost:8080/public-user/find-by/${id}`)
      .then((data) => setPublicUser(data.data))
      .catch((err) => console.log(err));
  }, [id]);
  console.log(publicUser);
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
    return unsubscribe;
  }, []);
  useEffect(() => {
    setFilteredMessages(
      messages.filter(
        (message) =>
          (message.data.receiverEmail === publicUser?.email &&
            message.data.email === user?.email) ||
          (message.data.receiverEmail === user?.email &&
            message.data.email === publicUser?.email)
      )
    );
  }, [messages, user, publicUser]);
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
    return unsubscribe;
  }, []);
  const [selectedFile, setSelectedFile] = useState();
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const handleUpload = () => {
    const size = selectedFile?.size / 1000000;
    if (size <= 100) {
      if (error) {
        setError(null);
      }
      const storageRef = ref(
        publicUserStorage,
        `client/${user?.email}/` +
          selectedFile?.name?.split(".")[0] +
          "-" +
          uuidv4() +
          "-" +
          `${
            (selectedFile?.name?.split(".")?.[1] == "pdf" && "pdf") ||
            (selectedFile?.name?.split(".")?.[1] == "doc" && "doc.doc") ||
            (selectedFile?.name?.split(".")?.[1] == "docx" && "docx.docx") ||
            (selectedFile?.name?.split(".")?.[1] == "jpeg" && "jpeg") ||
            (selectedFile?.name?.split(".")?.[1] == "png" && "png") ||
            (selectedFile?.name?.split(".")?.[1] == "jpg" && "jpg")
          }`
      );

      const uploadTask = uploadBytesResumable(storageRef, selectedFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;

            // ...

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        async () => {
          // Upload completed successfully, now we can get the download URL
          await getDownloadURL(uploadTask.snapshot.ref).then(
            async (downloadURL) => {
              await addDoc(collection(db, "messages"), {
                email: user?.email,
                photoURL: user?.photoURL,
                displayName: user?.displayName,
                text: downloadURL,
                timestamp: serverTimestamp(),
                receiverEmail: publicUser?.email,
              });
              setSelectedFile(null);
              fileInputRef.current.value = "";
              setProgress(null);
            }
          );
        }
      );
    } else {
      setError("File Size Can Not Exceed 100MB");
    }
  };
  const sendMessage = async () => {
    await addDoc(collection(db, "messages"), {
      email: user?.email,
      photoURL: user?.photoURL,
      displayName: user?.displayName,
      text: newMessage,
      timestamp: serverTimestamp(),
      receiverEmail: publicUser?.email,
    });

    setNewMessage("");
  };

  return (
    <div>
      <div className="flex justify-center bg-gray-800 py-10 min-h-screen">
        {user && (
          <div>
            <div> Logged in as {user.email}</div>
            {!selectedFile && (
              <div>
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  className=" bg-white rounded-[10px] hover:bg-blue-400 p-3"
                  onClick={sendMessage}
                >
                  Send Message
                </button>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : undefined;
                setSelectedFile(file);
              }}
            />
            <button onClick={handleUpload}>Upload file</button>
            {error && <Typography sx={{ color: "red" }}>{error}</Typography>}
            {progress && (
              <LinearProgress variant="determinate" value={progress} />
            )}
            <div className="flex flex-col gap-5">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    justifyContent: `${
                      msg.data.email === user?.email ? "end" : "start"
                    }`,
                    background: `${
                      msg.data.email === user?.email ? "gray" : "blue"
                    }`,
                    margin: "10px 0",
                  }}
                >
                  <div
                    className={`message flex flex-row p-3 gap-3 rounded-[20px] items-center ${
                      msg.data.uid === user.uid
                        ? " text-white bg-blue-500"
                        : " bg-white "
                    }`}
                  >
                    {!msg.data.text?.includes("https") && (
                      <p> {msg.data.text}</p>
                    )}
                    {msg.data.text?.includes("https") &&
                      msg.data.text?.includes("pdf") && (
                        <a
                          href={`${msg.data.text}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img src={pdfFileImage} width="50px" />
                          <p>Click to view</p>
                        </a>
                      )}
                    {msg.data.text?.includes("https") &&
                      msg.data.text?.includes("doc") && (
                        <a
                          href={`${msg.data.text}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img src={docFileImage} width="50px" />
                          <p>Click to Download</p>
                        </a>
                      )}
                    {msg.data.text?.includes("https") &&
                      msg.data.text?.includes("docx") && (
                        <a
                          href={`${msg.data.text}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img src={docxFileImage} width="50px" />
                          <p>Click to Download</p>
                        </a>
                      )}
                    {msg.data.text?.includes("https") &&
                      msg.data.text?.includes("jpeg") && (
                        <p>
                          <img src={msg.data.text} width="200px" />
                        </p>
                      )}
                    {msg.data.text?.includes("https") &&
                      msg.data.text?.includes("jpg") && (
                        <p>
                          <img src={msg.data.text} width="200px" />
                        </p>
                      )}
                    {msg.data.text?.includes("https") &&
                      msg.data.text?.includes("png") && (
                        <p>
                          <img src={msg.data.text} width="200px" />
                        </p>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatEmployee;
