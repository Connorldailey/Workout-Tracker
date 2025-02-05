import { Schema, model } from 'mongoose';

const routineExerciseSchema = new Schema({
    exercise: {
        type: Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true,
    },
    defaultSets: {
        type: Number,
        required: true,
    },
    defaultReps: {
        type: Number,
        required: true,
    },
});

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
    exercises: [routineExerciseSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Routine = model('Routine', routineSchema);

export default Routine;