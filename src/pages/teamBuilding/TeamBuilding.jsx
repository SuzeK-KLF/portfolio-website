import React, { useEffect, useState } from "react";
import {
    Card,
    Button,
    Modal,
    Input,
    Select,
    Form,
    Typography,
    Spin,
    Divider,
    Space,
    Slider,
    Avatar,
    Progress,
    App,
} from "antd";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { UserAddOutlined, StarFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import deepOceanLogo from "../../assets/deepocean.png";

const { Title, Text } = Typography;
const { Option } = Select;

const ageGroups = ["20s", "30s", "40s", "50+"];
const positions = ["Forward", "Midfield", "Defense", "Goalkeeper"];
const colorPrimary = "#00bcd4";
const colorSecondary = "#1890ff";

const TeamBuilding = () => {
    const { message } = App.useApp();
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(localStorage.getItem("team_user_id"));
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const [newPlayer, setNewPlayer] = useState({
        name: "",
        ageGroup: "30s",
        positions: [],
        abilityScores: 70,
    });
    const [formData, setFormData] = useState({
        dates: [],
        headCount: 1,
        dietRestrictions: "",
        food: "",
        tools: "",
    });

    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const fetchPlayers = async () => {
            setLoading(true);
            try {
                const snapshot = await getDocs(collection(db, "players"));
                const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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

    const handleUserSelect = (value) => {
        setCurrentUserId(value);
        localStorage.setItem("team_user_id", value);
    };

    const handleCreateUser = () => {
        setIsModalVisible(true);
    };

    const handleModalOk = async () => {
        const newId = newPlayer.name.toLowerCase().replace(/\s+/g, "_");
        await setDoc(doc(db, "players", newId), { ...newPlayer });
        setPlayers((prev) => [...prev, { id: newId, ...newPlayer }]);
        setCurrentUserId(newId);
        localStorage.setItem("team_user_id", newId);
        setIsModalVisible(false);
        setNewPlayer({ name: "", ageGroup: "30s", positions: [], abilityScores: 70 });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setNewPlayer({ name: "", ageGroup: "30s", positions: [], abilityScores: 70 });
    };

    const handleFormSubmit = async () => {
        if (!currentUserId) return message.warning("Please select your name first.");
        try {
            await setDoc(doc(db, "players", currentUserId), {
                ...players.find((p) => p.id === currentUserId),
                ...formData,
            });
            message.success("RSVP submitted!");
        } catch (e) {
            message.error("Failed to submit RSVP.");
            console.error(e);
        }
    };

    const currentUser = players.find((p) => p.id === currentUserId);
    console.log("currentUser", currentUser);

    return (
        <div style={{ padding: 24, maxWidth: 1000, margin: "auto" }}>
            <Link
                to="/deep-ocean"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    textDecoration: "none",
                }}
            >
                <img
                    src={deepOceanLogo}
                    alt="Deep Ocean Logo"
                    style={{
                        height: 60,
                        width: "auto",
                        filter: "drop-shadow(0 0 4px rgba(0,0,0,0.3))",
                    }}
                />
                <Title level={2} style={{ color: "white" }}>
                    Team Building RSVP
                </Title>
            </Link>
            <Text style={{ color: "#aaa" }}>Please select your name or create a new one.</Text>

            {loading ? (
                <Spin size="large" />
            ) : (
                <Card style={{ marginTop: 24, backgroundColor: "#c1cbd7", borderColor: "#333" }}>
                    <Select
                        style={{ width: 300, backgroundColor: "#8a8a8a", color: "white" }}
                        placeholder="Select your name"
                        dropdownStyle={{ backgroundColor: "#8a8a8a", color: "white" }}
                        value={currentUserId || undefined}
                        onChange={handleUserSelect}
                    >
                        {players.map((player) => (
                            <Option key={player.id} value={player.id}>
                                {player.name}
                            </Option>
                        ))}
                    </Select>
                    <Button type="link" onClick={handleCreateUser}>
                        Name not found? Create new
                    </Button>
                </Card>
            )}

            <Modal
                title={
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Avatar
                            style={{
                                backgroundColor: colorPrimary,
                                color: "white",
                            }}
                            icon={<UserAddOutlined />}
                        />
                        <span style={{ color: "white" }}>Create New Participant</span>
                    </div>
                }
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Create Profile"
                cancelText="Cancel"
                width={600}
                styles={{
                    body: {
                        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
                        padding: "24px",
                    },
                    header: {
                        background: "transparent",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    },
                    footer: {
                        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                    },
                }}
                okButtonProps={{
                    style: {
                        background: colorPrimary,
                        border: "none",
                        fontWeight: 500,
                        borderRadius: 6,
                    },
                }}
                cancelButtonProps={{
                    style: {
                        color: "#8a8a8a",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        borderRadius: 6,
                    },
                }}
            >
                <Space direction="vertical" style={{ width: "100%", gap: 24 }}>
                    <div>
                        <Text
                            strong
                            style={{
                                color: "rgba(255, 255, 255, 0.8)",
                                display: "block",
                                marginBottom: 8,
                            }}
                        >
                            Player Name
                        </Text>
                        <Input
                            placeholder="Enter full name"
                            size="large"
                            value={newPlayer.name}
                            onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                            style={{
                                borderRadius: 8,
                                background: "rgba(0, 0, 0, 0.3)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                color: "white",
                            }}
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                            <Text
                                strong
                                style={{
                                    color: "rgba(255, 255, 255, 0.8)",
                                    display: "block",
                                    marginBottom: 8,
                                }}
                            >
                                Age Group
                            </Text>
                            <Select
                                size="large"
                                value={newPlayer.ageGroup}
                                onChange={(val) => setNewPlayer({ ...newPlayer, ageGroup: val })}
                                style={{
                                    width: "100%",
                                    borderRadius: 8,
                                    background: "rgba(0, 0, 0, 0.3)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    color: "white",
                                }}
                                dropdownStyle={{
                                    background: "#0f2027",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    borderRadius: 8,
                                }}
                            >
                                {ageGroups.map((age) => (
                                    <Option key={age} value={age}>
                                        <span style={{ color: "white" }}>{age}</span>
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <Text
                                strong
                                style={{
                                    color: "rgba(255, 255, 255, 0.8)",
                                    display: "block",
                                    marginBottom: 8,
                                }}
                            >
                                Positions
                            </Text>
                            <Select
                                size="large"
                                mode="multiple"
                                placeholder="Select positions"
                                value={newPlayer.positions}
                                onChange={(val) => setNewPlayer({ ...newPlayer, positions: val })}
                                style={{
                                    width: "100%",
                                    borderRadius: 8,
                                    background: "rgba(0, 0, 0, 0.3)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    color: "white",
                                }}
                                dropdownStyle={{
                                    background: "#0f2027",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    borderRadius: 8,
                                }}
                            >
                                {positions.map((pos) => (
                                    <Option key={pos} value={pos}>
                                        <span style={{ color: "white" }}>{pos}</span>
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    <div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 8,
                            }}
                        >
                            <Text strong style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                                Skill Level
                            </Text>
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <StarFilled style={{ color: colorPrimary }} />
                                <Text strong style={{ color: colorPrimary }}>
                                    {newPlayer.abilityScores}/100
                                </Text>
                            </div>
                        </div>
                        <Slider
                            min={60}
                            max={100}
                            value={newPlayer.abilityScores}
                            onChange={(v) => setNewPlayer({ ...newPlayer, abilityScores: v })}
                            trackStyle={{ background: colorPrimary }}
                            handleStyle={{
                                borderColor: colorPrimary,
                                boxShadow: "0 0 0 2px rgba(0, 188, 212, 0.2)",
                            }}
                            railStyle={{ background: "rgba(255, 255, 255, 0.1)" }}
                        />
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: 4,
                            }}
                        >
                            <Text type="secondary" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                                小费
                            </Text>
                            <Text type="secondary" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                                Expert
                            </Text>
                        </div>
                    </div>
                </Space>
            </Modal>

            <Divider style={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

            {currentUserId && (
                <Card
                    style={{ marginTop: 24, backgroundColor: "#c1cbd7", borderColor: "#333" }}
                    title="Your RSVP Info"
                >
                    <Form layout="vertical">
                        <Form.Item label="Available Dates">
                            <Select
                                mode="multiple"
                                placeholder="Choose one or more dates"
                                value={formData.dates}
                                onChange={(val) => setFormData({ ...formData, dates: val })}
                            >
                                <Option value="2025-06-29">June 29 (Long Weekend)</Option>
                                <Option value="2025-07-06">July 6 (Next Long Weekend)</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="Number of Attendees (including family)">
                            <Input
                                type="number"
                                min={1}
                                max={10}
                                value={formData.headCount}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        headCount: parseInt(e.target.value || "1"),
                                    })
                                }
                            />
                        </Form.Item>

                        <Form.Item label="Dietary Restrictions">
                            <Input.TextArea
                                placeholder="E.g. No peanuts, vegetarian"
                                value={formData.dietRestrictions}
                                onChange={(e) =>
                                    setFormData({ ...formData, dietRestrictions: e.target.value })
                                }
                            />
                        </Form.Item>

                        <Form.Item label="Food You're Bringing">
                            <Input.TextArea
                                placeholder="E.g. Fried rice, watermelon"
                                value={formData.food}
                                onChange={(e) => setFormData({ ...formData, food: e.target.value })}
                            />
                        </Form.Item>

                        <Form.Item label="Tools / Equipment You're Bringing">
                            <Input.TextArea
                                placeholder="E.g. Grill, extra chairs"
                                value={formData.tools}
                                onChange={(e) =>
                                    setFormData({ ...formData, tools: e.target.value })
                                }
                            />
                        </Form.Item>

                        <Button type="primary" onClick={handleFormSubmit} style={{ marginTop: 16 }}>
                            Submit RSVP
                        </Button>
                    </Form>
                </Card>
            )}

            {/* Summary Section */}
            <Divider style={{ borderColor: "rgba(255, 255, 255, 0.1)", marginTop: 48 }} />
            <Title level={3} style={{ color: "white" }}>
                All Participants Overview
            </Title>
            {players.length === 0 ? (
                <Text style={{ color: "#ccc" }}>No participants yet.</Text>
            ) : (
                players.map((player) => (
                    <Card
                        key={player.id}
                        title={<Text style={{ color: "black" }}>{player.name}</Text>}
                        style={{
                            marginBottom: 16,
                            backgroundColor: "#c1cbd7",
                            borderColor: "#333",
                        }}
                    >
                        <Text type="secondary">Dates: </Text>
                        {player.dates?.join(", ") || "N/A"}
                        <br />
                        <Text type="secondary">Attendees: </Text>
                        {player.headCount || 0}
                        <br />
                        <Text type="secondary">Diet: </Text>
                        {player.dietRestrictions || "N/A"}
                        <br />
                        <Text type="secondary">Food: </Text>
                        {player.food || "N/A"}
                        <br />
                        <Text type="secondary">Tools: </Text>
                        {player.tools || "N/A"}
                    </Card>
                ))
            )}
        </div>
    );
};

export default TeamBuilding;
