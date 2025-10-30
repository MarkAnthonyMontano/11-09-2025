import React, { useEffect, useState } from "react";
import axios from "axios";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import {
  Assignment,        // Requirements
  MeetingRoom,       // Room
  Class,             // Section
  Timeline,          // Semester
  ChangeCircle,      // Change Grade Period
  Update,            // Year Update
  EventAvailable,    // School Year Activator
  Layers,            // Year Level
  CalendarToday,     // Year Panel
  DateRange,         // School Year Panel
  Email,             // Email Sender
  Settings,
  Campaign,           // Announcement
  HelpOutline
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import {
  Box,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const SystemDashboardPanel = () => {

  // Also put it at the very top
  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");

  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(false);


  const pageId = 99;

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


  const menuItems = [
    { title: "REQUIREMENTS PANEL", link: "/requirements_form", icon: <Assignment className="text-maroon-500 text-3xl" /> },
    { title: "ROOM FORM", link: "/room_registration", icon: <MeetingRoom className="text-maroon-500 text-3xl" /> },
    { title: "SETTINGS", link: "/settings", icon: <Settings className="text-maroon-500 text-3xl" /> },
    { title: "SECTION PANEL FORM", link: "/section_panel", icon: <Class className="text-maroon-500 text-3xl" /> },
    { title: "SEMESTER PANEL FORM", link: "/semester_panel", icon: <Timeline className="text-maroon-500 text-3xl" /> },
    { title: "CHANGE GRADING PERIOD", link: "/change_grade_period", icon: <ChangeCircle className="text-maroon-500 text-3xl" /> },
    { title: "YEAR UPDATE PANEL", link: "/year_update_panel", icon: <Update className="text-maroon-500 text-3xl" /> },
    { title: "SCHOOL YEAR ACTIVATOR PANEL", link: "/school_year_activator_panel", icon: <EventAvailable className="text-maroon-500 text-3xl" /> },
    { title: "YEAR LEVEL PANEL FORM", link: "/year_level_panel", icon: <Layers className="text-maroon-500 text-3xl" /> },
    { title: "YEAR PANEL FORM", link: "/year_panel", icon: <CalendarToday className="text-maroon-500 text-3xl" /> },
    { title: "SCHOOL YEAR PANEL", link: "/school_year_panel", icon: <DateRange className="text-maroon-500 text-3xl" /> },
    { title: "EMAIL SENDER", link: "/email_template_manager", icon: <Email className="text-maroon-500 text-3xl" /> },
    { title: "ANNOUNCEMENT", link: "/announcement", icon: <Campaign className="text-maroon-500 text-3xl" /> },
    { title: "EVALUATION MANAGEMENT", link: "/evaluation_crud", icon: <HelpOutlineIcon className="text-maroon-500 text-3xl" /> },
  ];




  // Put this at the very bottom before the return 
  if (loading || hasAccess === null) {
    return <LoadingOverlay open={loading} message="Check Access" />;
  }

  if (!hasAccess) {
    return (
      <Unauthorized />
    );
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
      <div className="p-2 px-10 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {menuItems.map((item, idx) => (
            <div className="relative" key={idx}>
              <Link to={item.link}>
                {/* Icon box */}
                <div className="bg-white p-4 border-4 rounded-lg border-maroon-500 absolute left-16 top-12 w-enough">
                  {item.icon}
                </div>

                {/* Button (no hover) */}
                <button className="bg-white text-maroon-500 border-4 rounded-lg border-maroon-500 p-4 w-80 h-32 font-medium mt-20 ml-8 flex items-end justify-center">
                  {item.title}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Box>
  );
};

export default SystemDashboardPanel;
