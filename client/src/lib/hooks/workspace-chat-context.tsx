// client/src/app/workspace-chat-context.tsx
import React, { createContext, useState, useEffect, useContext } from "react";

export interface Workspace {
  id: string;
  name: string;
  fileUrls: string[];
  createdAt: number;
  locked?: boolean;
  desc?: string;
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
    id: "Employee-Manual-38e8ef41-0b71-42d9-8e82-7479faf95234",
    name: "Employee Manual",
    createdAt: 1744040775759,
    fileUrls: [],
  },
  {
    id: "COLLECTIVE-BARGAINING-AGREEMENT-7eac42f4-db23-4cc1-ae6d-9fe33d4b9f56",
    name: "Collective Bargaining Agreement",
    createdAt: 1744120354959,
    fileUrls: [],
    desc: "Between 1199SEIU and LEAGUE of VOLUNTARY HOSPITALS & HOMES of NEW YORK",
  },
  {
    id: "1199-Constitution-3a50e2d7-56a5-4e57-a0a6-47abe6f529c2",
    name: "1199 Constitution",
    createdAt: 1744122380555,
    fileUrls: [],
    desc: "Chat with the 1199 Constiution",
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
