'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { WorkflowDetail, WorkflowMeta } from '@/types';

// Extended workflow data for preview (can be full detail or just meta)
export type PreviewWorkflow = WorkflowDetail | (WorkflowMeta & { workflow?: never });

interface WorkflowPreviewContextType {
  previewWorkflow: PreviewWorkflow | null;
  isOpen: boolean;
  openPreview: (workflow: PreviewWorkflow) => void;
  closePreview: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const WorkflowPreviewContext = createContext<WorkflowPreviewContextType | null>(
  null
);

export function WorkflowPreviewProvider({ children }: { children: ReactNode }) {
  const [previewWorkflow, setPreviewWorkflow] =
    useState<PreviewWorkflow | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openPreview = useCallback((workflow: PreviewWorkflow) => {
    setPreviewWorkflow(workflow);
    setIsOpen(true);
  }, []);

  const closePreview = useCallback(() => {
    setIsOpen(false);
    // Delay clearing workflow to allow exit animation
    setTimeout(() => setPreviewWorkflow(null), 200);
  }, []);

  return (
    <WorkflowPreviewContext.Provider
      value={{
        previewWorkflow,
        isOpen,
        openPreview,
        closePreview,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </WorkflowPreviewContext.Provider>
  );
}

export function useWorkflowPreview() {
  const context = useContext(WorkflowPreviewContext);
  if (!context) {
    throw new Error(
      'useWorkflowPreview must be used within a WorkflowPreviewProvider'
    );
  }
  return context;
}

export default WorkflowPreviewContext;
