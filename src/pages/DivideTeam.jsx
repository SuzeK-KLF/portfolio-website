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
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
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
    const [editingId, setEditingId] = useState(null);
    const [blueTeam, setBlueTeam] = useState([]);
    const [redTeam, setRedTeam] = useState([]);
    const [fairnessText, setFairnessText] = useState("");

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const snapshot = await getDocs(collection(db, "players"));
                const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setPlayers(data);
            } catch (err) {
                message.error("Failed to load players.");
                console.error(err);
            }
        };
        fetchPlayers();
    }, []);

    const shuffle = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    const calculateAverageAge = (team) => {
        const total = team.reduce((sum, p) => sum + ageGroupValue[p.ageGroup], 0);
        return team.length ? total / team.length : 0;
    };

    const splitTeams = () => {
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
    };

    const handleAddOrUpdatePlayer = async () => {
        if (!newPlayer.name || newPlayer.positions.length === 0) {
            message.warning("Name and position required.");
            return;
        }
        try {
            if (editingId) {
                await updateDoc(doc(db, "players", editingId), newPlayer);
                setPlayers(players.map((p) => (p.id === editingId ? { ...p, ...newPlayer } : p)));
                message.success("Player updated.");
                setEditingId(null);
            } else {
                const docRef = await addDoc(collection(db, "players"), newPlayer);
                message.success("Player added.");
                setPlayers([...players, { ...newPlayer, id: docRef.id }]);
            }
            setNewPlayer({ name: "", ageGroup: "30s", positions: [], abilityScores: 70 });
        } catch (e) {
            message.error("Operation failed.");
        }
    };

    const handleDeletePlayer = async (id) => {
        try {
            await deleteDoc(doc(db, "players", id));
            setPlayers(players.filter((p) => p.id !== id));
            message.success("Deleted");
        } catch (e) {
            message.error("Delete failed");
        }
    };

    return (
        <div
            style={{
                padding: 20,
                minHeight: "100vh",
                backgroundImage:
                    "url('https://www.musco.com/wp-content/uploads/2021/09/Woodland_1200x600.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "white",
            }}
        >
            <Typography.Title level={2} style={{ color: "#00bcd4" }}>
                ⚽ Sunday Football Team Divider
            </Typography.Title>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                <Card
                    title={editingId ? "Edit Player" : "Add Player"}
                    style={{ flex: 1, backgroundColor: "#002a38", color: "white" }}
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
                        <Button type="primary" onClick={handleAddOrUpdatePlayer}>
                            {editingId ? "Update" : "Add Player"}
                        </Button>
                        {editingId && (
                            <Button
                                onClick={() => {
                                    setEditingId(null);
                                    setNewPlayer({
                                        name: "",
                                        ageGroup: "30s",
                                        positions: [],
                                        abilityScores: 70,
                                    });
                                }}
                            >
                                Cancel
                            </Button>
                        )}
                    </Space>
                </Card>

                <Card
                    title="Player List"
                    style={{
                        flex: 2,
                        backgroundColor: "#00394d",
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
                                hoverable
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
                                    <Button
                                        size="small"
                                        type="link"
                                        onClick={() => {
                                            setEditingId(p.id);
                                            setNewPlayer({
                                                name: p.name,
                                                ageGroup: p.ageGroup,
                                                positions: p.positions,
                                                abilityScores: p.abilityScores,
                                            });
                                        }}
                                    >
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
            <Typography.Text style={{ color: "#FCFCFC" }} strong>
                {"      "}{fairnessText}
            </Typography.Text>

            <Divider />
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 16,
                }}
            >
                <TeamColumn title="🔵 Blue Team" players={blueTeam} color="blue" />
                <TeamColumn title="🔴 Red Team" players={redTeam} color="red" />
            </div>
        </div>
    );
}

function TeamColumn({ title, players, color }) {
    return (
        <div>
            <Typography.Title level={3} style={{ color: color === "blue" ? "#00bfff" : "#ff4d4f" }}>
                {title}
            </Typography.Title>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                    gap: 12,
                }}
            >
                {players.map((p) => (
                    <Card
                        key={p.id}
                        size="small"
                        hoverable
                        style={{
                            backgroundColor: color === "blue" ? "#00bfff" : "#ff4d4f",
                            color: "white",
                            textAlign: "center",
                        }}
                    >
                        <b>{p.name}</b>
                        <div>{p.ageGroup}</div>
                        <div>{p.abilityScores}</div>
                        <div>{p.positions?.join(", ")}</div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
