import React, { useState } from 'react';
import { Card, Row, Col, Button, Image, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MessageSquare, ThumbsUp, Send } from 'lucide-react';
import { Review } from './MovieContext';
import { reviewAPI, commentAPI, userAPI, authAPI } from '../../../services/api';

interface ReviewItemProps {
  review: Review;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onReviewUpdated?: (updatedReview: Review) => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ 
  review, 
  isExpanded, 
  onToggleExpand,
  onReviewUpdated 
}) => {
  const navigate = useNavigate();
  const currentUser = authAPI.getCurrentUser();
  const isLoggedIn = authAPI.isLoggedIn();
  
  const [commentInput, setCommentInput] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Format date
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

  // Handle like functionality
  const handleLike = async () => {
    if (!isLoggedIn || !currentUser) {
      navigate('/reel-critic/account/login');
      return;
    }
    
    try {
      if (!review) return;
      
      // Make sure likes is an array
      const currentLikes = Array.isArray(review.likes) ? [...review.likes] : [];
      const isLiked = currentLikes.includes(currentUser.id);
      let updatedLikes;
      
      if (isLiked) {
        // Unlike
        updatedLikes = currentLikes.filter(id => id !== currentUser.id);
      } else {
        // Like
        updatedLikes = [...currentLikes, currentUser.id];
      }
      
      // Update the review
      const updatedReview = {
        ...review,
        likes: updatedLikes
      };
      
      const result = await reviewAPI.updateReview(review.id, updatedReview);
      
      // Call the callback to update the parent component
      if (onReviewUpdated && result) {
        onReviewUpdated(result);
      }
    } catch (err) {
      console.error('Error liking review:', err);
    }
  };

  // Toggle comments visibility
  const toggleComments = async () => {
    const newShowComments = !showComments;
    setShowComments(newShowComments);
    
    // Load comments if they're being shown and haven't been loaded yet
    if (newShowComments && comments.length === 0 && !isLoadingComments) {
      await loadComments();
    }
  };

  // Load comments for this review
  const loadComments = async () => {
    if (!review) return;
    
    setIsLoadingComments(true);
    try {
      const commentsData = await commentAPI.getCommentsByReviewId(review.id);
      
      if (commentsData && Array.isArray(commentsData)) {
        // Fetch user details for each comment
        const commentsWithUsers = await Promise.all(
          commentsData.map(async (comment) => {
            try {
              const user = await userAPI.getUserById(comment.userId);
              return {
                ...comment,
                user: {
                  name: user.name,
                  username: user.username,
                  profilePicture: user.profilePicture
                }
              };
            } catch (err) {
              console.error(`Error fetching user for comment ${comment.id}:`, err);
              return comment;
            }
          })
        );
        
        setComments(commentsWithUsers);
      }
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      setIsLoadingComments(false);
    }
  };

  // Handle comment submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn || !currentUser) {
      navigate('/reel-critic/account/login');
      return;
    }
    
    if (!commentInput.trim()) return;
    
    setIsSubmittingComment(true);
    try {
      // Create new comment
      const newComment = {
        reviewId: review.id,
        userId: currentUser.id,
        content: commentInput,
        date: new Date().toISOString().split('T')[0]
      };
      
      // Add comment to database
      const createdComment = await commentAPI.createComment(newComment);
      
      if (!createdComment || !createdComment.id) {
        throw new Error("Failed to create comment");
      }
      
      // Make sure comments is an array
      const currentComments = Array.isArray(review.comments) ? [...review.comments] : [];
      
      // Update review with new comment ID
      const updatedReview = {
        ...review,
        comments: [...currentComments, createdComment.id]
      };
      
      // Update review in database
      const result = await reviewAPI.updateReview(review.id, updatedReview);
      
      // Call the callback to update the parent component
      if (onReviewUpdated && result) {
        onReviewUpdated(result);
      }
      
      // Add the new comment to the local state
      const user = await userAPI.getUserById(currentUser.id);
      const commentWithUser = {
        ...createdComment,
        user: {
          name: user.name,
          username: user.username,
          profilePicture: user.profilePicture
        }
      };
      
      setComments(prev => [...prev, commentWithUser]);
      setCommentInput('');
      
      // Make sure comments are visible
      setShowComments(true);
    } catch (err) {
      console.error('Error submitting comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Check if the current user has liked this review
  const isLiked = currentUser && Array.isArray(review.likes) && review.likes.includes(currentUser.id);

  return (
    <Card className="mb-4 bg-dark text-light shadow-sm review-item">
      <Card.Body className="p-3 p-md-4">
        {/* User Info */}
        <Row className="align-items-center mb-3">
          <Col xs="auto" className="pe-0">
            <Link to={`/reel-critic/account/profile/${review.user?.id}`}>
              <Image
                src={review.user?.profilePicture || "https://via.placeholder.com/48"}
                alt={review.user?.name || "User"}
                roundedCircle
                width="40"
                height="40"
                className="d-block"
              />
            </Link>
          </Col>
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Link 
                  to={`/reel-critic/account/profile/${review.user?.id}`}
                  className="text-decoration-none text-light"
                >
                  <h6 className="mb-0 fw-bold fs-6">{review.user?.name || "Anonymous User"}</h6>
                  <small className="text-muted d-block d-md-inline">@{review.user?.username || "anonymous"}</small>
                </Link>
                <small className="text-muted d-block mt-1 mt-md-0">
                  {formatDate(review.date)}
                </small>
              </div>
            </div>
          </Col>
        </Row>
        
        {/* Rating */}
        <div className="d-flex align-items-center mb-3">
          <div className="me-2">{renderStars(review.rating)}</div>
          <span className="text-warning">{review.rating}/5</span>
        </div>
        
        {/* Review Content */}
        <p className={`mt-2 mb-3 ${!isExpanded && review.content.length > 200 ? 'text-truncate-3' : ''}`}>
          {review.content}
        </p>
        
        {review.content.length > 200 && (
          <Button 
            variant="link" 
            className="text-muted p-0 mb-3"
            onClick={onToggleExpand}
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </Button>
        )}
        
        {/* Action Buttons */}
        <div className="mt-3 d-flex flex-wrap gap-2 gap-md-4">
          <Button 
            variant={isLiked ? "outline-warning" : "outline-light"}
            size="sm"
            className="d-flex align-items-center gap-2"
            onClick={handleLike}
            disabled={!isLoggedIn}
          >
            <ThumbsUp size={16} fill={isLiked ? "#ffc107" : "none"} /> 
            {Array.isArray(review.likes) ? review.likes.length : 0}
          </Button>
          
          <Button 
            variant="outline-light"
            size="sm"
            className="d-flex align-items-center gap-2"
            onClick={toggleComments}
          >
            <MessageSquare size={16} /> 
            {Array.isArray(review.comments) ? review.comments.length : 0}
          </Button>
        </div>
        
        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-3 border-top border-secondary">
            <h6 className="mb-3">Comments ({Array.isArray(review.comments) ? review.comments.length : 0})</h6>
            
            {isLoadingComments ? (
              <p className="text-muted">Loading comments...</p>
            ) : comments.length > 0 ? (
              <div className="mb-3">
                {comments.map(comment => (
                  <div key={comment.id} className="d-flex mb-3">
                    <Image
                      src={comment.user?.profilePicture || "https://via.placeholder.com/32"}
                      alt={comment.user?.name || "User"}
                      roundedCircle
                      width="32"
                      height="32"
                      className="me-2 align-self-start"
                    />
                    <div className="comment-bubble bg-dark-secondary p-2 rounded flex-grow-1">
                      <div className="d-flex flex-column flex-md-row justify-content-between">
                        <small className="fw-bold comment-username">{comment.user?.name || "Anonymous"}</small>
                        <small className="text-muted comment-timestamp mt-1 mt-md-0">{formatDate(comment.date)}</small>
                      </div>
                      <p className="mb-0 small mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No comments yet. Be the first to comment!</p>
            )}
            
            {/* Comment Form */}
            {isLoggedIn ? (
              <Form className="d-flex mt-3" onSubmit={handleSubmitComment}>
                <Form.Control
                  type="text"
                  placeholder="Add a comment..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="comment-input bg-dark-secondary text-light border-secondary me-2"
                  disabled={isSubmittingComment}
                />
                <Button 
                  type="submit"
                  variant="outline-light"
                  disabled={!commentInput.trim() || isSubmittingComment}
                >
                  <Send size={16} />
                </Button>
              </Form>
            ) : (
              <p className="text-muted small mt-3">
                <Link to="/reel-critic/account/login" className="text-light">Log in</Link> to leave a comment.
              </p>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ReviewItem; 