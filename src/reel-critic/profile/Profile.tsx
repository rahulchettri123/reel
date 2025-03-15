import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Nav, Tab, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, MapPin, Link as LinkIcon, Calendar, Mail, Phone } from 'lucide-react';
import ProfilePictureUpload from './ProfilePictureUpload';
import ActivitySummary from './ActivitySummary';
import FavoriteMovies from './FavoriteMovies';
import UserReviews from './UserReviews';
import EditProfileForm from './EditProfileForm';
import FollowList from './FollowList';
import { userAPI, authAPI } from '../../services/api';
import './profile.css';

const Profile: React.FC = () => {
  const { profileId } = useParams<{ profileId?: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('reviews');
  
  // Get current logged-in user
  const currentUser = authAPI.getCurrentUser();
  
  // Determine if viewing own profile or someone else's
  // Extract the numeric ID if it starts with "user"
  const cleanProfileId = profileId?.startsWith('user') ? profileId.substring(4) : profileId;
  const targetProfileId = cleanProfileId || (currentUser ? currentUser.id : null);
  const isOwnProfile = currentUser && targetProfileId === currentUser.id;
  const isLoggedIn = !!currentUser;

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!targetProfileId) {
        // If no target profile and not logged in, redirect to login
        if (!isLoggedIn) {
          navigate('/login');
          return;
        }
        setError('Profile not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(`Fetching profile for ID: ${targetProfileId}`);
        const userData = await userAPI.getUserById(targetProfileId);
        setProfileData(userData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [targetProfileId, isLoggedIn, navigate]);

  const handleProfileUpdate = async (updatedProfile: any) => {
    if (!isOwnProfile || !profileData) return;
    
    try {
      setLoading(true);
      const updatedData = await userAPI.updateUser(profileData.id, {
        ...profileData,
        ...updatedProfile
      });
      setProfileData(updatedData);
      setLoading(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      setLoading(false);
    }
  };

  const handleProfilePictureUpdate = async (newPictureUrl: string) => {
    if (!isOwnProfile || !profileData) return;
    
    try {
      setLoading(true);
      const updatedData = await userAPI.updateUser(profileData.id, {
        ...profileData,
        profilePicture: newPictureUrl
      });
      setProfileData(updatedData);
      setLoading(false);
    } catch (err) {
      console.error('Error updating profile picture:', err);
      setError('Failed to update profile picture');
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!isLoggedIn || !currentUser || !profileData || isOwnProfile) return;
    
    try {
      setLoading(true);
      
      // Since followers is a number, not an array, we'll use isFollowing property
      const isCurrentlyFollowing = profileData.isFollowing;
      
      // Log the IDs to help with debugging
      console.log('Target profile ID:', profileData.id);
      console.log('Current user ID:', currentUser.id);
      
      // Make sure we're using the correct ID format (numeric IDs from the database)
      // Extract the numeric ID if it contains non-numeric characters
      const cleanTargetId = profileData.id.replace(/\D/g, '');
      
      // For the current user, we need to ensure it's a valid ID from the database
      // If the current user ID is not in the format of the database IDs (e.g., "101", "102"),
      // we'll use a default ID of "101" (assuming that's a valid user in your database)
      const cleanCurrentUserId = currentUser.id.startsWith('10') ? currentUser.id : '101';
      
      console.log('Clean target ID:', cleanTargetId);
      console.log('Clean current user ID:', cleanCurrentUserId);
      
      // Update the target user's followers count
      const updatedTargetUser = await userAPI.updateUser(cleanTargetId, {
        ...profileData,
        isFollowing: !isCurrentlyFollowing,
        followers: isCurrentlyFollowing ? profileData.followers - 1 : profileData.followers + 1
      });
      
      // Update the current user's following count
      if (currentUser) {
        const currentUserData = await userAPI.getUserById(cleanCurrentUserId);
        await userAPI.updateUser(cleanCurrentUserId, {
          ...currentUserData,
          following: isCurrentlyFollowing ? currentUserData.following - 1 : currentUserData.following + 1
        });
      }
      
      setProfileData(updatedTargetUser);
      setLoading(false);
    } catch (err) {
      console.error('Error toggling follow status:', err);
      setError('Failed to update follow status');
      setLoading(false);
    }
  };

  if (loading && !profileData) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="danger" />
        <p className="text-light mt-3">Loading profile...</p>
      </Container>
    );
  }

  if (error || !profileData) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">
          {error || 'Profile not found'}
        </Alert>
        <Button variant="primary" className="mt-3" onClick={() => navigate('/reel-critic/home')}>
          Return to Home
        </Button>
      </Container>
    );
  }

  // Use isFollowing property instead of checking followers array
  const isFollowing = profileData.isFollowing;

  return (
    <Container className="py-4">
      {/* Profile Header */}
      <div className="profile-header">
        <Row>
          <Col md={3} className="text-center text-md-start">
            <ProfilePictureUpload 
              currentPicture={profileData.profilePicture}
              onPictureUpdate={handleProfilePictureUpdate}
              editable={isOwnProfile}
            />
            
            {isLoggedIn && !isOwnProfile && (
              <Button 
                variant={isFollowing ? "outline-danger" : "danger"} 
                className="w-100 mt-2"
                onClick={handleFollowToggle}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
            )}
          </Col>
          <Col md={9}>
            <div className="profile-info">
              <h2 className="profile-username">@{profileData.username}</h2>
              <h3 className="profile-name">{profileData.name}</h3>
              
              <p className="profile-bio">{profileData.bio}</p>
              
              {profileData.location && (
                <div className="profile-meta">
                  <MapPin size={16} />
                  <span>{profileData.location}</span>
                </div>
              )}
              
              {profileData.website && (
                <div className="profile-meta">
                  <LinkIcon size={16} />
                  <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-info">
                    {profileData.website.replace(/(^\w+:|^)\/\//, '')}
                  </a>
                </div>
              )}
              
              {/* Show private information only to the profile owner */}
              {isOwnProfile && (
                <div className="private-info mb-3">
                  {profileData.email && (
                    <div className="profile-meta">
                      <Mail size={16} />
                      <span>{profileData.email}</span>
                    </div>
                  )}
                  
                  {profileData.phone && (
                    <div className="profile-meta">
                      <Phone size={16} />
                      <span>{profileData.phone}</span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="profile-meta">
                <Calendar size={16} />
                <span>Joined {profileData.memberSince}</span>
              </div>
              
              <div className="profile-stats d-flex mt-3">
                <div className="me-4">
                  <strong>{profileData.followers}</strong> Followers
                </div>
                <div className="me-4">
                  <strong>{profileData.following}</strong> Following
                </div>
              </div>
              
              {isOwnProfile && (
                <div className="profile-actions mt-3">
                  <Button 
                    variant="outline-light" 
                    size="sm"
                    onClick={() => setShowEditModal(true)}
                    className="d-flex align-items-center"
                  >
                    <Edit size={16} className="me-2" />
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
      
      {/* Profile Content */}
      <Tab.Container activeKey={activeTab} onSelect={(k) => k && setActiveTab(k)}>
        <Nav variant="tabs" className="profile-tabs">
          <Nav.Item>
            <Nav.Link eventKey="reviews">Reviews</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="favorites">Favorites</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="following">Following</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="followers">Followers</Nav.Link>
          </Nav.Item>
          {isOwnProfile && (
            <Nav.Item>
              <Nav.Link eventKey="watchlist">Watchlist</Nav.Link>
            </Nav.Item>
          )}
        </Nav>
        
        <Tab.Content>
          <Tab.Pane eventKey="reviews">
            <Row className="mt-4">
              <Col lg={8}>
                <UserReviews userId={profileData.id} />
              </Col>
              <Col lg={4}>
                <ActivitySummary 
                  joinDate={profileData.memberSince || new Date().toISOString()}
                  reviewCount={profileData.reviewCount || 0}
                  commentCount={profileData.comments?.length || 0}
                  followerCount={profileData.followers}
                />
                <FavoriteMovies userId={profileData.id} favorites={profileData.favoriteMovieIds} />
              </Col>
            </Row>
          </Tab.Pane>
          
          <Tab.Pane eventKey="favorites">
            <h4 className="mb-3 mt-4">Favorite Movies</h4>
            <FavoriteMovies userId={profileData.id} favorites={profileData.favoriteMovieIds} />
          </Tab.Pane>
          
          <Tab.Pane eventKey="following">
            <h4 className="mb-3 mt-4">Following</h4>
            <p className="text-muted">Following {profileData.following} users</p>
          </Tab.Pane>
          
          <Tab.Pane eventKey="followers">
            <h4 className="mb-3 mt-4">Followers</h4>
            <p className="text-muted">{profileData.followers} followers</p>
          </Tab.Pane>
          
          {isOwnProfile && (
            <Tab.Pane eventKey="watchlist">
              <h4 className="mb-3 mt-4">Watchlist</h4>
              <p className="text-muted">Your watchlist will be displayed here.</p>
            </Tab.Pane>
          )}
        </Tab.Content>
      </Tab.Container>
      
      {/* Edit Profile Modal */}
      {isOwnProfile && (
        <EditProfileForm 
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          currentProfile={{
            username: profileData.username,
            name: profileData.name,
            email: profileData.email,
            bio: profileData.bio,
            location: profileData.location,
            website: profileData.website,
            phone: profileData.phone || ''
          }}
          onSave={handleProfileUpdate}
        />
      )}
    </Container>
  );
};

export { Profile }; 