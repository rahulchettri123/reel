import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Badge, Modal } from 'react-bootstrap';
import { Heart, MessageCircle, Share2, MoreHorizontal, ThumbsUp, ExternalLink, Star, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { authAPI } from './mockAuth';
import { mockPosts, mockComments } from './mockData';
import { CreatePost } from '../../components/posts/CreatePost';
import './PostFeed.css';

interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  year: string;
  director: string;
  rating: number;
}

interface Post {
  id: string;
  userId: string;
  username: string;
  userProfilePicture: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  images?: string[];
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  isLiked: boolean;
  isFollowing: boolean;
  movie?: Movie;
}

interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
  return (
    <div className="movie-card">
      <Link to={`/reel-critic/details/${movie.id}`} className="movie-poster">
        <img src={movie.posterUrl} alt={movie.title} />
      </Link>
      <div className="movie-info">
        <h5 className="movie-title">
          <Link to={`/reel-critic/details/${movie.id}`}>
            {movie.title}
          </Link>
        </h5>
        <div className="movie-meta">
          <span className="movie-year">{movie.year}</span>
          <span className="movie-rating">
            <Star size={14} className="star-icon" />
            {movie.rating}
          </span>
        </div>
        <p className="movie-director">Dir: {movie.director}</p>
        <Link to={`/reel-critic/details/${movie.id}`}>
          <Button variant="outline-primary" size="sm" className="view-details-btn">
            View Details <ExternalLink size={14} />
          </Button>
        </Link>
      </div>
    </div>
  );
};

