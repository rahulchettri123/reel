import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Star } from 'lucide-react';
import { movieAPI } from '../../services/api';

interface FavoriteMoviesProps {
  userId: string;
  favorites?: string[] | number[] | null;
}

const FavoriteMovies: React.FC<FavoriteMoviesProps> = ({ userId, favorites }) => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      // Check if favorites exists and has items
      if (!favorites || !Array.isArray(favorites) || favorites.length === 0) {
        setMovies([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch movie details for each favorite
        const moviePromises = favorites.map(async (movieId) => {
          try {
            return await movieAPI.getMovieById(String(movieId));
          } catch (err) {
            console.error(`Error fetching movie ${movieId}:`, err);
            return null;
          }
        });
        
        const fetchedMovies = (await Promise.all(moviePromises)).filter(movie => movie !== null);
        
        setMovies(fetchedMovies);
      } catch (err) {
        console.error('Error fetching favorite movies:', err);
        setError('Failed to load favorite movies');
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteMovies();
  }, [favorites]); // Only re-run if favorites array changes

  if (loading) {
    return (
      <Card className="bg-dark text-light favorite-movies mb-4">
        <Card.Body className="text-center py-4">
          <Spinner animation="border" variant="danger" />
          <p className="mt-3">Loading favorite movies...</p>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-dark text-light favorite-movies mb-4">
        <Card.Body>
          <Alert variant="danger">{error}</Alert>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="bg-dark text-light favorite-movies mb-4">
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <h5 className="mb-0 me-2">Favorite Movies</h5>
          <Star size={16} className="text-warning" />
        </div>
        
        {movies.length === 0 ? (
          <p className="text-muted">No favorite movies added yet.</p>
        ) : (
          <Row xs={2} md={3} lg={4} className="g-3">
            {movies.map((movie) => (
              <Col key={movie.id}>
                <div className="favorite-movie-item">
                  <div className="movie-poster-container">
                    <img 
                      src={movie.posterUrl} 
                      alt={`${movie.title} poster`} 
                      className="movie-poster"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/150x225/lightgray/gray?text=No+Image';
                      }}
                    />
                  </div>
                  <div className="movie-info mt-2">
                    <p className="movie-title mb-0">{movie.title}</p>
                    <small className="text-muted">{movie.year}</small>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default FavoriteMovies; 