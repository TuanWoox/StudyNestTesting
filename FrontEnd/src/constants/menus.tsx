import {
    DashboardOutlined,
    UserOutlined,
    MessageOutlined,
    FileTextOutlined,
    EditOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import path from 'path';

export const adminMenus = [
    { path: '/admin/settings', name: 'Settings', icon: <SettingOutlined /> },
    { path: '/admin/feedbacks', name: 'Feedback', icon: <MessageOutlined /> },

];

export const userMenus = [
    { path: '/user/notes', name: 'Notes', icon: <FileTextOutlined /> },
    {
        name: 'Quiz',
        icon: <EditOutlined />,
        children: [
            { path: '/user/quiz', name: 'My Quizzes', key: '/user/quiz' },
            { path: '/user/exploreQuiz', name: 'Explore', key: '/exploreQuiz' },
        ]
    },
    { path: '/user/feedbacks', name: 'Feedback', icon: <MessageOutlined /> },
];
