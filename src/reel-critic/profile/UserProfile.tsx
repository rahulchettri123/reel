import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Nav, Tab } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Film, MessageCircle, Heart, UserCheck } from 'lucide-react';
import { userAPI, reviewAPI, Review } from '../../services/api';
import './profile.css';

interface ProfileUser {
  id: string;
  username: string;
  profilePicture: string;
  bio: string;
  followers: number;
  following: number;
  isFollowing: boolean;
  memberSince?: string;
  favoriteGenres?: string[];
  favoriteDirectors?: string[];
  reviewCount?: number;
}

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('reviews');

  // Create a memoized fetchUserProfile function
  const fetchUserProfile = useCallback(async () => {
    if (!userId) {
      console.log('No userId provided');
      setError('Invalid user ID');
      setLoading(false);
      return;
    }

    // Extract the numeric ID if it starts with "user"
    const cleanUserId = userId.startsWith('user') ? userId.substring(4) : userId;
    console.log('Fetching profile for userId:', cleanUserId);

    try {
      setLoading(true);
      setError(null);

      // Fetch user data from API
      const userData = await userAPI.getUserById(cleanUserId);
      console.log('Fetched user data:', userData);
      
      if (userData) {
        setUser({
          id: userData.id,
          username: userData.username,
          profilePicture: userData.profilePicture,
          bio: userData.bio,
          followers: userData.followers,
          following: userData.following,
          isFollowing: userData.isFollowing,
          memberSince: userData.memberSince,
          favoriteGenres: userData.favoriteGenres,
          favoriteDirectors: userData.favoriteDirectors,
          reviewCount: userData.reviewCount
        });
        
        // Fetch user reviews
        const reviews = await reviewAPI.getReviewsByUserId(cleanUserId);
        setUserReviews(reviews);
      } else {
        setError('User not found');
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch user data only once on mount
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Log when user data changes
  useEffect(() => {
    console.log('User data updated:', user);
  }, [user]);

  const handleFollow = useCallback(async () => {
    if (!user) return;
    
    try {
      await userAPI.toggleFollow(user.id);
      
      // Update local state
      setUser(prevUser => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          isFollowing: !prevUser.isFollowing,
          followers: prevUser.isFollowing ? prevUser.followers - 1 : prevUser.followers + 1
        };
      });
    } catch (err) {
      console.error('Error toggling follow status:', err);
    }
  }, [user]);

  const handleReturnHome = useCallback(() => {
    navigate('/reel-critic/home');
  }, [navigate]);

  if (loading) {
    return (
      <Container className="profile-container">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container className="profile-container">
        <div className="text-center py-5">
          <h3 className="text-danger">{error || 'User not found'}</h3>
          <p>The user profile you're looking for doesn't exist or couldn't be loaded.</p>
          <Button variant="primary" onClick={handleReturnHome}>
            Return to Home
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="profile-container">
      <Card className="profile-header">
        <div className="profile-cover"></div>
        <div className="profile-avatar-container">
          <img 
            src={user.profilePicture} 
            alt={user.username} 
            className="profile-avatar"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/150x150/lightgray/gray?text=User';
            }}
          />
        </div>
        <div className="profile-info">
          <h2 className="profile-username">{user.username}</h2>
          <p className="profile-bio">{user.bio}</p>
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{user.followers}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{user.following}</span>
              <span className="stat-label">Following</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{user.reviewCount || 0}</span>
              <span className="stat-label">Reviews</span>
            </div>
          </div>
          <div className="profile-actions">
            <Button 
              variant={user.isFollowing ? "primary" : "outline-primary"}
              className="follow-button"
              onClick={handleFollow}
            >
              {user.isFollowing ? (
                <>
                  <UserCheck size={18} />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <User size={18} />
                  <span>Follow</span>
                </>
              )}
            </Button>
            <Button variant="outline-secondary">
              <MessageCircle size={18} />
              <span>Message</span>
            </Button>
          </div>
        </div>
      </Card>

      <Tab.Container id="profile-tabs" defaultActiveKey="reviews">
        <Card className="profile-content">
          <Card.Header className="profile-tabs">
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="reviews">
                  <Film size={16} />
                  <span>Reviews</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="likes">
                  <Heart size={16} />
                  <span>Likes</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="about">
                  <User size={16} />
                  <span>About</span>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body>
            <Tab.Content>
              <Tab.Pane eventKey="reviews">
                <div className="user-reviews">
                  {userReviews.length > 0 ? (
                    userReviews.map(review => (
                      <Card key={review.id} className="review-card">
                        <Card.Body>
                          <h5 className="review-title">
                            <span>Movie Review</span>
                          </h5>
                          <p className="review-content">{review.content}</p>
                          {review.mediaUrl && (
                            <div className="review-media">
                              <img src={review.mediaUrl} alt="Review media" className="img-fluid rounded" />
                            </div>
                          )}
                          <div className="review-stats">
                            <span><Heart size={14} /> {review.likes} likes</span>
                            <span><MessageCircle size={14} /> {review.comments} comments</span>
                          </div>
                        </Card.Body>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p>No reviews yet.</p>
                    </div>
                  )}
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="likes">
                <div className="text-center py-4">
                  <p>Liked content will appear here.</p>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="about">
                <div className="about-section">
                  <h4>About {user.username}</h4>
                  <p>{user.bio}</p>
                  
                  {user.memberSince && (
                    <div className="about-item">
                      <h5>Member Since</h5>
                      <p>{user.memberSince}</p>
                    </div>
                  )}
                  
                  {user.favoriteGenres && user.favoriteGenres.length > 0 && (
                    <div className="about-item">
                      <h5>Favorite Genres</h5>
                      <div className="tags">
                        {user.favoriteGenres.map((genre, index) => (
                          <span key={index} className="tag">{genre}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {user.favoriteDirectors && user.favoriteDirectors.length > 0 && (
                    <div className="about-item">
                      <h5>Favorite Directors</h5>
                      <div className="tags">
                        {user.favoriteDirectors.map((director, index) => (
                          <span key={index} className="tag">{director}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>
    </Container>
  );
};

export { UserProfile }; 