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

    type Set {
        weight: Float!
        reps: Int!
    }
        
    type WorkoutExercise {
        exerciseId: String!
        sets: [Set!]!
        notes: String
    }

    type Workout {
        _id: ID!
        user: ID!
        date: String
        routine: ID!
        exercises: [WorkoutExercise!]!
        overallNotes: String!
    }

    input SetInput {
        weight: Float!
        reps: Int!
    }

    input WorkoutExerciseInput {
        exerciseId: String!
        sets: [SetInput!]!
        notes: String
    }

    input WorkoutInput {
        routineId: ID!
        exercises: [WorkoutExerciseInput!]!
        overallNotes: String!
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
        workoutsByUser: [Workout!]!
    }

    type Mutation {
        login(
            email: String!
            password: String!
        ): Auth

        signup(input: SignupInput!): Auth

        createRoutine(input: RoutineInput!): Routine!

        updateRoutine(routineId: ID!, exercise: ExerciseInput!): Routine!

        deleteRoutine(routineId: ID!): Routine!

        deleteExerciseFromRoutine(routineId: ID!, exerciseId: ID!): Routine!

        addWorkout(input: WorkoutInput!): Workout!

        removeExercise(routineId: ID!, exerciseId: ID!): Routine
    }
`;

export default typeDefs;