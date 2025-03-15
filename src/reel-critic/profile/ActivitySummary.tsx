import React from 'react';
import { Card } from 'react-bootstrap';
import { Calendar, Film, MessageSquare, Users } from 'lucide-react';

interface ActivitySummaryProps {
  joinDate: string;
  reviewCount: number;
  commentCount: number;
  followerCount: number;
}

const ActivitySummary: React.FC<ActivitySummaryProps> = ({
  joinDate,
  reviewCount,
  commentCount,
  followerCount
}) => {
  // Format join date
  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long'
    });
  };

  return (
    <Card className="bg-dark text-light activity-summary mb-4">
      <Card.Body>
        <h5 className="mb-3">Activity Summary</h5>
        
        <div className="d-flex align-items-center mb-2">
          <Calendar size={16} className="me-2 text-muted" />
          <p className="mb-0">Joined in {formatJoinDate(joinDate)}</p>
        </div>
        
        <div className="d-flex align-items-center mb-2">
          <Film size={16} className="me-2 text-muted" />
          <p className="mb-0">
            {reviewCount === 0 
              ? 'No reviews yet' 
              : `Reviewed ${reviewCount} ${reviewCount === 1 ? 'movie' : 'movies'}`}
          </p>
        </div>
        
        <div className="d-flex align-items-center mb-2">
          <MessageSquare size={16} className="me-2 text-muted" />
          <p className="mb-0">
            {commentCount === 0 
              ? 'No comments yet' 
              : `Posted ${commentCount} ${commentCount === 1 ? 'comment' : 'comments'}`}
          </p>
        </div>
        
        <div className="d-flex align-items-center">
          <Users size={16} className="me-2 text-muted" />
          <p className="mb-0">
            {followerCount === 0 
              ? 'No followers yet' 
              : `Followed by ${followerCount} ${followerCount === 1 ? 'person' : 'people'}`}
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ActivitySummary; 