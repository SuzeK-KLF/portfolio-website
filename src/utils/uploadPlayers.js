// src/utils/uploadPlayers.js
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

// Your player list (can also import from JSON)
const players = [
    { id: 1, name: "戴阿姨饭店", ageGroup: "40s", positions: ["Midfield"], abilityScores: 60 },
    { id: 2, name: "墨西哥", ageGroup: "30s", positions: ["Midfield"] },
    { id: 3, name: "随身空调仔", ageGroup: "30s", positions: ["Midfield"] },
    { id: 4, name: "康康", ageGroup: "30s", positions: ["Midfield"] },
    { id: 5, name: "姚街娃", ageGroup: "40s", positions: ["Midfield"] },
    { id: 6, name: "Jerryzhang", ageGroup: "30s", positions: ["Midfield"] },
    { id: 7, name: "大伟", ageGroup: "30s", positions: ["Midfield"] },
    { id: 8, name: "王堃_pp", ageGroup: "30s", positions: ["Midfield"] },
    { id: 9, name: "{alanNesta}", ageGroup: "30s", positions: ["Midfield"] },
    { id: 10, name: "坚", ageGroup: "30s", positions: ["Midfield"] },
    { id: 11, name: "郑 守门", ageGroup: "30s", positions: ["Midfield"] },
    { id: 12, name: "Bigban", ageGroup: "30s", positions: ["Midfield"] },
    { id: 13, name: "老夏", ageGroup: "50+", positions: ["Midfield"] },
    { id: 14, name: "🐷大雨", ageGroup: "40s", positions: ["Midfield"] },
    { id: 15, name: "柬埔寨", ageGroup: "30s", positions: ["Midfield"] },
    { id: 16, name: "老刘", ageGroup: "40s", positions: ["Midfield"] },
    { id: 17, name: "阿桂", ageGroup: "40s", positions: ["Midfield"] },
    { id: 18, name: "张铮", ageGroup: "50+", positions: ["Midfield"] },
    { id: 19, name: "老贾", ageGroup: "50+", positions: ["Midfield"] },
];

export const uploadPlayers = async () => {
    const colRef = collection(db, "players");

    for (const player of players) {
        const playerWithScore = {
            ...player,
            abilityScores: player.abilityScores || Math.floor(Math.random() * 21) + 60, // random 60–80
            timestamp: new Date(),
        };
        try {
            await addDoc(colRef, playerWithScore);
            console.log(`Added: ${player.name}`);
        } catch (err) {
            console.error(`Failed to add ${player.name}`, err);
        }
    }
};
