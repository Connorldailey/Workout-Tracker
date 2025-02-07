import { Routine, User } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';
import axios from 'axios';
import dotenv from 'dotenv';
import https from 'https';

dotenv.config();

const EXERCISE_API_URL = 'https://exercisedb.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

const agent = new https.Agent({
    secureProtocol: 'TLSv1_2_method',
});

const axiosInstance = axios.create({
    baseURL: EXERCISE_API_URL,
    httpsAgent: agent,
    headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
        'Accept': 'application/json'
    }
});

const resolvers = {
    Query: {
        me: async (_parent, _args, context) => {
            if (!context.user) {
                throw new AuthenticationError('Could not authenticate user.');
            }
            return User.findOne({ _id: context.user._id });
        },
        exercisesByName: async (_parent, { name, offset }) => {
            try {
                const encodedName = encodeURIComponent(name);
                const response = await axiosInstance.get(`/exercises/name/${encodedName}`, {
                    params: {
                        offset: offset
                    }
                });
                return response.data;
            } catch (error) {
                console.error('Error fetching exercises by name:', error);
                throw new Error('Failed to get exercises by name.');
            }
        },
        exercisesByBodyPart: async (_parent, { bodyPart, offset }) => {
            try {
                const encodedBodyPart = encodeURIComponent(bodyPart);
                const response = await axiosInstance.get(`exercises/bodyPart/${encodedBodyPart}`, {
                    params: {
                        offset: offset
                    }
                });
                return response.data;
            } catch (error) {
                console.error('Error fetching exercises by body part:', error);
                throw new Error('Failed to get exercises by body part.');
            }
        },
        exercisesByEquipment: async (_parent, { equipment, offset }) => {
            try {
                const encodedEquipment = encodeURIComponent(equipment);
                const response = await axiosInstance.get(`exercises/equipment/${encodedEquipment}`, {
                    params: {
                        offset: offset
                    }
                });
                return response.data;
            } catch (error) {
                console.error('Error fetching exercises by equipment:', error);
                throw new Error('Failed to get exercises by equipment.');
            }
        },
        exercisesByTarget: async (_parent, { target, offset }) => {
            try {
                const encodedTarget = encodeURIComponent(target);
                const response = await axiosInstance.get(`exercises/target/${encodedTarget}`, {
                    params: {
                        offset: offset
                    }
                });
                return response.data;
            } catch (error) {
                console.error('Error fetching exercises by target:', error);
                throw new Error('Failed to get exercises by target.');
            }
        },
        exerciseById: async (_parent, { id }) => {
            try {
                const response = await axiosInstance.get(`exercises/exercise/${id}`);
                return response.data;
            } catch (error) {
                console.error('Error fetching exercises by id:', error);
                throw new Error('Failed to get exercise.');
            }
        },
        randomExercises: async () => {
            try {
                const randomOffset = Math.floor(Math.random() * 1000)
                const response = await axiosInstance.get('exercises', {
                    params: {
                        offset: randomOffset,
                        limit: 10
                    }
                });
                return response.data;
            } catch (error) {
                console.error('Error fetching random exercises:', error);
                throw new Error('Failed to get random exercises.');
            }
        },
        bodyPartList: async () => {
            try {
                const response = await axiosInstance.get('exercises/bodyPartList');
                return response.data;
            } catch (error) {
                console.error('Error fetching body part list:', error);
                throw new Error('Failed to get body parts list.')
            }
        },
        equipmentList: async () => {
            try {
                const response = await axiosInstance.get('exercises/equipmentList');
                return response.data;
            } catch (error) {
                console.error('Error fetching equipment list:', error);
                throw new Error('Failed to get equipment list.')
            }
        },
        targetList: async () => {
            try {
                const response = await axiosInstance.get('exercises/targetList');
                return response.data;
            } catch (error) {
                console.error('Error fetching target list:', error);
                throw new Error('Failed to get target list.')
            }
        },
        routinesByUser: async (_parent, { userId, offset, limit }, context) => {
            if (!context.user) {
                throw new AuthenticationError('You must be logged in to view your routines.');
            }

            const routines = await Routine.find({ user: userId })
                .skip(offset)
                .limit(limit)
                .sort({ createdAt: -1 });

            return routines;
        },
    },
    Mutation: {
        login: async (_parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Could not authenticate user.');
            }

            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Could not authenticate user.');
            }

            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        signup: async (_parent, { input }) => {
            const user = await User.create({ ...input });
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        createRoutine: async (_parent, { input }, context) => {
            if (!context.user) {
                throw new AuthenticationError('You must be logged in to create a routine.');
            }

            const routineExercises = input.exercises.map(exId => ({ Exercise: exId }));

            const newRoutine = await Routine.create({
                user: context.user._id,
                name: input.name,
                description: input.description,
                exercises: routineExercises,
            });

            return newRoutine;
        },
        updateRoutine: async (_parent, { routineId, input }, context) => {
            if (!context.user) {
                throw new AuthenticationError('You must be logged in to update a routine.');
            }

            const routine = await Routine.findOne({ _id: routineId, user: context.user._id });
            if (!routine) {
                throw new Error('Routine not found.')
            }

            if (input.name !== undefined) {
                routine.name = input.name;
            }

            if (input.description !== undefined) {
                routine.description = input.description;
            }

            if (input.exercises !== undefined) {
                routine.exercises = input.exercises.map(exId => ({ exercise: exId }));
            }

            await routine.save();
            return routine;
        },
        //asdasdasd
        addToExerciseToRoutine: async (_parent, { exerciseId, routineId }, context) => {
            if (!context.user) {
                throw new AuthenticationError('You must be logged in to add an exercise to a routine.');
            }

            const routine = await Routine.findOne({ _id: routineId, user: context.user._id });
            if (!routine) {
                throw new Error('Routine not found.');
            }

            routine.exercises.push({ exercise: exerciseId });
            await routine.save();
            return routine;
        }
        
    },
};

export default resolvers;