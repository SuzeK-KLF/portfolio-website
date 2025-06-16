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
    App,
    Table,
} from "antd";
import { collection, getDocs, setDoc, addDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { UserAddOutlined, StarFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import deepOceanLogo from "../../assets/deepocean.png";
import { Pie, Column } from "@ant-design/charts";

const { Title, Text } = Typography;
const { Option } = Select;

const ageGroups = ["20s", "30s", "40s", "50+"];
const positions = ["Forward", "Midfield", "Defense", "Goalkeeper"];
const colorPrimary = "#00bcd4";

const TeamBuilding = () => {
    const { message } = App.useApp();
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(localStorage.getItem("team_user_id"));
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const [newPlayer, setNewPlayer] = useState({
        name: "",
        ageGroup: "30s",
        positions: [],
        abilityScores: 70,
        dates: [],
        attendance: 1,
        dietary: "",
        foods: [],
        tools: [],
    });

    const [formData, setFormData] = useState({
        dates: [],
        headCount: 0,
        dietRestrictions: "",
        food: "",
        tools: "",
    });

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

    useEffect(() => {
        fetchPlayers();
    }, []);

    useEffect(() => {
        const user = players.find((p) => p.id === currentUserId);
        if (user) {
            setFormData({
                dates: user.dates || [],
                headCount: user.headCount || 1,
                dietRestrictions: user.dietRestrictions || "",
                food: user.food || "",
                tools: user.tools || "",
            });
        }
    }, [players, currentUserId]);

    const handleUserSelect = (value) => {
        setCurrentUserId(value);
        localStorage.setItem("team_user_id", value);
    };

    const handleCreateUser = () => {
        setIsModalVisible(true);
    };

    const handleModalOk = async () => {
        const docRef = await addDoc(collection(db, "players"), {
            name: newPlayer.name,
            ageGroup: newPlayer.ageGroup,
            positions: newPlayer.positions,
            abilityScores: newPlayer.abilityScores,
        });
        setCurrentUserId(docRef.id);
        localStorage.setItem("team_user_id", docRef.id);
        setIsModalVisible(false);
        setNewPlayer({ name: "", ageGroup: "30s", positions: [], abilityScores: 70 });
        fetchPlayers();
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
                dates: formData.dates,
                headCount: formData.headCount,
                dietRestrictions: formData.dietRestrictions,
                food: formData.food,
                tools: formData.tools,
            });
            message.success("RSVP submitted!");
            fetchPlayers();
        } catch (e) {
            message.error("Failed to submit RSVP.");
            console.error(e);
        }
    };

    const currentUser = players.find((p) => p.id === currentUserId);

    const dateAttendance = players.reduce((acc, player) => {
        player.dates?.forEach((date) => {
            acc[date] = (acc[date] || 0) + (player.headCount || 1);
        });
        return acc;
    }, {});

    const chartData = Object.entries(dateAttendance)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const totalPeople = players.reduce((sum, p) => sum + (p.headCount || 0), 0);
    const allTools = players.map((p) => p.tools).filter(Boolean);
    const allFoods = players.map((p) => p.food).filter(Boolean);
    const allDiets = players.map((p) => p.dietRestrictions).filter(Boolean);

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

            {currentUser && (
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
                                <Option value="2025-06-21">June 21 (Sat 周六)</Option>
                                <Option value="2025-06-22">June 22 (Sun 周日)</Option>
                                <Option value="2025-06-23">June 23 (Mon 周一)</Option>
                                <Option value="2025-06-28">June 28 (Sat 周六)</Option>
                                <Option value="2025-06-29">June 29 (Sun 周日)</Option>
                                <Option value="2025-06-30">June 30 (Mon 周一)</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="Number of Attendees (including family)">
                            <Input
                                type="number"
                                min={0}
                                max={100}
                                value={formData.headCount}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        headCount: parseInt(e.target.value || "1"),
                                    })
                                }
                            />
                        </Form.Item>

                        <Form.Item label="Dietary Restrictions 忌口">
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

            <Title level={4} style={{ color: "white" }}>
                {currentUser ? "RSVP Summary" : "Select your name to see the summary"}
            </Title>
            {currentUser && (
                <>
                    <Button
                        onClick={() => setShowDetails(!showDetails)}
                        style={{ marginBottom: 16 }}
                    >
                        {showDetails ? "Hide Details" : "Show Details"}
                    </Button>
                    <Card title="Summary" style={{ backgroundColor: "#c1cbd7", color: "black" }}>
                        <p style={{ color: "black" }}>
                            Total Attendees: <strong>{totalPeople}</strong>
                        </p>
                        <p style={{ color: "black" }}>
                            All Foods: <strong>{allFoods.join(", ") || "N/A"}</strong>
                        </p>
                        <p style={{ color: "black" }}>
                            All Tools: <strong>{allTools.join(", ") || "N/A"}</strong>
                        </p>
                        <p style={{ color: "black" }}>
                            Dietary Restrictions: <strong>{allDiets.join(" | ") || "N/A"}</strong>
                        </p>
                        <p style={{ color: "black" }}>
                            Attendance by Date:
                            {Object.entries(dateAttendance)
                                .sort(([a], [b]) => new Date(a) - new Date(b))
                                .map(([date, count]) => (
                                    <div key={date}>
                                        <strong>{date}</strong>: {count}
                                    </div>
                                ))}
                        </p>
                    </Card>
                    <Card title="Attendance Chart" style={{ marginTop: 24 }}>
                        <Column
                            data={chartData}
                            xField="date"
                            yField="count"
                            label={{ position: "middle", style: { fill: "#c1cbd7" } }}
                            xAxis={{ label: { autoRotate: false } }}
                            yAxis={{ title: { text: "Attendees" } }}
                            meta={{
                                date: { alias: "Date" },
                                count: { alias: "Attendance Count" },
                            }}
                        />
                    </Card>
                    <Divider />

                    {showDetails && (
                        <Table
                            dataSource={players}
                            rowKey="id"
                            columns={[
                                { title: "Name", dataIndex: "name", key: "name" },
                                { title: "Attendees", dataIndex: "headCount" },
                                {
                                    title: "Dates",
                                    dataIndex: "dates",
                                    render: (val) => val?.join(", "),
                                },
                                { title: "Food", dataIndex: "food" },
                                { title: "Tools", dataIndex: "tools" },
                            ]}
                            pagination={false}
                            style={{ backgroundColor: "#c1cbd7", color: "white" }}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default TeamBuilding;
