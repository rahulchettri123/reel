import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Modal, Button, Form, Spinner } from 'react-bootstrap';
import { Plus, ChevronLeft, ChevronRight, X, Camera, Film, Upload } from 'lucide-react';
import { authAPI } from './mockAuth';
import { mockStories } from './mockData';
import './Stories.css';

interface Story {
  id: string;
  userId: string;
  username: string;
  userProfilePicture: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  createdAt: string;
  viewed: boolean;
}

interface CreateStoryProps {
  onStoryCreate: () => void;
}

const CreateStory: React.FC<CreateStoryProps> = ({ onStoryCreate }) => {
  const currentUser = authAPI.getCurrentUser();

  return (
    <div className="story-item create-story" onClick={onStoryCreate}>
      <div className="story-circle">
        <div className="story-image">
          <img 
            src={currentUser?.profilePicture || '/default-profile.png'} 
            alt="Your story" 
            className="rounded-circle"
          />
        </div>
        <div className="add-story-icon">
          <Plus size={20} />
        </div>
      </div>
      <div className="story-username">Your Story</div>
    </div>
  );
};

const StoryUploadModal: React.FC<{
  show: boolean;
  onHide: () => void;
  onStoryUpload: (mediaUrl: string, mediaType: 'image' | 'video') => void;
}> = ({ show, onHide, onStoryUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !preview) return;
    
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      // Determine media type
      const mediaType = selectedFile.type.startsWith('image/') ? 'image' : 'video';
      
      // In a real app, you would upload the file to a server and get a URL back
      // For this demo, we'll use the preview URL
      onStoryUpload(preview, mediaType as 'image' | 'video');
      
      // Reset state
      setSelectedFile(null);
      setPreview(null);
      setIsUploading(false);
      onHide();
    }, 1500);
  };

  return (
    <Modal show={show} onHide={onHide} centered className="story-upload-modal">
      <Modal.Header closeButton>
        <Modal.Title>Create Story</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-4">
          {preview ? (
            <div className="preview-container">
              {selectedFile?.type.startsWith('image/') ? (
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="img-fluid rounded"
                />
              ) : (
                <video 
                  src={preview} 
                  controls 
                  className="img-fluid rounded"
                />
              )}
              <Button 
                variant="danger" 
                size="sm" 
                className="position-absolute top-0 end-0 m-2 rounded-circle p-1"
                onClick={() => {
                  setSelectedFile(null);
                  setPreview(null);
                }}
              >
                <X size={16} />
              </Button>
            </div>
          ) : (
            <div 
              className="upload-placeholder"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={48} className="mb-3 text-muted" />
              <p className="text-muted">Click to select an image or video</p>
            </div>
          )}
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          className="d-none"
          accept="image/*,video/*"
          onChange={handleFileSelect}
        />
        
        <div className="d-grid gap-2">
          {!preview && (
            <Button 
              variant="outline-primary" 
              onClick={() => fileInputRef.current?.click()}
            >
              Select File
            </Button>
          )}
          
          {preview && (
            <Button 
              variant="primary" 
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Uploading...
                </>
              ) : 'Share Story'}
            </Button>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

const StoryViewer: React.FC<{
  stories: Story[];
  currentIndex: number;
  onClose: () => void;
}> = ({ stories, currentIndex, onClose }) => {
  const [progress, setProgress] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(currentIndex);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isAnimating) {
        setProgress((prev) => {
          if (prev >= 100) {
            if (currentStoryIndex < stories.length - 1) {
              setCurrentStoryIndex((prev) => prev + 1);
              return 0;
            } else {
              onClose();
              return 0;
            }
          }
          return prev + 1;
        });
      }
    }, 50);

    return () => clearInterval(timer);
  }, [currentStoryIndex, stories.length, onClose, isAnimating]);

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePause = () => {
    setIsAnimating(false);
  };

  const handleResume = () => {
    setIsAnimating(true);
  };

  const currentStory = stories[currentStoryIndex];

  return (
    <Modal 
      show={true} 
      onHide={onClose} 
      centered 
      dialogClassName="story-viewer-modal"
      contentClassName="story-viewer-content"
    >
      <div className="story-progress">
        {stories.map((_, index) => (
          <div key={index} className="progress-segment">
            <div
              className={`progress-bar ${index < currentStoryIndex ? 'completed' : index === currentStoryIndex ? 'active' : ''}`}
              style={{ 
                width: index === currentStoryIndex ? `${progress}%` : index < currentStoryIndex ? '100%' : '0%' 
              }}
            />
          </div>
        ))}
      </div>
      
      <div className="story-header">
        <img 
          src={currentStory.userProfilePicture} 
          alt={currentStory.username} 
          className="story-user-avatar"
        />
        <span className="story-username">{currentStory.username}</span>
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      <div 
        className="story-content"
        onMouseDown={handlePause}
        onMouseUp={handleResume}
        onTouchStart={handlePause}
        onTouchEnd={handleResume}
      >
        {currentStory.mediaType === 'image' ? (
          <img src={currentStory.mediaUrl} alt="Story" className="story-media" />
        ) : (
          <video src={currentStory.mediaUrl} controls className="story-media" />
        )}
      </div>

      <div className="story-navigation">
        <button
          className="nav-button prev"
          onClick={handlePrevious}
          disabled={currentStoryIndex === 0}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className="nav-button next"
          onClick={handleNext}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </Modal>
  );
};

