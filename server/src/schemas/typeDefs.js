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

    type Routine {
        _id: ID!
        user: ID!
        name: String!
        description: String
        exercises: [Exercise!]!
        createdAt: String
    }

    input RoutineInput {
        name: String!
        description: String
        exercises: [ID!]!
    }

    input UpdateRoutineInput {
        name: String
        description: String
        exercises: [ID!]
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
        routinesByUser(userId: ID!, offset: Int, limit: Int): [Routine!]!
    }

    type Mutation {
        login(
            email: String!
            password: String!
        ): Auth

        signup(input: SignupInput!): Auth

        createRoutine(input: RoutineInput!): Routine!

        updateRoutine(routineId: ID!, input: UpdateRoutineInput!): Routine!

        addToExerciseToRoutine(userId: ID!, routineId: ID!, exerciseId: ID!): Routine    
    }
`;

export default typeDefs;