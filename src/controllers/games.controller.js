import { game } from "../models/game.js";
import { generateWord } from "../utils/generateWord.js";

export const getGames = async (req, res) => {
    await game
        .find()
        .then((games) => res.json(games))
        .catch((err) => console.log(err));
};

export const createGame = async (req, res) => {
    await game
        .find()
        .then(async (games) => {
            let numberTable = 1;

            games.forEach((game) => {
                if (game.number === numberTable) {
                    numberTable++;
                } else {
                    return;
                }
            });

            let word = generateWord();

            while (word.length > 10) {
                word = generateWord();
            }

            await game
                .create({
                    number: numberTable,
                    code: req.body.code,
                    word: word.toUpperCase(),
                    bad: 0,
                    availableLetters: "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split(""),
                    status: "playing",
                })
                .then((game) => res.json(game))
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
};