const Stories: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  const isLoggedIn = authAPI.isLoggedIn();
  const currentUser = authAPI.getCurrentUser();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setStories(mockStories);
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const handleStoryClick = (index: number) => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    setSelectedStoryIndex(index);
  };

  const handleCreateStory = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    setShowUploadModal(true);
  };

  const handleStoryUpload = (mediaUrl: string, mediaType: 'image' | 'video') => {
    if (!currentUser) return;
    
    const newStory: Story = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      userProfilePicture: currentUser.profilePicture || '/default-profile.png',
      mediaUrl,
      mediaType,
      createdAt: new Date().toISOString(),
      viewed: false
    };
    
    setStories([newStory, ...stories]);
  };

  if (loading) {
    return <div className="stories-loading">Loading stories...</div>;
  }

  if (error) {
    return <div className="stories-error">{error}</div>;
  }

  return (
    <Container fluid className="stories-container">
      <div className="stories-scroll">
        <div className="user-story">
          <CreateStory onStoryCreate={handleCreateStory} />
        </div>
        {stories.map((story, index) => (
          <div 
            key={story.id} 
            className={`story-item ${story.viewed ? 'viewed' : ''}`}
            onClick={() => handleStoryClick(index)}
          >
            <div className="story-circle">
              <div className="story-image">
                <img 
                  src={story.userProfilePicture} 
                  alt={story.username} 
                  className="rounded-circle"
                />
              </div>
            </div>
            <div className="story-username">{story.username}</div>
          </div>
        ))}
      </div>

      {/* Story Upload Modal */}
      <StoryUploadModal 
        show={showUploadModal}
        onHide={() => setShowUploadModal(false)}
        onStoryUpload={handleStoryUpload}
      />

      {/* Story Viewer Modal */}
      {selectedStoryIndex !== null && (
        <StoryViewer
          stories={stories}
          currentIndex={selectedStoryIndex}
          onClose={() => setSelectedStoryIndex(null)}
        />
      )}

      {/* Login Prompt Modal */}
      <Modal 
        show={showLoginPrompt} 
        onHide={() => setShowLoginPrompt(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <Film size={48} className="mb-3 text-danger" />
          <h5>You need to be logged in</h5>
          <p className="text-muted">Please log in to view or create stories</p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowLoginPrompt(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            href="/reel-critic/account/login"
          >
            Log In
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Stories; 