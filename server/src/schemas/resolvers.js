import { Routine, User, Workout } from '../models/index.js';
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
            try {
                if (!context.user) {
                    throw new AuthenticationError('Could not authenticate user.');
                }
                return User.findOne({ _id: context.user._id });
            } catch (error) {
                console.error('Error finding user', error);
                throw new Error('Failed to get user.');
            }
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
        routinesByUser: async (_parent, _args, context) => {
            try {
                if (!context.user) {
                    throw new AuthenticationError('You must be logged in to view your routines.');
                }

                const routines = await Routine.find({ user: context.user._id });

                return routines;
            } catch (error) {
                console.error('Error finding routines by user', error);
                throw new Error('Failed to get routines by user.')
            }
        },
        routineById: async (_parent, { routineId }, context) => {
            try {
                if (!context.user) {
                    throw new AuthenticationError('You must be logged in to view your routines.');
                }

                const routine = await Routine.findOne({ user: context.user._id, _id: routineId });

                return routine;
            } catch (error) {
                console.error('Error finding routine by ID', error);
                throw new Error('Failed to get routine by ID.')
            }
        },
        workoutsByUser : async (_parent, _args, context) => {
            try {
                if (!context.user) {
                    throw new AuthenticationError('You must be logged in to view your workouts.');
                }

                const workouts = await Workout.find({ user: context.user._id });

                return workouts;
            } catch (error) {
                console.error('Error finding workouts by user', error);
                throw new Error('Failed to get workouts by user.')
            }
        },
    },
    Mutation: {
        login: async (_parent, { email, password }) => {
            try {
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
            } catch (error) {
                console.error('Error logging in user', error);
                throw new Error('Could not authenticate user.');
            }
        },
        signup: async (_parent, { input }) => {
            try {
                const user = await User.create({ ...input });
                const token = signToken(user.username, user.email, user._id);
                return { token, user };
            } catch (error) {
                console.error('Error signing up user', error);
                throw new Error('Failed to sign up user.');
            }
        },
        createRoutine: async (_parent, { input }, context) => {
            try {
                if (!context.user) {
                    throw new AuthenticationError('You must be logged in to create a routine.');
                }

                const newRoutine = await Routine.create({
                    user: context.user._id,
                    name: input.name,
                    description: input.description,
                    exercises: input.exercises,
                    date: input.date
                });

                return newRoutine;
            } catch (error) {
                console.error('Error creating routine', error);
                throw new Error('Failed to create routine.');
            }
        },
        updateRoutine: async (_parent, { routineId, exercise }, context) => {
            try {
                if (!context.user) {
                    throw new AuthenticationError('You must be logged in to update a routine.');
                }
    
                const routine = await Routine.findOne({ _id: routineId, user: context.user._id });
                if (!routine) {
                    throw new Error('Routine not found.')
                }
    
                routine.exercises.push(exercise);
    
                await routine.save();
                return routine;
            } catch (error) {
                console.error('Error updating routine:', error);
                throw new Error('Failed to update routine.');
            }  
        },
        deleteRoutine: async (_parent, { routineId }, context) => {
            try {
                if (!context.user) {
                    throw new AuthenticationError('You must be logged in to delete a routine.');
                }

                const routine = await Routine.findOneAndDelete({ _id: routineId, user: context.user._id });
                if (!routine) {
                    throw new Error('Routine not found.')
                }

                return routine;
            } catch (error) {
                console.error('Error deleting routine', error);
                throw new Error('Failed to delete routine.');
            }
        },
        addWorkout: async (_parent, { input }, context) => {
            try {
                if (!context.user) {
                    throw new AuthenticationError('You must be logged in to create a routine.');
                }

                const newWorkout = Workout.create({
                    user: context.user._id,
                    routine: input.routineId,
                    exercises: input.exercises,
                    overallNotes: input.overallNotes
                });

                return newWorkout;
            } catch (error) {
                console.error('Error creating workout', error);
                throw new Error('Failed to create workout.');
            }
        },
        removeExercise: async (_, { routineId, exerciseId }) => {
            try {
                const updatedRoutine = await Routine.findByIdAndUpdate(
                    routineId,
                    { $pull: { exercises: { _id: exerciseId } } }, // Remove exercise by ID
                    { new: true } // Return updated routine
                );

                if (!updatedRoutine) {
                    throw new Error('Routine not found');
                }

                return updatedRoutine;
            } catch (error) {
                throw new Error(`Error removing exercise: ${error.message}`);
            }
        },
    },
};

export default resolvers;