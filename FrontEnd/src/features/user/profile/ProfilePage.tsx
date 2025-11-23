import React from "react";
import { Form, Input, Button, Typography, Space, Grid, Divider } from "antd";
import useChangePassword from "@/hooks/authHook/useChangePassword";
import { UserChangePassword } from "@/types/auth/userChangePassword";
import { useAntDesignTheme } from "@/hooks/common";

const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
    const screens = Grid.useBreakpoint();
    const { borderColor, shadowColor, bgColor, textColor } = useAntDesignTheme();
    const [form] = Form.useForm<UserChangePassword & { confirmPassword?: string }>();
    const { changePasswordAsync, isLoading } = useChangePassword();

    const onFinish = async (values: any) => {
        const payload: UserChangePassword = {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
        };

        try {
            await changePasswordAsync(payload);
            form.resetFields();
            // hook already shows toast on success; optionally show a local message here
        } catch {
            // errors handled inside hook (toast). keep minimal.
        }
    };

    return (
        <div className="w-full h-full overflow-y-auto px-6 pt-4 pb-5"
            style={{
                backgroundColor: bgColor,
                scrollbarWidth: "none",
            }}>
            {/* <Card
                style={{
                    // borderRadius: 8,
                    // boxShadow: `0 2px 6px ${borderColor}`,
                    backgroundColor: bgColor
                }}
            > */}
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <div style={{ flex: screens.xs ? "1 1 100%" : "0 0 auto", minWidth: screens.xs ? "100%" : 250 }}>
                    <Title
                        level={2}
                        style={{
                            margin: 0,
                            fontWeight: 700,
                        }}
                    >
                        Change Password
                    </Title>
                    <Text
                        type="secondary"
                        style={{
                            fontSize: 15,
                            marginTop: 4,
                            display: "block",
                        }}
                    >
                        Update your password to keep your account secure
                    </Text>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ currentPassword: "", newPassword: "", confirmPassword: "" }}
                >
                    <Form.Item
                        name="currentPassword"
                        label="Current password"
                        rules={[{ required: true, message: "Please enter your current password" }]}
                    >
                        <Input.Password placeholder="Current password" />
                    </Form.Item>

                    <Divider style={{
                        backgroundColor: shadowColor
                    }} />

                    <Form.Item
                        name="newPassword"
                        label="New password"
                        rules={[
                            { required: true, message: "Please enter a new password" },
                            { min: 6, message: "Password should be at least 6 characters" },
                        ]}
                        hasFeedback
                    >
                        <Input.Password placeholder="New password" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Confirm new password"
                        dependencies={["newPassword"]}
                        hasFeedback
                        rules={[
                            { required: true, message: "Please confirm your new password" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Passwords do not match"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirm new password" />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={isLoading}>
                                Change password
                            </Button>
                            <Button
                                onClick={() => {
                                    form.resetFields();
                                }}
                            >
                                Reset
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Space>
            {/* </Card> */}
        </div>
    );
};

export default ProfilePage;