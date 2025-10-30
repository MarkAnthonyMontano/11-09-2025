import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";

const UserPageAccess = () => {
  const [userFound, setUserFound] = useState(null);
  const [pages, setPages] = useState([]);
  const [pageAccess, setPageAccess] = useState({});
  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });

  const mainColor = "#7E0000";

  // 🔍 Automatically search when typing user ID (debounced)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (userID.trim() !== "") {
        handleSearchUser();
      } else {
        setUserFound(null);
        setPages([]);
      }
    }, 600); // Delay search after typing stops

    return () => clearTimeout(delayDebounce);
  }, [userID]);

  // 🔍 Fetch user page access
  const handleSearchUser = async () => {
    if (!userID) return;

    setLoading(true);
    try {
      const { data: allPages } = await axios.get("http://localhost:5000/api/pages");
      const { data: accessRows } = await axios.get(`http://localhost:5000/api/page_access/${userID}`);

      const accessMap = accessRows.reduce((acc, curr) => {
        acc[curr.page_id] = curr.page_privilege === 1;
        return acc;
      }, {});

      allPages.forEach((page) => {
        if (accessMap[page.id] === undefined) accessMap[page.id] = false;
      });

      setUserFound({ id: userID });
      setPages(allPages);
      setPageAccess(accessMap);
      setSnackbar({ open: true, message: "User found successfully!", type: "success" });
    } catch (error) {
      console.error("Error searching user:", error);
      setUserFound(null);
      setPages([]);
      setSnackbar({ open: true, message: "User not found or error loading data", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Refresh pages and access
  const fetchPages = async () => {
    try {
      const { data: allPages } = await axios.get("http://localhost:5000/api/pages");
      const { data: accessRows } = await axios.get(`http://localhost:5000/api/page_access/${userID}`);

      const accessMap = accessRows.reduce((acc, curr) => {
        acc[curr.page_id] = curr.page_privilege === 1;
        return acc;
      }, {});

      allPages.forEach((page) => {
        if (accessMap[page.id] === undefined) accessMap[page.id] = false;
      });

      setPages(allPages);
      setPageAccess(accessMap);
    } catch (err) {
      console.error("Error fetching pages:", err);
    }
  };

  // ✅ Toggle access privileges
  const handleToggleChange = async (pageId, hasAccess) => {
    const newAccessState = !hasAccess;
    try {
      if (newAccessState) {
        await axios.post(`http://localhost:5000/api/page_access/${userID}/${pageId}`);
      } else {
        await axios.delete(`http://localhost:5000/api/page_access/${userID}/${pageId}`);
      }
      await fetchPages();
      setSnackbar({
        open: true,
        message: `Access ${newAccessState ? "granted" : "revoked"} successfully!`,
        type: "success",
      });
    } catch (error) {
      console.error("Error updating access:", error);
      setSnackbar({ open: true, message: "Error updating access", type: "error" });
    }
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 150px)",
        overflowY: "auto",
        paddingRight: 1,
        backgroundColor: "transparent",
      }}
    >
      {/* 🧾 Top Header: Title + Search (aligned) */}
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
            color: mainColor,
            fontSize: "36px",
          }}
        >
          USER PAGE ACCESS
        </Typography>

        {/* 🔎 Right Side Search */}
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            size="small"
            placeholder="Search by Person ID"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "gray" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: "100%", sm: "350px" },
              backgroundColor: "white",
              borderRadius: "5px",
            }}
          />
        </Box>
      </Box>

      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />

      {/* ⏳ Loading Indicator */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* 📋 Access Table */}
      {userFound && (
        <Paper
          elevation={4}
          sx={{
            border: `2px solid ${mainColor}`,
            overflow: "hidden",
            backgroundColor: "#ffffff",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: mainColor }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>#</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Page Description</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Page Group</TableCell>
                  <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>
                    Access
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {pages.length > 0 ? (
                  pages.map((page, index) => {
                    const hasAccess = !!pageAccess[page.id];
                    return (
                      <TableRow key={page.id} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{page.page_description}</TableCell>
                        <TableCell>{page.page_group}</TableCell>
                        <TableCell align="center">
                          <Switch
                            checked={hasAccess}
                            onChange={() => handleToggleChange(page.id, hasAccess)}
                            color="primary"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No pages found.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* 🔔 Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserPageAccess;
