import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./login";
import Register from "./register";
import { Profile } from "../profile";
import { authAPI } from "../../services/api";

export default function Account() {
  // Check if user is logged in
  const isLoggedIn = authAPI.isLoggedIn();
  
  return (
    <Routes>
      {/* Redirect only ONCE to login if not logged in, otherwise to profile */}
      <Route path="/" element={
        isLoggedIn 
          ? <Navigate to="profile" /> 
          : <Navigate to="login" />
      } />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="profile" element={<Profile />} />
      <Route path="profile/:profileId" element={<Profile />} />
    </Routes>
  );
}
