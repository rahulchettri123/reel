import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Star, Calendar, ThumbsUp, MessageSquare } from 'lucide-react';
import { reviewAPI, movieAPI } from '../../services/api';

interface UserReviewsProps {
  userId: string;
}

const UserReviews: React.FC<UserReviewsProps> = ({ userId }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        
        // Clean the ID to ensure it's in the correct format
        const cleanUserId = userId.replace(/\D/g, '');
        console.log('Fetching reviews for user with ID:', cleanUserId);
        
        // Fetch reviews by user ID
        const userReviews = await reviewAPI.getReviewsByUserId(cleanUserId);
        
        // Fetch movie details for each review
        const reviewsWithMovies = await Promise.all(
          userReviews.map(async (review: any) => {
            try {
              const movie = await movieAPI.getMovieById(review.movieId);
              return {
                ...review,
                movieTitle: movie.title,
                moviePosterUrl: movie.posterUrl
              };
            } catch (err) {
              console.error(`Error fetching movie ${review.movieId}:`, err);
              return {
                ...review,
                movieTitle: 'Unknown Movie',
                moviePosterUrl: 'https://placehold.co/150x225/lightgray/gray?text=No+Image'
              };
            }
          })
        );
        
        // Sort reviews by date (newest first)
        const sortedReviews = reviewsWithMovies.sort((a: any, b: any) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        setReviews(sortedReviews);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews');
        setLoading(false);
      }
    };

    if (userId) {
      fetchReviews();
    }
  }, [userId]);

  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId) 
        : [...prev, reviewId]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Generate star rating display
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={16} 
          fill={i <= rating ? "#ffc107" : "none"} 
          color="#ffc107" 
          className="me-1"
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <Card className="bg-dark text-light user-reviews mb-4">
        <Card.Body className="text-center py-5">
          <Spinner animation="border" variant="danger" />
          <p className="mt-3">Loading reviews...</p>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-dark text-light user-reviews mb-4">
        <Card.Body>
          <Alert variant="danger">{error}</Alert>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="bg-dark text-light user-reviews mb-4">
      <Card.Body>
        <h5 className="mb-3">Reviews</h5>
        
        {reviews.length === 0 ? (
          <p className="text-muted">No reviews yet.</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => {
              const isExpanded = expandedReviews.includes(review.id);
              
              return (
                <Card key={review.id} className="review-card mb-3 bg-dark-secondary border-secondary">
                  <Card.Body>
                    <Row>
                      <Col xs={3} md={2}>
                        <img 
                          src={review.moviePosterUrl} 
                          alt={`${review.movieTitle} poster`} 
                          className="review-movie-poster"
                        />
                      </Col>
                      <Col xs={9} md={10}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-0">{review.movieTitle}</h6>
                          <div className="d-flex">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        
                        <p className={`review-content mb-2 ${isExpanded ? '' : 'review-truncated'}`}>
                          {review.content}
                        </p>
                        
                        {review.content.length > 150 && (
                          <button 
                            className="btn btn-link btn-sm text-muted p-0 mb-2"
                            onClick={() => toggleReviewExpansion(review.id)}
                          >
                            {isExpanded ? 'Show less' : 'Read more'}
                          </button>
                        )}
                        
                        <div className="d-flex align-items-center text-muted review-meta">
                          <Calendar size={14} className="me-1" />
                          <small className="me-3">{formatDate(review.date)}</small>
                          
                          <ThumbsUp size={14} className="me-1" />
                          <small className="me-3">{review.likes?.length || 0}</small>
                          
                          <MessageSquare size={14} className="me-1" />
                          <small>{review.comments?.length || 0}</small>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        )}
        
        {reviews.length > 5 && (
          <div className="text-center mt-3">
            <button className="btn btn-outline-light btn-sm">View All Reviews</button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default UserReviews; 