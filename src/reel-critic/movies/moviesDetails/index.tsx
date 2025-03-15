import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { MovieProvider } from './MovieContext';
import MovieDetailsContent from './MovieDetailsContent';
import ReviewsSection from './ReviewsSection';
import './index.css';

// Add CSS for truncated text
const styles = `
.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
`;

export default function MovieDetails() {
  // We don't need to extract the movieId here anymore since we're doing it in the MovieContext
  // The MovieProvider will handle getting the movieId from the URL
  const [isLoading, setIsLoading] = useState(false);
  
  // Set a timeout to ensure we don't show loading indefinitely
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  console.log(`MovieDetails component rendering`);

  return (
    <MovieProvider>
      <style>{styles}</style>
      <div className="movie-details-page">
        <MovieDetailsContent />
        <ReviewsSection />
      </div>
    </MovieProvider>
  );
}