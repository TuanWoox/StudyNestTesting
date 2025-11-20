import { useAntDesignTheme } from "@/hooks/common";
import { Button, Modal, ModalProps } from "antd";
import React from "react";

interface StudynestModalProps {
    visible: boolean;
    onClose: () => void;
    onSave?: () => void;
    children: React.ReactNode;
    saveText?: string;
    cancelText?: string;
    customFooter?: React.ReactNode;
    customStyles?: ModalProps["styles"]
}

const StudynestModal: React.FC<StudynestModalProps> = ({
    visible,
    onClose,
    onSave,
    children,
    saveText,
    cancelText,
    customFooter,
    customStyles,
}) => {
    const { modalStyles } = useAntDesignTheme();
    const appliedStyles = customStyles ? customStyles : modalStyles;
    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={
                customFooter ? customFooter :
                    <StudynestModalDefaultFooter
                        onClose={onClose}
                        onSave={onSave}
                        saveText={saveText}
                        cancelText={cancelText}>
                    </StudynestModalDefaultFooter>
            }
            centered
            width="95%"
            closable={false}
            keyboard
            maskClosable={false}
            styles={appliedStyles}
        >
            {children}
        </Modal>
    )
};


interface StudynestModalDefaultFooterProps {
    onClose: () => void;
    onSave?: () => void;
    saveText?: string; // optional, default "Save"
    cancelText?: string; // optional, default "Cancel"
}

const StudynestModalDefaultFooter: React.FC<StudynestModalDefaultFooterProps> = ({
    onClose,
    onSave,
    saveText = "Save",
    cancelText = "Cancel",
}) => {
    return <div className="flex justify-end gap-2 mb-4 mr-4 ml-4">
        <Button onClick={onClose}>{cancelText}</Button>
        {onSave && (
            <Button type="primary" onClick={onSave}>
                {saveText}
            </Button>
        )}
    </div>
}


export default StudynestModal;
