import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import { Box, Typography, Button, Snackbar, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";

const ProgramTagging = () => {
  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const pageId = 39;

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
      setLoading(false);
    }
  };

  const [progTag, setProgTag] = useState({
    curriculum_id: "",
    year_level_id: "",
    semester_id: "",
    course_id: "",
  });
  const [courseList, setCourseList] = useState([]);
  const [yearLevelList, setYearlevelList] = useState([]);
  const [semesterList, setSemesterList] = useState([]);
  const [curriculumList, setCurriculumList] = useState([]);
  const [taggedPrograms, setTaggedPrograms] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCourse();
    fetchYearLevel();
    fetchSemester();
    fetchCurriculum();
    fetchTaggedPrograms();
  }, []);

  const fetchYearLevel = async () => {
    try {
      const res = await axios.get("http://localhost:5000/get_year_level");
      setYearlevelList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSemester = async () => {
    try {
      const res = await axios.get("http://localhost:5000/get_semester");
      setSemesterList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCurriculum = async () => {
    try {
      const res = await axios.get("http://localhost:5000/get_curriculum");
      setCurriculumList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCourse = async () => {
    try {
      const res = await axios.get("http://localhost:5000/course_list");
      setCourseList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTaggedPrograms = async () => {
    try {
      const res = await axios.get("http://localhost:5000/prgram_tagging_list");
      setTaggedPrograms(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangesForEverything = (e) => {
    const { name, value } = e.target;
    setProgTag((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInsertingProgTag = async () => {
    const { curriculum_id, year_level_id, semester_id, course_id } = progTag;
    if (!curriculum_id || !year_level_id || !semester_id || !course_id) {
      setSnackbar({
        open: true,
        message: "Please fill all fields",
        severity: "error",
      });
      return;
    }

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/program_tagging/${editingId}`,
          progTag
        );
        setSnackbar({
          open: true,
          message: "Program tag updated successfully!",
          severity: "success",
        });
      } else {
        await axios.post(`http://localhost:5000/program_tagging`, progTag);
        setSnackbar({
          open: true,
          message: "Program tag inserted successfully!",
          severity: "success",
        });
      }

      fetchTaggedPrograms();
      setProgTag({
        curriculum_id: "",
        year_level_id: "",
        semester_id: "",
        course_id: "",
      });
      setEditingId(null);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Error saving data.",
        severity: "error",
      });
    }
  };

  const handleEdit = (program) => {
    setEditingId(program.program_tagging_id);
    setProgTag({
      curriculum_id: program.curriculum_id,
      year_level_id: program.year_level_id,
      semester_id: program.semester_id,
      course_id: program.course_id,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tag?")) return;

    try {
      await axios.delete(`http://localhost:5000/program_tagging/${id}`);
      setSnackbar({
        open: true,
        message: "Program tag deleted successfully!",
        severity: "success",
      });
      fetchTaggedPrograms();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Error deleting program tag.",
        severity: "error",
      });
    }
  };

  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("keydown", (e) => {
    const blocked =
      e.key === "F12" ||
      e.key === "F11" ||
      (e.ctrlKey && e.shiftKey && ["i", "j"].includes(e.key.toLowerCase())) ||
      (e.ctrlKey && ["u", "p"].includes(e.key.toLowerCase()));
    if (blocked) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  if (loading || hasAccess === null) {
    return <LoadingOverlay open={loading} message="Check Access" />;
  }

  if (!hasAccess) {
    return <Unauthorized />;
  }

  return (
    <Box sx={{ height: "calc(100vh - 150px)", overflowY: "auto", paddingRight: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "maroon", fontSize: "36px" }}
        >
          PROGRAM AND COURSE MANAGEMENT
        </Typography>
      </Box>

      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />

      <div style={styles.container}>
        {/* Left: Form Section */}
        <div style={styles.formSection}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Curriculum:</label>
            <select
              name="curriculum_id"
              value={progTag.curriculum_id}
              onChange={handleChangesForEverything}
              style={styles.select}
            >
              <option value="">Choose Curriculum</option>
              {curriculumList.map((curriculum) => (
                <option key={curriculum.curriculum_id} value={curriculum.curriculum_id}>
                  {curriculum.year_description} - {curriculum.program_description}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Course:</label>
            <select
              name="course_id"
              value={progTag.course_id}
              onChange={handleChangesForEverything}
              style={styles.select}
            >
              <option value="">Choose Course</option>
              {courseList.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.course_code} - {course.course_description}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Year Level:</label>
            <select
              name="year_level_id"
              value={progTag.year_level_id}
              onChange={handleChangesForEverything}
              style={styles.select}
            >
              <option value="">Choose Year Level</option>
              {yearLevelList.map((year) => (
                <option key={year.year_level_id} value={year.year_level_id}>
                  {year.year_level_description}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Semester:</label>
            <select
              name="semester_id"
              value={progTag.semester_id}
              onChange={handleChangesForEverything}
              style={styles.select}
            >
              <option value="">Choose Semester</option>
              {semesterList.map((semester) => (
                <option key={semester.semester_id} value={semester.semester_id}>
                  {semester.semester_description}
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={handleInsertingProgTag}
            variant="contained"
            sx={{
              backgroundColor: "maroon",
              color: "white",
              mt: 3,
              width: "100%",
              "&:hover": { backgroundColor: "#8b0000" },
            }}
          >
            {editingId ? "Update Program Tag" : "Insert Program Tag"}
          </Button>
        </div>

        {/* Right: Tagged Programs */}
        <div style={styles.displaySection}>
          <h3 style={{ color: "maroon" }}>Tagged Programs</h3>
          <div style={styles.taggedProgramsContainer}>
            {taggedPrograms.length > 0 ? (
              <table style={styles.table}>
                <thead style={{ background: "#f1f1f1" }}>
                  <tr>
                    <th style={styles.th}>Curriculum</th>
                    <th style={styles.th}>Course</th>
                    <th style={styles.th}>Year Level</th>
                    <th style={styles.th}>Semester</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {taggedPrograms.map((program) => (
                    <tr key={program.program_tagging_id}>
                      <td style={styles.td}>{program.curriculum_description}</td>
                      <td style={styles.td}>{program.course_description}</td>
                      <td style={styles.td}>{program.year_level_description}</td>
                      <td style={styles.td}>{program.semester_description}</td>
                      <td style={{ ...styles.td, whiteSpace: "nowrap" }}>
                        <button
                          onClick={() => handleEdit(program)}
                          style={{
                            backgroundColor: "#2E7D32",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            padding: "8px 14px",
                            marginRight: "6px",
                            cursor: "pointer",
                            width: "100px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "5px",
                          }}
                        >
                          <EditIcon fontSize="small" /> Edit
                        </button>

                        <button
                          onClick={() => handleDelete(program.program_tagging_id)}
                          style={{
                            backgroundColor: "#800000",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            padding: "8px 14px",
                            cursor: "pointer",
                            width: "100px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "5px",
                          }}
                        >
                          <DeleteIcon fontSize="small" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No tagged programs available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "30px",
    width: "95%",
    margin: "30px auto",
    maxHeight: "600px",
  },
  formSection: {
    flex: "1",
    background: "#f8f8f8",
    border: "2px solid maroon",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    maxHeight: "600px",
    minWidth: "48%",
  },
  displaySection: {
    flex: "1",
    background: "#f8f8f8",
    border: "2px solid maroon",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    maxHeight: "600px",
    minWidth: "48%",
    overflowY: "auto",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    fontWeight: "bold",
    display: "block",
    marginBottom: "8px",
  },
  select: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  taggedProgramsContainer: {
    overflowY: "auto",
    maxHeight: "500px",
    marginTop: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  th: {
    padding: "12px",
    borderBottom: "2px solid #ccc",
    backgroundColor: "#f1f1f1",
    fontWeight: "bold",
    fontSize: "15px",
    color: "#333",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    fontSize: "14px",
    color: "#333",
  },
};

export default ProgramTagging;