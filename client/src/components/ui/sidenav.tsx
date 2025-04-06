import { useState } from "react";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { TbNotes } from "react-icons/tb";
import { FaRocket, FaPlus, FaLock } from "react-icons/fa";
import { usePathname } from "next/navigation";
import {
  useWorkspaceChatContext,
  Workspace,
} from "@/lib/hooks/workspace-chat-context";
import { SkeletonLoader } from "./skeleton-loader";
import { Tooltip } from "./tooltip";

const Sidenav: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { workspaces } = useWorkspaceChatContext();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const sortedChats = workspaces
    .slice()
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt));

  return (
    <div className="flex flex-row w-fit !overflow-x-visible z-[100]">
      <div
        className={`bg-gradient-to-b from-white to-gray-50 p-4 transition-all duration-500 ease-in-out border-r border-gray-200 shadow-md !overflow-x-visible 
        ${isCollapsed ? "w-16 max-w-[470px]" : "max-w-[470px] w-[300px]"} 
        overflow-y-scroll no-scrollbar`}
      >
        <div
          className={`flex mb-8 ${isCollapsed ? "flex-col gap-2" : "flex-col"}`}
        >
          <div
            className={`flex items-center min-w-fit text-black no-underline rounded-lg 
            ${isCollapsed ? "justify-center" : "justify-start"}`}
          >
            <Link
              href={"/"}
              className={`bg-white hover:bg-blue-50 hover:text-[#1C17FF] 
              transition-all duration-300 justify-center items-center py-3 px-3 rounded-lg flex
              shadow-sm border border-gray-100`}
            >
              <FaRocket
                className={`${isCollapsed ? "" : "mr-2"} text-[#1C17FF]`}
              />
              <span
                className={`${isCollapsed ? "hidden" : "inline font-semibold tracking-wide"}`}
              >
                CHATDOCS
              </span>
            </Link>
          </div>
          {!isCollapsed && (
            <div className="text-xs text-gray-500 ml-1 mt-2 flex items-center">
              <div className="h-0.5 w-3 bg-gray-300 rounded mr-2"></div>
              developed by F.A.I.R.
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div className="mb-3 ml-1">
            <h2 className="text-xs uppercase font-medium text-gray-500 tracking-wider">
              Workspaces
            </h2>
          </div>
        )}

        <ul className="!overflow-visible space-y-2">
          {workspaces.length === 0 ? (
            <SkeletonLoader />
          ) : (
            <>
              {sortedChats.map((workspace: Workspace) => {
                if (!workspace) return null;
                return (
                  <SidenavItem
                    key={workspace.id}
                    title={workspace.name}
                    href={`/workspace/${workspace.id}`}
                    isActive={isActive(`/workspace/${workspace.id}`)}
                    isCollapsed={isCollapsed}
                    locked={workspace.locked}
                  />
                );
              })}
            </>
          )}
          {/* <li className="mt-6">
            <SidenavItem
              title="Create Workspace"
              href="/workspace/new"
              isActive={isActive("/workspace/new")}
              isCollapsed={isCollapsed}
              icon={
                <FaPlus
                  className={`${isCollapsed ? "" : "scale-75"} ${isActive("/workspace/new") ? "text-white" : "text-[#1C17FF]"}`}
                />
              }
              animatedBorder
            />
          </li> */}
        </ul>
      </div>
      <button
        onClick={toggleSidebar}
        className="relative mb-4 w-8 h-8 my-4 ml-2 rounded-full hover:bg-slate-50 flex z-0
        justify-center items-center bg-white border border-gray-100 text-xl cursor-pointer shadow-sm"
        aria-expanded={!isCollapsed}
      >
        <div className="text-gray-600">
          {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </div>
      </button>
    </div>
  );
};

interface SidenavItemProps {
  title: string;
  href: string;
  isActive: boolean;
  isCollapsed: boolean;
  icon?: React.ReactNode;
  locked?: boolean;
  animatedBorder?: boolean;
}

const SidenavItem: React.FC<SidenavItemProps> = ({
  title,
  href,
  isActive,
  isCollapsed,
  icon,
  locked,
  animatedBorder,
}) => {
  return (
    <li>
      {isCollapsed ? (
        <Tooltip
          text={
            <span>
              {title}
              {locked && <span className="ml-2">(Read-Only)</span>}
            </span>
          }
        >
          <Link
            href={href}
            className={`flex items-center text-gray-800 no-underline rounded-lg mb-1 
            ${
              isActive
                ? "bg-[#1C17FF] text-white shadow-md transition-colors duration-0"
                : "hover:bg-gray-100 hover:text-gray-900 bg-white border border-gray-100"
            } transition-all duration-100 justify-center py-3 ${animatedBorder ? "border-glow" : ""}`}
          >
            <div className="relative">
              {icon || (
                <TbNotes
                  className={`${isActive ? "text-white" : "text-gray-600"}`}
                />
              )}
              {locked && (
                <span className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 scale-75 text-yellow-500">
                  <FaLock />
                </span>
              )}
            </div>
          </Link>
        </Tooltip>
      ) : (
        <Link
          href={href}
          className={`flex items-center text-gray-800 no-underline rounded-lg mb-1 
          ${
            isActive
              ? "bg-[#1C17FF] text-white shadow-md transition-colors duration-0"
              : "hover:bg-blue-50 hover:text-[#1C17FF] bg-white border border-gray-100"
          } transition-all duration-100 justify-start px-4 py-3 ${animatedBorder ? "border-glow" : ""}`}
        >
          {<div className="mr-3">{icon}</div> || (
            <TbNotes
              className={`mr-3 ${isActive ? "text-white" : "text-gray-600"}`}
            />
          )}
          <span className={`truncate ${isActive ? "" : "font-medium"}`}>
            {title}
          </span>
          {locked && (
            <span className="ml-2 scale-75 text-yellow-500">
              <Tooltip text={<span className="">Read-Only</span>}>
                <FaLock />
              </Tooltip>
            </span>
          )}
        </Link>
      )}
    </li>
  );
};

export default Sidenav;
