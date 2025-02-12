import { useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { GET_WORKOUTS } from '../utils/queries';
import { Accordion } from 'react-bootstrap';
import WorkoutCard from '../components/WorkoutCard';

const formatDate = (dateStr) => {
    return new Date(parseInt(dateStr)).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
};

const HistoryPage = () => {
    const [workoutHistory, setWorkoutHistory] = useState([]);
    const { data: workoutData, loading, error } = useQuery(GET_WORKOUTS);

    useEffect(() => {
        if (workoutData && workoutData.workoutsByUser) {
            setWorkoutHistory(workoutData.workoutsByUser);
        }
    }, [workoutData]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    
    return (
        <>
            <h1 className='mb-3'>History</h1>
            {workoutHistory.length ? (
                workoutHistory.slice(0).reverse().map((workout) => (
                    <div key={workout._id}>
                        <h5>{formatDate(workout.date)}</h5>
                        <WorkoutCard workout={workout} />
                    </div>
                ))
            ) : (
                <p>No workouts found.</p>
            )}
        </>
    );
};

export default HistoryPage;