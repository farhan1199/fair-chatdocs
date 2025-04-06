"use client";
import React, { useState } from "react";
import Link from "next/link";

const Page = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 rounded-lg">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left section with illustration */}
          <div className="w-full md:w-5/12 bg-[#1C17FF] text-white p-8 flex flex-col justify-center">
            <div className="mb-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">
              Chat with your documents
            </h2>
            <p className="opacity-80 mb-6">
              Get instant answers through an AI-powered conversational
              interface.
            </p>
            <div className="mt-auto">
              <div className="text-sm opacity-70">Powered by</div>
              <div className="font-bold text-lg">CHATDOCS</div>
              <div className="flex items-center mt-1 text-xs ">
                <span>developed by</span>
                <div
                  className="relative ml-1 flex items-center cursor-pointer group"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <span className="font-bold">F.A.I.R.</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>

                  {showTooltip && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white text-gray-800 p-2 rounded-md shadow-lg z-10 text-xs">
                      <div className="font-medium">F.A.I.R. stands for:</div>
                      <div>Farhan A.I. Research</div>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right section with content */}
          <div className="w-full md:w-7/12 p-8 md:p-12">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Welcome to F.A.I.R.
              </h1>
              <p className="text-gray-600 leading-relaxed">
                This lightweight application was developed by Farhan as a
                recreational project. It enables interactive engagement with the
                Employee Manual through an AI-powered conversational interface.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1C17FF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">
                    Get started quickly
                  </h3>
                  <p className="text-sm text-gray-600">
                    Access the Employee Manual directly through our
                    conversational interface.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1C17FF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">
                    Get instant answers
                  </h3>
                  <p className="text-sm text-gray-600">
                    Ask questions and get immediate responses based on the
                    manual's content.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/workspace/fc8d47ed-7556-4495-802e-8bb96ca9756e"
                className="inline-flex items-center justify-center bg-[#1C17FF] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#1914da] transition-colors duration-200 shadow-sm"
              >
                Chat with Employee Manual
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
