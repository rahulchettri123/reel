import { useState, useEffect } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Button, Badge } from "react-bootstrap";
import {  fetchAutocompleteMovies } from "../../../services/api";
import { BsArrowLeft, BsCalendar, BsStar, BsClock, BsGlobe } from "react-icons/bs";
import "./index.css";

interface Movie {
  id: string;
  title: string;
  poster: string | null;
  type?: string;
  averageRating?: string | null;
  contentRating?: string | null;
  description?: string | null;
  genres?: string[];
  releaseDate?: string | null;
  startYear?: number | null;
  runtimeMinutes?: number | null;
  languages?: string[];
  countriesOfOrigin?: string[];
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const query = searchParams.get("query") || "";
  const movieId = searchParams.get("id") || "";
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have a movie from navigation state
    if (location.state?.selectedMovie) {
      setSelectedMovie(location.state.selectedMovie);
      setMovies([]);
      return;
    }
    
    // If we have an ID, redirect to the movie details page
    if (movieId) {
      navigate(`/reel-critic/details/${movieId}`);
      return;
    }
    
    // If we have a search query, fetch search results
    if (query) {
      const fetchSearchResults = async () => {
        setLoading(true);
        setError(null);
        try {
          const results = await fetchAutocompleteMovies(query);
          setMovies(results);
          setSelectedMovie(null);
        } catch (err: any) {
          console.error("Failed to fetch search results:", err);
          setError("Failed to load search results. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      
      fetchSearchResults();
    }
  }, [query, movieId, location.state, navigate]);

  const handleMovieClick = (movie: Movie) => {
    // Navigate to movie details page with the movie ID
    navigate(`/reel-critic/details/${movie.id}`);
  };

  const handleBackToResults = () => {
    setSelectedMovie(null);
    if (query) {
      navigate(`/reel-critic/search?query=${query}`);
    } else {
      navigate(`/reel-critic/search`);
    }
  };

  const formatType = (type: string = "") => {
    if (type === "tvSeries" || type === "tvMiniSeries") return "TV Series";
    if (type === "tvEpisode") return "TV Episode";
    if (type === "videoGame") return "Video Game"; 
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 pt-5 text-center">
        <Spinner animation="border" variant="light" />
        <p className="text-light mt-3">Loading...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5 pt-5 text-center">
        <div className="error-message">
          <h3 className="text-danger">Error</h3>
          <p className="text-light">{error}</p>
          <Button variant="outline-light" onClick={() => navigate("/reel-critic/home")}>
            Return to Home
          </Button>
        </div>
      </Container>
    );
  }

  if (selectedMovie) {
    return (
      <Container className="mt-5 pt-5">
        <Button 
          variant="outline-light" 
          className="d-flex align-items-center gap-2 mb-4"
          onClick={handleBackToResults}
        >
          <BsArrowLeft /> Back to Results
        </Button>
        
        <Row>
          <Col md={4} className="mb-4">
            <div className="d-flex justify-content-center align-items-center bg-dark p-2 rounded shadow" 
                 style={{ maxWidth: '350px', margin: '0 auto', minHeight: '450px' }}>
              <div className="position-relative" style={{ width: '100%', textAlign: 'center' }}>
                <img 
                  src={selectedMovie.poster || "/no-image.png"} 
                  alt={selectedMovie.title}
                  className="img-fluid rounded" 
                  style={{ maxHeight: '500px', objectFit: 'contain' }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/no-image.png";
                  }}
                />
                {selectedMovie.averageRating && (
                  <Badge bg="dark" className="position-absolute bottom-0 end-0 m-2 p-2">
                    ⭐ {selectedMovie.averageRating}
                  </Badge>
                )}
                {selectedMovie.contentRating && (
                  <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
                    {selectedMovie.contentRating}
                  </Badge>
                )}
              </div>
            </div>
          </Col>
          <Col md={8}>
            <h1 className="fw-bold mb-3 text-light">
              {selectedMovie.title}
              {selectedMovie.startYear && (
                <span className="ms-2 text-secondary fw-normal">({selectedMovie.startYear})</span>
              )}
            </h1>
            
            <div className="d-flex align-items-center flex-wrap gap-3 mb-3">
              {selectedMovie.type && (
                <Badge bg="danger">{formatType(selectedMovie.type)}</Badge>
              )}
              {selectedMovie.runtimeMinutes && (
                <span className="text-secondary d-flex align-items-center gap-1">
                  <BsClock /> {selectedMovie.runtimeMinutes} min
                </span>
              )}
              {selectedMovie.releaseDate && (
                <span className="text-secondary d-flex align-items-center gap-1">
                  <BsCalendar /> {formatDate(selectedMovie.releaseDate)}
                </span>
              )}
              {selectedMovie.averageRating && (
                <span className="text-warning d-flex align-items-center gap-1">
                  <BsStar /> {selectedMovie.averageRating}/10
                </span>
              )}
            </div>
            
            {selectedMovie.genres && selectedMovie.genres.length > 0 && (
              <div className="mb-4">
                {selectedMovie.genres.map((genre, index) => (
                  <Badge bg="secondary" key={index} className="me-2 mb-2">{genre}</Badge>
                ))}
              </div>
            )}
            
            {selectedMovie.description && (
              <div className="mb-4">
                <h3 className="h5 fw-bold text-light">Overview</h3>
                <p className="text-light">{selectedMovie.description}</p>
              </div>
            )}
            
            {selectedMovie.languages && selectedMovie.languages.length > 0 && (
              <div className="mb-3">
                <h3 className="h5 fw-bold text-light">Languages</h3>
                <p className="text-secondary">
                  <BsGlobe className="me-2" />
                  {selectedMovie.languages.join(", ")}
                </p>
              </div>
            )}
            
            {selectedMovie.countriesOfOrigin && selectedMovie.countriesOfOrigin.length > 0 && (
              <div className="mb-3">
                <h3 className="h5 fw-bold text-light">Countries</h3>
                <p className="text-secondary">{selectedMovie.countriesOfOrigin.join(", ")}</p>
              </div>
            )}
            
            <div className="mt-4">
              <Button 
                variant="primary" 
                href={`https://www.imdb.com/title/${selectedMovie.id}`} 
                target="_blank"
                className="me-3"
              >
                View on IMDb
              </Button>
              <Button variant="outline-light">
                Add to Watchlist
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-5 pt-5">
      <h2 className="text-white text-center my-4">
        {query ? `Search Results for "${query}"` : "Popular Titles"}
      </h2>

      {movies.length === 0 ? (
        <p className="text-center text-light">
          {query ? "No results found." : "Try searching for movies or TV shows."}
        </p>
      ) : (
        <Row>
          {movies.map((movie) => (
            <Col key={movie.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card 
                className="bg-dark text-light movie-card"
                onClick={() => handleMovieClick(movie)}
              >
                <div className="image-container">
                  {movie.poster ? (
                    <Card.Img
                      variant="top"
                      src={movie.poster}
                      alt={movie.title}
                      className="fixed-height-image"
                      onError={(e) => (e.currentTarget.src = "/no-image.png")}
                    />
                  ) : (
                    <div className="no-image-container">
                      <p>No Image Available</p>
                    </div>
                  )}
                </div>
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{movie.averageRating ? `⭐ ${movie.averageRating}` : ''}</span>
                    {movie.type && (
                      <Badge bg="danger" pill>{formatType(movie.type)}</Badge>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}