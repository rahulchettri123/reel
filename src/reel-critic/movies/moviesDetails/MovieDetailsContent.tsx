import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useMovieContext } from './MovieContext';

const MovieDetailsContent: React.FC = () => {
  const { movie, loading, error } = useMovieContext();
  const navigate = useNavigate();
  const [localLoading, setLocalLoading] = useState(true);
  
  // Set a timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalLoading(false);
    }, 5000); // 5 seconds timeout
    
    return () => clearTimeout(timer);
  }, []);

  // Update localLoading when context loading changes
  useEffect(() => {
    if (!loading) {
      setLocalLoading(false);
    }
  }, [loading]);

  if (loading && localLoading) {
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <Spinner animation="border" variant="danger" />
        <p className="text-light mt-3">Loading movie details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">
          <h3>Error: {error}</h3>
          <p>There was a problem loading the movie details.</p>
        </Alert>
        <Button variant="primary" onClick={() => navigate(-1)}>Go Back</Button>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="warning">
          <h3>Movie not found</h3>
          <p>The requested movie could not be found.</p>
        </Alert>
        <Button variant="primary" onClick={() => navigate(-1)}>Go Back</Button>
      </Container>
    );
  }

  return (
    <Container className="movie-details-container py-4 py-md-5">
      <Button variant="outline-light" className="mb-3 mb-md-4" onClick={() => navigate(-1)}>
        ← Back
      </Button>
      
      <Row className="g-4">
        <Col xs={12} md={4} className="text-center text-md-start">
          <img 
            src={movie.primaryImage || "https://via.placeholder.com/300"}
            alt={movie.primaryTitle}
            className="movie-poster img-fluid rounded shadow"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "https://via.placeholder.com/300x450?text=No+Image";
            }}
          />
        </Col>
        <Col xs={12} md={8}>
          <h1 className="text-light mb-2 mb-md-3">{movie.primaryTitle}</h1>
          
          <div className="movie-meta mb-3 mb-md-4">
            {movie.averageRating > 0 && (
              <span className="badge bg-warning me-2 mb-2">
                ⭐ {movie.averageRating.toFixed(1)} ({movie.numVotes?.toLocaleString() || 0} votes)
              </span>
            )}
            {movie.contentRating && (
              <span className="badge bg-info me-2 mb-2">{movie.contentRating}</span>
            )}
            {movie.runtimeMinutes > 0 && (
              <span className="badge bg-secondary me-2 mb-2">{movie.runtimeMinutes} min</span>
            )}
            {movie.releaseDate && (
              <span className="badge bg-primary mb-2">{movie.releaseDate}</span>
            )}
          </div>

          {movie.description && (
            <p className="text-light mb-3 mb-md-4">{movie.description}</p>
          )}

          <div className="movie-details text-light">
            {movie.genres && movie.genres.length > 0 && movie.genres[0] !== "Unknown" && (
              <p><strong>Genres:</strong> {movie.genres.join(", ")}</p>
            )}
            {movie.interests && movie.interests.length > 0 && (
              <p><strong>Tags:</strong> {movie.interests.join(", ")}</p>
            )}
            {movie.filmingLocations && movie.filmingLocations.length > 0 && (
              <p><strong>Filming Locations:</strong> {movie.filmingLocations.join(", ")}</p>
            )}
            {movie.countriesOfOrigin && movie.countriesOfOrigin.length > 0 && (
              <p><strong>Countries of Origin:</strong> {movie.countriesOfOrigin.join(", ")}</p>
            )}
            {movie.budget > 0 && (
              <p><strong>Budget:</strong> ${(movie.budget / 1000000).toFixed(1)}M</p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MovieDetailsContent; 