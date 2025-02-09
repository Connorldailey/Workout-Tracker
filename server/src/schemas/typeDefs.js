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
        secondary: [String!]
        instructions: [String!]
        gifUrl: String
    }

    input ExerciseInput {
        id: ID!
        name: String!
        bodyPart: String
        equipment: String
        target: String
        secondary: [String!]
        instructions: [String!]
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
        exercises: [ExerciseInput!]!
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
        routinesByUser: [Routine!]!
        routineById(routineId: ID!): Routine!
    }

    type Mutation {
        login(
            email: String!
            password: String!
        ): Auth

        signup(input: SignupInput!): Auth

        createRoutine(input: RoutineInput!): Routine!

        updateRoutine(routineId: ID!, exercise: ExerciseInput!): Routine!
    }
`;

export default typeDefs;