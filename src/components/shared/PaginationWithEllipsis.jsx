"use client";

import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function PaginationWithEllipsis({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];

    pages.push(1);

    if (page > 3) {
      pages.push("ellipsis-1");
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }

    if (page < totalPages - 2) {
      pages.push("ellipsis-2");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 pt-8">
      {/* Previous Button */}
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(Math.max(page - 1, 1))}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-extrabold bg-card border border-border text-foreground hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm">
        <FaChevronLeft className="h-3 w-3" />
        <span>Previous</span>
      </button>

      {/* Page Numbers & Ellipsis */}
      <div className="flex items-center gap-1.5">
        {getPageNumbers().map((p, i) =>
          typeof p === "string" && p.startsWith("ellipsis") ? (
            <span key={`ellipsis-${i}`} className="px-2.5 text-xs font-black text-muted-foreground select-none">
              •••
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 rounded-2xl text-xs font-black transition-all shadow-sm ${
                p === page
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-500/50 scale-105"
                  : "bg-card border border-border text-foreground hover:bg-accent hover:border-cyan-500/40"
              }`}>
              {p}
            </button>
          )
        )}
      </div>

      {/* Next Button */}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(Math.min(page + 1, totalPages))}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-extrabold bg-card border border-border text-foreground hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm">
        <span>Next</span>
        <FaChevronRight className="h-3 w-3" />
      </button>
    </div>
  );
}
