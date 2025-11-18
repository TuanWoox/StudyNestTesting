import {
    DashboardOutlined,
    UserOutlined,
    MessageOutlined,
    FileTextOutlined,
    EditOutlined
} from '@ant-design/icons';

export const adminMenus = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: <DashboardOutlined /> },
    { path: '/admin/users', name: 'Manage Users', icon: <UserOutlined /> },
    { path: '/admin/feedback', name: 'Feedback', icon: <MessageOutlined /> },
];

export const userMenus = [
    { path: '/user/notes', name: 'Notes', icon: <FileTextOutlined /> },
    { path: '/user/quiz', name: 'Quiz', icon: <EditOutlined /> },
    { path: '/user/feedback', name: 'Feedback', icon: <MessageOutlined /> },
];
