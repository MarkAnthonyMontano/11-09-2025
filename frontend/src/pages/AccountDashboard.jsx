import {
  ListAlt,
  PersonAdd,
  LockReset,
  People,
  AssignmentInd,
  TableChart,
  Security,
  School,
  SupervisorAccount,
  AdminPanelSettings,
  Info,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";


const AccountDashboard = () => {

  // Also put it at the very top
  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");

  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(false);


  const pageId = 97;

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
    return <LoadingOverlay open={loading} message="Check Access" />;
  }

  if (!hasAccess) {
    return (
      <Unauthorized />
    );
  }







  const menuItems = [
    {
      label: "ADD FACULTY ACCOUNTS",
      icon: <PersonAdd className="text-maroon-500 text-2xl" />,
      path: "/register_prof",
    },
    {
      label: "ADD REGISTRAR'S ACCOUNT",
      icon: <PersonAdd className="text-maroon-500 text-2xl" />,
      path: "/register_registrar",
    },
    {
      label: "ADD STUDENT'S ACCOUNT",
      icon: <PersonAdd className="text-maroon-500 text-2xl" />,
      path: "/register_student",
    },
    {
      label: "APPLICANT INFORMATION",
      path: "/super_admin_applicant_dashboard1",
      icon: <Info className="text-maroon-500 text-2xl" />,
    },
    {
      label: "STUDENT INFORMATION",
      path: "/super_admin_student_dashboard1",
      icon: <Info className="text-maroon-500 text-2xl" />,
    },

    {
      label: "USER PAGE ACCESS",
      icon: <Security className="text-maroon-500 text-2xl" />,
      path: "/user_page_access",
    },
    {
      label: "PAGE TABLE",
      icon: <TableChart className="text-maroon-500 text-2xl" />,
      path: "/page_crud",
    },
    {
      label: "RESET PASSWORD",
      icon: <LockReset className="text-maroon-500 text-2xl" />,
      path: "/registrar_reset_password",
    },
    {
      label: "APPLICANT RESET PASSWORD",
      icon: <People className="text-maroon-500 text-2xl" />,
      path: "/superadmin_applicant_reset_password",
    },
    {
      label: "STUDENT RESET PASSWORD",
      icon: <School className="text-maroon-500 text-2xl" />,
      path: "/superadmin_student_reset_password",
    },
    {
      label: "FACULTY RESET PASSWORD",
      icon: <SupervisorAccount className="text-maroon-500 text-2xl" />,
      path: "/superadmin_faculty_reset_password",
    },
    {
      label: "REGISTRAR RESET PASSWORD",
      icon: <AdminPanelSettings className="text-maroon-500 text-2xl" />,
      path: "/superadmin_registrar_reset_password",
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
      <div className="p-2 px-10 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {menuItems.map((item, index) => (
            <div className="relative" key={index}>
              <Link to={item.path}>
                <div className="bg-white p-4 border-4 rounded-lg border-maroon-500 absolute left-16 top-12 w-enough">
                  {item.icon}
                </div>
                <button className="bg-white text-maroon-500 border-4 rounded-lg border-maroon-500 p-4 w-80 h-32 font-medium mt-20 ml-8 flex items-end justify-center">
                  {item.label}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Box>
  );
};

export default AccountDashboard;
