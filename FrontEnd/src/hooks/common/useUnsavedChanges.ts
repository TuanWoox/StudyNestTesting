import { useState, useEffect, useCallback } from "react";

interface UseUnsavedChangesProps {
  isDirty: boolean;
}

export const useUnsavedChanges = ({ isDirty }: UseUnsavedChangesProps) => {
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const showConfirmDiscard = useCallback(
    (action: () => void) => {
      if (isDirty) {
        setShowUnsavedModal(true);
        setPendingAction(() => action);
      } else {
        action();
      }
    },
    [isDirty]
  );

  const handleDiscardChanges = () => {
    if (pendingAction) {
      pendingAction();
    }
    setShowUnsavedModal(false);
    setPendingAction(null);
  };

  const handleContinueEditing = () => {
    setShowUnsavedModal(false);
    setPendingAction(null);
  };

  return {
    showConfirmDiscard,
    isUnsavedModalOpen: showUnsavedModal,
    handleDiscardChanges,
    handleContinueEditing,
  };
};
