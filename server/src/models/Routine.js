import { Schema, model } from 'mongoose';
import Exercise from './Exercise.js';

const routineSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    exercises: [Exercise.schema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Routine = model('Routine', routineSchema);

export default Routine;