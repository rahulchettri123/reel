import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useMovieContext } from './MovieContext';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';
import { Review } from './MovieContext';
import { authAPI } from '../../../services/api';

const ReviewsSection: React.FC = () => {
  const { 
    movie,
    reviews: contextReviews, 
    loading, 
    error, 
    expandedReviews, 
    toggleReviewExpansion,
    updateReview 
  } = useMovieContext();
  const [localLoading, setLocalLoading] = useState(true);
  
  // Check if user is logged in
  const isLoggedIn = authAPI.isLoggedIn();
  
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

  // Handle review updates from ReviewItem component
  const handleReviewUpdated = (updatedReview: Review) => {
    // Update the review in the context
    updateReview(updatedReview);
  };

  // Handle new review submission
  const handleReviewSubmitted = () => {
    // Refresh the reviews list
    if (movie) {
      console.log('Review submitted, refreshing data...');
    }
  };

  if (loading && localLoading) {
    return (
      <div className="text-center py-3 py-md-4">
        <Spinner animation="border" variant="danger" />
        <p className="text-light mt-2">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-3 my-md-4">
        Error loading reviews: {error}
      </Alert>
    );
  }

  // If there are no reviews, show the review form directly
  if (!contextReviews || contextReviews.length === 0) {
    return (
      <Container className="py-3 py-md-4">
        <h3 className="text-light mb-3 mb-md-4">User Reviews</h3>
        
        {movie && isLoggedIn ? (
          <ReviewForm 
            movieId={movie.id} 
            onReviewSubmitted={handleReviewSubmitted} 
          />
        ) : (
          <Alert variant="secondary">
            <Alert.Heading>Want to leave a review?</Alert.Heading>
            <p>
              Please <a href="/reel-critic/account/login" className="alert-link">log in</a> to leave a review.
            </p>
          </Alert>
        )}
      </Container>
    );
  }

  return (
    <Container className="py-3 py-md-4">
      <h3 className="text-light mb-3 mb-md-4">User Reviews ({contextReviews.length})</h3>
      
      {/* Always show the review form for logged-in users */}
      {isLoggedIn && movie && (
        <div className="mb-4">
          <ReviewForm 
            movieId={movie.id} 
            onReviewSubmitted={handleReviewSubmitted} 
          />
        </div>
      )}
      
      {/* Show login prompt for non-logged in users */}
      {!isLoggedIn && movie && (
        <Alert variant="secondary" className="mb-4">
          <Alert.Heading>Want to leave a review?</Alert.Heading>
          <p>
            Please <a href="/reel-critic/account/login" className="alert-link">log in</a> to leave a review.
          </p>
        </Alert>
      )}
      
      {/* Divider between review form and existing reviews */}
      {contextReviews.length > 0 && (
        <div className="border-bottom border-secondary mb-4"></div>
      )}
      
      <Row>
        <Col xs={12}>
          {contextReviews.map(review => (
            <ReviewItem 
              key={review.id}
              review={review}
              isExpanded={expandedReviews.includes(review.id)}
              onToggleExpand={() => toggleReviewExpansion(review.id)}
              onReviewUpdated={handleReviewUpdated}
            />
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default ReviewsSection; 