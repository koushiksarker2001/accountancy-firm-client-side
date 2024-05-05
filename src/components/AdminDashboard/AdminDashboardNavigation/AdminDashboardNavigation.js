import { Box, Button } from "@mui/material";
import React from "react";
import { useSignOut } from "react-firebase-hooks/auth";
import { Link, Outlet } from "react-router-dom";
import { auth } from "../../../firebase.config";

const AdminDashboardNavigation = () => {
  const [signOut, loading, error] = useSignOut(auth);
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
          <Link to="/admin-dashboard/create-employee">Create employee</Link>
          <Link to="/admin-dashboard/create-task">Assign Task</Link>
          <Link to="/admin-dashboard/task-status">Task Status</Link>
          <Link to="/admin-dashboard/statistics">Statistics</Link>
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

export default AdminDashboardNavigation;
