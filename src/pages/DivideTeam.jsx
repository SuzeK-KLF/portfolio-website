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
    Layout,
    theme,
    Avatar,
    Badge,
    Progress,
    FloatButton,
} from "antd";
import { db } from "../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { random } from "lodash";
import {
    UserAddOutlined,
    TeamOutlined,
    EditOutlined,
    DeleteOutlined,
    SyncOutlined,
    TrophyOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const positions = ["Forward", "Midfield", "Defense", "Goalkeeper"];
const ageGroups = ["30s", "40s", "50+"];
const ageGroupValue = { "30s": 30, "40s": 40, "50+": 55 };

export default function TeamDividerPage() {
    const {
        token: { colorBgContainer, colorPrimary },
    } = theme.useToken();

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
    const [fairnessScore, setFairnessScore] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPlayers = async () => {
            setLoading(true);
            try {
                const snapshot = await getDocs(collection(db, "players"));
                console.log("snapshot", snapshot);
                const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                console.log("data", data);
                setPlayers(data);
            } catch (err) {
                message.error("Failed to load players.");
                console.error(err);
            } finally {
                setLoading(false);
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

    const calculateTeamAbility = (team) => {
        const total = team.reduce((sum, p) => sum + (p.abilityScores || 70), 0);
        return team.length ? total / team.length : 0;
    };

    const splitTeams = () => {
        setLoading(true);
        try {
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

            const blueAvgAge = calculateAverageAge(blue);
            const redAvgAge = calculateAverageAge(red);
            const blueAbility = calculateTeamAbility(blue);
            const redAbility = calculateTeamAbility(red);

            const ageDiff = Math.abs(blueAvgAge - redAvgAge);
            const abilityDiff = Math.abs(blueAbility - redAbility);

            // Calculate fairness score (0-100)
            const score = 100 - (ageDiff * 2 + abilityDiff * 5);
            setFairnessScore(Math.max(0, Math.min(100, score)));

            setBlueTeam([]);
            setRedTeam([]);
            setTimeout(() => {
                setBlueTeam(blue);
                setRedTeam(red);
                setLoading(false);
            }, 0);
        } catch (error) {
            message.error("Error dividing teams");
            setLoading(false);
        }
    };

    const handleAddOrUpdatePlayer = async () => {
        if (!newPlayer.name || newPlayer.positions.length === 0) {
            message.warning("Name and position required.");
            return;
        }
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePlayer = async (id) => {
        setLoading(true);
        try {
            await deleteDoc(doc(db, "players", id));
            setPlayers(players.filter((p) => p.id !== id));
            message.success("Deleted");
        } catch (e) {
            message.error("Delete failed");
        } finally {
            setLoading(false);
        }
    };

    const getFairnessStatus = () => {
        if (fairnessScore > 80) return { text: "Excellent Balance", color: "#52c41a" };
        if (fairnessScore > 60) return { text: "Good Balance", color: "#faad14" };
        return { text: "Needs Adjustment", color: "#ff4d4f" };
    };

    const fairnessStatus = getFairnessStatus();

    return (
        <Layout
            style={{
                minHeight: "100vh",
                backgroundImage:
                    "url('https://www.musco.com/wp-content/uploads/2021/09/Woodland_1200x600.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Header
                style={{
                    background: "linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)",
                    padding: "0 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <TrophyOutlined style={{ fontSize: 24, color: "white" }} />
                    <Title level={3} style={{ color: "white", margin: 0 }}>
                        Sunday Football Team Divider
                    </Title>
                </div>
                <Badge count={players.length} style={{ backgroundColor: colorPrimary }}>
                    <TeamOutlined style={{ fontSize: 20, color: "white" }} />
                </Badge>
            </Header>

            <Content style={{ padding: "24px", maxWidth: 1400, margin: "0 auto", width: "100%" }}>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 2fr",
                        gap: 24,
                        marginBottom: 24,
                        alignItems: "start",
                    }}
                >
                    {/* Add Player Card */}
                    <Card
                        title={
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <UserAddOutlined />
                                {editingId ? "Edit Player" : "Add Player"}
                            </div>
                        }
                        style={{
                            background: "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(8px)",
                            borderRadius: 12,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                        headStyle={{ borderBottom: "1px solid #f0f0f0" }}
                    >
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <Input
                                placeholder="Player Name"
                                size="large"
                                value={newPlayer.name}
                                onChange={(e) =>
                                    setNewPlayer({ ...newPlayer, name: e.target.value })
                                }
                                style={{ borderRadius: 8 }}
                            />

                            <Select
                                size="large"
                                placeholder="Age Group"
                                value={newPlayer.ageGroup}
                                onChange={(val) => setNewPlayer({ ...newPlayer, ageGroup: val })}
                                options={ageGroups.map((a) => ({ label: a, value: a }))}
                                style={{ width: "100%", borderRadius: 8 }}
                            />

                            <Select
                                size="large"
                                mode="multiple"
                                placeholder="Primary and Secondary Positions"
                                value={newPlayer.positions}
                                onChange={(val) => setNewPlayer({ ...newPlayer, positions: val })}
                                options={positions.map((p) => ({ label: p, value: p }))}
                                style={{ width: "100%", borderRadius: 8 }}
                            />

                            <div style={{ padding: "8px 0" }}>
                                <Text strong>Ability Level: {newPlayer.abilityScores}</Text>
                                <Slider
                                    min={60}
                                    max={100}
                                    value={newPlayer.abilityScores}
                                    onChange={(v) =>
                                        setNewPlayer({ ...newPlayer, abilityScores: v })
                                    }
                                    trackStyle={{ background: colorPrimary }}
                                    handleStyle={{ borderColor: colorPrimary }}
                                />
                            </div>

                            <Button
                                type="primary"
                                size="large"
                                onClick={handleAddOrUpdatePlayer}
                                loading={loading}
                                style={{ borderRadius: 8, fontWeight: 500 }}
                                block
                            >
                                {editingId ? "Update Player" : "Add Player"}
                            </Button>

                            {editingId && (
                                <Button
                                    size="large"
                                    onClick={() => {
                                        setEditingId(null);
                                        setNewPlayer({
                                            name: "",
                                            ageGroup: "30s",
                                            positions: [],
                                            abilityScores: 70,
                                        });
                                    }}
                                    style={{ borderRadius: 8, fontWeight: 500 }}
                                    block
                                >
                                    Cancel
                                </Button>
                            )}
                        </Space>
                    </Card>

                    {/* Player List */}
                    <Card
                        title={
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <TeamOutlined />
                                Player Roster ({players.length})
                            </div>
                        }
                        loading={loading}
                        style={{
                            background: "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(8px)",
                            borderRadius: 12,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                        headStyle={{ borderBottom: "1px solid #f0f0f0" }}
                        bodyStyle={{ padding: 16 }}
                    >
                        {players.length === 0 ? (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: 40,
                                    textAlign: "center",
                                }}
                            >
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/863/863684.png"
                                    alt="No players"
                                    style={{ width: 80, opacity: 0.5, marginBottom: 16 }}
                                />
                                <Text type="secondary">
                                    No players added yet. Start by adding players above.
                                </Text>
                            </div>
                        ) : (
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                                    gap: 16,
                                }}
                            >
                                {players.map((p) => (
                                    <Card
                                        key={p.id}
                                        hoverable
                                        style={{
                                            borderRadius: 8,
                                            border: "1px solid #f0f0f0",
                                            transition: "all 0.3s",
                                            background: editingId === p.id ? "#e6f7ff" : "white",
                                        }}
                                        bodyStyle={{ padding: 12 }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 12,
                                                marginBottom: 8,
                                            }}
                                        >
                                            <Avatar
                                                style={{
                                                    backgroundColor: colorPrimary,
                                                    color: "white",
                                                }}
                                            >
                                                {p.name.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <div>
                                                <Text strong style={{ display: "block" }}>
                                                    {p.name}
                                                </Text>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {p.ageGroup}
                                                </Text>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: 8 }}>
                                            <Progress
                                                percent={p.abilityScores || 70}
                                                size="small"
                                                strokeColor={colorPrimary}
                                                showInfo={false}
                                            />
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                Ability: {p.abilityScores || 70}
                                            </Text>
                                        </div>

                                        <div style={{ marginBottom: 8 }}>
                                            {p.positions?.map((pos, i) => (
                                                <Tag
                                                    color={i === 0 ? colorPrimary : "default"}
                                                    key={i}
                                                    style={{ marginBottom: 4, borderRadius: 4 }}
                                                >
                                                    {pos}
                                                </Tag>
                                            ))}
                                        </div>

                                        <div style={{ display: "flex", gap: 8 }}>
                                            <Button
                                                icon={<EditOutlined />}
                                                size="small"
                                                onClick={() => {
                                                    setEditingId(p.id);
                                                    setNewPlayer({
                                                        name: p.name,
                                                        ageGroup: p.ageGroup,
                                                        positions: p.positions,
                                                        abilityScores: p.abilityScores,
                                                    });
                                                }}
                                                style={{ borderRadius: 4 }}
                                            />
                                            <Popconfirm
                                                title="Delete this player?"
                                                onConfirm={() => handleDeletePlayer(p.id)}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button
                                                    icon={<DeleteOutlined />}
                                                    size="small"
                                                    danger
                                                    style={{ borderRadius: 4 }}
                                                />
                                            </Popconfirm>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                {/* Team Division Section */}
                <Divider style={{ margin: "24px 0" }} />

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 24,
                        flexWrap: "wrap",
                        gap: 16,
                    }}
                >
                    <div>
                        <Title level={4} style={{ margin: 0 }}>
                            Team Division
                        </Title>
                        {fairnessScore > 0 && (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {blueTeam.length} vs {redTeam.length} players
                            </Text>
                        )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        {fairnessScore > 0 && (
                            <div style={{ textAlign: "right" }}>
                                <Text strong style={{ color: fairnessStatus.color }}>
                                    {fairnessStatus.text}
                                </Text>
                                <Progress
                                    percent={fairnessScore}
                                    size="small"
                                    strokeColor={fairnessStatus.color}
                                    showInfo={false}
                                    style={{ width: 120 }}
                                />
                            </div>
                        )}

                        <Button
                            onClick={splitTeams}
                            type="primary"
                            size="large"
                            icon={<SyncOutlined />}
                            loading={loading}
                            style={{ borderRadius: 8, fontWeight: 500 }}
                        >
                            Divide Teams
                        </Button>
                    </div>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 24,
                        marginBottom: 48,
                    }}
                >
                    <TeamColumn
                        title="🔵 Blue Team"
                        players={blueTeam}
                        color="#1890ff"
                        loading={loading}
                    />
                    <TeamColumn
                        title="🔴 Red Team"
                        players={redTeam}
                        color="#ff4d4f"
                        loading={loading}
                    />
                </div>

                <FloatButton.BackTop visibilityHeight={200} />
            </Content>
        </Layout>
    );
}

function TeamColumn({ title, players, color, loading }) {
    const teamAbility =
        players.reduce((sum, p) => sum + (p.abilityScores || 70), 0) / (players.length || 1);
    const avgAge =
        players.reduce((sum, p) => {
            const age = p.ageGroup === "30s" ? 35 : p.ageGroup === "40s" ? 45 : 55;
            return sum + age;
        }, 0) / (players.length || 1);

    return (
        <div
            style={{
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(8px)",
                borderRadius: 12,
                padding: 24,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                borderTop: `4px solid ${color}`,
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                }}
            >
                <Title level={4} style={{ color, margin: 0 }}>
                    {title} ({players.length})
                </Title>

                {players.length > 0 && (
                    <div style={{ display: "flex", gap: 16 }}>
                        <div style={{ textAlign: "center" }}>
                            <Text strong style={{ color }}>
                                {teamAbility.toFixed(1)}
                            </Text>
                            <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                                Avg Ability
                            </Text>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <Text strong style={{ color }}>
                                {avgAge.toFixed(1)}
                            </Text>
                            <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                                Avg Age
                            </Text>
                        </div>
                    </div>
                )}
            </div>

            {loading && players.length === 0 ? (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: 100,
                    }}
                >
                    <Text type="secondary">Dividing teams...</Text>
                </div>
            ) : players.length === 0 ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 40,
                        textAlign: "center",
                    }}
                >
                    <img
                        src={"https://cdn-icons-png.flaticon.com/512/892/892530.png"}
                        alt="Empty team"
                        style={{ width: 80, opacity: 0.5, marginBottom: 16 }}
                    />
                    <Text type="secondary">No players assigned yet</Text>
                </div>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                        gap: 16,
                    }}
                >
                    {players.map((p) => (
                        <Card
                            key={p.id}
                            hoverable
                            style={{
                                borderRadius: 8,
                                border: "1px solid #f0f0f0",
                                transition: "all 0.3s",
                            }}
                            bodyStyle={{ padding: 12 }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    marginBottom: 8,
                                }}
                            >
                                <Avatar
                                    style={{
                                        backgroundColor: color,
                                        color: "white",
                                    }}
                                >
                                    {p.name.charAt(0).toUpperCase()}
                                </Avatar>
                                <div>
                                    <Text strong style={{ display: "block" }}>
                                        {p.name}
                                    </Text>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {p.ageGroup}
                                    </Text>
                                </div>
                            </div>

                            <div style={{ marginBottom: 8 }}>
                                <Progress
                                    percent={p.abilityScores || 70}
                                    size="small"
                                    strokeColor={color}
                                    showInfo={false}
                                />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {p.abilityScores || 70} ability
                                </Text>
                            </div>

                            <div>
                                {p.positions?.map((pos, i) => (
                                    <Tag
                                        color={i === 0 ? color : "default"}
                                        key={i}
                                        style={{ marginBottom: 4, borderRadius: 4 }}
                                    >
                                        {pos}
                                    </Tag>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
