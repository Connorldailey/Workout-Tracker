import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation LoginUser($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

export const SIGNUP_USER = gql`
    mutation SignupUser($input: SignupInput!) {
        signup(input: $input) {
            token
            user {
                _id
                username
            }
        }
    }
`;

export const CREATE_ROUTINE = gql`
    mutation CreateRoutine($input: RoutineInput!) {
        createRoutine(input: $input) {
            _id
            name
            description
            createdAt
            exercises {
                id
                name
                bodyPart
                equipment
                target
                secondary
                instructions
                gifUrl
            }
        }
    }
`;

export const UPDATE_ROUTINE = gql`
    mutation UpdateRoutine($routineId: ID!, $exercise: ExerciseInput!) {
        updateRoutine(routineId: $routineId, exercise: $exercise) {
            _id
            name
            description
            createdAt
            exercises {
                id
                name
                bodyPart
                equipment
                target
                secondary
                instructions
                gifUrl
            }
        }
    }
`;

export const DELETE_ROUTINE = gql`
    mutation DeleteRoutine($routineId: ID!) {
        deleteRoutine(routineId: $routineId) {
            _id
            name
        }
    }
`;

export const DELETE_EXERCISE_FROM_ROUTINE = gql`
    mutation deleteExerciseFromRoutine($routineId: ID!, $exerciseId: ID!) {
        deleteExerciseFromRoutine(routineId: $routineId, exerciseId: $exerciseId) {
            _id
            name
            exercises {
                _id
                name
            }
        }
    }
`;
