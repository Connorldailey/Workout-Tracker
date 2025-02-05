const typeDefs = `
    type User {
        _id: ID!
        username: String!
        email: String!
    }

    type Auth {
        token: String!
        user: User!
    }

    input SignupInput {
        username: String!
        email: String!
        password: String!
    }

    type Exercise {
        id: ID!
        name: String!
        bodyPart: String
        equipment: String
        target: String
        gifUrl: String
    }

    type Query {
        me: User
        exercises: [Exercise!]!
        exercise(id: ID!): Exercise
        searchExercises(query: String!): [Exercise!]!
    }


    type Mutation {
        login(
            email: String!
            password: String!
        ): Auth

        signup(input: SignupInput!): Auth
    }
`;

export default typeDefs;