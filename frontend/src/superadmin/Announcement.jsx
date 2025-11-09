import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import {
    Container,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    CardActions,
    CardMedia,
    Grid,
    DialogContent,
    DialogActions,
    IconButton,
    Box,
} from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";
import { Dialog } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";


function Announcement() {

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


    const pageId = 69;

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


    const [announcements, setAnnouncements] = useState([]);
    const [openImage, setOpenImage] = useState(null);
    const [image, setImage] = useState(null);

    const [form, setForm] = useState({
        title: "",
        content: "",
        valid_days: "7",
        target_role: "",
    });
    const [editingId, setEditingId] = useState(null);

    // Example: current logged-in admin
    const currentUser = {
        id: 1,
        role: "faculty",
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/announcements");
            setAnnouncements(res.data);
        } catch (err) {
            console.error("Error fetching announcements:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("content", form.content);
            formData.append("valid_days", form.valid_days);
            formData.append("target_role", form.target_role);
            formData.append("creator_role", currentUser.role);
            formData.append("creator_id", currentUser.id);

            if (image) formData.append("image", image);

            if (editingId) {
                await axios.put(
                    `http://localhost:5000/api/announcements/${editingId}`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
            } else {
                await axios.post("http://localhost:5000/api/announcements", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            setForm({ title: "", content: "", valid_days: "7", target_role: "" });
            setImage(null);
            setEditingId(null);
            fetchAnnouncements();
        } catch (err) {
            console.error("Error creating/updating announcement:", err);
        }
    };

    const handleEdit = (announcement) => {
        setForm({
            title: announcement.title,
            content: announcement.content,
            valid_days: announcement.valid_days.toString(),
            target_role: announcement.target_role,
        });
        setEditingId(announcement.id);
        setImage(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this announcement?"))
            return;

        try {
            await axios.delete(`http://localhost:5000/api/announcements/${id}`);
            fetchAnnouncements();
        } catch (err) {
            console.error("Error deleting announcement:", err);
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


return (
    <>
        {/* Header */}
        <Box>
            <Box display="flex" alignItems="center">
                <CampaignIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h4" fontWeight="bold" style={{ color: titleColor }}>
                    ANNOUNCEMENT
                </Typography>
            </Box>
            <br />
            <hr style={{ border: "1px solid #ccc", width: "100%" }} />
        </Box>

        {/* Main */}
        <Container maxWidth="lg" sx={{ py: 2, height: "calc(100vh - 150px)" }}>
            <Grid container spacing={4} sx={{ height: "100%" }}>
                {/* Left: Form */}
                <Grid item xs={12} md={5}>
                    <PaperForm
                        form={form}
                        setForm={setForm}
                        handleSubmit={handleSubmit}
                        editingId={editingId}
                        image={image}
                        setImage={setImage}
                        borderColor={borderColor}
                        mainButtonColor={mainButtonColor}
                        subtitleColor={subtitleColor} // ✅ Apply subtitleColor to Form title
                    />
                </Grid>

                {/* Right: Active Announcements */}
                <Grid item xs={12} md={7} sx={{ display: "flex", flexDirection: "column", height: "95%" }}>
                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowY: "auto",
                            height: "100%",
                            pr: 1,
                            p: 2,
                            border: `2px solid ${borderColor}`,
                            borderRadius: 2,
                        }}
                    >
                        {/* Active Announcements Title */}
                        <Typography variant="h5" gutterBottom sx={{ color: subtitleColor }}> 
                            Active Announcements
                        </Typography>

                        {announcements.length === 0 ? (
                            <Typography color="text.secondary">No active announcements.</Typography>
                        ) : (
                            <Grid container spacing={2}>
                                {announcements.map((a) => (
                                    <Grid item xs={12} key={a.id}>
                                        <Card elevation={3} sx={{ borderRadius: 2, border: `2px solid ${borderColor}` }}>
                                            <CardContent>
                                                <Typography variant="h6">{a.title}</Typography>
                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                    {a.content}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    For: {a.target_role}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Expires: {new Date(a.expires_at).toLocaleString()}
                                                </Typography>
                                            </CardContent>

                                            <CardActions>
                                                <Button
                                                    size="small"
                                                    sx={{ border: "2px solid black", backgroundColor: "green", color: "white" }}
                                                    onClick={() => handleEdit(a)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="small"
                                                    sx={{ border: "2px solid black", backgroundColor: "maroon", color: "white" }}
                                                    onClick={() => handleDelete(a.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Container>
    </>
);

}

function PaperForm({
    form,
    setForm,
    handleSubmit,
    editingId,
    image,
    setImage,
    borderColor,
    mainButtonColor,
    subtitleColor // ✅ receive subtitleColor
}) {

    // Local state for modal preview
    const [openModal, setOpenModal] = useState(false);
    const [tempImage, setTempImage] = useState(null);

    // File input handler → store in tempImage first
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTempImage(file);
            setOpenModal(true); // open preview modal
        }
    };

    // Confirm upload → move tempImage to actual image
    const handleConfirm = () => {
        setImage(tempImage);
        setOpenModal(false);
        setTempImage(null);
    };

    // Cancel upload → discard tempImage
    const handleCancel = () => {
        setTempImage(null);
        setOpenModal(false);
    };

    // Remove currently selected image
    const handleRemoveImage = () => {
        setImage(null);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: "background.paper",
                boxShadow: 2,
                color: subtitleColor, // ✅ applied subtitleColor
                border: `2px solid ${borderColor}`,
            }}
        >
            {/* Form Title */}
            <Typography
                variant="h6"
                gutterBottom
                sx={{ color: subtitleColor }} // ✅ applied subtitleColor
            >
                {editingId ? "Edit Announcement" : "Create New Announcement"}
            </Typography>

            <TextField
                label="Title"
                fullWidth
                margin="normal"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
            />

            <TextField
                label="Content"
                fullWidth
                multiline
                rows={3}
                margin="normal"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
            />

            <FormControl fullWidth margin="normal">
                <InputLabel>Valid For</InputLabel>
                <Select
                    value={form.valid_days}
                    label="Valid For"
                    onChange={(e) => setForm({ ...form, valid_days: e.target.value })}
                >
                    <MenuItem value="1">1 Day</MenuItem>
                    <MenuItem value="3">3 Days</MenuItem>
                    <MenuItem value="7">7 Days</MenuItem>
                    <MenuItem value="14">14 Days</MenuItem>
                    <MenuItem value="30">30 Days</MenuItem>
                    <MenuItem value="60">60 Days</MenuItem>
                    <MenuItem value="90">90 Days</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <InputLabel>Target Role</InputLabel>
                <Select
                    value={form.target_role}
                    label="Target Role"
                    onChange={(e) => setForm({ ...form, target_role: e.target.value })}
                    required
                >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="faculty">Faculty</MenuItem>
                    <MenuItem value="applicant">Applicant</MenuItem>
                </Select>
            </FormControl>

            {/* Upload Section */}
            <Box mt={2}>
                <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                    sx={{
                        border: `2px dashed ${borderColor}`,
                        backgroundColor: mainButtonColor,
                        color: "white",
                        "&:hover": { bgcolor: "#000000" },
                        py: 1.5,
                        fontWeight: "bold",
                        textTransform: "none",
                    }}
                >
                    Upload Announcement Image
                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </Button>

                {image && (
                    <Box
                        sx={{
                            position: "relative",
                            mt: 2,
                            p: 2,
                            border: `1px solid ${borderColor}`,
                            borderRadius: 2,
                            bgcolor: "#f5f5f5",
                            display: "flex",
                            height: "50px",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography noWrap sx={{ mr: 2 }}>
                            {image.name} {/* Show the file name instead of image */}
                        </Typography>
                        <IconButton
                            onClick={handleRemoveImage}
                            sx={{
                                width: "20px",
                                height: "20px",
                                backgroundColor: "rgba(255,255,255,0.8)",
                                "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
                            }}
                        >
                            ✕
                        </IconButton>
                    </Box>
                )}
            </Box>

            <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 2 }}>
                {editingId ? "Update Announcement" : "Create Announcement"}
            </Button>

            {/* Image Preview Modal */}
            <Dialog open={openModal} onClose={handleCancel} maxWidth="sm" fullWidth>
                <DialogContent sx={{ textAlign: "center" }}>
                    {tempImage && (
                        <img
                            src={URL.createObjectURL(tempImage)}
                            alt="Preview"
                            style={{ maxWidth: "100%", borderRadius: "8px" }}
                        />
                    )}
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                    <Button variant="contained" onClick={handleConfirm} sx={{ bgcolor: "maroon" }}>
                        Confirm
                    </Button>
                    <Button variant="outlined" onClick={handleCancel} color="error">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Announcement;