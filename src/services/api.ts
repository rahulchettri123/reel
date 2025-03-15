import axios from 'axios';

// Define the base URL for the JSON server
const API_BASE_URL = 'http://localhost:3001';

// Define interfaces for our data types
export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture: string;
  bio: string;
  followers: number;
  following: number;
  isFollowing: boolean;
  memberSince: string;
  favoriteGenres: string[];
  favoriteDirectors: string[];
  favoriteMovieIds: string[];
  points: number;
  reviewCount: number;
  role: string;
}

export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  year: string;
  director: string;
  rating: number;
  genres: string[];
  runtime: number;
  plot: string;
  cast: string[];
  releaseDate: string;
}

export interface Review {
  id: string;
  userId: string;
  movieId: string;
  content: string;
  rating: number;
  mediaUrl: string | null;
  mediaType: string | null;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  isLiked: boolean;
}

export interface Comment {
  id: string;
  reviewId: string;
  userId: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

export interface PopularCritic {
  id: string;
  points: number;
  rank: number;
}

// Create API services for each data type
export const userAPI = {
  // Get all users
  getAll: async (): Promise<User[]> => {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  },

  // Get a user by ID
  getById: async (id: string): Promise<User> => {
    // Clean the ID to ensure it's in the correct format (numeric)
    const cleanId = id.replace(/\D/g, '');
    console.log(`Fetching user with cleaned ID: ${cleanId}`);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${cleanId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${cleanId}:`, error);
      throw error;
    }
  },

  // Alias for getById to maintain compatibility with existing code
  getUserById: async (id: string): Promise<User> => {
    return userAPI.getById(id);
  },

  // Update a user
  update: async (id: string, userData: Partial<User>): Promise<User> => {
    // Clean the ID to ensure it's in the correct format (numeric)
    const cleanId = id.replace(/\D/g, '');
    console.log(`Updating user with cleaned ID: ${cleanId}`);
    
    try {
      const response = await axios.patch(`${API_BASE_URL}/users/${cleanId}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with ID ${cleanId}:`, error);
      throw error;
    }
  },

  // Alias for update to maintain compatibility with existing code
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    return userAPI.update(id, userData);
  },

  // Follow/unfollow a user
  toggleFollow: async (userId: string): Promise<User> => {
    // Clean the ID to ensure it's in the correct format (numeric)
    const cleanId = userId.replace(/\D/g, '');
    
    const user = await userAPI.getById(cleanId);
    const updatedUser = {
      ...user,
      isFollowing: !user.isFollowing,
      followers: user.isFollowing ? user.followers - 1 : user.followers + 1
    };
    return userAPI.update(cleanId, updatedUser);
  }
};

export const movieAPI = {
  // Get all movies
  getAll: async (): Promise<Movie[]> => {
    const response = await axios.get(`${API_BASE_URL}/movies`);
    return response.data;
  },

  // Get a movie by ID
  getById: async (id: string): Promise<Movie> => {
    // Clean the ID to ensure it's in the correct format
    const cleanId = id.replace(/\D/g, '');
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/${cleanId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching movie with ID ${cleanId}:`, error);
      throw error;
    }
  },

  // Alias for getById to maintain compatibility with existing code
  getMovieById: async (id: string): Promise<Movie> => {
    return movieAPI.getById(id);
  }
};

export const reviewAPI = {
  // Get all reviews
  getAll: async (): Promise<Review[]> => {
    const response = await axios.get(`${API_BASE_URL}/reviews`);
    return response.data;
  },

  // Get a review by ID
  getById: async (id: string): Promise<Review> => {
    // Clean the ID to ensure it's in the correct format
    const cleanId = id.replace(/\D/g, '');
    const response = await axios.get(`${API_BASE_URL}/reviews/${cleanId}`);
    return response.data;
  },

  // Get reviews by user ID
  getByUserId: async (userId: string): Promise<Review[]> => {
    // Clean the ID to ensure it's in the correct format
    const cleanId = userId.replace(/\D/g, '');
    const response = await axios.get(`${API_BASE_URL}/reviews?userId=${cleanId}`);
    return response.data;
  },

  // Alias for getByUserId to maintain compatibility with existing code
  getReviewsByUserId: async (userId: string): Promise<Review[]> => {
    return reviewAPI.getByUserId(userId);
  },

  // Get reviews by movie ID
  getByMovieId: async (movieId: string): Promise<Review[]> => {
    // Clean the ID to ensure it's in the correct format
    const cleanId = movieId.replace(/\D/g, '');
    const response = await axios.get(`${API_BASE_URL}/reviews?movieId=${cleanId}`);
    return response.data;
  },

  // Alias for getByMovieId to maintain compatibility with existing code
  getReviewsByMovieId: async (movieId: string | number): Promise<Review[]> => {
    return reviewAPI.getByMovieId(String(movieId));
  },

  // Create a new review
  createReview: async (reviewData: Omit<Review, 'id'>): Promise<Review> => {
    const response = await axios.post(`${API_BASE_URL}/reviews`, reviewData);
    return response.data;
  },

  // Update a review
  updateReview: async (id: string, reviewData: Partial<Review>): Promise<Review> => {
    const response = await axios.patch(`${API_BASE_URL}/reviews/${id}`, reviewData);
    return response.data;
  },

  // Like/unlike a review
  toggleLike: async (reviewId: string): Promise<Review> => {
    const review = await reviewAPI.getById(reviewId);
    const updatedReview = {
      ...review,
      isLiked: !review.isLiked,
      likes: review.isLiked ? review.likes - 1 : review.likes + 1
    };
    const response = await axios.patch(`${API_BASE_URL}/reviews/${reviewId}`, updatedReview);
    return response.data;
  }
};

