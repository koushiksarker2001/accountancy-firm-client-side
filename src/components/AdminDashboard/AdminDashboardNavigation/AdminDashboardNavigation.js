import {
  AccountCircle,
  Add,
  AddTask,
  Assignment,
  BarChart,
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
import React from "react";
import { useSignOut } from "react-firebase-hooks/auth";
import { Link, Outlet } from "react-router-dom";
import { auth } from "../../../firebase.config";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
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

const AdminDashboardNavigation = () => {
  const [signOut, loading, error] = useSignOut(auth);
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
            to="/admin-dashboard/create-employee"
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem button>
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary="Create Employee" />
            </ListItem>
          </Link>
          <Link
            to="/admin-dashboard/create-task"
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem button>
              <ListItemIcon>
                <AddTask />
              </ListItemIcon>
              <ListItemText primary="Create Task" />
            </ListItem>
          </Link>
          <Link
            to="/admin-dashboard/task-status"
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem button>
              <ListItemIcon>
                <Assignment />
              </ListItemIcon>
              <ListItemText primary="Task Status" />
            </ListItem>
          </Link>
          <Link
            to="/admin-dashboard/statistics"
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem button>
              <ListItemIcon>
                <BarChart />
              </ListItemIcon>
              <ListItemText primary="Statistics" />
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

export default AdminDashboardNavigation;
