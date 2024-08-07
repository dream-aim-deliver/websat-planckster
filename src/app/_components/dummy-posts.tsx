"use client";
import { useEffect, useState } from "react";
import { api as vanilla } from "~/lib/infrastructure/client/trpc/vanilla-api";

export default function DummyPosts() {
  const [greeting, setGreeting] = useState<string>("");
  useEffect(() => {
    vanilla.post.hello
      .query({ text: "world" })
      .then((res) => {
        setGreeting(res.greeting);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  const handleCreatePost = async () => {
    const createPostResponse = await vanilla.post.create.mutate({
      name: "Hello Again, world!",
    });
    console.log(createPostResponse);
  };
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-4xl font-bold">Posts</h1>
      <pre>{greeting}</pre>
      <button
        className={[
          "p-4",
          "rounded-md",
          "bg-blue-500",
          "text-white",
          "font-bold",
          "transition",
          "hover:bg-blue-700",
        ].join(" ")}
        onClick={handleCreatePost}
      >
        Create Post
      </button>
    </div>
  );
}
