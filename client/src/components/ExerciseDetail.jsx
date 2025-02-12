import { useQuery } from '@apollo/client';
import { SEARCH_BY_ID } from '../utils/queries';

const ExerciseDetail = ({ exerciseId }) => {
    const { data, loading, error } = useQuery(SEARCH_BY_ID, {
        variables: { id: exerciseId },
    });

    if (loading) return <span>Loading exercise...</span>;
    if (error) return <span>Error loading exercise</span>;

    const exercise = data.exerciseById;

    return <span>{exercise.name}</span>;
};

export default ExerciseDetail;