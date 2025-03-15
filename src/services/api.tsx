import axios from "axios";

// Define the ImportMeta interface for Vite
interface ImportMetaEnv {
  readonly VITE_RAPIDAPI_KEY: string;
  readonly VITE_RAPIDAPI_HOST: string;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const API_HOST = import.meta.env.VITE_RAPIDAPI_HOST;

console.log("✅ API Key:", API_KEY);
console.log("✅ API Host:", API_HOST);

if (!API_KEY || !API_HOST) {
  console.error("❌ Missing API Key or Host. Check your .env file!");
}

export const fetchMostPopularMovies = async () => {
  try {
    console.log("🚀 Fetching movies...");

    const response = await axios.get(
      "https://imdb236.p.rapidapi.com/imdb/most-popular-movies",
      {
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": API_HOST,
        },
      }
    );

    console.log("✅ Raw API Response:", response.data);

    // Ensure `response.data` contains movies in the expected format
    let movies = response.data.movies || response.data || [];

    // Validate that `movies` is actually an array
    if (!Array.isArray(movies) || movies.length === 0) {
      console.error("🚨 API Response does not contain a valid movie list:", response.data);
      throw new Error("No movies found in API response.");
    }

    console.log("✅ Processed Movies:", movies);
    return movies;
  } catch (error: any) {
    console.error("❌ Error fetching movies:", error?.response?.data || error.message);
    return [];
  }
};

interface User {
  id: string;
  username: string;
  profilePicture?: string;
}

class AuthAPI {
  private static instance: AuthAPI;
  private currentUser: User | null = null;

  private constructor() {
    // Initialize from localStorage if available
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  public static getInstance(): AuthAPI {
    if (!AuthAPI.instance) {
      AuthAPI.instance = new AuthAPI();
    }
    return AuthAPI.instance;
  }

  public isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public async login(username: string, password: string): Promise<User> {
    try {
      // TODO: Replace with actual API call
      const response = await axios.post('/api/auth/login', { username, password });
      const userData = response.data as User;
      this.currentUser = userData;
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  public async logout(): Promise<void> {
    try {
      // TODO: Replace with actual API call
      await axios.post('/api/auth/logout');
      this.currentUser = null;
      localStorage.removeItem('currentUser');
    } catch (error) {
      throw new Error('Logout failed');
    }
  }

  public async register(username: string, password: string, email: string): Promise<User> {
    try {
      // TODO: Replace with actual API call
      const response = await axios.post('/api/auth/register', { username, password, email });
      const userData = response.data as User;
      this.currentUser = userData;
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw new Error('Registration failed');
    }
  }
}

export const authAPI = AuthAPI.getInstance();
