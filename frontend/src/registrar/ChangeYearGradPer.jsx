import React, { useState, useEffect, useContext } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import { Box, Typography, Button } from "@mui/material";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";


const ChangeGradingPeriod = () => {
  const settings = useContext(SettingsContext);

  // 🎨 UI color states
  const [titleColor, setTitleColor] = useState("#000000");
  const [subtitleColor, setSubtitleColor] = useState("#555555");
  const [borderColor, setBorderColor] = useState("#000000");
  const [mainButtonColor, setMainButtonColor] = useState("#1976d2");
  const [subButtonColor, setSubButtonColor] = useState("#ffffff");
  const [stepperColor, setStepperColor] = useState("#000000");

  // 🏫 School info
  const [fetchedLogo, setFetchedLogo] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [shortTerm, setShortTerm] = useState("");
  const [campusAddress, setCampusAddress] = useState("");

  useEffect(() => {
    if (!settings) return;

    setTitleColor(settings.title_color || "#000000");
    setSubtitleColor(settings.subtitle_color || "#555555");
    setBorderColor(settings.border_color || "#000000");
    setMainButtonColor(settings.main_button_color || "#1976d2");
    setSubButtonColor(settings.sub_button_color || "#ffffff");
    setStepperColor(settings.stepper_color || "#000000");

    setFetchedLogo(settings.logo_url ? `http://localhost:5000${settings.logo_url}` : EaristLogo);
    setCompanyName(settings.company_name || "");
    setShortTerm(settings.short_term || "");
    setCampusAddress(settings.campus_address || "");
  }, [settings]);

  // 📆 Grading period list
  const [gradingPeriod, setGradingPeriod] = useState([]);
  const fetchYearPeriod = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get-grading-period");
      setGradingPeriod(response.data);
    } catch (error) {
      console.error("Error in Fetching Data", error);
    }
  };

  // 👤 User and access control
  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const pageId = 14;

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
      console.error("Error checking access:", error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYearPeriod();
  }, []);

  const handlePeriodActivate = async (id) => {
    try {
      await axios.post(`http://localhost:5000/grade_period_activate/${id}`);
      alert("Grading period activated!");
      fetchYearPeriod();
    } catch (error) {
      console.error("Error activating grading period:", error);
    }
  };

  // 🌀 Loading and access guard
  if (loading || hasAccess === null) {
    return <LoadingOverlay open={loading} message="Checking Access..." />;
  }

  if (!hasAccess) {
    return <Unauthorized />;
  }

  return (
    <Box
      sx={{
        height: "calc(100vh - 150px)",
        overflowY: "auto",
        paddingRight: 1,
        backgroundColor: "transparent",
      }}
    >
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
            color: titleColor,
            fontSize: "36px",
          }}
        >
          GRADING PERIOD
        </Typography>
      </Box>

      <hr style={{ border: "1px solid #ccc", width: "100%" }} />

      {/* Period List */}
      <Box sx={{ mt: 3 }}>
        {gradingPeriod.map((period) => (
          <Box
            key={period.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: `2px solid ${borderColor}`,
              padding: "15px",
              backgroundColor: "#fff",
              margin: "20px auto",
              width: "50%",
              borderRadius: "6px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography sx={{ fontSize: "18px", fontWeight: 500, color: "#333" }}>
              {period.description}
            </Typography>
            <Box>
              {period.status === 1 ? (
                <Typography sx={{ color: "#757575", fontSize: "16px" }}>Activated</Typography>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => handlePeriodActivate(period.id)}
                  sx={{
                    backgroundColor: "#4CAF50",
                    "&:hover": { backgroundColor: "#45a049" },
                  }}
                >
                  Activate
                </Button>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ChangeGradingPeriod;
