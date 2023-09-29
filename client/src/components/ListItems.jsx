import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAppContext } from "../context/AppContext";
import { useUserContext } from "../context/UserContext";

const ListItems = () => {
  const { setActiveComponent } = useAppContext();
  const { user } = useUserContext();

  const handleItemClick = (componentName) => {
    setActiveComponent(componentName);
  };

  return (
    <>
      {/* <ListItemButton onClick={() => handleItemClick("Dashboard")}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton> */}
      <ListItemButton onClick={() => handleItemClick("Tasks")}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Tasks" />
      </ListItemButton>
      {user?.isAdmin === true && (
        <ListItemButton onClick={() => handleItemClick("Manage Users")}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Manage Users" />
        </ListItemButton>
      )}
      <ListItemButton onClick={() => handleItemClick("Profile")}>
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItemButton>
    </>
  );
};

export default ListItems;
