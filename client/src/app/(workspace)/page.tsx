"use client";
import React, { useState } from "react";
import Link from "next/link";

const Page = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-full rounded-2xl bg-cover text-black">
      <div className="backdrop-blur-sm bg-white/30 border-dotted rounded-lg border-2 border-gray-300 p-1 sm:p-5 md:p-12 md:max-w-[90%]">
        <div className="flex items-center mb-10">
          <h1 className="text-sm sm:text-xl md:text-4xl font-medium sm:font-normal">
            Welcome to F.A.I.R.
          </h1>
          <div className="relative ml-2">
            <button
              className="text-xs md:text-sm text-gray-600 rounded-full bg-gray-200 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center hover:bg-gray-300 focus:outline-none"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
              aria-label="What does F.A.I.R. stand for?"
            >
              ?
            </button>
            {showTooltip && (
              <div className="absolute left-0 mt-2 w-48 md:w-64 bg-white p-2 rounded-md shadow-lg z-10 text-xs md:text-sm">
                <p className="font-medium">F.A.I.R. stands for:</p>
                <p className="text-gray-700">Farhan A.I. Research</p>
              </div>
            )}
          </div>
        </div>
        <p className="text-xs md:text-base text-gray-700 text-pretty">
          This lightweight application was developed by Farhan as a recreational
          project. It enables interactive engagement with the Employee Manual
          through an AI-powered conversational interface.
        </p>
        <div className="flex flex-row gap-5 items-center">
          <Link
            href="/workspace/fc8d47ed-7556-4495-802e-8bb96ca9756e"
            className="text-xs bg-[#1C17FF] p-2 px-4 rounded-md md:text-base text-white hover:opacity-65 focus:outline-none flex items-center justify-center mt-10"
          >
            Chat with Employee Manual
          </Link>
          <Link href="/workspace/new">
            <div className="text-xs md:text-base text-[#1C17FF] hover:opacity-65 focus:outline-none flex items-center justify-center mt-10">
              Create your own
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
