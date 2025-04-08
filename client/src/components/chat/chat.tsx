"use client";
import { useChat } from "ai/react";
import { ChatMessage } from "./chat-message";
import UploadButton from "../ui/upload-button";
import { Workspace } from "@/lib/hooks/workspace-chat-context";
import { PromptGrid } from "../ui/prompt-grid";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { Tooltip } from "../ui/tooltip";

import {
  FiChevronLeft,
  FiChevronRight,
  FiSend,
  FiPaperclip,
} from "react-icons/fi";

export default function Chat({ workspace }: { workspace: Workspace }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      body: { namespaceId: workspace.id },
    });

  // setPrompts is unused in this example, but imagine generating prompts based on the workspace content... :-)
  const [prompts, setPrompts] = useState<Prompt[]>([
    {
      id: "1",
      name: `Tell me about the content in the \"${workspace.name}\" workspace`,
      description: "",
      content: `Tell me about the content in the \"${workspace.name}\" workspace`,
      folderId: null,
    },
    {
      id: "2",
      name: `Give me some quotes about \"${workspace.name}\" from the content.`,
      description: "",
      content: `Give me some quotes about \"${workspace.name}\" from the content.`,
      folderId: null,
    },
    {
      id: "3",
      name: `Write me an essay about \"${workspace.name}\" from the content.`,
      description: "",
      content: `Write me an essay about \"${workspace.name}\" from the content.`,
      folderId: null,
    },
    {
      id: "4",
      name: `Tell me something I might not know about \"${workspace.name}\"`,
      description: "",
      content: `Tell me something I might not know about \"${workspace.name}\"`,
      folderId: null,
    },
  ]);

  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handlePromptSubmit = (prompt: Prompt) => {
    handleInputChange({
      target: { value: prompt.content },
    } as ChangeEvent<HTMLInputElement>);
    setShouldSubmit(true);
  };

  useEffect(() => {
    if (shouldSubmit) {
      const form = document.querySelector("form");
      if (form) {
        form.dispatchEvent(new Event("submit", { cancelable: true }));
        form.requestSubmit();
        setShouldSubmit(false);
      }
    }
  }, [shouldSubmit]);

  const [documentTrayIsOpen, setDocumentTrayIsOpen] = useState(false);

  const toggleOpen = () => {
    setDocumentTrayIsOpen(!documentTrayIsOpen);
  };

  return (
    <div className="relative flex flex-col w-full h-full py-8 mx-auto px-4 bg-gradient-to-b from-blue-100 to-blue-50 rounded-lg shadow-sm">
      <div className="mb-6 pl-2">
        <h2 className="text-xl font-semibold text-gray-800">
          {workspace.name}
        </h2>
        <p className="text-sm text-gray-500">
          {workspace.desc ? workspace.desc : "Chatting with your documents"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4 rounded-lg bg-white/80 backdrop-blur-sm shadow-inner overflow-x-hidden">
        {messages.length > 0 ? (
          <div className="space-y-6 ">
            {messages.map((m) => (
              <div key={m.id} className="whitespace-pre-wrap">
                <ChatMessage key={m.id} message={m} />
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center flex-col">
            <div className="bg-blue-50 rounded-full p-6 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1C17FF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Start a conversation
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-md">
              Ask questions about your documents in this workspace. The AI will
              use these documents to provide answers.
            </p>
          </div>
        )}
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="flex space-x-2">
              <div className="animate-bounce bg-[#1C17FF] h-2 w-2 rounded-full delay-0"></div>
              <div className="animate-bounce bg-[#1C17FF] h-2 w-2 rounded-full delay-150"></div>
              <div className="animate-bounce bg-[#1C17FF] h-2 w-2 rounded-full delay-300"></div>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}
        className="mt-6 relative"
      >
        <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-[#1C17FF] focus-within:ring-opacity-50">
          <textarea
            className="p-4 flex-grow bg-transparent text-black outline-none resize-none min-h-[60px] max-h-[200px]"
            value={input}
            placeholder={
              isLoading
                ? "Responding..."
                : "Ask a question about your documents..."
            }
            disabled={isLoading}
            onChange={handleInputChange}
            onKeyDown={(e: any) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            rows={1}
            ref={(textarea) => {
              if (textarea) {
                textarea.style.height = "auto";
                textarea.style.height = `${Math.min(textarea.scrollHeight, window.innerHeight * 0.3)}px`;
                if (!isFocused) {
                  textarea.focus();
                  setIsFocused(true);
                }
              }
            }}
          />
          <div className="flex items-center pr-4 space-x-2">
            {/* <button
              type="button"
              onClick={toggleOpen}
              className="text-gray-500 hover:text-[#1C17FF] p-2 rounded-full transition-colors"
            >
              <FiPaperclip className="h-5 w-5" />
            </button> */}
            <button
              type="submit"
              disabled={isLoading || input.trim() === ""}
              className={`p-2 rounded-full ${
                isLoading || input.trim() === ""
                  ? "bg-gray-100 text-gray-400"
                  : "bg-[#1C17FF] text-white hover:bg-[#1914da]"
              } transition-colors`}
            >
              <FiSend className="h-5 w-5" />
            </button>
          </div>
        </div>

        {documentTrayIsOpen && (
          <div className="absolute bottom-full mb-4 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4 space-y-3 max-h-[300px] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-800">Workspace Documents</h3>
              <button
                onClick={toggleOpen}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
