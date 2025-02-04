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