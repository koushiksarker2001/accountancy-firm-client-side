import {
  AccountCircle,
  Add,
  Chat,
  Factory,
  FileOpen,
  FileUploadOutlined,
  Group,
  Groups3,
  Home,
  Logout,
  Person,
  Person2,
  PersonAdd,
  PersonAddAlt,
  PowerOff,
  VideoCall,
  Warehouse,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import React from "react";
import { useSignOut } from "react-firebase-hooks/auth";
import { Link, Outlet } from "react-router-dom";
import { employeeAuth } from "../../../../firebase.config";

const drawerWidth = 240;

const useStyles = {
  root: {
    display: "flex",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // toolbar: theme.mixins.toolbar,
};

const ModernSidebar = () => {
  const [signOut, loading, error] = useSignOut(employeeAuth);

  return (
    <div className={useStyles.root}>
      <Drawer
        className={useStyles.drawer}
        variant="permanent"
        classes={{
          paper: useStyles.drawerPaper,
        }}
      >
        <div className={useStyles.toolbar} />
        <List>
          <Link
            to="/employee-dashboard/create-slot"
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem button>
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary="Create Slots" />
            </ListItem>
          </Link>
          <Link
            to="/employee-dashboard/create-user"
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem button>
              <ListItemIcon>
                <PersonAdd />
              </ListItemIcon>
              <ListItemText primary="Create User" />
            </ListItem>
          </Link>
          <Link
            to="/employee-dashboard/assigned-task"
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem button>
              <ListItemIcon>
                <Groups3 />
              </ListItemIcon>
              <ListItemText primary="Assigned Task" />
            </ListItem>
          </Link>
          <Link
            to="/employee-dashboard/create-company"
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem button>
              <ListItemIcon>
                <Factory />
              </ListItemIcon>
              <ListItemText primary="Create Company" />
            </ListItem>
          </Link>
          <Link
            to="/employee-dashboard/list-users"
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem button>
              <ListItemIcon>
                <Group />
              </ListItemIcon>
              <ListItemText primary="All Clients" />
            </ListItem>
          </Link>
          <Link
            to="/employee-dashboard/company-list"
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem button>
              <ListItemIcon>
                <Warehouse />
              </ListItemIcon>
              <ListItemText primary="Companies" />
            </ListItem>
          </Link>
          <Link
            to="/employee-dashboard/session"
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem button>
              <ListItemIcon>
                <VideoCall />
              </ListItemIcon>
              <ListItemText primary="Session with clients" />
            </ListItem>
          </Link>
          <Link
            to="/employee-dashboard/chat"
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem button>
              <ListItemIcon>
                <Chat />
              </ListItemIcon>
              <ListItemText primary="Chat with clients" />
            </ListItem>
          </Link>
          <ListItem button onClick={() => signOut()}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItem>
        </List>
      </Drawer>
      <Box sx={{ marginLeft: "250px", padding: "20px 0" }}>
        <Outlet />
      </Box>
    </div>
  );
};

export default ModernSidebar;
