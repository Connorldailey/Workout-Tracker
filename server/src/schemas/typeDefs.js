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
        exercisesByName(name: String!, offset: Int): [Exercise!]!
        exercisesByBodyPart(bodyPart: String!, offset: Int): [Exercise!]!
        exercisesByEquipment(equipment: String!, offset: Int): [Exercise!]!
        exercisesByTarget(target: String!, offset: Int): [Exercise!]!
        exerciseById(id: ID!): Exercise
        randomExercises: [Exercise!]!
        bodyPartList: [String!]!
        equipmentList: [String!]!
        targetList: [String!]!
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