import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";

const Profile = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [editedDetails, setEditedDetails] = useState();
  const { user } = useUserContext();

  const handleEdit = () => {
    setIsEditable(true);
    setEditedDetails({ ...user });
  };

  const handleSave = () => {
    setIsEditable(false);
    // setTaskDetails({ ...editedDetails });
    console.log(editedDetails.name);
  };

  return (
    <>
      <div style={{ width: "100%" }}>
        <Box
          sx={{
            backgroundColor: "lightgray",
            borderRadius: 1,
            py: 2,
            px: 3,
            mb: 3,
          }}
        >
          <Typography component="h1" variant="h3" align="left">
            Edit Profile
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            mb: 3,
          }}
        >
          <TextField
            label="Name"
            value={isEditable ? editedDetails.name || "" : user.name || ""}
            variant="outlined"
            disabled={!isEditable}
            onChange={(e) =>
              setEditedDetails({ ...user, name: e.target.value })
            }
          />
          {!isEditable && (
            <Button
              variant="text"
              disableElevation
              onClick={handleEdit}
              sx={{
                textTransform: "capitalize",
                alignItems: "left",
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              Edit
            </Button>
          )}
          {isEditable && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Button
                variant="text"
                disableElevation
                onClick={handleSave}
                sx={{
                  textTransform: "capitalize",
                  alignItems: "left",
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                Save
              </Button>
              <Button
                variant="text"
                disableElevation
                onClick={() => setIsEditable(false)}
                sx={{
                  textTransform: "capitalize",
                  alignItems: "left",
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            mb: 3,
          }}
        >
          <TextField
            label="Email"
            value={user.email}
            variant="outlined"
            disabled
          />
        </Box>
      </div>
    </>
  );
};

export default Profile;
