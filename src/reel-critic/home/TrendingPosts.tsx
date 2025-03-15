import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Button } from 'react-bootstrap';
import { TrendingUp, Star, ExternalLink, UserCheck, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { reviewAPI, userAPI, popularCriticAPI, User as UserType, Review } from '../../services/api';
import './TrendingPosts.css';

const TrendingPosts: React.FC = () => {
  const [trendingPosts, setTrendingPosts] = useState<Review[]>([]);
  const [topCritics, setTopCritics] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch reviews and sort by likes to get trending posts
        const reviews = await reviewAPI.getAll();
        const sortedPosts = [...reviews]
          .sort((a, b) => b.likes - a.likes)
          .slice(0, 5);
        setTrendingPosts(sortedPosts);
        
        // Fetch popular critics with user details
        const critics = await popularCriticAPI.getAllWithDetails();
        setTopCritics(critics.slice(0, 4));
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleFollowCritic = async (criticId: string) => {
    try {
      // Clean the ID to ensure it's in the correct format
      const cleanCriticId = criticId.replace(/\D/g, '');
      console.log('Following critic with ID:', cleanCriticId);
      
      await userAPI.toggleFollow(cleanCriticId);
      
      // Update the local state to reflect the change
      setTopCritics(prevCritics => 
        prevCritics.map(critic => 
          critic.id === criticId
            ? { 
                ...critic, 
                isFollowing: !critic.isFollowing, 
                followers: critic.isFollowing ? critic.followers - 1 : critic.followers + 1 
              }
            : critic
        )
      );
    } catch (err) {
      console.error('Error following critic:', err);
    }
  };

  if (loading) {
    return (
      <div className="trending-container">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trending-container">
        <div className="text-center py-5">
          <h3 className="text-danger">{error}</h3>
          <p>Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trending-container">
      <Card className="trending-card">
        <Card.Header className="trending-header">
          <TrendingUp size={18} />
          <span>Trending Movies</span>
        </Card.Header>
        <ListGroup variant="flush">
          {trendingPosts.map(post => (
            <ListGroup.Item key={post.id} className="trending-item">
              <div className="trending-movie">
                <Link to={`/reel-critic/details/${post.movieId}`} className="trending-poster">
                  {/* We'll need to fetch movie details separately */}
                  <img 
                    src={`https://image.tmdb.org/t/p/w500/${post.movieId}.jpg`} 
                    alt="Movie poster" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://placehold.co/150x225/lightgray/gray?text=No+Image';
                    }}
                  />
                </Link>
                <div className="trending-info">
                  <h6 className="trending-title">
                    <Link to={`/reel-critic/details/${post.movieId}`}>
                      {/* We'll display the review content as a preview */}
                      {post.content.length > 50 
                        ? post.content.substring(0, 50) + '...' 
                        : post.content}
                    </Link>
                  </h6>
                  <div className="trending-meta">
                    <span className="trending-rating">
                      <Star size={12} className="star-icon" />
                      {post.rating}
                    </span>
                  </div>
                  <div className="trending-stats">
                    <span>{post.likes} likes</span>
                    <span>{post.comments} comments</span>
                  </div>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Card.Footer className="trending-footer">
          <Link to="/movies" className="trending-more">
            Discover more movies <ExternalLink size={14} />
          </Link>
        </Card.Footer>
      </Card>

      <Card className="trending-card mt-4">
        <Card.Header className="trending-header">
          <User size={18} />
          <span>Popular Critics</span>
        </Card.Header>
        <ListGroup variant="flush">
          {topCritics.map(critic => (
            <ListGroup.Item key={critic.id} className="trending-item">
              <div className="trending-user">
                <Link to={`/reel-critic/account/profile/${critic.id.replace(/\D/g, '')}`} className="trending-avatar-link">
                  <img 
                    src={critic.profilePicture} 
                    alt={critic.username} 
                    className="trending-avatar"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://placehold.co/50x50/lightgray/gray?text=User';
                    }}
                  />
                </Link>
                <div className="trending-user-info">
                  <h6 className="trending-username">
                    <Link to={`/reel-critic/account/profile/${critic.id.replace(/\D/g, '')}`}>
                      {critic.username}
                    </Link>
                  </h6>
                  <div className="trending-user-stats">
                    <span>Movie Critic</span>
                    <span>{critic.followers} followers</span>
                  </div>
                </div>
                <Button 
                  variant={critic.isFollowing ? "primary" : "outline-primary"}
                  size="sm"
                  className="follow-btn"
                  onClick={() => handleFollowCritic(critic.id)}
                >
                  {critic.isFollowing ? (
                    <>
                      <UserCheck size={14} />
                      <span className="d-none d-md-inline ms-1">Following</span>
                    </>
                  ) : (
                    <>
                      <User size={14} />
                      <span className="d-none d-md-inline ms-1">Follow</span>
                    </>
                  )}
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Card.Footer className="trending-footer">
          <Link to="/home" className="trending-more">
            Discover more critics <ExternalLink size={14} />
          </Link>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default TrendingPosts; 