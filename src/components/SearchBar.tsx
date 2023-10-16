import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { Post } from "../utils/types";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchTermRef = useRef(searchTerm);
  const timeoutId = useRef<any>(null);

  useEffect(() => {
    searchTermRef.current = searchTerm;
  }, [searchTerm]);

  useEffect(() => {
    const fetchPosts = async () => {
      const snapshot = await getDocs(collection(db, "posts"));
      const posts: Post[] = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Post)
      );
      setAllPosts(posts);
    };

    fetchPosts();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        searchTermRef.current !== ""
      ) {
        clearSearch();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (term: string) => {
    if (term) {
      const lowercaseTerm = term.toLowerCase();
      const filtered = allPosts.filter((post) =>
        post.title.toLowerCase().includes(lowercaseTerm)
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setResults([]);
  };

  return (
    <div className="search-container" ref={searchContainerRef}>
      <label htmlFor="search-input">Search:</label>
      <input
        className="search-input"
        id="search-input"
        type="text"
        value={searchTerm}
        placeholder="Search for posts..."
        onChange={(e) => {
          const newTerm = e.target.value;
          setSearchTerm(newTerm);
          if (timeoutId.current) {
            clearTimeout(timeoutId.current);
          }
          timeoutId.current = setTimeout(() => {
            handleSearch(newTerm);
          }, 500);
        }}
      />
      <div className="search-results">
        {results.length > 0
          ? results.map((post, index) => (
              <div
                key={post.id}
                className="search-result-item animate__animated animate__fadeInDown"
                style={{ animationDelay: `${index * 0.025}s` }}
              >
                <Link to={`/post/${post.id}`} onClick={clearSearch}>
                  {post.title}
                </Link>
              </div>
            ))
          : searchTerm && (
              <div className="no-results animate__animated animate__fadeIn">
                No results found!
              </div>
            )}
      </div>
    </div>
  );
};

export default SearchBar;
