import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Divider,
  List,
  Radio,
  Space,
  Typography,
  theme,
  Empty,
  Alert,
} from "antd";
import {
  listZellerCustomers,
  type ZellerCustomer,
} from "../services/customers";

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
  const [customers, setCustomers] = useState<ZellerCustomer[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch customers from API
  useEffect(() => {
    setLoading(true);
    setError(null);
    listZellerCustomers()
      .then((items) => {
        setCustomers(items ?? []);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : String(err));
        setCustomers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Fetched lists from API data
  const fetchedAdmin: User[] = (customers ?? [])
    .filter((c) => c.role === "Admin")
    .map((c) => ({ name: c.name, role: c.role }));
  const fetchedManager: User[] = (customers ?? [])
    .filter((c) => c.role === "Manager")
    .map((c) => ({ name: c.name, role: c.role }));

  const displayData = useMemo(
    () => (userType === "Admin" ? fetchedAdmin : fetchedManager),
    [userType, fetchedAdmin, fetchedManager],
  );

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

      {error ? (
        <Alert
          type="error"
          message={error}
          showIcon
          style={{ marginBottom: 16 }}
        />
      ) : null}

      <List
        itemLayout="horizontal"
        loading={loading}
        dataSource={displayData}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<InitialAvatar name={item.name}></InitialAvatar>}
              title={item.name}
              description={item.role}
            ></List.Item.Meta>
          </List.Item>
        )}
        locale={{ emptyText: <Empty description="No users to display" /> }}
      ></List>
    </div>
  );
}
