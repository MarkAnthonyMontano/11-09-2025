import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";


import axios from "axios";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import {
  EventNote,          // for Schedule Plotting Form
  Apartment,          // for Department Section Panel
  Assignment,         // for Department Panel
  MeetingRoom         // for Department Room Panel
} from "@mui/icons-material";
import { Link } from 'react-router-dom';

const DepartmentManagement = () => {
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


const pageId = 95;

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
  <div className="p-2 px-10 w-full">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

      {/* Schedule Plotting Form */}
      <div className="relative">
        <Link to={'/select_college'}>
          <div
            className="bg-white p-4 rounded-lg absolute left-16 top-12 w-enough"
            style={{
              border: `2px solid ${borderColor}`,        // ✅ dynamic border
              color: titleColor,
            }}
          >
            {React.cloneElement(<EventNote />, {
              style: { color: titleColor, fontSize: 32 },
            })}
          </div>

          <button
            className="bg-white rounded-lg p-4 w-80 h-32 font-medium mt-20 ml-8 flex items-end justify-center"
            style={{
              border: `2px solid ${borderColor}`,        // ✅ dynamic border
              color: titleColor,                         // ✅ text color
            }}
          >
            SCHEDULE PLOTTING FORM
          </button>
        </Link>
      </div>

      {/* Department Section Panel */}
      <div className="relative">
        <Link to={'/department_section_panel'}>
          <div
            className="bg-white p-4 rounded-lg absolute left-16 top-12 w-enough"
            style={{
              border: `2px solid ${borderColor}`,
              color: titleColor,
            }}
          >
            {React.cloneElement(<Apartment />, {
              style: { color: titleColor, fontSize: 32 },
            })}
          </div>

          <button
            className="bg-white rounded-lg p-4 w-80 h-32 font-medium mt-20 ml-8 flex items-end justify-center"
            style={{
              border: `2px solid ${borderColor}`,
              color: titleColor,
            }}
          >
            DEPARTMENT SECTION PANEL
          </button>
        </Link>
      </div>

      {/* Department Panel */}
      <div className="relative">
        <Link to={'/department_registration'}>
          <div
            className="bg-white p-4 rounded-lg absolute left-16 top-12 w-enough"
            style={{
              border: `2px solid ${borderColor}`,
              color: titleColor,
            }}
          >
            {React.cloneElement(<Assignment />, {
              style: { color: titleColor, fontSize: 32 },
            })}
          </div>

          <button
            className="bg-white rounded-lg p-4 w-80 h-32 font-medium mt-20 ml-8 flex items-end justify-center"
            style={{
              border: `2px solid ${borderColor}`,
              color: titleColor,
            }}
          >
            DEPARTMENT PANEL
          </button>
        </Link>
      </div>

      {/* Department Room Panel */}
      <div className="relative">
        <Link to={'/department_room'}>
          <div
            className="bg-white p-4 rounded-lg absolute left-16 top-12 w-enough"
            style={{
              border: `2px solid ${borderColor}`,
              color: titleColor,
            }}
          >
            {React.cloneElement(<MeetingRoom />, {
              style: { color: titleColor, fontSize: 32 },
            })}
          </div>

          <button
            className="bg-white rounded-lg p-4 w-80 h-32 font-medium mt-20 ml-8 flex items-end justify-center"
            style={{
              border: `2px solid ${borderColor}`,
              color: titleColor,
            }}
          >
            DEPARTMENT ROOM PANEL
          </button>
        </Link>
      </div>

    </div>
  </div>
);

};

export default DepartmentManagement;