const PostCard: React.FC<{
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onFollow: (userId: string) => void;
}> = ({ post, onLike, onComment, onShare, onFollow }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandText, setExpandText] = useState(false);
  const currentUser = authAPI.getCurrentUser();
  
  // Determine if text is long enough to need expansion
  const isLongText = post.content.length > 300;
  const displayText = isLongText && !expandText 
    ? post.content.substring(0, 300) + '...' 
    : post.content;

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setComments(mockComments);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        userId: currentUser.id,
        username: currentUser.username,
        content: newComment,
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false
      };
      setComments(prev => [...prev, newCommentObj]);
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if post has any images (either uploaded or movie poster)
  const hasImages = (post.images && post.images.length > 0) || post.mediaUrl || (post.movie && post.movie.posterUrl);

  return (
    <Card className="post-card">
      <Card.Header className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <img
            src={post.userProfilePicture}
            alt={post.username}
            className="post-user-avatar"
          />
          <div>
            <div className="post-username">{post.username}</div>
            <div className="post-timestamp">
              {formatDate(post.createdAt)}
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          {!post.isFollowing && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => onFollow(post.userId)}
            >
              Follow
            </Button>
          )}
          <Button variant="link" className="p-0">
            <MoreHorizontal size={20} />
          </Button>
        </div>
      </Card.Header>

      <Card.Body>
        <Row>
          {/* Left Box - Images */}
          {hasImages ? (
            <Col xs={12} md={5} className="mb-3 mb-md-0">
              <div className="post-media-container">
                {/* Movie Image */}
                {post.movie && post.movie.posterUrl && (
                  <div className={`movie-poster-container ${(post.images && post.images.length > 0) || post.mediaUrl ? 'mb-3' : ''}`}>
                    <Link to={`/reel-critic/details/${post.movie.id}`}>
                      <img 
                        src={post.movie.posterUrl} 
                        alt={post.movie.title} 
                        className="img-fluid rounded movie-poster-image" 
                      />
                      <div className="movie-poster-overlay">
                        <div className="movie-poster-title">
                          {post.movie.title}
                          {post.movie.year && <span> ({post.movie.year})</span>}
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
                
                {/* Uploaded Images */}
                {post.images && post.images.length > 0 && (
                  <div className="uploaded-images-container">
                    {post.images.map((image, index) => (
                      <img 
                        key={index}
                        src={image} 
                        alt={`Post image ${index + 1}`} 
                        className="img-fluid rounded mb-2" 
                      />
                    ))}
                  </div>
                )}
                
                {/* Legacy Media URL */}
                {post.mediaUrl && post.mediaType === 'image' && (
                  <img 
                    src={post.mediaUrl} 
                    alt="Post content" 
                    className="img-fluid rounded" 
                  />
                )}
                
                {post.mediaUrl && post.mediaType === 'video' && (
                  <video 
                    src={post.mediaUrl} 
                    controls 
                    className="w-100 rounded" 
                  />
                )}
              </div>
            </Col>
          ) : (
            <Col xs={12} md={5} className="mb-3 mb-md-0">
              <div className="post-no-media">
                <div className="text-center p-4 bg-dark rounded">
                  <Film size={48} className="text-muted mb-2" />
                  <p className="text-muted">No images attached to this post</p>
                </div>
              </div>
            </Col>
          )}
          
          {/* Right Box - Content */}
          <Col xs={12} md={7}>
            <div className="post-content">
              <Card.Text>{displayText}</Card.Text>
              
              {isLongText && (
                <Button 
                  variant="link" 
                  className="p-0 text-primary" 
                  onClick={() => setExpandText(!expandText)}
                >
                  {expandText ? 'Show Less' : 'Read More'}
                </Button>
              )}
              
              {post.movie && !post.movie.posterUrl && (
                <div className="movie-reference mt-3">
                  <MovieCard movie={post.movie} />
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Card.Body>

      <Card.Footer>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex gap-3">
            <Button
              variant="link"
              className={`p-0 ${post.isLiked ? 'text-danger' : ''}`}
              onClick={() => onLike(post.id)}
            >
              <Heart size={20} />
              <span className="ms-1">{post.likes}</span>
            </Button>
            <Button
              variant="link"
              className="p-0"
              onClick={() => setShowComments(true)}
            >
              <MessageCircle size={20} />
              <span className="ms-1">{post.comments}</span>
            </Button>
            <Button
              variant="link"
              className="p-0"
              onClick={() => onShare(post.id)}
            >
              <Share2 size={20} />
              <span className="ms-1">{post.shares}</span>
            </Button>
          </div>
        </div>
      </Card.Footer>

      <Modal
        show={showComments}
        onHide={() => setShowComments(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Comments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="comments-list">
            {loading ? (
              <div className="text-center">Loading comments...</div>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="d-flex align-items-start gap-2">
                    <img
                      src={`https://randomuser.me/api/portraits/${comment.id % 2 === 0 ? 'women' : 'men'}/${comment.id.charCodeAt(0) % 100}.jpg`}
                      alt={comment.username}
                      className="comment-avatar"
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <span className="comment-username">{comment.username}</span>
                        <span className="comment-timestamp">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="comment-content">{comment.content}</p>
                      <div className="d-flex gap-2">
                        <Button
                          variant="link"
                          className={`p-0 ${comment.isLiked ? 'text-danger' : ''}`}
                          onClick={() => {/* TODO: Implement comment like */}}
                        >
                          <ThumbsUp size={16} />
                          <span className="ms-1">{comment.likes}</span>
                        </Button>
                        <Button
                          variant="link"
                          className="p-0"
                          onClick={() => {/* TODO: Implement comment reply */}}
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <form onSubmit={handleSubmitComment} className="w-100">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button type="submit" disabled={!newComment.trim()}>
                Post
              </Button>
            </div>
          </form>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

const PostFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedType, setFeedType] = useState<'following' | 'explore'>('explore');
  const isLoggedIn = authAPI.isLoggedIn();

  useEffect(() => {
    fetchPosts();
  }, [feedType]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setPosts(mockPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
            : post
        )
      );
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = (postId: string) => {
    // Handled in PostCard component
  };

  const handleShare = async (postId: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
      // Show success message
    } catch (err) {
      console.error('Error sharing post:', err);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setPosts(prev =>
        prev.map(post =>
          post.userId === userId ? { ...post, isFollowing: true } : post
        )
      );
    } catch (err) {
      console.error('Error following user:', err);
    }
  };

  const handleCreatePost = (postData: any) => {
    // Create a new post object
    const newPost: Post = {
      id: Date.now().toString(),
      userId: postData.userId,
      username: postData.userName,
      userProfilePicture: postData.userAvatar,
      content: postData.content,
      images: postData.images, // Add images from the form
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date().toISOString(),
      isLiked: false,
      isFollowing: true,
    };

    // Add movie data if provided
    if (postData.movieId) {
      newPost.movie = {
        id: postData.movieId,
        title: postData.movieTitle,
        posterUrl: postData.movieImage,
        year: postData.year || '2024',
        director: 'Unknown',
        rating: postData.rating || 0
      };
    }

    // Add the new post to the beginning of the posts array
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  return (
    <div className="posts-container">
      <CreatePost onSubmit={handleCreatePost} />
      
      {isLoggedIn && (
        <div className="feed-toggle">
          <Button
            variant={feedType === 'following' ? 'primary' : 'outline-primary'}
            onClick={() => setFeedType('following')}
          >
            Following
          </Button>
          <Button
            variant={feedType === 'explore' ? 'primary' : 'outline-primary'}
            onClick={() => setFeedType('explore')}
          >
            Explore
          </Button>
        </div>
      )}

      {loading ? (
        <div className="posts-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="posts-error">
          <p>Error loading posts. Please try again later.</p>
        </div>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              onFollow={handleFollow}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostFeed; 