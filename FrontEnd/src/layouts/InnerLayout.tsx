import { useState } from 'react';
import { PageContainer, ProLayout } from '@ant-design/pro-components';
import { useNavigate, Outlet } from 'react-router-dom';
import {
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, Menu, ConfigProvider, theme, Space } from 'antd';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import logo from '../assets/react.svg'
import { ERole } from '../utils/enums/ERole';
import { adminMenus, userMenus } from '../constants/menus';

interface InnerLayoutProps {
    role: string;
}

const InnerLayout = ({ role }: InnerLayoutProps) => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);

    const layoutTitle = role === ERole.Admin ? 'Admin Panel' : 'Study Nest';
    const menus = role === ERole.Admin ? adminMenus : userMenus;

    const menu = (
        <Menu
            items={[
                {
                    key: 'profile',
                    icon: <UserOutlined />,
                    label: 'Profile',
                    onClick: () => navigate('/profile'),
                },
                {
                    key: 'settings',
                    icon: <SettingOutlined />,
                    label: 'Settings',
                    onClick: () => navigate('/settings'),
                },
                {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: 'Logout',
                    danger: true,
                    onClick: () => console.log('Logging out...'),
                },
            ]}
        />
    );

    return (
        <ConfigProvider
            theme={{
                algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorPrimary: darkMode ? '#6366F1' : '#FBBF24',
                    borderRadius: 8,
                    fontSize: 15,
                },
            }}
        >
            <div className={`transition-colors duration-500 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
                <ProLayout
                    title={layoutTitle}
                    logo={logo}
                    fixSiderbar
                    layout="mix"
                    navTheme={darkMode ? 'realDark' : 'light'}
                    location={{ pathname: window.location.pathname }}
                    menu={{
                        request: async () => menus,
                    }}
                    menuItemRender={(item, dom) => (
                        <div
                            onClick={() => navigate(item.path || '/')}
                            className="hover:opacity-70 transition"
                        >
                            {dom}
                        </div>
                    )}
                    rightContentRender={() => (
                        <Space>
                            {/* Toggle Dark Mode */}
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`relative flex items-center w-14 h-7 rounded-full transition-all duration-300 ${darkMode ? 'bg-indigo-500' : 'bg-amber-400'}`}
                            >
                                <span
                                    className={`absolute left-1 top-1 w-5 h-5 rounded-full bg-white shadow-md transform transition-all duration-300 ${darkMode ? 'translate-x-7' : 'translate-x-0'}`}
                                ></span>
                                <span className="absolute left-1.5 text-yellow-400">
                                    <SunIcon className="w-4 h-4" />
                                </span>
                                <span className="absolute right-1.5 text-[#6366F1]">
                                    <MoonIcon className="w-4 h-4" />
                                </span>
                            </button>

                            {/* Avatar */}
                            <Dropdown overlay={menu} trigger={['click']}>
                                <Avatar
                                    size={40}
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: darkMode ? '#6366F1' : '#FBBF24',
                                    }}
                                    icon={<UserOutlined />}
                                />
                            </Dropdown>
                        </Space>
                    )}
                >
                    <PageContainer>
                        <div className="transition-colors duration-500">
                            <Outlet />
                        </div>
                    </PageContainer>
                </ProLayout>
            </div>
        </ConfigProvider>
    );
};

export default InnerLayout;
