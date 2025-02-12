import React, { useState } from 'react';
import backgroundImage from '../assets/—Pngtree—3d rendered gym equipment against_11966449.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useQuery } from '@apollo/client';
import { GET_USER_ROUTINES } from '../utils/queries';
import Auth from '../utils/auth';
import { Button } from 'react-bootstrap';

// Create localizer for the calendar (you can adjust this to your needs)
const localizer = momentLocalizer(moment);

const Homepage = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedRoutine, setSelectedRoutine] = useState('');

    // Fetch routines using GraphQL query
    const { data, loading, error } = useQuery(GET_USER_ROUTINES);

    // Function to handle adding a new event
    const addEvent = (e) => {
        e.preventDefault();

        // If the user hasn't selected a routine or date, return early
        if (!selectedRoutine || !selectedDate) {
            return;
        }

        // Convert selected date into a moment object for the event
        const start = moment(selectedDate).startOf('day').toDate();
        const end = moment(selectedDate).endOf('day').toDate();

        // Add the new event to the state with the selected routine as the event title
        const newEvent = {
            title: selectedRoutine,  // Use the selected routine name as event title
            routine: selectedRoutine,
            start,
            end,
        };

        setEvents([...events, newEvent]);

        // Clear form after adding event
        setSelectedDate('');
        setSelectedRoutine('');
    };

    // Show loading state or error if data is not available
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            {Auth.loggedIn() ? (
                <div className="d-flex">
                    <div style={{ width: '60%', padding: '20px' }}>
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 600 }}
                            eventPropGetter={(event) => ({
                                style: {
                                    cursor: 'pointer',
                                    backgroundColor: 'lightblue',
                                },
                            })}
                        />
                    </div>

                    <div style={{ width: '30%', padding: '10px' }}>
                        <Button
                            variant="outline-primary"
                            as={Link}
                            to={`/workout`} /* Link to the workout page needs prroper use */
                            className="btn-lg mb-3 mt-1 ms-5 w-100 text-center fw-bold text-uppercase py-3 " 
                        >
                            Start Workout
                        </Button>

                        {/* Event Creation Form */}
                        <h4>Add Event</h4>
                        <form onSubmit={addEvent}>
                            <div className="mb-3">
                                <label htmlFor="routine" className="form-label">Select Routine</label>
                                <select
                                    className="form-control"
                                    id="routine"
                                    value={selectedRoutine}
                                    onChange={(e) => setSelectedRoutine(e.target.value)}
                                    required
                                    style={{ width: '70%' }}  // 30% shorter width
                                >
                                    <option value="">-- Select Routine --</option>
                                    {data.routinesByUser.map((routine) => (
                                        <option key={routine._id} value={routine.name}>
                                            {routine.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date Picker */}
                            <div className="mb-3">
                                <label htmlFor="date" className="form-label">Select Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    required
                                    style={{ width: '70%' }}  // 30% shorter width
                                />
                            </div>

                            <button type="submit" className="btn btn-primary">Add Event</button>
                        </form>
                    </div>
                </div>
            ) : (
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
            )}
        </>
    );
};

export default Homepage;
