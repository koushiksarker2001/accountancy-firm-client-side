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
import pdfFileImage from "../../assets/images/file-type/pdf file.png";
import docFileImage from "../../assets/images/file-type/doc icon.png";
import docxFileImage from "../../assets/images/file-type/docx icon.png";
import { useAuthState } from "react-firebase-hooks/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  chatApp,
  publicUserAuth,
  publicUserStorage,
} from "../../firebase.config";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Button, LinearProgress, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Attachment, Message } from "@mui/icons-material";
const db = getFirestore(chatApp);
const Chat = () => {
  const [selectedFile, setSelectedFile] = useState();
  let [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const [user] = useAuthState(publicUserAuth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [employee, setEmployee] = useState();
  const [filteredMessages, setFilteredMessages] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`http://localhost:8080/employee/${id}`)
      .then((data) => setEmployee(data.data))
      .catch((err) => console.log(err));
  }, [id]);
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
          (message.data.receiverEmail === employee?.email &&
            message.data.email === user?.email) ||
          (message.data.receiverEmail === user?.email &&
            message.data.email === employee?.email)
      )
    );
  }, [messages, user, employee]);

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
                receiverEmail: employee?.email,
              });
              setSelectedFile(null);
              toast("File sent");
              fileInputRef.current.value = "";
              setProgress(null);
            }
          );
        }
      );
    } else {
      if (!selectedFile) {
        setError("No file selected");
        toast.warn("No file sent");
      } else {
        setError("File Size Can Not Exceed 100MB");
        toast.error("File Size Can Not Exceed 100MB");
      }
    }
  };
  const sendMessage = async () => {
    await addDoc(collection(db, "messages"), {
      email: user?.email,
      photoURL: user?.photoURL,
      displayName: user?.displayName,
      text: newMessage,
      timestamp: serverTimestamp(),
      receiverEmail: employee?.email,
    });

    setNewMessage("");
  };

  return (
    <div>
      <div className="flex justify-center bg-gray-800 py-10 min-h-screen">
        {user && (
          <div>
            <div className="flex flex-col gap-5" style={{ padding: "0 15px" }}>
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    justifyContent: `${
                      msg.data.email === user?.email ? "end" : "start"
                    }`,
                    fontWeight: `${
                      msg.data.email === user?.email ? "" : "700"
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

            <div style={{ padding: "0 15px" }}>
              {!selectedFile && (
                <div>
                  <input
                    style={{ width: "85%", padding: "20px" }}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />

                  <Button
                    // style={{ display: "flex", alignItems: "center" }}
                    onClick={sendMessage}
                  >
                    <Message sx={{ fontSize: "30px" }} /> Send Message
                  </Button>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "10px 0",
                  justifyContent: "center",
                }}
              >
                <Attachment />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files ? e.target.files[0] : undefined;
                    setSelectedFile(file);
                  }}
                />
                <Button onClick={handleUpload}>Upload file</Button>
              </div>

              {error && <Typography sx={{ color: "red" }}>{error}</Typography>}
              {progress && (
                <LinearProgress variant="determinate" value={progress} />
              )}
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Chat;
