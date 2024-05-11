import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { publicUserAuth, publicUserStorage } from "../../../firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";

import { Alert, LinearProgress, Typography } from "@mui/material";
import axios from "axios";
import { CheckCircleOutline, DangerousOutlined } from "@mui/icons-material";
// import { publicUserAuth } from "../../../firebase.config";

const PublicUserUploadFile = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [user] = useAuthState(publicUserAuth);
  let [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const [successStatus, setSuccessStatus] = useState("");
  const [url, setUrl] = useState("");
  // Create the file metadata
  /** @type {any} */
  /* const metadata = {
    contentType: "image/jpeg",
  }; */

  // Upload file and metadata to the object 
  // Listen for state changes, errors, and completion of the upload.
  const handleUpload = () => {
    const size = selectedFile?.size / 1000000;
    if (size <= 100) {
      if (error) {
        setError(null);
      }

      const location =
        `client/${user?.email}/` + selectedFile?.name + "-" + uuidv4();
      const storageRef = ref(publicUserStorage, location);

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
              setUrl(downloadURL);
              await axios
                .post("http://localhost:8080/upload-file", {
                  file: downloadURL,
                  type: selectedFile?.type,
                  uploadedBy: user?.email,
                  location: location,
                  fileName: selectedFile?.name,
                })
                .then((data) => setSuccessStatus(data.data))
                .catch((error) => console.log(error));
            }
          );
        }
      );
    } else {
      if (!selectedFile) {
        setError("File Not Selected");
      } else {
        setError("File Size Can Not Exceed 100MB");
      }
    }
  };
  return (
    <div>
      <p>
    
        <input
          type="file"
          onChange={(e) => {
            setSuccessStatus("");
            setProgress(null);
            const file = e.target.files ? e.target.files[0] : undefined;
            setSelectedFile(file);
          }}
        />
        <button onClick={handleUpload}>Upload file</button>
        {error && <Typography sx={{ color: "red" }}>{error}</Typography>}
        {successStatus && (
          <Alert
            icon={
              successStatus == "Successful" ? (
                <CheckCircleOutline fontSize="inherit" />
              ) : (
                <DangerousOutlined />
              )
            }
            severity={`${successStatus == "Successful" ? "success" : "error"}`}
          >
            {successStatus == "Successful" ? (
              <p>
                The file uploaded successfully and can be viewed at:
                <a href={`${url}`} target="_blank" rel="_noreferrer">
                  View
                </a>
              </p>
            ) : (
              "Could not upload"
            )}
          </Alert>
        )}
        {progress && <LinearProgress variant="determinate" value={progress} />}
      </p>
    </div>
  );
};
export default PublicUserUploadFile;
