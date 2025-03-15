import {
  Navbar,
  Nav,
  Button,
  Container,
  Form,
  FormControl,
  ListGroup,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import { useEffect, useRef, useState } from "react";
import { authAPI, fetchAutocompleteMovies } from "/src/services/api";

export default function Navigation() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Check if user is logged in
  const isLoggedIn = authAPI.isLoggedIn();
  const currentUser = authAPI.getCurrentUser();

  // ✅ Fetch autocomplete suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim()) {
        setSuggestions([]);
        setShowDropdown(false); // ✅ Hide dropdown when query is empty
        return;
      }

      const results = await fetchAutocompleteMovies(query);
      console.log("🔍 Autocomplete Results in UI:", results);
      setSuggestions(results);
      setShowDropdown(results.length > 0); // ✅ Show dropdown if results exist
    };

    fetchSuggestions();
  }, [query]);

  // ✅ Modified to navigate directly to movie details page
  const handleSelect = (movie: any) => {
    // Navigate to movie details page with the movie ID
    navigate(`/reel-critic/details/${movie.id}`);
    
    // Clear search UI
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false); 
  };

  // ✅ Prevent default form submission on Enter key
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/reel-critic/search?query=${query}`);
      setSuggestions([]);
      setShowDropdown(false);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    authAPI.logout();
    navigate('/reel-critic/home');
    // Force a refresh to update the navigation
    window.location.reload();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Navbar bg="black" expand="lg" fixed="top" className="px-3 py-2">
      <Container fluid className="d-flex align-items-center">
        {/* Left-Aligned Brand Name */}
        <Navbar.Brand
          as={Link}
          to="/reel-critic"
          className="fw-bold text-uppercase text-light fs-1 me-2"
        >
          <span style={{ color: "white" }}>Reel</span>
          <span style={{ color: "red" }}>Critic</span>
        </Navbar.Brand>

        <Navbar.Toggle 
          aria-controls="navbar-nav" 
          className="ms-auto border-0 text-light" 
          children={<span className="navbar-toggler-icon"></span>}
        />
        <Navbar.Collapse id="navbar-nav">
          {/* Right-Aligned Navigation & Buttons */}
          <Nav className="ms-auto d-flex align-items-lg-center fs-5 gap-1 mt-2 mt-lg-0">
            <Nav.Link
              as={Link}
              to="/reel-critic/home"
              className="text-light mx-1 mx-lg-2 nav-item"
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/reel-critic/movies"
              className="text-light mx-1 mx-lg-2 nav-item"
            >
              Movies
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/reel-critic/tvshows"
              className="text-light mx-1 mx-lg-2 nav-item"
            >
              TV Shows
            </Nav.Link>
            
            <Nav.Link
              as={Link}
              to="/reel-critic/trending_movies"
              className="text-light mx-1 mx-lg-2 nav-item"
            >
              Trending
            </Nav.Link>

            {/* Enhanced Netflix-style Search Bar */}
            {/* Search Bar with Live Autocomplete */}
            <div className="search-container mx-lg-3 mx-0 my-2 my-lg-0 position-relative" ref={dropdownRef} style={{ outline: 'none' }}>
              <Form className="d-flex custom-search no-outline" onSubmit={handleSearch} style={{ outline: 'none', boxShadow: 'none' }}>
                <div className="search-wrapper" style={{ outline: 'none', boxShadow: 'none' }}>
                  <CiSearch className="search-icon" />
                  <FormControl
                    type="search"
                    placeholder="Search movies, TV shows..."
                    className="search-input no-outline search-input-no-outline"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setShowDropdown(true);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                    aria-label="Search movies and TV shows"
                    style={{ outline: 'none', boxShadow: 'none' }}
                  />
                </div>
              </Form>
              {/* ✅ Display autocomplete suggestions */}
              {showDropdown && suggestions.length > 0 && (
                <ListGroup className="netflix-search-dropdown" tabIndex="-1">
                  {suggestions.map((movie) => (
                    <ListGroup.Item
                      key={movie.id}
                      className="netflix-search-item"
                      onClick={() => handleSelect(movie)}
                      tabIndex="-1"
                    >
                      <div className="search-item-content">
                        <span className="movie-title">{movie.title}</span>
                        {movie.type && <span className="movie-type">({movie.type})</span>}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
            
            {/* Conditional rendering based on login status */}
            <div className="d-flex align-items-center gap-2 ms-lg-2 ms-0 flex-wrap flex-lg-nowrap justify-content-center">
              {isLoggedIn ? (
                <div className="d-flex flex-column flex-lg-row align-items-center gap-2">
                  <Nav.Link as={Link} to="/reel-critic/account/profile" className="px-2 w-100 w-lg-auto text-center">
                    <Button variant="outline-light" className="custom-login-btn w-100">
                      Profile
                    </Button>
                  </Nav.Link>
                  <Button variant="danger" className="custom-signup-btn w-100 w-lg-auto" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="d-flex flex-column flex-lg-row align-items-center gap-2">
                  <Nav.Link as={Link} to="/reel-critic/account/login" className="px-2 w-100 w-lg-auto text-center">
                    <Button variant="outline-light" className="custom-login-btn w-100">
                      Login
                    </Button>
                  </Nav.Link>
                  <Nav.Link as={Link} to="/reel-critic/account/register" className="px-2 w-100 w-lg-auto text-center">
                    <Button className="custom-signup-btn w-100">Sign Up</Button>
                  </Nav.Link>
                </div>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}