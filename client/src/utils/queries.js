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
            gifUrl
        }
    }
`;