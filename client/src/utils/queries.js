import { gql } from '@apollo/client';

export const GET_ME = gql`
    query Me {
        me {
            _id
            username
            email
        }
    }
`;

export const GET_EXERCISES = gql`
    query Exercises {
        exercises {
            id
            name
            bodyPart
            equipment
            target
            gifUrl
        }
    }
`;

export const GET_EXERCISE = gql`
    query Exercise($id: ID!) {
        exercise(id: $id) {
            id
            name
            bodyPart
            equipment
            target
            gifUrl
        }
    }
`;

export const SEARCH_EXERCISES = gql`
    query SearchExercises($query: String!) {
        searchExercises(query: $query) {
            id
            name
            bodyPart
            equipment
            target
            gifUrl
        }
    }
`;