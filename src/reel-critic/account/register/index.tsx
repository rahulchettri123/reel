import { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../../services/api";
import "./index.css";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.username || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (!formData.agreeTerms) {
      setError("You must agree to the Terms & Conditions");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const userData = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password, // In a real app, you'd hash this on the server
        bio: "",
        location: "",
        website: "",
        profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`
      };
      
      const result = await authAPI.register(userData);
      
      if (result.success) {
        // Redirect to home page on successful registration
        navigate("/reel-critic/home");
      } else {
        setError(result.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Container className="register-container">
        <h2 className="text-white text-center mb-4">Sign Up</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          {/* Name Input */}
          <Form.Group controlId="name">
            <Form.Control 
              type="text" 
              name="name"
              placeholder="Full Name" 
              className="register-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Username Input */}
          <Form.Group controlId="username" className="mt-3">
            <Form.Control 
              type="text" 
              name="username"
              placeholder="Username" 
              className="register-input"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Email Input */}
          <Form.Group controlId="email" className="mt-3">
            <Form.Control 
              type="email" 
              name="email"
              placeholder="Email address" 
              className="register-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Password Input */}
          <Form.Group controlId="password" className="mt-3">
            <Form.Control 
              type="password" 
              name="password"
              placeholder="Password" 
              className="register-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Confirm Password Input */}
          <Form.Group controlId="confirmPassword" className="mt-3">
            <Form.Control 
              type="password" 
              name="confirmPassword"
              placeholder="Confirm Password" 
              className="register-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Terms & Conditions */}
          <Form.Group className="mt-3">
            <Form.Check 
              type="checkbox" 
              name="agreeTerms"
              label="I agree to the Terms & Conditions" 
              className="text-light"
              checked={formData.agreeTerms}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Register Button */}
          <Button 
            variant="danger" 
            type="submit" 
            className="w-100 mt-4 register-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>

          {/* Already have an account? */}
          <p className="mt-4 text-light text-center">
            Already a member? 
            <Link to="/reel-critic/account/login" className="text-danger ms-1 register-link">Sign in now</Link>
          </p>
        </Form>
      </Container>
    </div>
  );
}
