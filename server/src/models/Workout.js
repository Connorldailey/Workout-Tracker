import { Schema, model } from 'mongoose';

const setSchema = new Schema({
    weight: {
        type: Number,
        required: true
    },
    reps: {
        type: Number,
        required: true
    },
});

const workoutExerciseSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    bodyPart: {
        type: String,
    },
    sets: [setSchema],
    notes: {
        type: String
    },
});

const workoutSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    routine: {
        type: Schema.Types.ObjectId,
        ref: 'Routine'
    },
    exercises: [workoutExerciseSchema],
    overallNotes: {
        type: String,
    },
});

const Workout = model('Workout', workoutSchema);

export default Workout;