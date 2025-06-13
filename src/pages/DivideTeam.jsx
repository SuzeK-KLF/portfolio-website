"use client";

import { useState, useEffect } from "react";
import {
    Button,
    Input,
    Select,
    Card,
    Typography,
    Space,
    Tag,
    Divider,
    message,
    Slider,
    Popconfirm,
} from "antd";
import { db } from "../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { random } from "lodash";
import "antd/dist/reset.css";

const positions = ["Forward", "Midfield", "Defense", "Goalkeeper"];
const ageGroups = ["30s", "40s", "50+"];
const ageGroupValue = { "30s": 30, "40s": 40, "50+": 55 };

export default function TeamDividerPage() {
    const [players, setPlayers] = useState([]);
    const [newPlayer, setNewPlayer] = useState({
        name: "",
        ageGroup: "30s",
        positions: [],
        abilityScores: 70,
    });
    const [blueTeam, setBlueTeam] = useState([]);
    const [redTeam, setRedTeam] = useState([]);
    const [fairnessText, setFairnessText] = useState("");

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const snapshot = await getDocs(collection(db, "players"));
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    editing: false,
                }));
                setPlayers(data);
            } catch (err) {
                message.error("Failed to load players.");
                console.error(err);
            }
        };
        fetchPlayers();
    }, []);

    function shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function calculateAverageAge(team) {
        const total = team.reduce((sum, p) => sum + ageGroupValue[p.ageGroup], 0);
        return team.length ? total / team.length : 0;
    }

    function splitTeams() {
        const grouped = { Goalkeeper: [], Defense: [], Midfield: [], Forward: [] };
        players.forEach((p) => {
            const primary = p.positions?.[0];
            if (grouped[primary]) grouped[primary].push(p);
        });

        const blue = [],
            red = [];
        Object.values(grouped).forEach((group) => {
            const shuffled = shuffle(group);
            shuffled.forEach((p, i) => (i % 2 === 0 ? blue : red).push(p));
        });

        const blueAvg = calculateAverageAge(blue);
        const redAvg = calculateAverageAge(red);
        const diff = Math.abs(blueAvg - redAvg);
        let text = `Blue Avg Age: ${blueAvg.toFixed(1)}, Red Avg Age: ${redAvg.toFixed(1)}. `;
        if (diff < 2) text += "Fair ✅";
        else if (diff < 5) text += "Slightly Unbalanced ⚠️";
        else text += "Unfair ❌";

        setBlueTeam([]);
        setRedTeam([]);
        setTimeout(() => {
            setBlueTeam(blue);
            setRedTeam(red);
            setFairnessText(text);
        }, 0);
    }

    async function handleAddPlayer() {
        if (!newPlayer.name || newPlayer.positions.length === 0) {
            message.warning("Name and position required.");
            return;
        }
        try {
            await addDoc(collection(db, "players"), newPlayer);
            message.success("Player added.");
            setPlayers([...players, { ...newPlayer, id: random(), editing: false }]);
            setNewPlayer({ name: "", ageGroup: "30s", positions: [], abilityScores: 70 });
        } catch (e) {
            message.error("Failed to add player.");
        }
    }

    async function handleDeletePlayer(id) {
        try {
            await deleteDoc(doc(db, "players", id));
            setPlayers(players.filter((p) => p.id !== id));
            message.success("Deleted");
        } catch (e) {
            message.error("Delete failed");
        }
    }

    return (
        <div
            style={{ padding: 20, backgroundColor: "#001f3f", minHeight: "100vh", color: "white" }}
        >
            <Typography.Title level={2} style={{ color: "#00bcd4" }}>
                ⚽ Sunday Football Team Divider
            </Typography.Title>
            <div style={{ display: "flex", gap: 24 }}>
                <Card
                    title="Add Player"
                    style={{ flex: 1, backgroundColor: "#00334d", color: "white" }}
                >
                    <Space direction="vertical" style={{ width: "100%" }}>
                        <Input
                            placeholder="Name"
                            value={newPlayer.name}
                            onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                        />
                        <Select
                            placeholder="Age Group"
                            value={newPlayer.ageGroup}
                            onChange={(val) => setNewPlayer({ ...newPlayer, ageGroup: val })}
                            options={ageGroups.map((a) => ({ label: a, value: a }))}
                        />
                        <Select
                            mode="multiple"
                            placeholder="Positions"
                            value={newPlayer.positions}
                            onChange={(val) => setNewPlayer({ ...newPlayer, positions: val })}
                            options={positions.map((p) => ({ label: p, value: p }))}
                        />
                        <div>
                            <div>Ability: {newPlayer.abilityScores}</div>
                            <Slider
                                min={60}
                                max={100}
                                value={newPlayer.abilityScores}
                                onChange={(v) => setNewPlayer({ ...newPlayer, abilityScores: v })}
                            />
                        </div>
                        <Button type="primary" onClick={handleAddPlayer}>
                            Add Player
                        </Button>
                    </Space>
                </Card>

                <Card
                    title="Player List"
                    style={{
                        flex: 2,
                        backgroundColor: "#002633",
                        color: "white",
                        overflowY: "auto",
                        maxHeight: 420,
                    }}
                >
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                        {players.map((p) => (
                            <Card
                                key={p.id}
                                size="small"
                                style={{ width: 160, backgroundColor: "#004d66", color: "white" }}
                            >
                                <b>{p.name}</b>
                                <div>Age: {p.ageGroup}</div>
                                <div>Ability: {p.abilityScores || 70}</div>
                                <div>
                                    Pos:{" "}
                                    {p.positions?.map((pos, i) => (
                                        <Tag color="cyan" key={i}>
                                            {pos}
                                        </Tag>
                                    ))}
                                </div>
                                <div style={{ marginTop: 8 }}>
                                    <Button size="small" type="link">
                                        Edit
                                    </Button>
                                    <Popconfirm
                                        title="Delete?"
                                        onConfirm={() => handleDeletePlayer(p.id)}
                                    >
                                        <Button size="small" danger type="link">
                                            Delete
                                        </Button>
                                    </Popconfirm>
                                </div>
                            </Card>
                        ))}
                    </div>
                </Card>
            </div>

            <Divider />
            <Button onClick={splitTeams} type="primary">
                🎲 Divide Teams
            </Button>
            <Typography.Text style={{ color: "#00bcd4" }} strong>
                {fairnessText}
            </Typography.Text>

            <Divider />
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                <TeamColumn title="🔵 Blue Team" players={blueTeam} color="blue" />
                <TeamColumn title="🔴 Red Team" players={redTeam} color="red" />
            </div>
        </div>
    );
}

function TeamColumn({ title, players, color }) {
    return (
        <div style={{ flex: 1 }}>
            <Typography.Title level={3} style={{ color: color === "blue" ? "#00bfff" : "#ff4d4f" }}>
                {title}
            </Typography.Title>
            <Space direction="vertical" style={{ width: "100%" }}>
                {players.map((p) => (
                    <Card
                        key={p.id}
                        size="small"
                        style={{
                            backgroundColor: color === "blue" ? "#00bfff" : "#ff4d4f",
                            color: "white",
                        }}
                    >
                        <b>{p.name}</b>
                        <div>Age: {p.ageGroup}</div>
                        <div>Ability: {p.abilityScores}</div>
                        <div>Pos: {p.positions?.join(", ")}</div>
                    </Card>
                ))}
            </Space>
        </div>
    );
}
