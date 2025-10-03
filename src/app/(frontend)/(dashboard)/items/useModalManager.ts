// src/app/(frontend)/(dashboard)/items/useModalManager.ts
import { useState, useCallback } from "react";
import type { Tables } from "@/types/database";

type ViewItemsFull = Tables<"view_items_full">;
type ItemMaster = Tables<"item_masters">;
type ItemVariant = Tables<"item_variants">;

type ModalType = "item" | "master" | "variant" | "delete" | null;
type ModalMode = "create" | "edit";

interface DeletePayload {
  type: "item" | "master" | "variant";
  id: string | null;
  name: string | null;
}

interface ModalState {
  type: ModalType;
  mode?: ModalMode;
  payload?: ViewItemsFull | ItemMaster | ItemVariant | DeletePayload;
  parentModal?: ModalType; // Track parent modal for nested navigation
}

export const useModalManager = () => {
  const [modal, setModal] = useState<ModalState>({ type: null });

  // Open modal functions with optional parent tracking
  const openItemModal = useCallback(
    (mode: ModalMode = "create", item?: ViewItemsFull, fromParent?: ModalType) => {
      setModal({ type: "item", mode, payload: item, parentModal: fromParent });
    },
    []
  );

  const openMasterModal = useCallback(
    (mode: ModalMode = "create", master?: ItemMaster, fromParent?: ModalType) => {
      setModal({ type: "master", mode, payload: master, parentModal: fromParent });
    },
    []
  );

  const openVariantModal = useCallback(
    (mode: ModalMode = "create", variant?: ItemVariant, fromParent?: ModalType) => {
      setModal({ type: "variant", mode, payload: variant, parentModal: fromParent });
    },
    []
  );

  const openDeleteModal = useCallback((payload: DeletePayload) => {
    setModal({ type: "delete", payload });
  }, []);

  // Close modal with smart navigation
  const closeModal = useCallback(() => {
    const parentModal = modal.parentModal;
    
    // If modal was opened from a parent modal, return to parent
    if (parentModal) {
      setModal({ type: parentModal, mode: "create" });
    } else {
      // Otherwise, close completely
      setModal({ type: null, mode: undefined, payload: undefined });
    }
  }, [modal.parentModal]);

  // Force close all modals (ignore parent)
  const closeAllModals = useCallback(() => {
    setModal({ type: null, mode: undefined, payload: undefined, parentModal: undefined });
  }, []);

  // Helpers for checking modal state
  const isItemModalOpen = modal.type === "item";
  const isMasterModalOpen = modal.type === "master";
  const isVariantModalOpen = modal.type === "variant";
  const isDeleteModalOpen = modal.type === "delete";

  // Get typed payloads
  const itemPayload = isItemModalOpen ? (modal.payload as ViewItemsFull | undefined) : undefined;
  const masterPayload = isMasterModalOpen ? (modal.payload as ItemMaster | undefined) : undefined;
  const variantPayload = isVariantModalOpen ? (modal.payload as ItemVariant | undefined) : undefined;
  const deletePayload = isDeleteModalOpen ? (modal.payload as DeletePayload) : undefined;

  return {
    // State
    modal,
    
    // Open functions
    openItemModal,
    openMasterModal,
    openVariantModal,
    openDeleteModal,
    
    // Close functions
    closeModal, // Smart close (returns to parent if exists)
    closeAllModals, // Force close everything
    
    // Boolean helpers
    isItemModalOpen,
    isMasterModalOpen,
    isVariantModalOpen,
    isDeleteModalOpen,
    
    // Typed payloads
    itemPayload,
    masterPayload,
    variantPayload,
    deletePayload,
    
    // Mode & parent helpers
    modalMode: modal.mode,
    parentModal: modal.parentModal,
    hasParentModal: !!modal.parentModal,
  };
};

export type { ModalType, ModalMode, DeletePayload, ModalState };