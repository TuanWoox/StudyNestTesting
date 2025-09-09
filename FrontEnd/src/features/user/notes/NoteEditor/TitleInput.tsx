import React from 'react';
import { Input } from 'antd';

interface TitleInputProps {
    value: string;
    onChange: (val: string) => void;
    darkMode: boolean;
}

const TitleInput: React.FC<TitleInputProps> = ({ value, onChange, darkMode }) => {
    return (
        <div className="flex-1 mr-6 group">
            <Input
                placeholder="✨ Start writing your thoughts..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`${darkMode ? "dark" : "light"}`}
                style={{
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    lineHeight: "1.5",
                    border: "none",
                    boxShadow: "none",
                    background: "transparent",
                    padding: "5px 0",
                    color: darkMode ? "#FFFFFF" : "#37352F",
                    fontFamily: "inherit",
                }}
            />
            <div
                className={`h-0.5 w-0 group-hover:w-full transition-all duration-500 ${darkMode ? "bg-blue-400" : "bg-blue-500"} mt-2`}
            />
        </div>
    );
};

export default TitleInput;
