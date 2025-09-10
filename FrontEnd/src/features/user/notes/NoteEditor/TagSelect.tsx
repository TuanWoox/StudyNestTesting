import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { Tag } from '@/types/notes';
import { components } from 'react-select';

const CustomValueContainer = (props: any) => (
    <components.ValueContainer {...props}>
        <div style={{
            display: "flex",
            flexWrap: "wrap",
            overflowY: "auto",
            maxHeight: "40px",
            paddingRight: "4px",
        }}>
            {props.children}
        </div>
    </components.ValueContainer>
);

interface TagSelectProps {
    selectedTags: Tag[];
    tags: Tag[];
    onChange: (tags: Tag[]) => void;
    onAddTag: (name: string) => Tag;
    darkMode: boolean;
}

const TagSelect: React.FC<TagSelectProps> = ({ selectedTags, tags, onChange, onAddTag, darkMode }) => {
    return (
        <div className="flex-1">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                🏷️ Tags
            </label>
            <CreatableSelect
                isMulti
                components={{ ValueContainer: CustomValueContainer }}
                placeholder="Add tags to organize..."
                value={selectedTags.map((tag) => ({ label: tag.name, value: tag.id }))}
                options={tags.map((tag) => ({ label: tag.name, value: tag.id }))}
                onChange={(selectedOptions) => {
                    const newTags = selectedOptions.map((opt) =>
                        tags.find((t) => t.id === opt.value || t.name === opt.label) || onAddTag(opt.label)
                    );
                    onChange(newTags);
                }}
                styles={{
                    menu: (base) => ({
                        ...base,
                        maxHeight: "200px",
                        overflowY: "auto",
                        zIndex: 9999,
                    }),
                    menuList: (base) => ({
                        ...base,
                        maxHeight: "200px",
                        overflowY: "auto",
                    }),
                    control: (base, state) => ({
                        ...base,
                        display: "flex",
                        flexWrap: "nowrap",
                        alignItems: "center",
                        minHeight: "54px",
                        maxHeight: "54px",
                        overflow: "hidden",
                        borderRadius: "8px",
                        border: `2px solid ${state.isFocused
                            ? (darkMode ? "#3B82F6" : "#2563EB")
                            : darkMode ? "#374151" : "#E5E7EB"}`,
                        background: darkMode ? "#1F2937" : "#FFFFFF",
                        fontSize: "14px",
                        paddingLeft: "8px",
                        boxShadow: state.isFocused
                            ? `0 0 0 3px ${darkMode ? "rgba(59, 130, 246, 0.1)" : "rgba(37, 99, 235, 0.1)"}`
                            : "none",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            borderColor: darkMode ? "#4B5563" : "#D1D5DB",
                        },
                    }),
                    multiValue: (base) => ({
                        ...base,
                        background: darkMode
                            ? "linear-gradient(135deg, #1E40AF, #3B82F6)"
                            : "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
                        borderRadius: "6px",
                        padding: "2px 8px",
                        margin: "2px",
                        border: darkMode ? "1px solid #3B82F6" : "1px solid #93C5FD",
                    }),
                    multiValueLabel: (base) => ({
                        ...base,
                        color: darkMode ? "#FFFFFF" : "#1E40AF",
                        fontWeight: 500,
                        fontSize: "12px",
                    }),
                    multiValueRemove: (base) => ({
                        ...base,
                        color: darkMode ? "#BFDBFE" : "#3B82F6",
                        "&:hover": {
                            backgroundColor: darkMode ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.1)",
                            color: "#EF4444",
                        },
                    }),
                    placeholder: (base) => ({
                        ...base,
                        color: darkMode ? "#9CA3AF" : "#6B7280",
                        fontWeight: 400,
                    }),
                }}
            />
        </div>
    );
};

export default TagSelect;
