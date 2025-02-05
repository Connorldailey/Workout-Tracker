import User from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';
import axios from 'axios';
import dotenv from 'dotenv';
import https from 'https';

dotenv.config();

const EXERCISE_API_URL = 'https://exercisedb.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
console.log('RAPIDAPI_KEY:', RAPIDAPI_KEY);

const agent = new https.Agent({
    secureProtocol: 'TLSv1_2_method',
});


const resolvers = {
    Query: {
        me: async (_parent, _args, context) => {
            if (!context.user) {
                throw new AuthenticationError('Could not authenticate user.');
            }
            return User.findOne({ _id: context.user._id });
        },
        exercises: async () => {
            try {
                const response = await axios.get(`${EXERCISE_API_URL}/exercises`, {
                    httpsAgent: agent,
                    headers: {
                        'X-RapidAPI-Key': RAPIDAPI_KEY,
                        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
                        'Accept': 'application/json'
                    }
                });
                return response.data.map((item, index) => ({
                    id: item.id || index,
                    name: item.name,
                    bodyPart: item.bodyPart,
                    equipment: item.equipment,
                    target: item.target,
                    gifUrl: item.gifUrl,
                }));
            } catch (error) {
                console.error('Error fetching exercises:', error);
                throw new Error('Failed to fetch exercises.');
            }
        },
        exercise: async (_parent, { id }) => {
            try {
                const response = await axios.get(`${EXERCISE_API_URL}/exercises/${id}`, {
                    httpsAgent: agent,
                    headers: {
                        'X-RapidAPI-Key': RAPIDAPI_KEY,
                        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
                        'Accept': 'application/json'
                    }
                });
                return {
                    id: response.data.id,
                    name: response.data.name,
                    bodyPart: response.data.bodyPart,
                    equipment: response.data.equipment,
                    target: response.data.target,
                    gifUrl: response.data.gifUrl,
                };
            } catch (error) {
                console.error(`Error fetching exercise ${id}:`, error);
                throw new Error('Failed to fetch the exercise.');
            }
        },
        searchExercises: async (_parent, { query }) => {
            if (!RAPIDAPI_KEY) {
                throw new Error("Missing API key. Ensure your .env file is loaded correctly.");
            }
        
            try {
                const response = await axios.get(`${EXERCISE_API_URL}/exercises`, {
                    httpsAgent: agent,
                    headers: {
                        'X-RapidAPI-Key': RAPIDAPI_KEY,
                        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
                        'Accept': 'application/json'
                    }
                });
        
                // 🔍 Filter exercises by name, body part, or equipment
                const filteredExercises = response.data.filter((exercise) =>
                    exercise.name.toLowerCase().includes(query.toLowerCase()) ||
                    exercise.bodyPart.toLowerCase().includes(query.toLowerCase()) ||
                    exercise.equipment.toLowerCase().includes(query.toLowerCase())
                );
        
                return filteredExercises.map((item, index) => ({
                    id: item.id || index,
                    name: item.name,
                    bodyPart: item.bodyPart,
                    equipment: item.equipment,
                    target: item.target,
                    gifUrl: item.gifUrl,
                }));
        
            } catch (error) {
                console.error('Error fetching exercises:', error);
                throw new Error('Failed to fetch exercises.');
            }
        }
        
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
    },
};

export default resolvers;