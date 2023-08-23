import { Schema, model } from "mongoose";

export const game = model(
    "Game",
    new Schema(
        {
            number: {
                type: Number,
                required: true,
            },
            code: {
                type: Number,
                required: true,
            },
            players: {
                type: Array,
                default: [],
            },
            turn: {
                type: Number,
                default: 0,
            },
            word: {
                type: String,
                default: "",
            },
            good: {
                type: Array,
                default: [],
            },
            bad: {
                type: Number,
                default: 0,
            },
            availableLetters: {
                type: Array,
                default: "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split(""),
            },
            win: {
                type: Boolean,
                default: false,
            },
            lose: {
                type: Boolean,
                default: false,
            },
        },
        {
            timestamps: false,
            versionKey: false,
        }
    )
);
