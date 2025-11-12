"use client";

import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import PostCard from "../home/_home-feed";

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // 🔍 Fetch posts matching searchTerm
  const { data, isLoading } = api.post.searchPosts.useQuery(
    { query: searchTerm },
    { enabled: !!searchTerm }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(query.trim());
  };

  return (
    <main className="min-h-screen w-full bg-white dark:bg-black p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">Explore</h1>

      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        className="flex items-center justify-center gap-2 max-w-xl mx-auto mb-8"
      >
        <Input
          type="text"
          placeholder="Search posts by title or tag..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={!query.trim()}>
          Search
        </Button>
      </form>

      {/* Search results */}
      {isLoading && <p className="text-center">Searching...</p>}

      {!isLoading && searchTerm && (!data?.posts?.length ? (
        <p className="text-center text-gray-500">No results found for “{searchTerm}”.</p>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {data.posts.map((post) => (
            <PostCard href={post.mediaUrl} key={post.id} post={post} />
          ))}
        </div>
      ))}
    </main>
  );
}
