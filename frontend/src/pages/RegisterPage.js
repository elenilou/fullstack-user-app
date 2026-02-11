import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createUser } from "../services/userService";
import "./RegisterPage.css";

function RegisterPage() {
    const navigate = useNavigate();

    //State variables for form fields
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        gender: "",
        birthdate: null,
        workAddress: "",
        homeAddress: "",
    });

    //State for error
    const [error, setError] = useState({});

    //State for loading
    const [isSubmitting, setIsSubmitting] = useState(false);

    //State for success message
    const [showSuccess, setShowSuccess] = useState(false);

    //Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Clear error for the field
        if(error[name]) {
            setError({
                ...error,
                [name]: "",
            });
        }
    };

    //Handle date change
    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            birthdate: date,
        });
        // Clear birthdate error
        if(error.birthdate) {
            setError({
                ...error,
                birthdate: "",
            });
        }
    };

    //Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError({});

    // Client-side validation
    const newErrors = {};
    
    if (!formData.name.trim()) {
        newErrors.name = "Name is required";
    }
    
    if (!formData.surname.trim()) {
        newErrors.surname = "Surname is required";
    }
    
    if (!formData.gender) {
        newErrors.gender = "Gender is required";
    }
    
    if (!formData.birthdate) {
        newErrors.birthdate = "Birthdate is required";
    }

    // If there are validation errors, set them and stop submission
    if (Object.keys(newErrors).length > 0) {
        setError(newErrors);
        setIsSubmitting(false);
        return;
    }

        try {
            //Convert birthdate to ISO string format (YYYY-MM-DD)
            const dataToSend = {
                ...formData,
                birthdate: formData.birthdate 
                    ? formData.birthdate.toISOString().split("T")[0] 
                    : null,
            };

            await createUser(dataToSend);

            // Show success message
            setShowSuccess(true);

            //Reset form
            setFormData({
                name: "",
                surname: "",
                gender: "",
                birthdate: null,
                workAddress: "",
                homeAddress: "",
            });
        
            // Redirect after 2 seconds to DisplayUsersPage
            setTimeout(() => {
                navigate("/users");
            }, 2000);
            
        } catch (err) {
            // Handle validation errors from backend
            if (typeof err === "object" && err !== null) {
                setError(err);
            } else {
                setError({ general: err.message || "An error occurred. Please try again." });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h1>Register New User</h1>

                {showSuccess && (
                    <div className="success-message">
                        ✅ User registered successfully! Redirecting...
                    </div>
                )}

                {error.general && (
                    <div className="error-message">
                        ❌ {error.general}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="register-form">
                    {/* Name Field */}
                    <div className="form-group">
                        <label htmlFor="name">
                            Name <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={error.name ? "input-error" : ""}
                        />
                        {error.name && <span className="error-text">{error.name}</span>}
                    </div>

                    {/* Surname Field */}
                    <div className="form-group">
                        <label htmlFor="surname">
                            Surname <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="surname"
                            name="surname"
                            value={formData.surname}
                            onChange={handleChange}
                            className={error.surname ? "input-error" : ""}
                        />
                        {error.surname && <span className="error-text">{error.surname}</span>}
                    </div>

                    {/* Gender Field */}
                    <div className="form-group">
                        <label htmlFor="gender">
                            Gender <span className="required">*</span>
                        </label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className={error.gender ? "input-error" : ""}
                        >
                            <option value="">Select Gender</option>
                            <option value="M">Male (M)</option>
                            <option value="F">Female (F)</option>
                        </select>
                        {error.gender && <span className="error-text">{error.gender}</span>}
                    </div>

                    {/* Birthdate Field */}
                    <div className="form-group">
                        <label htmlFor="birthdate">
                            Birthdate <span className="required">*</span>
                        </label>
                        <DatePicker
                            selected={formData.birthdate}
                            onChange={handleDateChange}
                            dateFormat="dd/MM/yyyy"
                            showYearDropdown
                            scrollableYearDropdown
                            yearDropdownItemNumber={100}
                            maxDate={new Date()}
                            placeholderText="Select birthdate"
                            className={error.birthdate ? "input-error" : ""}
                        />
                        {error.birthdate && <span className="error-text">{error.birthdate}</span>}
                    </div>

                    {/* Work Address Field */}
                    <div className="form-group">
                        <label htmlFor="workAddress">
                            Work Address
                        </label>
                        <textarea
                            id="workAddress"
                            name="workAddress"
                            value={formData.workAddress}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    {/* Home Address Field */}
                    <div className="form-group">
                        <label htmlFor="homeAddress">
                            Home Address
                        </label>
                        <textarea
                            id="homeAddress"
                            name="homeAddress"
                            value={formData.homeAddress}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="form-buttons">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate("/")}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Register User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;