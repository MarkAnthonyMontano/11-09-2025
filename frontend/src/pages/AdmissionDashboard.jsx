import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import {
  CollectionsBookmark,
  School,
  Info,
  Replay,
  Description,
  Assignment,
  Schedule,
  AssignmentInd,
  ListAlt,
  Score,
  Assessment,
  MeetingRoom,
  EventAvailable,
  Group,
  LocalHospital,
  AssignmentTurnedIn,
  People,
  Transform,
  FormatListNumbered,
  Numbers,
  Class,
  Search,
  Payment,
  FamilyRestroom,
  MedicalServices,
  FolderShared,
  FilePresent,
  FolderCopy,
  AccountCircle,
  Psychology,
  HealthAndSafety,
  AssignmentOutlined,
  Summarize,
  EditCalendar,
  HistoryEdu,
  ListAltOutlined,
  FactCheck,
  FolderSpecial,
  Verified,
  Badge,
  ContactEmergency,
  Diversity3,
} from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const AdmissionDashboardPanel = () => {
  
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



  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const pageId = 93;

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

  if (loading || hasAccess === null) {
    return <LoadingOverlay open={loading} message="Check Access" />;
  }

  if (!hasAccess) {
    return <Unauthorized />;
  }

  // ✅ Grouped Menu Items
  const groupedMenu = [
    {
      label: "ADMISSION OFFICE",
      items: [
        { title: "APPLICANT LIST", link: "/applicant_list_admin", icon: <ListAltOutlined className="text-maroon-500 text-2xl" /> },
        { title: "PERSONAL INFORMATION", link: "/admin_dashboard1", icon: <AccountCircle className="text-maroon-500 text-2xl" /> },
        { title: "FAMILY BACKGROUND", link: "/admin_dashboard2", icon: <FamilyRestroom className="text-maroon-500 text-2xl" /> },
        { title: "EDUCATIONAL ATTAINMENT", link: "/admin_dashboard3", icon: <School className="text-maroon-500 text-2xl" /> },
        { title: "HEALTH MEDICAL RECORDS", link: "/admin_dashboard4", icon: <LocalHospital className="text-maroon-500 text-2xl" /> },
        { title: "OTHER INFORMATION", link: "/admin_dashboard5", icon: <Info className="text-maroon-500 text-2xl" /> },
        { title: "DOCUMENTS SUBMITTED", link: "/student_requirements", icon: <Description className="text-maroon-500 text-2xl" /> },
        { title: "ENTRANCE EXAM ROOM ASSIGNMENT", link: "/assign_entrance_exam", icon: <MeetingRoom className="text-maroon-500 text-2xl" /> },
        { title: "ENTRANCE EXAM SCHEDULE MANAGEMENT", link: "/assign_schedule_applicant", icon: <EditCalendar className="text-maroon-500 text-2xl" /> },
        { title: "EXAMINATION PERMIT", link: "/registrar_examination_profile", icon: <Badge className="text-maroon-500 text-2xl" /> },
        { title: "PROCTOR'S APPLICANT LIST", link: "/proctor_applicant_list", icon: <People className="text-maroon-500 text-2xl" /> },
        { title: "ENTRANCE EXAMINATION SCORES", link: "/applicant_scoring", icon: <Score className="text-maroon-500 text-2xl" /> },
      ],
    },
    {
      label: "ENROLLMENT OFFICER",
      items: [
        { title: "APPLICANT LIST", link: "/applicant_list", icon: <ListAlt className="text-maroon-500 text-2xl" /> },
        { title: "PERSONAL INFORMATION", link: "/registrar_dashboard1", icon: <AccountCircle className="text-maroon-500 text-2xl" /> },
        { title: "FAMILY BACKGROUND", link: "/registrar_dashboard2", icon: <FamilyRestroom className="text-maroon-500 text-2xl" /> },
        { title: "EDUCATIONAL ATTAINMENT", link: "/registrar_dashboard3", icon: <School className="text-maroon-500 text-2xl" /> },
        { title: "HEALTH MEDICAL RECORDS", link: "/registrar_dashboard4", icon: <MedicalServices className="text-maroon-500 text-2xl" /> },
        { title: "OTHER INFORMATION", link: "/registrar_dashboard5", icon: <Info className="text-maroon-500 text-2xl" /> },
        { title: "DOCUMENTS SUBMITTED", link: "/registrar_requirements", icon: <FolderCopy className="text-maroon-500 text-2xl" /> },
        { title: "INTERVIEW ROOM MANAGEMENT", link: "/assign_interview_exam", icon: <MeetingRoom className="text-maroon-500 text-2xl" /> },
        { title: "INTERVIEW SCHEDULE MANAGEMENT", link: "/assign_schedule_applicants_interview", icon: <EditCalendar className="text-maroon-500 text-2xl" /> },
        { title: "INTERVIEWER APPLICANT LIST", link: "/interviewer_applicant_list", icon: <People className="text-maroon-500 text-2xl" /> },
        { title: "QUALIFYING / INTERVIEW EXAM SCORES", link: "/qualifying_exam_scores", icon: <Assessment className="text-maroon-500 text-2xl" /> },
        { title: "STUDENT NUMBERING FOR COLLEGE", link: "/student_numbering_per_college", icon: <FormatListNumbered className="text-maroon-500 text-2xl" /> },
        { title: "COURSE TAGGING", link: "/course_tagging", icon: <Class className="text-maroon-500 text-2xl" /> },
      ],
    },
    {
      label: "MEDICAL AND DENTAL SERVICES",
      items: [
        { title: "APPLICANT LIST", link: "/medical_applicant_list", icon: <ListAltOutlined className="text-maroon-500 text-2xl" /> },
        { title: "PERSONAL INFORMATION", link: "/medical_dashboard1", icon: <AccountCircle className="text-maroon-500 text-2xl" /> },
        { title: "FAMILY BACKGROUND", link: "/medical_dashboard2", icon: <FamilyRestroom className="text-maroon-500 text-2xl" /> },
        { title: "EDUCATIONAL ATTAINMENT", link: "/medical_dashboard3", icon: <School className="text-maroon-500 text-2xl" /> },
        { title: "HEALTH MEDICAL RECORDS", link: "/medical_dashboard4", icon: <HealthAndSafety className="text-maroon-500 text-2xl" /> },
        { title: "OTHER INFORMATION", link: "/medical_dashboard5", icon: <Info className="text-maroon-500 text-2xl" /> },
        { title: "DOCUMENTS SUBMITTED", link: "/medical_requirements", icon: <Description className="text-maroon-500 text-2xl" /> },
        { title: "MEDICAL REQUIREMENTS", link: "/medical_requirements_form", icon: <MedicalServices className="text-maroon-500 text-2xl" /> },
        { title: "DENTAL ASSESSMENT", link: "/dental_assessment", icon: <HealthAndSafety className="text-maroon-500 text-2xl" /> },
        { title: "PHYSICAL AND NEUROLOGICAL EXAMINATION", link: "/physical_neuro_exam", icon: <Psychology className="text-maroon-500 text-2xl" /> },
        { title: "HEALTH RECORDS CERTIFICATE", link: "/health_record", icon: <FactCheck className="text-maroon-500 text-2xl" /> },
        { title: "MEDICAL CERTIFICATE", link: "/medical_certificate", icon: <ContactEmergency className="text-maroon-500 text-2xl" /> },
      ],
    },
    {
      label: "REGISTRAR'S OFFICE",
      items: [
        { title: "APPLICANT LIST", link: "/super_admin_applicant_list", icon: <ListAltOutlined className="text-maroon-500 text-2xl" /> },
        { title: "PERSONAL INFORMATION", link: "/readmission_dashboard1", icon: <AccountCircle className="text-maroon-500 text-2xl" /> },
        { title: "FAMILY BACKGROUND", link: "/readmission_dashboard2", icon: <FamilyRestroom className="text-maroon-500 text-2xl" /> },
        { title: "EDUCATIONAL ATTAINMENT", link: "/readmission_dashboard3", icon: <School className="text-maroon-500 text-2xl" /> },
        { title: "HEALTH MEDICAL RECORDS", link: "/readmission_dashboard4", icon: <HealthAndSafety className="text-maroon-500 text-2xl" /> },
        { title: "OTHER INFORMATION", link: "/readmission_dashboard5", icon: <Info className="text-maroon-500 text-2xl" /> },
        { title: "CLASS LIST", link: "/class_roster", icon: <Class className="text-maroon-500 text-2xl" /> },
        { title: "SEARCH CERTIFICATE OF REGISTRATION", link: "/search_cor", icon: <Search className="text-maroon-500 text-2xl" /> },
        { title: "STUDENT NUMBERING PANEL", link: "/student_numbering", icon: <Numbers className="text-maroon-500 text-2xl" /> },
        { title: "REPORT OF GRADES", link: "/report_of_grades", icon: <Assessment className="text-maroon-500 text-2xl" /> },
        { title: "TRANSCRIPT OF RECORDS", link: "/transcript_of_records", icon: <HistoryEdu className="text-maroon-500 text-2xl" /> },

      ],
    },
  ];

 return (
  <Box
    sx={{
      height: "calc(100vh - 150px)",
      overflowY: "auto",
      paddingRight: 1,
      backgroundColor: "transparent",
    }}
  >
    {groupedMenu.map((group, idx) => (
      <Box key={idx} sx={{ mb: 5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            borderBottom: `2px solid ${settings?.header_color || "#1976d2"}`, // ✅ header color
            width: "100%",
            pb: 1,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: titleColor, // dynamic text color
              textTransform: "uppercase",
              fontSize: "34px",
            }}
          >
            {group.label}
          </Typography>
        </Box>

        <div className="p-2 px-10 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {group.items.map((item, i) => (
            <div className="relative" key={i}>
              <Link to={item.link}>
                <div
                  className="bg-white p-4 rounded-lg absolute left-16 top-12 w-enough"
                  style={{
                    border: `4px solid ${settings?.header_color || "#1976d2"}`, // ✅ header color
                  }}
                >
                  {React.cloneElement(item.icon, { style: { color: titleColor, fontSize: 32 } })}
                </div>

                <button
                  className="bg-white rounded-lg p-4 w-80 h-32 font-medium mr-4 mt-20 ml-8 flex items-end justify-center"
                  style={{
                    border: `4px solid ${settings?.header_color || "#1976d2"}`, // ✅ header color
                    color: titleColor, // dynamic button text
                  }}
                >
                  {item.title}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </Box>
    ))}
  </Box>
);

};

export default AdmissionDashboardPanel;
