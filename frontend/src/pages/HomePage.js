import React from "react"; 
import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
    return (
        <div className="home-container">
            <div className="home-card">
                <h1>User Management System</h1>
                <h2 className="menu-title">Menu</h2>
                
                <nav className="menu-buttons">
                    <Link to="/users" className="menu-button">
                        Display Users
                    </Link>
                    <Link to="/register" className="menu-button">
                        Register New User
                    </Link>
                </nav>
            </div>
        </div>
    );
}

export default HomePage;