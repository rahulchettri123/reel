import axios from "axios";

const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const API_HOST = import.meta.env.VITE_RAPIDAPI_HOST;

// In services/api.ts

// In services/api.ts

export const fetchMovieDetails = async (movieId: string) => {
  try {
    console.log(`External API: Fetching details for movie ID: ${movieId}`);
    
    if (!movieId) {
      console.error('External API: No movie ID provided');
      throw new Error('No movie ID provided');
    }
    
    // First try to get the movie from our local database
    try {
      console.log(`External API: Trying to fetch movie from local database: http://localhost:3001/movies/${movieId}`);
      const localResponse = await axios.get(`http://localhost:3001/movies/${movieId}`);
      
      if (localResponse.data) {
        console.log('External API: Found movie in local database:', localResponse.data);
        
        // Transform the data to match the expected MovieDetails interface
        return {
          id: localResponse.data.id,
          primaryTitle: localResponse.data.title,
          primaryImage: localResponse.data.posterUrl,
          averageRating: localResponse.data.rating,
          releaseDate: localResponse.data.year.toString(),
          description: localResponse.data.plot,
          contentRating: localResponse.data.contentRating || "PG-13",
          genres: localResponse.data.genre,
          runtimeMinutes: localResponse.data.runtime,
          budget: 0, // Not available in local data
          countriesOfOrigin: [],
          filmingLocations: [],
          interests: [],
          numVotes: 0,
          type: "Movie",
          url: `/reel-critic/movies/${localResponse.data.id}`,
          isAdult: false
        };
      }
    } catch (localError) {
      console.log('External API: Movie not found in local database, trying fallback data', localError);
    }
    
    // If we get here, we couldn't find the movie in the local database
    // Let's use the most-popular-movies endpoint as a fallback
    console.log('External API: Fetching from popular movies endpoint');
    const response = await axios.get(
      "https://imdb236.p.rapidapi.com/imdb/most-popular-movies",
      {
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": API_HOST,
        },
      }
    );

    console.log('External API: Response from popular movies endpoint:', 
      Array.isArray(response.data) ? `Array with ${response.data.length} items` : 
      (response.data && Array.isArray(response.data.movies)) ? `Object with ${response.data.movies.length} movies` : 
      'Unexpected format');

    // Find the specific movie from the response
    let movieData;
    
    if (Array.isArray(response.data)) {
      movieData = response.data.find((movie: any) => movie.id === movieId);
    } else if (response.data && Array.isArray(response.data.movies)) {
      movieData = response.data.movies.find((movie: any) => movie.id === movieId);
    }

    if (!movieData) {
      // As a last resort, create a placeholder movie
      console.log('External API: Movie not found in API response, creating placeholder');
      return {
        id: movieId,
        primaryTitle: "Movie Details Not Available",
        primaryImage: "https://via.placeholder.com/300x450?text=No+Image",
        averageRating: 0,
        releaseDate: "Unknown",
        description: "Details for this movie are not available at the moment.",
        contentRating: "Unknown",
        genres: ["Unknown"],
        runtimeMinutes: 0,
        budget: 0,
        countriesOfOrigin: [],
        filmingLocations: [],
        interests: [],
        numVotes: 0,
        type: "Movie",
        url: `/reel-critic/movies/${movieId}`,
        isAdult: false
      };
    }

    console.log('External API: Found movie data from API:', movieData);
    return movieData;
  } catch (error: any) {
    console.error("External API: ❌ Error fetching movie details:", error?.response?.data || error.message);
    // Return a placeholder instead of throwing an error
    return {
      id: movieId,
      primaryTitle: "Error Loading Movie",
      primaryImage: "https://via.placeholder.com/300x450?text=Error",
      averageRating: 0,
      releaseDate: "Unknown",
      description: "There was an error loading this movie's details. Please try again later.",
      contentRating: "Unknown",
      genres: ["Unknown"],
      runtimeMinutes: 0,
      budget: 0,
      countriesOfOrigin: [],
      filmingLocations: [],
      interests: [],
      numVotes: 0,
      type: "Movie",
      url: `/reel-critic/movies/${movieId}`,
      isAdult: false
    };
  }
};

export const fetchMostPopularMovies = async () => {
  try {
    const response = await axios.get(
      "https://imdb236.p.rapidapi.com/imdb/most-popular-movies",
      {
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": API_HOST,
        },
      }
    );

    // Extract movie data
    const movies = response.data.movies || response || [];

    // Validate the movie data format
    if (!Array.isArray(movies) || movies.length === 0) {
      throw new Error("No movies found in API response.");
    }

    return movies;
  } catch (error: any) {
    console.error("❌ Error fetching movies:", error?.response?.data || error.message);
    return [];
  }
};











/**
 * Fetches autocomplete search suggestions from IMDB API.
 * This function is triggered as the user types in the search bar.
 */
export const fetchAutocompleteMovies = async (query: string) => {
  if (!query) return []; // ✅ Prevent API call if query is empty

  try {
    console.log(`🔍 Fetching autocomplete results for: ${query}`);

    const response = await axios.get(`https://imdb236.p.rapidapi.com/imdb/autocomplete`, {
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": API_HOST,
      },
      params: { query },
    });

    console.log("🔍 Full API Response:", response.data); // ✅ Debug full API response

    // ✅ Extract all available fields from response
    if (response.data && response.data.length > 0) {
      const processedResults = response.data.map((movie: any) => ({
        id: movie.id || "N/A",
        title: movie.primaryTitle || movie.originalTitle || "Unknown Title",
        poster: movie.primaryImage || "/no-image.png",
        type: movie.type || "Unknown Type",
        averageRating: movie.averageRating || null,
        contentRating: movie.contentRating || null,
        description: movie.description || null,
        genres: movie.genres || [],
        releaseDate: movie.releaseDate || null,
        startYear: movie.startYear || null,
        runtimeMinutes: movie.runtimeMinutes || null,
        languages: movie.languages || [],
        countriesOfOrigin: movie.countriesOfOrigin || []
      }));

      console.log("✅ Processed Results:", processedResults); // ✅ Debug processed data
      return processedResults;
    }

  
    return [];
  } catch (error: any) {
    console.error("❌ Error fetching autocomplete search results:", error?.response?.data || error.message);
    return [];
  }
};


