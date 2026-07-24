"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* 404 Text with gradient effect */}
        <div className="mb-6">
          <div className="text-8xl md:text-9xl font-bold text-primary mb-2 select-none">
            404
          </div>
          <div className="h-1 w-24 bg-primary rounded-full mx-auto mb-8" />
        </div>

        {/* Heading and description */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Page Not Found
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Looks like you`ve ventured into uncharted territory. The page you`re
          looking for doesn`t exist or has been moved.
        </p>

        {/* Decorative element */}
        <div className="mb-10">
          <div className="flex justify-center gap-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-primary/40" />
            <div className="w-2 h-2 rounded-full bg-primary/60" />
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full" size="lg">
              <Home className="size-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="size-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Footer message */}
        <p className="text-sm text-muted-foreground mt-10">
          If you think this is a mistake,{" "}
          <Link href="/" className="text-primary hover:underline font-medium">
            contact support
          </Link>
        </p>
      </div>
    </main>
  );
}
