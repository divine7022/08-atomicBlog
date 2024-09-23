import { faker } from "@faker-js/faker";
import { createContext, useContext, useMemo, useState } from "react";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

// 1) CREATE A NEW CONTEXT(now we can pass the value into the context provider)
const PostContext = createContext();

function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  // coz we are memorize object we use useMemo()
  const value = useMemo(() => {
    return {
      posts: searchedPosts,
      onAddPost: handleAddPost,
      onClearPost: handleClearPosts,
      searchQuery, // it same as writing searchQuery : searchQuery
      setSearchQuery,
    };
  }, [searchQuery, searchedPosts]);

  return (
    // 2) PROVIDE VALUE TO CHILD COMPONENTS(i mean pass a value to a provider so that the value will be accessable)
    <PostContext.Provider value={value}>{children}</PostContext.Provider>
  );
}

// Always writing const { onAddPost } = useContext(PostContext); is a bit unknowing. so many developers follow this common pattern this days.[basically placing this context provider component(i,e <PostContext.Provider />) and then the corresponding hook all into the same file ]

function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined)
    throw new Error("PostContext was used outside of the PostProvider");
  return context;
}

// export { PostProvider, PostContext };
export { PostProvider, usePosts };
// with this basically we create an API for this context( insterd of exposing the context object itself we just create a function with which we can then access that ) [ basically we are encapsulating the data]
