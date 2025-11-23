import React from "react";
import { Modal, Form, Input, Rate, Select, ModalProps } from "antd";
import ActionButtons from "@/features/user/notes/NoteEditor/components/ActionButtons";
import { CreateFeedBackDTO } from "@/types/feedback/createFeedBackDTO";
import { useAntDesignTheme } from "@/hooks/common";
import StudynestModal from "@/components/StudyNestModal/StudynestModal";

interface FeedBackCreateEditProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    isCreating?: boolean;
    isUpdating?: boolean;
    editing?: CreateFeedBackDTO | null;
    form: any;
    categories?: string[]; // optional: pass available categories
}

const FeedBackCreateEdit: React.FC<FeedBackCreateEditProps> = ({
    open,
    onClose,
    onSave,
    isCreating,
    isUpdating,
    editing,
    form,
    categories = ["UI", "UX", "Performance", "Bug"], // default categories
}) => {

    const { bgColor, borderColor, shadowColor, textColor } = useAntDesignTheme();
    const customStyles: ModalProps["styles"] = {
        mask: {
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
        },
        content: {
            backgroundColor: bgColor,
            border: `1px solid ${borderColor}`,
            boxShadow: `4px 4px 0 ${shadowColor}`,
            padding: 20,
            fontFamily: '"Courier New", monospace',
            color: textColor,
            maxWidth: "70vw"
        }
    }


    return (
        <StudynestModal
            visible={open}
            title={editing ? "Edit Feedback" : "Create Feedback"}
            onClose={onClose}
            customFooter={
                <div className="mt-2 flex justify-end">
                    <ActionButtons
                        onSave={onSave}
                        onClose={onClose}
                        isCreating={isCreating}
                        isUpdating={isUpdating}
                        confirmBeforeClose
                    />
                </div>
            }
            customStyles={customStyles}
        >
            <Form form={form} layout="vertical" initialValues={editing || { rating: 0 }}>
                <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true, message: "Please select a category" }]}
                >
                    <Select placeholder="Select a category">
                        {categories.map((cat) => (
                            <Select.Option key={cat} value={cat}>
                                {cat}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name="rating" label="Rating">
                    <Rate />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: "Please enter a description" }]}
                >
                    <Input.TextArea rows={4} placeholder="Enter feedback description" />
                </Form.Item>
            </Form>
        </StudynestModal >
    );
};

export default FeedBackCreateEdit;
