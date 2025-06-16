import React from "react";
import { Link } from "react-router-dom";
import { Card, Typography, Space, Divider, Layout, Watermark, Image } from "antd";
import { TeamOutlined, PartitionOutlined } from "@ant-design/icons";
import deepOceanLogo from "../../assets/deepocean.png";
import "./DeepOcean.css";

const { Title, Text } = Typography;
const { Content, Header } = Layout;

const menuItems = [
    {
        title: "Divide Teams",
        path: "/deep-ocean/divide-team",
        icon: <PartitionOutlined style={{ fontSize: "24px" }} />,
        description: "Create balanced teams for matches",
    },
    {
        title: "Team Building",
        path: "/deep-ocean/team-building",
        icon: <TeamOutlined style={{ fontSize: "24px" }} />,
        description: "Build and manage team-bonding activities",
    },
];

const DeepOcean = () => (
    <Watermark content="Deep Ocean" font={{ color: "rgba(0, 180, 200, 0.1)" }}>
        <Layout className="ocean-layout">
            <Header className="ocean-header">
                <Image
                    src={deepOceanLogo}
                    preview={false}
                    height={80}
                    style={{
                        objectFit: "contain",
                        filter: "drop-shadow(0 0 8px rgba(0, 255, 255, 0.6))",
                    }}
                />
            </Header>

            <Content className="ocean-content">
                <div className="ocean-container">
                    <Space direction="vertical" size="large" align="center">
                        <Divider className="ocean-divider" />
                        <Title level={1} className="ocean-title">
                            <span className="title-gradient text-white">欢迎来到深海</span>
                        </Title>

                        <Text type="secondary" className="ocean-subtitle">
                            Dive into the depths of team management
                        </Text>

                        <div className="menu-grid">
                            {menuItems.map((item, index) => (
                                <Link to={item.path} key={index}>
                                    <Card
                                        hoverable
                                        className="menu-card"
                                        bodyStyle={{ padding: "24px" }}
                                    >
                                        <Space direction="vertical" align="center" size="middle">
                                            <div className="card-icon">{item.icon}</div>
                                            <Title level={3} className="card-title">
                                                {item.title}
                                            </Title>
                                            <Text type="secondary" className="card-description">
                                                {item.description}
                                            </Text>
                                        </Space>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </Space>
                </div>
            </Content>
        </Layout>
    </Watermark>
);

export default DeepOcean;
