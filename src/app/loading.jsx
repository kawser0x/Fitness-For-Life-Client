"use client";

import Image from "next/image";
import { FaDumbbell } from "react-icons/fa6";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 px-4">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-24 h-24 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
        <div className="absolute w-32 h-32 rounded-full border-4 border-blue-600/10 border-b-blue-600 animate-spin [animation-duration:1.5s]" />

        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-xl flex items-center justify-center animate-pulse">
          <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
            <Image
              src="/assets/logo.png"
              alt="Loading..."
              width={40}
              height={40}
              className="w-10 h-10 object-contain rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Text Indicator */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2 justify-center">
          <FaDumbbell className="h-4 w-4 text-cyan-400 animate-bounce" />
          FitnessForLife
        </h3>
        <p className="text-xs text-muted-foreground animate-pulse">
          Loading content, please wait...
        </p>
      </div>
    </div>
  );
}
