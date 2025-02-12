import { useQuery } from '@apollo/client';
import { GET_ROUTINE_BY_ID } from '../utils/queries';
import { Card } from 'react-bootstrap';

const toTitleCase = (str) => {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

const WorkoutCard = ({ workout }) => {
    const { data, loading, error } = useQuery(GET_ROUTINE_BY_ID, {
        variables: { routineId: workout.routine }
    });

    const formattedDate = new Date(parseInt(workout.date)).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    if (loading) return <p>Loading routine...</p>;
    if (error) return <p>Error loading routine</p>;

    const routineData = data.routineById;

    return (
        <Card>
            <Card.Header className='bg-primary text-white'>
                <Card.Title>{formattedDate} - {routineData.name || 'Routine deleted.'}</Card.Title>
                <Card.Subtitle>{routineData.description}</Card.Subtitle>
            </Card.Header>
            {/* Other workout/routine details */}
            <Card.Body>
                {workout.exercises.map((exercise) => (
                    <div key={exercise.exerciseId}>
                        <h5>{toTitleCase(exercise.name)}</h5>
                        <p className='fw-bold'>Sets:</p>
                        {exercise.sets.map((set, index) => (
                            <p className='ms-3'>{index + 1}. {set.weight} x {set.reps}</p>
                        ))}
                        <p><strong>Notes:</strong> {exercise.notes}</p>
                        {/* Render additional exercise details or sets if needed */}
                    </div>
                ))}
            </Card.Body>
        </Card>
    );
};

export default WorkoutCard;
