// src/components/posts/CreatePost.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Card, Form, Button, Row, Col, Image, Spinner, ListGroup } from 'react-bootstrap';
import { Star, X, Search, Film, Upload, Camera } from 'lucide-react';
import { authAPI } from '../../reel-critic/home/mockAuth';
import { fetchAutocompleteMovies } from '../../services/api';

interface CreatePostProps {
  onSubmit: (post: any) => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const [movieTitle, setMovieTitle] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Check if user is logged in
  const isLoggedIn = authAPI.isLoggedIn();
  const currentUser = authAPI.getCurrentUser();

  // Fetch movie suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!movieTitle.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const results = await fetchAutocompleteMovies(movieTitle);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    };

    fetchSuggestions();
  }, [movieTitle]);

  const handleMovieSelect = (movie: any) => {
    setSelectedMovie(movie);
    setMovieTitle(movie.title);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = [...images];
    const newPreviews = [...imagePreviews];

    Array.from(files).forEach(file => {
      // Only add if it's an image
      if (file.type.startsWith('image/')) {
        newImages.push(file);
        
        // Create preview URL
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newPreviews.push(event.target.result as string);
            setImagePreviews([...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    setImages(newImages);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      // Redirect to login page or show login prompt
      window.location.href = '/reel-critic/account/login';
      return;
    }
    
    setIsUploading(true);
    
    // In a real app, you would upload the images to a server and get URLs back
    // For this demo, we'll use the image previews as URLs
    const imageUrls = imagePreviews;
    
    // Get user data from auth context
    const userData = {
      userId: currentUser?.id || 'user1',
      userName: currentUser?.username || 'User',
      userAvatar: currentUser?.profilePicture || '/api/placeholder/40/40'
    };

    // Create post object
    const postData = {
      ...userData,
      content,
      images: imageUrls,
      likes: 0,
      comments: 0,
      shares: 0,
      rating: rating,
    };

    // Add movie data if a movie was selected
    if (selectedMovie) {
      postData.movieId = selectedMovie.id;
      postData.movieTitle = selectedMovie.title;
      postData.movieImage = selectedMovie.poster || 'https://via.placeholder.com/300';
      postData.genres = selectedMovie.type ? [selectedMovie.type] : ['Movie'];
    }

    // Submit the post
    onSubmit(postData);

    // Reset form
    setContent('');
    setMovieTitle('');
    setSelectedMovie(null);
    setRating(0);
    setImages([]);
    setImagePreviews([]);
    setIsUploading(false);
  };

  // If user is not logged in, show login prompt
  if (!isLoggedIn) {
    return (
      <Card className="bg-dark text-light mb-4 shadow-sm">
        <Card.Body className="text-center py-4">
          <Film size={48} className="mb-3 text-danger" />
          <h5>Share your thoughts about movies</h5>
          <p className="text-muted">Log in to create posts and join the conversation</p>
          <Button 
            variant="danger" 
            href="/reel-critic/account/login"
            className="px-4 mt-2"
          >
            Log In
          </Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="bg-dark text-light mb-4 shadow-sm">
      <Card.Header className="border-bottom border-secondary">
        <h5 className="mb-0">Create Post</h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          {/* User Avatar and Movie Search */}
          <Row className="align-items-center mb-3">
            <Col xs="auto" className="pe-0">
              <img
                src={currentUser?.profilePicture || "/api/placeholder/40/40"}
                alt="User"
                className="rounded-circle"
                width="48"
                height="48"
              />
            </Col>
            <Col>
              <div className="position-relative">
                <Form.Control
                  type="text"
                  placeholder="Search for a movie (optional)..."
                  value={movieTitle}
                  onChange={(e) => setMovieTitle(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  className="bg-dark text-light border-secondary"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ListGroup className="position-absolute w-100 z-3 mt-1 movie-suggestions">
                    {suggestions.map((movie) => (
                      <ListGroup.Item
                        key={movie.id}
                        className="bg-dark text-light border-secondary cursor-pointer"
                        onClick={() => handleMovieSelect(movie)}
                      >
                        <div className="d-flex align-items-center">
                          {movie.poster && (
                            <Image 
                              src={movie.poster} 
                              alt={movie.title} 
                              width={30} 
                              height={45} 
                              className="me-2"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/30x45/lightgray/gray?text=No+Image';
                              }}
                            />
                          )}
                          <div>
                            <div>{movie.title}</div>
                            {movie.year && <small className="text-muted">{movie.year}</small>}
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </div>
            </Col>
          </Row>
          
          {/* Selected Movie Preview */}
          {selectedMovie && (
            <div className="selected-movie mb-3 p-2 rounded d-flex align-items-center" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              {selectedMovie.poster && (
                <Image 
                  src={selectedMovie.poster} 
                  alt={selectedMovie.title} 
                  width={40} 
                  height={60} 
                  className="me-3"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/40x60/lightgray/gray?text=No+Image';
                  }}
                />
              )}
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">{selectedMovie.title}</h6>
                  <Button 
                    variant="link" 
                    className="text-light p-0 ms-2" 
                    onClick={() => {
                      setSelectedMovie(null);
                      setMovieTitle('');
                    }}
                  >
                    <X size={16} />
                  </Button>
                </div>
                {selectedMovie.year && <small className="text-muted">{selectedMovie.year}</small>}
              </div>
            </div>
          )}
          
          {/* Post Content */}
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-dark text-light border-secondary"
            />
          </Form.Group>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="image-previews mb-3">
              <Row>
                {imagePreviews.map((preview, index) => (
                  <Col key={index} xs={6} md={4} lg={3} className="mb-2">
                    <div className="position-relative">
                      <Image 
                        src={preview} 
                        alt={`Preview ${index}`} 
                        className="img-fluid rounded" 
                        style={{ height: '100px', objectFit: 'cover', width: '100%' }}
                      />
                      <Button 
                        variant="danger" 
                        size="sm" 
                        className="position-absolute top-0 end-0 rounded-circle p-0" 
                        style={{ width: '24px', height: '24px' }}
                        onClick={() => removeImage(index)}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* Action Buttons */}
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="d-flex align-items-center gap-3 mb-2 mb-sm-0">
              {/* Image Upload Button */}
              <Button 
                variant="outline-secondary" 
                className="d-flex align-items-center gap-1 p-1 px-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={18} />
                <span className="d-none d-sm-inline">Add Images</span>
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="d-none"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
              
              {/* Rating Stars */}
              <div className="d-flex align-items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    fill={star <= rating ? "gold" : "none"}
                    color={star <= rating ? "gold" : "gray"}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
            
            {/* Post Button */}
            <Button 
              type="submit" 
              variant="danger"
              disabled={(!content.trim() && imagePreviews.length === 0) || isUploading}
              className="px-4"
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
                  Posting...
                </>
              ) : 'Post'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};