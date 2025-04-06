// client/src/app/workspace-chat-context.tsx
import React, { createContext, useState, useEffect, useContext } from "react";

export interface Workspace {
  id: string;
  name: string;
  fileUrls: string[];
  createdAt: number;
  locked?: boolean;
}

export interface WorkspaceChatContextValue {
  workspaces: Workspace[];
  addWorkspace: (workspace: Workspace) => void;
  removeWorkspace: (workspaceId: string) => void;
}

const defaultValue: WorkspaceChatContextValue = {
  workspaces: [],
  addWorkspace: () => {},
  removeWorkspace: () => {},
};

export const WorkspaceChatContext =
  createContext<WorkspaceChatContextValue>(defaultValue);
export const useWorkspaceChatContext = () => useContext(WorkspaceChatContext);

const defaultWorkspaces: Workspace[] = [
  {
    id: "fc8d47ed-7556-4495-802e-8bb96ca9756e",
    name: "Employee Manual",
    createdAt: 1743861424667,
    fileUrls: [],
  },
];

export const WorkspaceChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  useEffect(() => {
    const storedWorkspaces = localStorage.getItem("workspaces");
    if (storedWorkspaces) {
      const parsedWorkspaces: Workspace[] = JSON.parse(storedWorkspaces);
      const updatedWorkspaces = defaultWorkspaces.map((defaultWorkspace) => {
        const existingWorkspace = parsedWorkspaces.find(
          (workspace) => workspace.id === defaultWorkspace.id
        );
        return existingWorkspace
          ? { ...existingWorkspace, ...defaultWorkspace }
          : defaultWorkspace;
      });
      const nonDefaultWorkspaces = parsedWorkspaces.filter(
        (workspace) =>
          !defaultWorkspaces.some(
            (defaultWorkspace) => defaultWorkspace.id === workspace.id
          )
      );
      setWorkspaces([...updatedWorkspaces, ...nonDefaultWorkspaces]);
    } else {
      setWorkspaces(defaultWorkspaces);
      localStorage.setItem("workspaces", JSON.stringify(defaultWorkspaces));
    }
  }, []);

  const addWorkspace = (workspace: Workspace) => {
    const updatedWorkspaces = [
      ...workspaces,
      { ...workspace, createdAt: Date.now() },
    ];
    setWorkspaces(updatedWorkspaces);
    localStorage.setItem("workspaces", JSON.stringify(updatedWorkspaces));
  };

  const removeWorkspace = (workspaceId: string) => {
    const updatedWorkspaces = workspaces.filter(
      (workspace) => workspace.id !== workspaceId
    );
    setWorkspaces(updatedWorkspaces);
    localStorage.setItem("workspaces", JSON.stringify(updatedWorkspaces));
  };

  return (
    <WorkspaceChatContext.Provider
      value={{ workspaces, addWorkspace, removeWorkspace }}
    >
      {children}
    </WorkspaceChatContext.Provider>
  );
};
