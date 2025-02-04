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

    type Query {
        me: User
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