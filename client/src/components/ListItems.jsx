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
  const { activeComponent, setActiveComponent } = useAppContext();
  const { user } = useUserContext();

  const handleItemClick = (componentName) => {
    setActiveComponent(componentName);
  };

  return (
    <>
      {/* <ListItemButton
        onClick={() => handleItemClick("Dashboard")}
        selected={activeComponent === "Dashboard"}
      >
        <ListItemIcon>
          <DashboardIcon
            color={activeComponent === "Dashboard" ? "primary" : "inherit"}
          />
        </ListItemIcon>
        <ListItemText
          primary="Dashboard"
          primaryTypographyProps={{
            color: activeComponent === "Dashboard" ? "primary" : "initial",
          }}
        />
      </ListItemButton> */}
      <ListItemButton
        onClick={() => handleItemClick("Tasks")}
        selected={activeComponent === "Tasks"}
      >
        <ListItemIcon>
          <AssignmentIcon
            color={activeComponent === "Tasks" ? "primary" : "inherit"}
          />
        </ListItemIcon>
        <ListItemText
          primary="Tasks"
          primaryTypographyProps={{
            color: activeComponent === "Tasks" ? "primary" : "initial",
          }}
        />
      </ListItemButton>
      {user?.isAdmin === true && (
        <ListItemButton
          onClick={() => handleItemClick("Manage Users")}
          selected={activeComponent === "Manage Users"}
        >
          <ListItemIcon>
            <PeopleIcon
              color={activeComponent === "Manage Users" ? "primary" : "inherit"}
            />
          </ListItemIcon>
          <ListItemText
            primary="Manage Users"
            primaryTypographyProps={{
              color: activeComponent === "Manage Users" ? "primary" : "initial",
            }}
          />
        </ListItemButton>
      )}
      <ListItemButton
        onClick={() => handleItemClick("Profile")}
        selected={activeComponent === "Profile"}
      >
        <ListItemIcon>
          <AccountCircleIcon
            color={activeComponent === "Profile" ? "primary" : "inherit"}
          />
        </ListItemIcon>
        <ListItemText
          primary="Profile"
          primaryTypographyProps={{
            color: activeComponent === "Profile" ? "primary" : "initial",
          }}
        />
      </ListItemButton>
    </>
  );
};

export default ListItems;
