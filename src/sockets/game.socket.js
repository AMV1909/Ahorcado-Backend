import { game } from "../models/game.js";
import { generateWord } from "../utils/generateWord.js";

export const gameSocket = (io) => {
    io.on("connection", (socket) => {
        socket.on("join-game", async (_id, player) => {
            await game
                .findById(_id)
                .then(async (data) => {
                    if (!data)
                        res.status(404).json({ message: "Game not found" });

                    //If the player is not in the game, add it as an object with the socket id and the player
                    if (!data.players.some((p) => p.id == socket.id)) {
                        data.players.push({ id: socket.id, name: player });
                    }

                    await game
                        .updateOne({ _id }, data)
                        .then(() => io.emit("game-" + _id, data))
                        .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
        });

        socket.on("resetGame", async (_id) => {
            let word = generateWord();

            while (word.length > 10) {
                word = generateWord();
            }

            await game
                .findById(_id)
                .then(async (data) => {
                    await game
                        .findOneAndReplace(
                            { _id },
                            {
                                word: word.toUpperCase(),
                                code: data.code,
                                number: data.number,
                            },
                            { new: true }
                        )
                        .then((data) => {
                            io.emit("game-" + _id, data);
                            io.emit("resetGame-" + _id);
                        })
                        .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
        });

        socket.on("deleteGame", async (_id) => {
            await game
                .deleteOne({ _id })
                .then(() => io.emit("deleteGame-" + _id))
                .catch((err) => console.log(err));
        });

        socket.on("letterSelected", async (_id, letter) => {
            await game
                .findById(_id)
                .then(async (data) => {
                    data.turn = (data.turn + 1) % data.players.length;

                    if (data.word.includes(letter)) {
                        data.good.push(letter);
                    } else {
                        data.bad++;
                    }

                    data.availableLetters = data.availableLetters.filter(
                        (l) => l !== letter
                    );

                    if (data.bad == 9) {
                        data.lose = true;
                    }

                    data.win = true;
                    data.word.split("").forEach((wordLetter) => {
                        if (!data.good.includes(wordLetter)) {
                            data.win = false;
                        }
                    });

                    await game
                        .updateOne({ _id }, data)
                        .then(() => io.emit("game", data))
                        .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
        });

        socket.on("leaveGame", async (_id) => {
            await game
                .findById(_id)
                .then(async (data) => {
                    if (data) {
                        data.turn = 0;

                        data.players = data.players.filter(
                            (player) => player.id != socket.id
                        );

                        if (data.players.length == 0) {
                            await game
                                .deleteOne({ _id })
                                .catch((err) => console.log(err));
                        } else {
                            await game
                                .updateOne({ _id }, data)
                                .then(() => io.emit("game-" + _id, data))
                                .catch((err) => console.log(err));
                        }
                    }
                })
                .catch((err) => console.log(err));
        });
    });
};
