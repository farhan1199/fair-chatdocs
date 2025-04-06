// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx

import { Message } from "ai";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/ui/codeblock";
import { MemoizedReactMarkdown } from "@/components/ui/markdown";
import { ChatMessageActions } from "@/components/chat/chat-message-actions";

export interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message, ...props }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "relative flex w-full",
        message.role === "user" ? "justify-end" : "justify-start"
      )}
      {...props}
    >
      <div
        className={cn(
          "flex max-w-[85%] md:max-w-[75%] overflow-hidden rounded-2xl px-4 py-3.5 shadow-sm",
          message.role === "user"
            ? "bg-[#1C17FF] text-white"
            : "bg-white border border-gray-100"
        )}
      >
        <div className="flex flex-col space-y-2 overflow-hidden">
          <div
            className={cn(
              "flex items-center space-x-2 text-xs",
              message.role === "user" ? "text-blue-100" : "text-gray-500"
            )}
          >
            <span className="font-semibold">
              {message.role === "user" ? "You" : "FAIR Assistant"}
            </span>
          </div>

          <div
            className={cn(
              "prose-sm max-w-none",
              message.role === "user" ? "text-white" : "text-gray-800"
            )}
          >
            <MemoizedReactMarkdown
              className="break-words prose-p:leading-relaxed prose-pre:p-0"
              remarkPlugins={[remarkGfm, remarkMath]}
              components={{
                p({ children }) {
                  return <p className="mb-2 last:mb-0">{children}</p>;
                },
                li({ children }) {
                  return <li className="mb-1">{children}</li>;
                },
                ul({ children }) {
                  return <ul className="list-disc pl-4 mb-2">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="list-decimal pl-4 mb-2">{children}</ol>;
                },
                a({ node, className, children, ...props }) {
                  return (
                    <a
                      className={cn(
                        "underline font-medium hover:text-opacity-80",
                        message.role === "user"
                          ? "text-blue-100"
                          : "text-blue-600"
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    >
                      {children}
                    </a>
                  );
                },
                code({ node, inline, className, children, ...props }) {
                  if (children.length) {
                    if (children[0] == "▍") {
                      return (
                        <span className="mt-1 cursor-default animate-pulse">
                          ▍
                        </span>
                      );
                    }

                    children[0] = (children[0] as string).replace("`▍`", "▍");
                  }

                  const match = /language-(\w+)/.exec(className || "");

                  if (inline) {
                    return (
                      <code
                        className={cn(
                          "px-1 py-0.5 rounded font-mono text-sm",
                          message.role === "user"
                            ? "bg-blue-700 text-white"
                            : "bg-gray-100 text-gray-800"
                        )}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }

                  return (
                    <div
                      className={
                        message.role === "user"
                          ? "bg-blue-700 rounded-md p-1 -mx-1"
                          : ""
                      }
                    >
                      <CodeBlock
                        key={Math.random()}
                        language={(match && match[1]) || ""}
                        value={String(children).replace(/\n$/, "")}
                        {...props}
                      />
                    </div>
                  );
                },
              }}
            >
              {message.content}
            </MemoizedReactMarkdown>
          </div>

          {message.role !== "user" && (
            <div className="flex justify-end pt-1">
              <ChatMessageActions message={message} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
