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
import { Button, Container, Modal } from 'react-bootstrap';

const localizer = momentLocalizer(moment);

const Homepage = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedRoutine, setSelectedRoutine] = useState('');
    const [showModal, setShowModal] = useState(false);

    const { data, loading, error } = useQuery(GET_USER_ROUTINES);

    const addEvent = (e) => {
        e.preventDefault();

        if (!selectedRoutine || !selectedDate) {
            return;
        }

        const start = moment(selectedDate).startOf('day').toDate();
        const end = moment(selectedDate).endOf('day').toDate();

        const newEvent = {
            title: selectedRoutine,
            routine: selectedRoutine,
            start,
            end,
        };

        setEvents([...events, newEvent]);

        setSelectedDate('');
        setSelectedRoutine('');
    };

    if (loading) return <p>Loading...</p>;

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

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
                                onClick={handleShow}
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
                                    style={{ width: '70%' }}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary">Add Routine</button>
                        </form>
                    </div>
                    <Container style={{
                        position: 'fixed',
                        bottom: '350px',
                        right: '300px',
                        width: 'auto',
                        fontSize: '1.5rem',
                    }} >
                        <h3 className="text-center">Your Recent History</h3>
                    </Container>

                    {/* Modal for selecting workout routine */}
                    <Modal show={showModal} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Select Workout Routine</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {data.routinesByUser.map((routine) => (
                                <Button
                                    key={routine._id}
                                    variant="outline-primary"
                                    as={Link}
                                    to={`/workout/${routine._id}`}
                                    className="w-100 mb-2"
                                    onClick={handleClose}
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
