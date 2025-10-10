// UnsavedChangesModal - Confirmation modal for unsaved changes

import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

// Utility function to show unsaved changes confirm dialog
export const confirmUnsavedChanges = (onDiscard: () => void): void => {
  console.log("🔔 confirmUnsavedChanges called"); // Debug log

  // Use Ant Design's Modal.confirm with proper syntax
  const modalInstance = Modal.confirm({
    title: (
      <span>
        <ExclamationCircleOutlined
          style={{ color: "#faad14", marginRight: 8 }}
        />
        Unsaved Changes
      </span>
    ),
    content: (
      <div>
        <p>You have unsaved changes that will be lost.</p>
        <p>Do you want to discard your changes or continue editing?</p>
      </div>
    ),
    okText: "Discard Changes",
    cancelText: "Continue Editing",
    okButtonProps: { danger: true },
    cancelButtonProps: { type: "default" },
    centered: true,
    width: 450,
    onOk() {
      console.log("✅ User clicked Discard"); // Debug log
      onDiscard();
    },
    onCancel() {
      console.log("❌ User clicked Continue Editing"); // Debug log
    },
  });

  console.log("📦 Modal instance:", modalInstance); // Debug log
};
