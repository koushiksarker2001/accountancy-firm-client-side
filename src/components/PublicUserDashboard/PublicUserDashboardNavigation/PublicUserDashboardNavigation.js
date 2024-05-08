import {
  AccountCircle,
  Chat,
  Factory,
  FileOpen,
  FileUploadOutlined,
  Group,
  Home,
  Logout,
  Person,
  Person2,
  PowerOff,
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
import { publicUserAuth } from "../../../firebase.config";

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
  const [signOut, loading, error] = useSignOut(publicUserAuth);

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
            to="/user-dashboard/upload-file"
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem button>
              <ListItemIcon>
                <FileUploadOutlined />
              </ListItemIcon>
              <ListItemText primary="Upload Files" />
            </ListItem>
          </Link>
          <Link
            to="/user-dashboard/uploaded-files"
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem button>
              <ListItemIcon>
                <FileOpen />
              </ListItemIcon>
              <ListItemText primary="Uploaded Files" />
            </ListItem>
          </Link>
          <Link
            to="/user-dashboard/chat"
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem button>
              <ListItemIcon>
                <Chat />
              </ListItemIcon>
              <ListItemText primary="Chat with employee" />
            </ListItem>
          </Link>
          <Link
            to="/user-dashboard/company-list"
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem button>
              <ListItemIcon>
                <Factory />
              </ListItemIcon>
              <ListItemText primary="Companies" />
            </ListItem>
          </Link>
          <Link
            to="/user-dashboard/session"
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem button>
              <ListItemIcon>
                <Group />
              </ListItemIcon>
              <ListItemText primary="Sessions" />
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
