import Auth from '../utils/auth';
import React from 'react';
import backgroundImage from '../assets/—Pngtree—3d rendered gym equipment against_11966449.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

// Render homepage with different content based on authentication status
const Homepage = () => {
    return (
        <>
            {Auth.loggedIn() ? (
                <>
                    <div>
                        <p>Agenda of Workouts for the Week</p>
                    </div>
                    <Link to='/WorkoutLog'>
                        <button className="button">Start Workout</button>
                    </Link>
                    <div>
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
