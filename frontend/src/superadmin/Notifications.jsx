import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import {
    Box,
    Typography,
    TextField,
    Button,
    FormControl,
    Select,
    MenuItem,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
    Paper,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import SearchIcon from "@mui/icons-material/Search";

const Notifications = () => {
    // Also put it at the very top
    const [userID, setUserID] = useState("");
    const [user, setUser] = useState("");
    const [userRole, setUserRole] = useState("");

    const [hasAccess, setHasAccess] = useState(null);
    const [loading, setLoading] = useState(false);


    const pageId = 71;

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


    const [notifications, setNotifications] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 100;

    // ✅ Fetch notifications from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/notifications");
                setNotifications(res.data);
            } catch (err) {
                console.error("❌ Failed to fetch notifications:", err);
            }
        };
        fetchData();
    }, []);

    // ✅ Filtering
    const filtered = notifications.filter((n) =>
        [n.message, n.applicant_number, n.type]
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    // ✅ Pagination logic
    const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filtered.slice(startIndex, startIndex + itemsPerPage);

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
        return <LoadingOverlay open={loading} message="Check Access" />;
    }

    if (!hasAccess) {
        return (
            <Unauthorized />
        );
    }








    return (
        <Box sx={{ height: 'calc(100vh - 150px)', overflowY: 'auto', pr: 1, }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                {/* Left: Header */}
                <Typography variant="h4" fontWeight="bold" color="maroon">
                    Notifications
                </Typography>

                {/* Right: Search */}
                <TextField
                    variant="outlined"
                    placeholder="Search by Applicant / Message / Type"
                    size="small"


                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
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

            <hr style={{ border: "1px solid #ccc", width: "100%" }} />
            <div style={{ height: "20px" }}></div>

            <TableContainer component={Paper} sx={{ width: '100%' }}>
                <Table size="small">
                    <TableHead sx={{ backgroundColor: '#6D2323', color: "white", border: "2px solid maroon", }}>
                        <TableRow>
                            <TableCell
                                colSpan={10}
                                sx={{
                                    border: "2px solid maroon",
                                    py: 0.5,
                                    backgroundColor: '#6D2323',
                                    color: "white"
                                }}
                            >
                                <Box display="flex" justifyContent="space-between" alignItems="center" >
                                    {/* Left: Applicant List Count */}
                                    <Typography fontSize="16px" fontWeight="bold" color="white" >
                                        Notifications List:
                                    </Typography>

                                    {/* Right: Pagination Controls */}
                                    <Box display="flex" alignItems="center" gap={1}>
                                        {/* First & Prev */}
                                        <Button
                                            onClick={() => setCurrentPage(1)}
                                            disabled={currentPage === 1}
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                minWidth: 80,
                                                color: "white",
                                                borderColor: "white",
                                                backgroundColor: "transparent",
                                                '&:hover': {
                                                    borderColor: 'white',
                                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                                },
                                                '&.Mui-disabled': {
                                                    color: "white",
                                                    borderColor: "white",
                                                    backgroundColor: "transparent",
                                                    opacity: 1,
                                                },
                                            }}
                                        >
                                            First
                                        </Button>

                                        <Button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                minWidth: 80,
                                                color: "white",
                                                borderColor: "white",
                                                backgroundColor: "transparent",
                                                '&:hover': {
                                                    borderColor: 'white',
                                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                                },
                                                '&.Mui-disabled': {
                                                    color: "white",
                                                    borderColor: "white",
                                                    backgroundColor: "transparent",
                                                    opacity: 1,
                                                },
                                            }}
                                        >
                                            Prev
                                        </Button>

                                        <FormControl size="small" sx={{ minWidth: 80 }}>
                                            <Select
                                                value={currentPage}
                                                onChange={(e) => setCurrentPage(Number(e.target.value))}
                                                displayEmpty
                                                sx={{
                                                    fontSize: '12px',
                                                    height: 36,
                                                    color: 'white',
                                                    border: '1px solid white',
                                                    backgroundColor: 'transparent',
                                                    '.MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'white',
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'white',
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'white',
                                                    },
                                                    '& svg': {
                                                        color: 'white',
                                                    }
                                                }}
                                                MenuProps={{
                                                    PaperProps: {
                                                        sx: {
                                                            maxHeight: 200,
                                                            backgroundColor: '#fff',
                                                        }
                                                    }
                                                }}
                                            >
                                                {Array.from({ length: Math.min(totalPages, 100) }, (_, i) => (
                                                    <MenuItem key={i + 1} value={i + 1}>
                                                        Page {i + 1}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>


                                        <Typography fontSize="11px" color="white">
                                            of {totalPages} page{totalPages > 1 ? 's' : ''}
                                        </Typography>

                                        {/* Next & Last */}
                                        <Button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                minWidth: 80,
                                                color: "white",
                                                borderColor: "white",
                                                backgroundColor: "transparent",
                                                '&:hover': {
                                                    borderColor: 'white',
                                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                                },
                                                '&.Mui-disabled': {
                                                    color: "white",
                                                    borderColor: "white",
                                                    backgroundColor: "transparent",
                                                    opacity: 1,
                                                },
                                            }}
                                        >
                                            Next
                                        </Button>

                                        <Button
                                            onClick={() => setCurrentPage(totalPages)}
                                            disabled={currentPage === totalPages}
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                minWidth: 80,
                                                color: "white",
                                                borderColor: "white",
                                                backgroundColor: "transparent",
                                                '&:hover': {
                                                    borderColor: 'white',
                                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                                },
                                                '&.Mui-disabled': {
                                                    color: "white",
                                                    borderColor: "white",
                                                    backgroundColor: "transparent",
                                                    opacity: 1,
                                                },
                                            }}
                                        >
                                            Last
                                        </Button>
                                    </Box>
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>

            <TableContainer component={Paper} sx={{ width: "100%" }}>
                <Table size="small">
                    <TableBody>
                        {currentData.length > 0 ? (
                            currentData.map((n, idx) => {
                                const number = startIndex + idx + 1; // ✅ calculate the running number
                                return (
                                    <TableRow key={idx}>
                                        <TableCell
                                            colSpan={10}
                                            sx={{
                                                border: "3px solid maroon",
                                                py: 0.5,
                                                borderRadius: "5px",
                                                fontSize: "12px",
                                                textAlign: "left",
                                            }}
                                        >
                                            <Typography sx={{ fontWeight: "bold", fontSize: "16px", lineHeight: "1.2" }}>
                                                {number}. {n.message}
                                            </Typography>

                                            <Typography sx={{ fontSize: "14px", color: "gray", lineHeight: "1.2" }}>
                                                Applicant #: {n.applicant_number || "N/A"} | Type: {n.type} |{" "}
                                                {new Date(n.timestamp).toLocaleString()}
                                            </Typography>

                                            <Typography sx={{ fontSize: "14px", lineHeight: "1.2" }}>
                                                By:{" "}
                                                <span style={{ color: "maroon", fontWeight: "bold" }}>
                                                    {n.actor_name || "Unknown"}
                                                </span>{" "}
                                                -{" "}
                                                <span style={{ color: "blue" }}>
                                                    {n.actor_email || "System"}
                                                </span>
                                            </Typography>

                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={10}
                                    sx={{
                                        textAlign: "center",
                                        border: "1px solid maroon",
                                        fontSize: "12px",
                                        py: 0.5,
                                    }}
                                >
                                    No notifications found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                </Table>
            </TableContainer>


        </Box>
    );
};

export default Notifications;
