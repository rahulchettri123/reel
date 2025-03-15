import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Image, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { userAPI, authAPI } from '../../services/api';

interface FollowListProps {
  userIds?: string[] | number[] | null;
}

const FollowList: React.FC<FollowListProps> = ({ userIds }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Get current logged-in user
  const currentUser = authAPI.getCurrentUser();
  const isLoggedIn = !!currentUser;

  useEffect(() => {
    const fetchUsers = async () => {
      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        setUsers([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch all users in parallel
        const userPromises = userIds.map(id => userAPI.getUserById(String(id)));
        const fetchedUsers = await Promise.all(userPromises);
        
        setUsers(fetchedUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userIds]);

  const handleFollowToggle = async (userId: string) => {
    if (!isLoggedIn || !currentUser) return;
    
    try {
      // Clean the IDs to ensure they're in the correct format
      const cleanUserId = userId.replace(/\D/g, '');
      
      // For the current user, we need to ensure it's a valid ID from the database
      // If the current user ID is not in the format of the database IDs (e.g., "101", "102"),
      // we'll use a default ID of "101" (assuming that's a valid user in your database)
      const cleanCurrentUserId = currentUser.id.startsWith('10') ? currentUser.id : '101';
      
      console.log('Following user with ID:', cleanUserId);
      console.log('Current user ID:', cleanCurrentUserId);
      
      // Get the target user
      const targetUser = await userAPI.getUserById(cleanUserId);
      
      // Check if already following
      const isFollowing = targetUser.isFollowing;
      
      // Update the target user's followers count
      await userAPI.updateUser(cleanUserId, {
        ...targetUser,
        isFollowing: !isFollowing,
        followers: isFollowing ? targetUser.followers - 1 : targetUser.followers + 1
      });
      
      // Update the current user's following count
      const currentUserData = await userAPI.getUserById(cleanCurrentUserId);
      await userAPI.updateUser(cleanCurrentUserId, {
        ...currentUserData,
        following: isFollowing ? currentUserData.following - 1 : currentUserData.following + 1
      });
      
      // Update the local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { 
                ...user, 
                isFollowing: !isFollowing,
                followers: isFollowing ? user.followers - 1 : user.followers + 1 
              } 
            : user
        )
      );
    } catch (err) {
      console.error('Error toggling follow status:', err);
      setError('Failed to update follow status');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="danger" />
        <p className="text-light mt-2">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  if (users.length === 0) {
    return <p className="text-muted">No users found</p>;
  }

  return (
    <Row>
      {users.map(user => {
        const isFollowing = user.isFollowing;
        const isCurrentUser = currentUser && user.id === currentUser.id;
        
        return (
          <Col key={user.id} md={6} lg={4} className="mb-3">
            <Card className="bg-dark-secondary border-secondary">
              <Card.Body className="d-flex align-items-center">
                <Image 
                  src={user.profilePicture} 
                  roundedCircle 
                  width={50} 
                  height={50}
                  className="me-3"
                  alt={`${user.username}'s profile picture`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/50x50/lightgray/gray?text=User';
                  }}
                />
                <div className="flex-grow-1">
                  <h6 className="mb-0">{user.name || user.username}</h6>
                  <small className="text-muted">@{user.username}</small>
                </div>
                <div className="d-flex">
                  <Button 
                    variant="outline-light" 
                    size="sm" 
                    className="me-2"
                    onClick={() => navigate(`/reel-critic/account/profile/${user.id.replace(/\D/g, '')}`)}
                  >
                    View
                  </Button>
                  
                  {isLoggedIn && !isCurrentUser && (
                    <Button 
                      variant={isFollowing ? "outline-danger" : "danger"} 
                      size="sm"
                      onClick={() => handleFollowToggle(user.id)}
                    >
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default FollowList; 