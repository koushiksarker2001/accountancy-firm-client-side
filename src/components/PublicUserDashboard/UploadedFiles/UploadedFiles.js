import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { publicUserAuth, publicUserStorage } from "../../../firebase.config";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
function createData(fileName, location, type, file) {
  return { fileName, location, type, file };
}
const UploadedFiles = () => {
  const [user] = useAuthState(publicUserAuth);
  const [rows, setRows] = useState([]);
  const [successStatus, setSuccessStatus] = useState("");
  useEffect(() => {
    axios.get(`http://localhost:8080/file/${user?.email}`).then((data) => {
      const result = data?.data?.map((data) =>
        createData(data.fileName, data.location, data.type, data.file)
      );
      setRows(result);
    });
  }, [user, successStatus]);
  const handleDelete = (location) => {
    console.log(location);
    const storage = getStorage();
    const storageRef = ref(publicUserStorage, location);
    deleteObject(storageRef)
      .then(async () => {
        await axios
          .post("http://localhost:8080/file/delete", {
            location: location,
          })
          .then((data) => {
            setSuccessStatus(data.data);
            data.data == "Successful" ? toast("Deleted") : toast.warn("Failed");
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => toast.warn("Failed to delete"));
  };
  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>View</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow>
                <TableCell>{row?.fileName}</TableCell>
                <TableCell>{row?.location}</TableCell>
                <TableCell>{row?.type}</TableCell>
                <TableCell>
                  <a href={row?.file} target="_blank" rel="noreferrer">
                    View
                  </a>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleDelete(row?.location)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ToastContainer />
    </div>
  );
};

export default UploadedFiles;
