import { Box, Button } from "@mui/material";
import React from "react";
import { useSignOut } from "react-firebase-hooks/auth";
import { Link, Outlet } from "react-router-dom";
import { publicUserAuth } from "../../../firebase.config";

const PublicUserDashboardNavigation = () => {
  const [signOut, loading, error] = useSignOut(publicUserAuth);
  return (
    <Box component="section" sx={{ display: "flex" }}>
      <Box
        component="section"
        style={{
          width: "200px",
          backgroundColor: "beige",
          height: "100vh",
          position: "fixed",
        }}
      >
        <div
          className="link-items"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Link to="/user-dashboard/upload-file">Upload Files</Link>
          <Link to="/user-dashboard/chat">Chat with employee</Link>
          {/* <Link to="/user-dashboard/upload-file">Upload Files</Link> */}
          {/* <Link to="/employee-dashboard/create-user">Create User</Link> */}
          <Button
            onClick={async () => {
              await signOut();
            }}
          >
            Sign out
          </Button>
        </div>
      </Box>
      <Box component="section" sx={{ marginLeft: "500px" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default PublicUserDashboardNavigation;
