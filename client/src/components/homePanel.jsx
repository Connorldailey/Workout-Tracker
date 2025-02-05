import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const HomePanel = () => {
    return (
        <>
        <div>
            <p>Agenda of Workouts for the Week</p>
        </div>
        <Link to='/workoutLog'>
             <button>Start Workout</button>
        </Link>
        <div>
            <p>Last 5 recorded workouts</p>
        </div>
        </>
    );
};
    export default HomePanel;