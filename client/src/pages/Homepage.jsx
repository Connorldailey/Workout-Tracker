import React, { useState, useEffect } from 'react';
import backgroundImage from '../assets/—Pngtree—3d rendered gym equipment against_11966449.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useQuery } from '@apollo/client';
import { GET_USER_ROUTINES } from '../utils/queries';
import Auth from '../utils/auth';
import { Button, Modal } from 'react-bootstrap';

// Localizer for react-big-calendar no touchie
const localizer = momentLocalizer(moment);

const Homepage = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedRoutine, setSelectedRoutine] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    const { data, loading, error } = useQuery(GET_USER_ROUTINES);

    useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem('events'));
        if (storedEvents) {
            setEvents(storedEvents.map(event => ({
                ...event,
                start: new Date(event.start),
                end: new Date(event.end),
            }))); // Ensure dates are valid Date objects
        }
    }, []);

    useEffect(() => {
        if (events.length > 0) {
            localStorage.setItem('events', JSON.stringify(events));
        }
    }, [events]);

    // Function to add new events
    const addEvent = (e) => {
        e.preventDefault();

        if (!selectedRoutine || !selectedDate || !startTime || !endTime) {
            return alert("Please fill in all fields.");
        }

        // Combine date and time (12-hour format with AM/PM)
        const start = moment(`${selectedDate} ${startTime}`, "YYYY-MM-DD hh:mm A").toDate();
        const end = moment(`${selectedDate} ${endTime}`, "YYYY-MM-DD hh:mm A").toDate();

        if (start >= end) {
            return alert("End time must be after start time.");
        }

        const newEvent = {
            title: selectedRoutine,
            routine: selectedRoutine,
            start,
            end,
        };

        setEvents((prevEvents) => [...prevEvents, newEvent]);

        // Reset form fields
        setSelectedDate('');
        setSelectedRoutine('');
        setStartTime('');
        setEndTime('');
    };

    // Function to handle event deletion
    const deleteEvent = (eventToDelete) => {
        // Filter out the event to delete
        const updatedEvents = events.filter(event => event !== eventToDelete);
        setEvents(updatedEvents);

        // Save the updated events to localStorage
        localStorage.setItem('events', JSON.stringify(updatedEvents));
    };

    // Handle modal visibility
    const handleShowDeleteModal = () => setShowDeleteModal(true);
    const handleCloseDeleteModal = () => setShowDeleteModal(false);

    const handleShowAddModal = () => setShowAddModal(true);
    const handleCloseAddModal = () => setShowAddModal(false);

    if (loading) return <p>Loading...</p>;

    return (
        <>
            {Auth.loggedIn() ? (
                <div className="d-flex">
                    <div style={{ width: '50%', padding: '20px' }}>
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

                    <div style={{ width: '40%', padding: '20px', marginLeft: '2%' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                            <Button
                                variant="outline-primary"
                                onClick={handleShowAddModal}
                                className="btn-lg mb-3 mt-1 ms-5 w-100 text-center fw-bold text-uppercase py-3"
                                style={{ marginLeft: '10%' }}
                            >
                                Start Workout
                            </Button>
                        </div>

                        {/* Routine Creation Form */}
                        <h4>Build Routine</h4>
                        <form onSubmit={addEvent}>
                            <div className="mb-3">
                                <label htmlFor="routine" className="form-label">Select Routine</label>
                                <select
                                    className="form-control"
                                    id="routine"
                                    value={selectedRoutine}
                                    onChange={(e) => setSelectedRoutine(e.target.value)}
                                    required
                                    style={{ width: '70%' }}
                                >
                                    <option value="">-- Select Routine --</option>
                                    {data?.routinesByUser.map((routine) => (
                                        <option key={routine._id} value={routine.name}>
                                            {routine.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="date" className="form-label">Select Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    required
                                    style={{ width: '70%' }}
                                />
                            </div>

                            {/* Start Time */}
                            <div className="mb-3">
                                <label htmlFor="start-time" className="form-label">Start Time</label>
                                <div style={{ display: 'flex', gap: '10px', width: '70%' }}>
                                    <select
                                        className="form-control"
                                        id="start-hour"
                                        value={startTime.split(':')[0] || ''}
                                        onChange={(e) => {
                                            const minutes = startTime.split(':')[1] || '00';
                                            const ampm = startTime.split(':')[2] || 'AM';
                                            setStartTime(`${e.target.value}:${minutes}:${ampm}`);
                                        }}
                                        required
                                    >
                                        <option value="">-- Hour --</option>
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                                {String(i + 1).padStart(2, '0')}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        className="form-control"
                                        id="start-minute"
                                        value={startTime.split(':')[1] || ''}
                                        onChange={(e) => {
                                            const hour = startTime.split(':')[0] || '01';
                                            const ampm = startTime.split(':')[2] || 'AM';
                                            setStartTime(`${hour}:${e.target.value}:${ampm}`);
                                        }}
                                        required
                                    >
                                        <option value="">-- Minute --</option>
                                        {['00', '15', '30', '45'].map((minute) => (
                                            <option key={minute} value={minute}>
                                                {minute}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        className="form-control"
                                        id="start-ampm"
                                        value={startTime.split(':')[2] || 'AM'}
                                        onChange={(e) => {
                                            const hour = startTime.split(':')[0] || '01';
                                            const minutes = startTime.split(':')[1] || '00';
                                            setStartTime(`${hour}:${minutes}:${e.target.value}`);
                                        }}
                                        required
                                    >
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>
                                </div>
                            </div>

                            {/* End Time */}
                            <div className="mb-3">
                                <label htmlFor="end-time" className="form-label">End Time</label>
                                <div style={{ display: 'flex', gap: '10px', width: '70%' }}>
                                    <select
                                        className="form-control"
                                        id="end-hour"
                                        value={endTime.split(':')[0] || ''}
                                        onChange={(e) => {
                                            const minutes = endTime.split(':')[1] || '00';
                                            const ampm = endTime.split(':')[2] || 'AM';
                                            setEndTime(`${e.target.value}:${minutes}:${ampm}`);
                                        }}
                                        required
                                    >
                                        <option value="">-- Hour --</option>
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                                {String(i + 1).padStart(2, '0')}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        className="form-control"
                                        id="end-minute"
                                        value={endTime.split(':')[1] || ''}
                                        onChange={(e) => {
                                            const hour = endTime.split(':')[0] || '01';
                                            const ampm = endTime.split(':')[2] || 'AM';
                                            setEndTime(`${hour}:${e.target.value}:${ampm}`);
                                        }}
                                        required
                                    >
                                        <option value="">-- Minute --</option>
                                        {['00', '15', '30', '45'].map((minute) => (
                                            <option key={minute} value={minute}>
                                                {minute}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        className="form-control"
                                        id="end-ampm"
                                        value={endTime.split(':')[2] || 'AM'}
                                        onChange={(e) => {
                                            const hour = endTime.split(':')[0] || '01';
                                            const minutes = endTime.split(':')[1] || '00';
                                            setEndTime(`${hour}:${minutes}:${e.target.value}`);
                                        }}
                                        required
                                    >
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Add Routine
                            </Button>
                            <Button
                                onClick={handleShowDeleteModal}
                                className="btn btn-primary "
                                style={{ marginLeft: '2%' }}
                            >
                                Delete Routine
                            </Button>
                        </form>


                    </div>

                    {/* Delete Routine Modal */}
                    <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Delete Workout Routine</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {events.map((event, index) => (
                                <Button
                                    key={index}
                                    variant="outline-danger"
                                    onClick={() => deleteEvent(event)}
                                    className="w-100 mb-2"
                                >
                                    {event.title} - {moment(event.start).format('YYYY-MM-DD')}
                                </Button>
                            ))}
                        </Modal.Body>
                    </Modal>

                    {/* Modal for selecting workout routine */}
                    <Modal show={showAddModal} onHide={handleCloseAddModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Select Workout Routine</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {data?.routinesByUser.map((routine) => (
                                <Button
                                    key={routine._id}
                                    variant="outline-primary"
                                    as={Link}
                                    to={`/workout/${routine._id}`}
                                    className="w-100 mb-2"
                                    onClick={handleCloseAddModal}
                                >
                                    {routine.name}
                                </Button>
                            ))}
                        </Modal.Body>
                    </Modal>
                </div>
            ) : (
                <div
                    className="d-flex justify-content-center align-items-center vh-100 bg-image"
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        imageRendering: 'crisp-edges',
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
