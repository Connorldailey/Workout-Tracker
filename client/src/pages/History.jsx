import { useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { GET_WORKOUTS } from '../utils/queries';
import WorkoutCard from '../components/WorkoutCard';

const HistoryPage = () => {
    const [workoutHistory, setWorkoutHistory] = useState([]);
    const { data: workoutData, loading, error } = useQuery(GET_WORKOUTS);

    useEffect(() => {
        if (workoutData && workoutData.workoutsByUser) {
            setWorkoutHistory(workoutData.workoutsByUser);
            console.log(workoutData.workoutsByUser);
        }
    }, [workoutData]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    
    return (
        <>
            <h1 className='mb-3'>History</h1>
            {workoutHistory.length ? (
                workoutHistory.map((workout) => (
                    <WorkoutCard key={workout._id} workout={workout}></WorkoutCard>
                ))
            ) : (
                <p>No workouts found.</p>
            )}
        </>
    );
};

export default HistoryPage;