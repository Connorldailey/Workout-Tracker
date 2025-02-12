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

export const SEARCH_BY_NAME = gql`
    query SearchByName($name: String!, $offset: Int) {
        exercisesByName(name: $name, offset: $offset) {
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
`;

export const SEARCH_BY_BODYPART = gql`
    query SearchByBodyPart($bodyPart: String!, $offset: Int) {
        exercisesByBodyPart(bodyPart: $bodyPart, offset: $offset) {
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
`;

export const SEARCH_BY_EQUIPMENT = gql`
    query SearchByEquipment($equipment: String!, $offset: Int) {
        exercisesByEquipment(equipment: $equipment, offset: $offset) {
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
`;

export const SEARCH_BY_TARGET = gql`
    query SearchByTarget($target: String!, $offset: Int) {
        exercisesByTarget(target: $target, offset: $offset) {
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
`;

export const SEARCH_BY_ID = gql`
    query SearchById($id: ID!) {
        exerciseById(id: $id) {
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
`;

export const GET_BODYPART_LIST = gql`
    query GetBodyPartsList {
        bodyPartList 
    }
`;

export const GET_EQUIPMENT_LIST = gql`
    query GetEquipmentList {
        equipmentList 
    }
`;

export const GET_TARGET_LIST = gql`
    query GetTargetList {
        targetList 
    }
`;

export const GET_RANDOM_EXERCISES = gql`
    query GetRandomExercises {
        randomExercises {
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
`;

export const GET_USER_ROUTINES = gql`
    query GetUserRoutines {
        routinesByUser {
            _id
            name
            description
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
            createdAt
        }
    }
`;

export const GET_ROUTINE_BY_ID = gql`
    query GetRoutineById($routineId: ID!) {
        routineById(routineId: $routineId) {
            _id
            name
            description
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
            createdAt
        }
    }
`;

export const GET_WORKOUTS = gql`
    query GetWorkouts {
        workoutsByUser {
            _id
            user
            date
            routine
            exercises {
                name
                bodyPart
                sets {
                    weight
                    reps
                }
                notes
            }
            overallNotes
        }
    }
`;

export const GET_ROUTINES_BY_DATE = gql`
    query GetRoutinesByDate($date: String!) {
        routinesByDate(date: $date) {
            _id
            name
            description
            date
        }
    }
`;
