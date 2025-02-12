import Auth from '../utils/auth';
import React from 'react';
import backgroundImage from '../assets/—Pngtree—3d rendered gym equipment against_11966449.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { Calendar } from "react-big-calendar";

const Homepage = () => {
    return (
        <>
            {Auth.loggedIn() ? (
                <>
                    <div 
                        className="d-flex justify-content-center align-items-center mb-3 border-dark"
                        style={{
                            margin: '10px',
                        }}>
                        <p>Agenda of Workouts for the Week</p>
                        <Link to='/WorkoutLog' 
                         style={{
                            margin: '10px',
                        }}>
                            <button className="button">Start Workout</button>
                    </Link>
                    </div>
                    <div
                    className="d-flex justify-content-between align-items-center mb-3">
                        <p>Last 5 recorded workouts</p>
                    </div>
                </>
            ) : (
                <>
                    <div
                        className="d-flex justify-content-center align-items-center vh-100 bg-image"
                        style={{
                            backgroundImage: `url(${backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            imageRendering: 'crisp-edges'
                        }}
                    >
                        <h1 className="text-white text-center fw-bold">
                            Stay Active. Stay Strong. <br />
                            Track your workouts with us! Just Log in or Signup!
                        </h1>
                    </div>
                </>
            )}
        </>
    );
};

export default Homepage;
