import {
    DashboardOutlined,
    UserOutlined,
    MessageOutlined,
    FileTextOutlined,
    EditOutlined,
    SettingOutlined,
} from '@ant-design/icons';

export const adminMenus = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: <DashboardOutlined /> },
    { path: '/admin/users', name: 'Users', icon: <UserOutlined /> },
    { path: '/admin/feedback', name: 'Feedback', icon: <MessageOutlined /> },
    { path: '/admin/settings', name: 'Settings', icon: <SettingOutlined /> },
];

export const userMenus = [
    { path: '/user/notes', name: 'Notes', icon: <FileTextOutlined /> },
    { path: '/user/quiz', name: 'Quiz', icon: <EditOutlined /> },
    { path: '/user/feedbacks', name: 'Feedback', icon: <MessageOutlined /> },
];
