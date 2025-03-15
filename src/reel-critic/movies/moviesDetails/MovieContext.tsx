import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchMovieDetails } from '../../../../services/api.tsx';
import { reviewAPI, userAPI } from '../../../services/api';
import { useParams, useLocation } from 'react-router-dom';

// Define interfaces
export interface MovieDetails {
  id: string;
  primaryTitle: string;
  primaryImage: string;
  averageRating: number;
  releaseDate: string;
  description: string;
  contentRating: string;
  genres: string[];
  runtimeMinutes: number;
  budget: number;
  countriesOfOrigin: string[];
  filmingLocations: string[];
  interests: string[];
  numVotes: number;
  type: string;
  url: string;
  isAdult: boolean;
}

export interface Review {
  id: string;
  userId: string;
  movieId: number;
  rating: number;
  content: string;
  date: string;
  likes: string[];
  comments: string[];
  user?: {
    id: string;
    name: string;
    username: string;
    profilePicture: string;
  };
}

export interface Comment {
  id: string;
  reviewId: string;
  userId: string;
  content: string;
  date: string;
  user?: {
    name: string;
    username: string;
    profilePicture: string;
  };
}

// Define context type
interface MovieContextType {
  movie: MovieDetails | null;
  reviews: Review[];
  loading: boolean;
  error: string | null;
  expandedReviews: string[];
  toggleReviewExpansion: (reviewId: string) => void;
  fetchMovieData: (id: string) => Promise<void>;
  updateReview: (updatedReview: Review) => void;
  addReview: (newReview: Review) => void;
}

// Create context
const MovieContext = createContext<MovieContextType | undefined>(undefined);

// Provider component
export const MovieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);
  
  // Get movieId from URL using React Router hooks
  const { movieId: pathMovieId } = useParams<{ movieId: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryMovieId = queryParams.get('identifier');
  
  // Use movieId from path or query parameter
  const movieId = pathMovieId || queryMovieId;

  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId) 
        : [...prev, reviewId]
    );
  };

  const fetchMovieData = async (id: string) => {
    if (!id) {
      console.error('MovieContext: No movie ID provided to fetchMovieData');
      setError('No movie ID provided');
      setLoading(false);
      return;
    }

    console.log(`MovieContext: Fetching data for movie ID: ${id}`);
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch movie details
      console.log('MovieContext: Fetching movie details...');
      const movieData = await fetchMovieDetails(id);
      
      if (!movieData || movieData.primaryTitle === "Error Loading Movie") {
        console.error('MovieContext: Failed to fetch movie details');
        setError('Failed to fetch movie details');
        setLoading(false);
        return;
      }
      
      console.log('MovieContext: Movie details received:', movieData);
      setMovie(movieData);
      
      // Fetch reviews for this movie
      console.log(`MovieContext: Fetching reviews for movie ID: ${id}`);
      try {
        const reviewsData = await reviewAPI.getReviewsByMovieId(Number(id));
        console.log('MovieContext: Reviews data received:', reviewsData);
        
        if (!reviewsData || !Array.isArray(reviewsData)) {
          console.warn('MovieContext: No reviews found or invalid reviews data format');
          setReviews([]);
          setLoading(false);
          return;
        }
        
        if (reviewsData.length === 0) {
          console.log('MovieContext: No reviews found for this movie');
          setReviews([]);
          setLoading(false);
          return;
        }
        
        // Fetch user details for each review
        console.log('MovieContext: Fetching user details for reviews...');
        const reviewsWithUserDetails = await Promise.all(
          reviewsData.map(async (review: Review) => {
            try {
              if (!review.userId) {
                console.warn(`MovieContext: Review ${review.id} has no userId`);
                return review;
              }
              
              const user = await userAPI.getUserById(review.userId);
              return {
                ...review,
                user: {
                  id: user.id,
                  name: user.name,
                  username: user.username,
                  profilePicture: user.profilePicture
                }
              };
            } catch (err) {
              console.error(`MovieContext: Error fetching user for review ${review.id}:`, err);
              return review;
            }
          })
        );
        
        // Sort reviews by date (newest first)
        const sortedReviews = reviewsWithUserDetails.sort((a: Review, b: Review) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        console.log('MovieContext: Processed reviews:', sortedReviews);
        setReviews(sortedReviews);
      } catch (reviewErr) {
        console.error('MovieContext: Error fetching reviews:', reviewErr);
        // Don't set error state here, just set empty reviews
        setReviews([]);
      }
    } catch (err: any) {
      console.error('MovieContext: Error fetching movie data:', err);
      setError(err.message || 'Failed to fetch movie data');
    } finally {
      setLoading(false);
    }
  };

  // Function to update a review in the context
  const updateReview = (updatedReview: Review) => {
    setReviews(prevReviews => 
      prevReviews.map(review => 
        review.id === updatedReview.id ? updatedReview : review
      )
    );
  };

  // Function to add a new review to the context
  const addReview = (newReview: Review) => {
    setReviews(prevReviews => [newReview, ...prevReviews]);
  };

  // Fetch data when component mounts or movieId changes
  useEffect(() => {
    if (movieId) {
      console.log(`MovieContext: Detected movieId: ${movieId}`);
      fetchMovieData(movieId);
    } else {
      console.warn('MovieContext: No movieId found');
      setError('No movie ID provided');
      setLoading(false);
    }
  }, [movieId]);

  return (
    <MovieContext.Provider value={{ 
      movie, 
      reviews, 
      loading, 
      error, 
      expandedReviews,
      toggleReviewExpansion,
      fetchMovieData,
      updateReview,
      addReview
    }}>
      {children}
    </MovieContext.Provider>
  );
};

// Custom hook to use the movie context
export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
}; 