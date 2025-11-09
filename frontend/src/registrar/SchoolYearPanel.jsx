import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";

const SchoolYearPanel = () => {

  const settings = useContext(SettingsContext);

  const [titleColor, setTitleColor] = useState("#000000");
  const [subtitleColor, setSubtitleColor] = useState("#555555");
  const [borderColor, setBorderColor] = useState("#000000");
  const [mainButtonColor, setMainButtonColor] = useState("#1976d2");
  const [subButtonColor, setSubButtonColor] = useState("#ffffff");   // ✅ NEW
  const [stepperColor, setStepperColor] = useState("#000000");       // ✅ NEW

  const [fetchedLogo, setFetchedLogo] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [shortTerm, setShortTerm] = useState("");
  const [campusAddress, setCampusAddress] = useState("");

  useEffect(() => {
    if (!settings) return;

    // 🎨 Colors
    if (settings.title_color) setTitleColor(settings.title_color);
    if (settings.subtitle_color) setSubtitleColor(settings.subtitle_color);
    if (settings.border_color) setBorderColor(settings.border_color);
    if (settings.main_button_color) setMainButtonColor(settings.main_button_color);
    if (settings.sub_button_color) setSubButtonColor(settings.sub_button_color);   // ✅ NEW
    if (settings.stepper_color) setStepperColor(settings.stepper_color);           // ✅ NEW

    // 🏫 Logo
    if (settings.logo_url) {
      setFetchedLogo(`http://localhost:5000${settings.logo_url}`);
    } else {
      setFetchedLogo(EaristLogo);
    }

    // 🏷️ School Information
    if (settings.company_name) setCompanyName(settings.company_name);
    if (settings.short_term) setShortTerm(settings.short_term);
    if (settings.campus_address) setCampusAddress(settings.campus_address);

  }, [settings]); 

// Also put it at the very top
const [userID, setUserID] = useState("");
const [user, setUser] = useState("");
const [userRole, setUserRole] = useState("");

const [hasAccess, setHasAccess] = useState(null);
const [loading, setLoading] = useState(false);


const pageId = 58;

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





  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [schoolYears, setSchoolYears] = useState([]);

  useEffect(() => {
    fetchYears();
    fetchSemesters();
    fetchSchoolYears();
  }, []);

  const fetchYears = async () => {
    try {
      const res = await axios.get("http://localhost:5000/year_table");
      setYears(res.data);
    } catch (error) {
      console.error("Error fetching years:", error);
    }
  };

  const fetchSemesters = async () => {
    try {
      const res = await axios.get("http://localhost:5000/get_semester");
      setSemesters(res.data);
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  };

  const fetchSchoolYears = async () => {
    try {
      const res = await axios.get("http://localhost:5000/school_years");
      setSchoolYears(res.data);
    } catch (error) {
      console.error("Error fetching school years:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedYear || !selectedSemester) return;

    try {
      await axios.post("http://localhost:5000/school_years", {
        year_id: selectedYear,
        semester_id: selectedSemester,
        activator: 0,
      });
      setSelectedYear("");
      setSelectedSemester("");
      fetchSchoolYears();
    } catch (error) {
      console.error("Error saving school year:", error);
    }
  };

  const formatYearRange = (year) => {
    const start = parseInt(year.year_description);
    return `${start}-${start + 1}`;
  };

  const getStatus = (activatorValue) => {
    return activatorValue === 1 ? "Active" : "Inactive";
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
            color: titleColor,
            fontSize: '36px',
          }}
        >
      SCHOOL YEAR PANEL
        </Typography>

      


      </Box>
      <hr style={{ border: "1px solid #ccc", width: "100%" }} />

      <br />
      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {/* Left Container: Form */}
        <Box sx={{
          flex: 1,
          p: 3,
          bgcolor: "#fff",
          border: `2px solid ${borderColor}`, 
          boxShadow: 2,
          width: 800,
          borderRadius: 2,
          minWidth: "300px"
        }}>
          <Typography variant="h6" mb={2} style={{color: subtitleColor, }}>
            Add New School Year
          </Typography>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label className="block font-semibold mb-1">Year Level</label>
              <select
                className="border p-2 w-full rounded"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">-- Select Year Level --</option>
                {years.map((year) => (
                  <option key={year.year_id} value={year.year_id}>
                    {formatYearRange(year)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Semester</label>
              <select
                className="border p-2 w-full rounded"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                <option value="">-- Select Semester --</option>
                {semesters.map((semester) => (
                  <option key={semester.semester_id} value={semester.semester_id}>
                    {semester.semester_description}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded"
              style={{   backgroundColor: "#1967d2",}}
            >
              Save
            </button>

          </form>
        </Box>

        {/* Right Container: Table */}
        <Box sx={{
          flex: 1,
          p: 3,
          bgcolor: "#fff",
          boxShadow: 2,
          border: `2px solid ${borderColor}`, 
          borderRadius: 2,
          minWidth: "300px"
        }}>
          <Typography variant="h6" mb={2} style={{color: subtitleColor, }}>
            Saved School Years
          </Typography>
          <Box sx={{ maxHeight: 350, overflowY: "auto" }}>
            <table style={{border: `2px solid ${borderColor}`}} className="w-full border border-gray-300 text-sm">
              <thead>
                <tr style={{backgroundColor: settings?.header_color || "#1976d2", color: "#ffffff"}} className="bg-gray-200">
                  <th style={{border: `2px solid ${borderColor}`}} className="p-2 border">Year Level</th>
                  <th style={{border: `2px solid ${borderColor}`}} className="p-2 border">Semester</th>
                  <th style={{border: `2px solid ${borderColor}`}} className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {schoolYears.map((sy, index) => (
                  <tr key={index}>
                    <td style={{border: `2px solid ${borderColor}`}} className="p-2 border text-center">
                      {`${sy.year_description}-${parseInt(sy.year_description) + 1}`}
                    </td>
                    <td style={{border: `2px solid ${borderColor}`}} className="p-2 border text-center">{sy.semester_description}</td>
                    <td style={{border: `2px solid ${borderColor}`}} className="p-2 border text-center">{getStatus(sy.astatus)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SchoolYearPanel;
