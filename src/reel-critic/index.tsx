import { Route, Routes, Navigate } from "react-router-dom";
import Navigation from "./navigations";
import Home from "./home";
import Search from "./search";
import Account from "./account";
import Movies from "./movies";
import TrendingMovies from "./movies/trending_movies";
import TvShows from "./tvshows";
import MovieDetails from "./movies/moviesDetails";
import { UserProfile } from './profile';
import { CriticsProvider } from './home/CriticsContext';
import "./style.css";
import "./responsive.css";

export default function ReelCritic() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navigation />
      <div className="flex-grow-1">
        <CriticsProvider>
          <Routes>
            {/* Home Page */}
            <Route path="home" element={<Home />} />
            
            {/* Other Pages */}
            <Route path="account/*" element={<Account />} />
            <Route path="movies/*" element={<Movies />} />
            <Route path="tvshows" element={<TvShows/>} />
            <Route path="trending_movies" element={<TrendingMovies />} />
            <Route path="search/*" element={<Search />} />
            
            {/* Movie Details Routes */}
            <Route path="movies/:movieId" element={<MovieDetails />} />
            <Route path="details/:movieId" element={<MovieDetails />} />
            
            {/* Profile Page */}
            <Route path="profile/:userId" element={<UserProfile />} />
            
            {/* Default route - redirect to home */}
            <Route path="*" element={<Navigate to="home" replace />} />
          </Routes>
        </CriticsProvider>
      </div>
    </div>
  );
}