export const commentAPI = {
  // Get all comments
  getAll: async (): Promise<Comment[]> => {
    const response = await axios.get(`${API_BASE_URL}/comments`);
    return response.data;
  },

  // Get a comment by ID
  getById: async (id: string): Promise<Comment> => {
    const response = await axios.get(`${API_BASE_URL}/comments/${id}`);
    return response.data;
  },

  // Get comments by review ID
  getByReviewId: async (reviewId: string): Promise<Comment[]> => {
    const response = await axios.get(`${API_BASE_URL}/comments?reviewId=${reviewId}`);
    return response.data;
  },

  // Add a comment to a review
  add: async (comment: Omit<Comment, 'id'>): Promise<Comment> => {
    const response = await axios.post(`${API_BASE_URL}/comments`, comment);
    return response.data;
  }
};

export const popularCriticAPI = {
  // Get all popular critics
  getAll: async (): Promise<PopularCritic[]> => {
    const response = await axios.get(`${API_BASE_URL}/popular_critics`);
    return response.data;
  },

  // Get popular critics with user details
  getAllWithDetails: async (): Promise<User[]> => {
    const popularCritics = await popularCriticAPI.getAll();
    const users = await userAPI.getAll();
    
    // Filter users to only include popular critics
    const criticIds = popularCritics.map(critic => critic.id);
    return users.filter(user => criticIds.includes(user.id))
      .sort((a, b) => {
        const aRank = popularCritics.find(c => c.id === a.id)?.rank || 0;
        const bRank = popularCritics.find(c => c.id === b.id)?.rank || 0;
        return aRank - bRank;
      });
  }
};

// Simulated authentication API
export const authAPI = {
  isLoggedIn: (): boolean => {
    return localStorage.getItem('isLoggedIn') === 'true';
  },
  
  login: async (email: string, password: string): Promise<User> => {
    // In a real app, this would make a POST request to authenticate
    const users = await userAPI.getAll();
    const user = users.find(u => u.email === email);
    
    if (user && password === 'hashed_password') { // Simplified for demo
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    
    throw new Error('Invalid credentials');
  },
  
  register: async (userData: any): Promise<{ success: boolean, message?: string, user?: User }> => {
    try {
      // Check if user with this email already exists
      const users = await userAPI.getAll();
      const existingUser = users.find(u => u.email === userData.email);
      
      if (existingUser) {
        return { success: false, message: 'A user with this email already exists' };
      }
      
      // Generate a new user ID (in a real app, the server would do this)
      // Use a format that matches your existing user IDs (e.g., "101", "102", etc.)
      const newId = String(100 + users.length + 1);
      
      // Create the new user object with required fields
      const newUser: User = {
        id: newId,
        username: userData.username,
        email: userData.email,
        profilePicture: userData.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`,
        bio: userData.bio || '',
        followers: 0,
        following: 0,
        isFollowing: false,
        memberSince: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
        favoriteGenres: userData.favoriteGenres || [],
        favoriteDirectors: userData.favoriteDirectors || [],
        favoriteMovieIds: userData.favoriteMovieIds || [],
        points: 0,
        reviewCount: 0,
        role: 'user'
      };
      
      // In a real app, this would be a POST request to create a new user
      // For this demo, we'll add the user to the JSON server
      const response = await axios.post(`${API_BASE_URL}/users`, newUser);
      
      // Log in the user automatically
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(response.data));
      
      return { success: true, user: response.data };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'An error occurred during registration' };
    }
  },
  
  logout: (): void => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
  },
  
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }
};

// Function to fetch most popular movies
export const fetchMostPopularMovies = async () => {
  try {
    // First try to get movies from our local API
    const response = await axios.get(`${API_BASE_URL}/movies`);
    
    if (!response.data || !Array.isArray(response.data)) {
      console.error('Invalid response format:', response.data);
      return [];
    }
    
    // Sort by rating to get the most popular ones
    const sortedMovies = [...response.data].sort((a, b) => b.rating - a.rating);
    
    // Format the data to match the expected structure in TopMovies component
    return sortedMovies.map((movie) => ({
      id: movie.id,
      primaryTitle: movie.title,
      primaryImage: movie.posterUrl,
      averageRating: movie.rating,
      releaseDate: movie.year,
      url: `/reel-critic/movies/${movie.id}`
    }));
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return []; // Return empty array instead of throwing
  }
};

// Function to fetch autocomplete suggestions for movies
export const fetchAutocompleteMovies = async (query: string) => {
  if (!query) return []; // Prevent API call if query is empty

  try {
    console.log(`🔍 Fetching autocomplete results for: ${query}`);
    
    // Get all movies from our local API
    const response = await axios.get(`${API_BASE_URL}/movies`);
    
    if (!response.data || !Array.isArray(response.data)) {
      console.error('Invalid response format:', response.data);
      return [];
    }
    
    // Filter movies that match the query
    const filteredMovies = response.data.filter((movie) => 
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    
    // Format the data to match the expected structure
    const processedResults = filteredMovies.map((movie) => ({
      id: movie.id,
      title: movie.title,
      type: movie.genres && movie.genres.length > 0 ? movie.genres[0] : 'Movie',
      year: movie.year,
      poster: movie.posterUrl,
      averageRating: movie.rating
    })).slice(0, 5); // Limit to 5 results
    
    console.log("✅ Processed Results:", processedResults);
    return processedResults;
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error);
    return [];
  }
};

export default {
  userAPI,
  movieAPI,
  reviewAPI,
  commentAPI,
  popularCriticAPI,
  authAPI,
  fetchMostPopularMovies,
  fetchAutocompleteMovies
}; 