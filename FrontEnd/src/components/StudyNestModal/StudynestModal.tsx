import { useAntDesignTheme } from "@/hooks/common";
import { Button, Modal, ModalProps } from "antd";
import React from "react";

interface StudynestModalProps {
    visible: boolean;
    onClose: () => void;
    onSave?: () => void;
    title?: React.ReactNode;
    children: React.ReactNode;
    saveText?: string;
    cancelText?: string;
    customFooter?: React.ReactNode;
    customStyles?: ModalProps["styles"];
    width?: string; // optional width
    isLoading?: boolean;
}

const StudynestModal: React.FC<StudynestModalProps> = ({
    visible,
    onClose,
    onSave,
    title,
    children,
    saveText,
    cancelText,
    customFooter,
    customStyles,
    width,
    isLoading
}) => {
    const { modalStyles } = useAntDesignTheme();
    const appliedStyles = customStyles ? customStyles : modalStyles;

    return (
        <Modal
            open={visible}
            title={title}
            onCancel={onClose}
            footer={
                customFooter ? (
                    <div className="flex justify-end gap-2 mb-4 mr-4 ml-4">
                        {customFooter}
                    </div>
                ) : (
                    <StudynestModalDefaultFooter
                        onClose={onClose}
                        onSave={onSave}
                        saveText={saveText}
                        cancelText={cancelText}
                        isLoading={isLoading}
                    />
                )
            }
            centered
            closable={false}
            keyboard
            maskClosable={false}
            styles={appliedStyles}
            {...(width ? { width } : {})} // only apply width if provided
        >
            {children}
        </Modal>
    );
};

interface StudynestModalDefaultFooterProps {
    onClose: () => void;
    onSave?: () => void;
    saveText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

const StudynestModalDefaultFooter: React.FC<StudynestModalDefaultFooterProps> = ({
    onClose,
    onSave,
    saveText = "Save",
    cancelText = "Cancel",
    isLoading,
}) => {
    return (
        <div className="flex justify-end gap-2 mb-4 mr-4 ml-4">
            <Button
                onClick={onClose}
                disabled={isLoading}
            >
                {cancelText}
            </Button>
            {onSave && (
                <Button
                    type="primary"
                    onClick={onSave}
                    disabled={isLoading}
                >
                    {saveText}
                </Button>
            )}
        </div>
    );
};

export default StudynestModal;
