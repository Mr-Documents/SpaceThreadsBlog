import React from "react";

export default function PostSkeleton() {
  return (
    <article className="w-full rounded-md bg-gray-800 border border-gray-800 p-4 animate-pulse">
      <div className="h-40 bg-gray-700 rounded mb-3" />
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-700 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-700 rounded w-2/3" />
    </article>
  );
}
