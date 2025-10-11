import { useCallback, useState } from 'react';

export interface ModalState {
  isOpen: boolean;
  type: 'create' | 'edit' | 'view' | 'delete' | 'bulk' | null;
  data?: any;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  onClose?: () => void;
}

export interface UseTableModalsOptions {
  defaultSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  defaultClosable?: boolean;
  onModalChange?: (modal: ModalState) => void;
}

export interface UseTableModalsReturn {
  // Modal state
  modal: ModalState;

  // Modal actions
  openCreateModal: (title?: string, size?: ModalState['size']) => void;
  openEditModal: (data: any, title?: string, size?: ModalState['size']) => void;
  openViewModal: (data: any, title?: string, size?: ModalState['size']) => void;
  openDeleteModal: (
    data: any,
    title?: string,
    size?: ModalState['size']
  ) => void;
  openBulkModal: (
    data: any[],
    title?: string,
    size?: ModalState['size']
  ) => void;
  closeModal: () => void;

  // Modal utilities
  isModalOpen: (type: ModalState['type']) => boolean;
  getModalTitle: (type: ModalState['type'], data?: any) => string;
}

export const useTableModals = (
  options: UseTableModalsOptions = {}
): UseTableModalsReturn => {
  const { defaultSize = 'md', defaultClosable = true, onModalChange } = options;

  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: null,
    size: defaultSize,
    closable: defaultClosable,
  });

  // Generic modal opener
  const openModal = useCallback(
    (
      type: ModalState['type'],
      data?: any,
      title?: string,
      size?: ModalState['size']
    ) => {
      const modalState: ModalState = {
        isOpen: true,
        type,
        data,
        title: title || getModalTitle(type, data),
        size: size || defaultSize,
        closable: defaultClosable,
      };

      setModal(modalState);
      onModalChange?.(modalState);
    },
    [defaultSize, defaultClosable, onModalChange]
  );

  // Specific modal openers
  const openCreateModal = useCallback(
    (title?: string, size?: ModalState['size']) => {
      openModal('create', undefined, title, size);
    },
    [openModal]
  );

  const openEditModal = useCallback(
    (data: any, title?: string, size?: ModalState['size']) => {
      openModal('edit', data, title, size);
    },
    [openModal]
  );

  const openViewModal = useCallback(
    (data: any, title?: string, size?: ModalState['size']) => {
      openModal('view', data, title, size);
    },
    [openModal]
  );

  const openDeleteModal = useCallback(
    (data: any, title?: string, size?: ModalState['size']) => {
      openModal('delete', data, title, size);
    },
    [openModal]
  );

  const openBulkModal = useCallback(
    (data: any[], title?: string, size?: ModalState['size']) => {
      openModal('bulk', data, title, size);
    },
    [openModal]
  );

  // Close modal
  const closeModal = useCallback(() => {
    const modalState: ModalState = {
      isOpen: false,
      type: null,
      size: defaultSize,
      closable: defaultClosable,
    };

    setModal(modalState);
    onModalChange?.(modalState);
    modal.onClose?.();
  }, [defaultSize, defaultClosable, onModalChange, modal.onClose]);

  // Check if specific modal is open
  const isModalOpen = useCallback(
    (type: ModalState['type']) => {
      return modal.isOpen && modal.type === type;
    },
    [modal.isOpen, modal.type]
  );

  // Get modal title
  const getModalTitle = useCallback(
    (type: ModalState['type'], data?: any): string => {
      switch (type) {
        case 'create':
          return 'Create New Item';
        case 'edit':
          return `Edit ${data?.name || data?.title || 'Item'}`;
        case 'view':
          return `View ${data?.name || data?.title || 'Item'}`;
        case 'delete':
          return `Delete ${data?.name || data?.title || 'Item'}`;
        case 'bulk':
          return `Bulk Actions (${data?.length || 0} items)`;
        default:
          return 'Modal';
      }
    },
    []
  );

  return {
    modal,
    openCreateModal,
    openEditModal,
    openViewModal,
    openDeleteModal,
    openBulkModal,
    closeModal,
    isModalOpen,
    getModalTitle,
  };
};

