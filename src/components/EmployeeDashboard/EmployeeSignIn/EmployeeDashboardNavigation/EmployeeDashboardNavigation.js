import { Box, Button } from "@mui/material";
import React from "react";
import { useSignOut } from "react-firebase-hooks/auth";
import { Link, Outlet } from "react-router-dom";

import { employeeAuth } from "../../../../firebase.config";

const EmployeeDashboardNavigation = () => {
  const [signOut, loading, error] = useSignOut(employeeAuth);
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
          <Link to="/employee-dashboard/create-slot">Create Slots</Link>
          <Link to="/employee-dashboard/create-user">Create User</Link>
          <Link to="/employee-dashboard/assigned-task">Assigned Task</Link>
          <Link to="/employee-dashboard/create-company">Create Company</Link>
          <Link to="/employee-dashboard/list-users">All Users</Link>
          <Link to="/employee-dashboard/company-list">Company List</Link>
          <Link to="/employee-dashboard/session">Session with clients</Link>
          <Link to="/employee-dashboard/chat">Chat</Link>
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

export default EmployeeDashboardNavigation;
