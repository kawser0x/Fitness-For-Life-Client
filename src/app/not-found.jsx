"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import Image from "next/image";
import logo from "../../public/assets/logo.png";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-16 bg-background">
      <div className="max-w-md w-full text-center flex flex-col items-center">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
        
            <div className="">
              <Image
                src={logo}
                alt="Logo"
                width={120}
                height={120}
                className="rounded-full"
              />
            </div>
          </div>
          <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-xs font-black bg-danger text-white uppercase tracking-wider">
            404
          </span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
           Route Not Found
        </h1>

        <p className="mt-3 text-sm text-foreground-500 leading-relaxed max-w-sm">
          Looks like you wandered off the plan. The page you are looking
          for doesn’t exist or has been moved.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link href="/">
            <Button
              color="primary"
              radius="full"
              className="font-semibold shadow-md shadow-primary/20">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
