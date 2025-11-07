import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";

const SuperAdminStudentResetPassword = () => {
  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [hasAccess, setHasAccess] = useState(null);

  const pageId = 92;

  useEffect(() => {
    const storedUser = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    const storedID = localStorage.getItem("person_id");

    if (storedUser && storedRole && storedID) {
      setUser(storedUser);
      setUserRole(storedRole);
      setUserID(storedID);

      if (storedRole === "registrar") {
        checkAccess(storedID);
      } else {
        window.location.href = "/login";
      }
    } else {
      window.location.href = "/login";
    }
  }, []);

  const checkAccess = async (userID) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/page_access/${userID}/${pageId}`
      );
      if (response.data && response.data.page_privilege === 1) {
        setHasAccess(true);
      } else {
        setHasAccess(false);
      }
    } catch (error) {
      console.error("Error checking access:", error);
      setHasAccess(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState("");
  const [searchError, setSearchError] = useState("");

  // ✅ Auto-fetch student info when search changes
  useEffect(() => {
    const fetchInfo = async () => {
      if (!searchQuery) {
        setUserInfo(null);
        setSearchError("");
        return;
      }
      setLoading(true);
      setResetMsg("");
      setSearchError("");

      try {
        const res = await axios.post("http://localhost:5000/superadmin-get-student", {
          search: searchQuery,
        });
        setUserInfo(res.data);
      } catch (err) {
        setSearchError(err.response?.data?.message || "No student found.");
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchInfo, 600);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // ✅ Reset password
  const handleReset = async () => {
    if (!userInfo) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/forgot-password-student", {
        student_number: userInfo.student_number,
      });
      setResetMsg(res.data.message);
    } catch (err) {
      setSearchError(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update status
  const handleStatusChange = async (e) => {
    const newStatus = parseInt(e.target.value, 10);
    setUserInfo((prev) => ({ ...prev, status: newStatus }));

    try {
      await axios.post("http://localhost:5000/superadmin-update-status-student", {
        student_number: userInfo.student_number,
        status: newStatus,
      });
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // ✅ Access Guards
  if (loading || hasAccess === null) {
    return <LoadingOverlay open={loading} message="Checking Access..." />;
  }

  if (!hasAccess) {
    return <Unauthorized />;
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "maroon",
            fontSize: "36px",
          }}
        >
          STUDENT RESET PASSWORD
        </Typography>

        <TextField
          size="small"
          placeholder="Search Student Number / Name / Email Address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: 450,
            backgroundColor: "#fff",
            borderRadius: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "gray" }} />,
          }}
        />
      </Box>

      {searchError && <Typography color="error">{searchError}</Typography>}
      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />

      {/* Info Panel */}
      <Paper sx={{ p: 3, border: "2px solid maroon" }}>
        <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap={2}>
          <TextField
            label="Student Number"
            value={userInfo ? userInfo.student_number : ""}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Email Address"
            value={userInfo ? userInfo.email : ""}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Full Name"
            value={userInfo ? userInfo.fullName : ""}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Birthdate"
            type="date"
            value={userInfo ? userInfo.birthdate : ""}
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
          />
          <TextField
            select
            label="Status"
            value={userInfo ? userInfo.status ?? "" : ""}
            fullWidth
            onChange={handleStatusChange}
          >
            <MenuItem value={1}>Active</MenuItem>
            <MenuItem value={0}>Inactive</MenuItem>
          </TextField>
        </Box>

        <Box mt={3}>
          <Button
            variant="contained"
            color="error"
            onClick={handleReset}
            disabled={!userInfo || loading}
          >
            {loading ? "Processing..." : "Reset Password"}
          </Button>
        </Box>
      </Paper>

      {resetMsg && (
        <Typography sx={{ mt: 2 }} color="green">
          {resetMsg}
        </Typography>
      )}
    </Box>
  );
};

export default SuperAdminStudentResetPassword;
