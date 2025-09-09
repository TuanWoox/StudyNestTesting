import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface EmptyStateProps {
    darkMode: boolean;
    handleCreateNote: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ darkMode, handleCreateNote }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <PlusOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
            <p style={{ fontSize: '18px', color: darkMode ? '#94A3B8' : '#6B7280' }}>
                Choose a note or create a new one.
            </p>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateNote}
                style={{
                    marginTop: '16px',
                    backgroundColor: darkMode ? '#0EA5E9' : '#2563EB',
                    borderColor: darkMode ? '#0EA5E9' : '#2563EB',
                }}
            >
                Create New Note
            </Button>
        </div>
    );
};

export default EmptyState;
