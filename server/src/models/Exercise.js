import { Schema, model } from 'mongoose';

const exerciseSchema = new Schema(
    {
        externalId: {
            type: String,
        },
        name: {
            type: String,
            required: true,
        },
        bodyPart: {
            type: String,
        },
        equipment: {
            type: String,
        },
        target: {
            type: String,
        },
        secondary: {
            type: [String],
        },
        instructions: {
            type: [String],
        },
        gifUrl: {
            type: String,
        },
    },
);

const Exercise = model('Exercise', exerciseSchema);

export default Exercise;