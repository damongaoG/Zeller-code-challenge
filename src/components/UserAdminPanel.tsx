import { useMemo, useState } from "react";
import { Avatar, Divider, List, Radio, Space, Typography, theme } from "antd";

type User = {
  name: string;
  role: "Admin" | "Manager";
};

function InitialAvatar({ name }: { name: string }) {
  const { token } = theme.useToken();
  const initial = useMemo(
    () => (name?.trim()?.[0] || "U").toUpperCase(),
    [name],
  );
  return (
    <Avatar
      shape="square"
      size={40}
      style={{
        background: token.colorPrimaryBg,
        color: token.colorPrimary,
        fontWeight: 600,
      }}
    >
      {initial}
    </Avatar>
  );
}

export default function UserAdminPanel() {
  const { token } = theme.useToken();
  const [userType, setUserType] = useState<"Admin" | "Manager">("Admin");

  // Mock data
  const adminUsers: User[] = [
    { name: "John Smith", role: "Admin" },
    { name: "Adam Muller", role: "Admin" },
    { name: "Perri Smith", role: "Admin" },
  ];
  const managerUsers: User[] = [];

  const data = userType === "Admin" ? adminUsers : managerUsers;

  return (
    <div style={{ maxWidth: 720, margin: "24px auto", width: "100%" }}>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        User Types
      </Typography.Title>
      <Radio.Group
        value={userType}
        onChange={(e) => setUserType(e.target.value)}
        style={{ width: "100%" }}
      >
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          {(["Admin", "Manager"] as const).map((opt) => (
            <Radio key={opt} value={opt} style={{ width: "100%" }}>
              <div
                style={{
                  width: "100%",
                  padding: 16,
                  borderRadius: 8,
                  background:
                    userType === opt ? token.colorPrimaryBg : "transparent",
                }}
              >
                {opt}
              </div>
            </Radio>
          ))}
        </Space>
      </Radio.Group>

      <Divider style={{ marginTop: 24, marginBottom: 24 }} />

      <Typography.Title level={3} style={{ marginTop: 0 }}>
        {userType} Users
      </Typography.Title>

      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<InitialAvatar name={item.name}></InitialAvatar>}
              title={item.name}
              description={item.role}
            ></List.Item.Meta>
          </List.Item>
        )}
      ></List>
    </div>
  );
}
