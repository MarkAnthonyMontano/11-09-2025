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

const SuperAdminRegistrarResetPassword = () => {
  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [hasAccess, setHasAccess] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState("");
  const [searchError, setSearchError] = useState("");
  const pageId = 86;

  // ✅ User Authentication + Access Control
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
      if (error.response && error.response.data.message) {
        console.log(error.response.data.message);
      } else {
        console.log("An unexpected error occurred.");
      }
      setLoading(false);
    }
  };

  // ✅ Search registrar info by email
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
        const res = await axios.post("http://localhost:5000/superadmin-get-registrar", {
          search: searchQuery, // changed from email → search
        });
        setUserInfo(res.data);
      } catch (err) {
        setSearchError(err.response?.data?.message || "No registrar found.");
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };


    const delayDebounce = setTimeout(fetchInfo, 600);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // ✅ Reset password handler
  const handleReset = async () => {
    if (!userInfo) return;
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/forgot-password-registrar",
        { email: searchQuery }
      );
      setResetMsg(res.data.message);
    } catch (err) {
      setSearchError(
        err.response?.data?.message || "Error resetting password"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Change account status
  const handleStatusChange = async (e) => {
    const newStatus = parseInt(e.target.value, 10);
    setUserInfo((prev) => ({ ...prev, status: newStatus }));

    try {
      await axios.post(
        "http://localhost:5000/superadmin-update-status-registrar",
        {
          email: userInfo.email,
          status: newStatus,
        }
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // 🔒 Disable right-click
  document.addEventListener("contextmenu", (e) => e.preventDefault());

  // 🔒 Block DevTools + Ctrl+P
  document.addEventListener("keydown", (e) => {
    const isBlockedKey =
      e.key === "F12" ||
      e.key === "F11" ||
      (e.ctrlKey &&
        e.shiftKey &&
        (e.key.toLowerCase() === "i" || e.key.toLowerCase() === "j")) ||
      (e.ctrlKey && e.key.toLowerCase() === "u") ||
      (e.ctrlKey && e.key.toLowerCase() === "p");

    if (isBlockedKey) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  // ✅ Loading / Unauthorized display
  if (loading || hasAccess === null) {
    return <LoadingOverlay open={loading} message="Check Access" />;
  }

  if (!hasAccess) {
    return <Unauthorized />;
  }

  // ✅ Main Component
  return (
    <Box>
      {/* Header Section */}
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
          sx={{ fontWeight: "bold", color: "maroon", fontSize: "36px" }}
        >
          REGISTRAR RESET PASSWORD
        </Typography>

        <TextField
          size="small"
          placeholder="Search Employee ID / Name / Email Address"
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

      {/* Registrar Information */}
      <Paper sx={{ p: 3, border: "2px solid maroon" }}>
        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
          gap={2}
        >
          <TextField
            label="Employee ID"
            value={userInfo?.employee_id || ""}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Email"
            value={userInfo?.email || ""}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Full Name"
            value={userInfo?.fullName || ""}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            select
            label="Status"
            value={userInfo?.status ?? ""}
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

export default SuperAdminRegistrarResetPassword;
