import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";

const SemesterPanel = () => {

  
// Also put it at the very top
const [userID, setUserID] = useState("");
const [user, setUser] = useState("");
const [userRole, setUserRole] = useState("");

const [hasAccess, setHasAccess] = useState(null);
const [loading, setLoading] = useState(false);


const pageId = 66;

//Put this After putting the code of the past code
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
        const response = await axios.get(`http://localhost:5000/api/page_access/${userID}/${pageId}`);
        if (response.data && response.data.page_privilege === 1) {
          setHasAccess(true);
        } else {
          setHasAccess(false);
        }
    } catch (error) {
        console.error('Error checking access:', error);
        setHasAccess(false);
        if (error.response && error.response.data.message) {
          console.log(error.response.data.message);
        } else {
          console.log("An unexpected error occurred.");
        }
        setLoading(false);
    }
  };




  const [semesterDescription, setSemesterDescription] = useState("");
  const [semesters, setSemesters] = useState([]);

  // Load semesters
  const fetchSemesters = async () => {
    try {
      const res = await axios.get("http://localhost:5000/get_semester");
      setSemesters(res.data);
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  // Add new semester
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!semesterDescription.trim()) return;

    try {
      await axios.post("http://localhost:5000/semesters", {
        semester_description: semesterDescription,
      });
      setSemesterDescription("");
      fetchSemesters();
    } catch (error) {
      console.error("Error saving semester:", error);
    }
  };

  // 🔒 Disable right-click
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // 🔒 Block DevTools shortcuts + Ctrl+P silently
  document.addEventListener('keydown', (e) => {
    const isBlockedKey =
      e.key === 'F12' || // DevTools
      e.key === 'F11' || // Fullscreen
      (e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === 'i' || e.key.toLowerCase() === 'j')) || // Ctrl+Shift+I/J
      (e.ctrlKey && e.key.toLowerCase() === 'u') || // Ctrl+U (View Source)
      (e.ctrlKey && e.key.toLowerCase() === 'p');   // Ctrl+P (Print)

    if (isBlockedKey) {
      e.preventDefault();
      e.stopPropagation();
    }
  });



// Put this at the very bottom before the return 
if (loading || hasAccess === null) {
   return <LoadingOverlay open={loading} message="Check Access"/>;
}

  if (!hasAccess) {
    return (
      <Unauthorized />
    );
  }

  return (
    <Box sx={{ height: "calc(100vh - 150px)", overflowY: "auto", paddingRight: 1, backgroundColor: "transparent" }}>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
      
          mb: 2,
       
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: 'maroon',
            fontSize: '36px',
          }}
        >
          SEMESTER PANEL
        </Typography>




      </Box>
      <hr style={{ border: "1px solid #ccc", width: "100%" }} />

      <br />


      <Grid container spacing={4}>
        {/* Form Section */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3, border: "2px solid maroon",     borderRadius: 2, }}>
            <Typography variant="h6" sx={{ mb: 2, color: "maroon" }}>
              Add Semester
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Semester Description"
                placeholder="e.g., First Semester"
                value={semesterDescription}
                onChange={(e) => setSemesterDescription(e.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#800000",
                  "&:hover": { backgroundColor: "#a00000" },
                }}
              >
                Save
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Display Section */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 3, border: "2px solid maroon",     borderRadius: 2, }}>
            <Typography variant="h6" sx={{ mb: 2, color: "maroon" }}>
              Saved Semesters
            </Typography>
            <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Semester ID</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {semesters.map((semester, index) => (
                    <TableRow key={index}>
                      <TableCell>{semester.semester_id}</TableCell>
                      <TableCell>{semester.semester_description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SemesterPanel;
