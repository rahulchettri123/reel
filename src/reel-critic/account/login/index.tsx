import { useState } from "react";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../../services/api";
import "./index.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const result = await authAPI.login(email, password);
      
      if (result.success) {
        // Redirect to home page on successful login
        navigate("/reel-critic/home");
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container className="login-container">
        <h2 className="text-white text-center mb-4">Sign In</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          {/* Email Input */}
          <Form.Group controlId="email">
            <Form.Control 
              type="email" 
              placeholder="Email or phone number" 
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          {/* Password Input */}
          <Form.Group controlId="password" className="mt-3">
            <Form.Control 
              type="password" 
              placeholder="Password" 
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          {/* Login Button */}
          <Button 
            variant="danger" 
            type="submit" 
            className="w-100 mt-4 login-btn"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          {/* Remember Me & Forgot Password */}
          <Row className="mt-3 text-light">
            <Col>
              <Form.Check type="checkbox" label="Remember me" className="text-light" />
            </Col>
            <Col className="text-end">
              <Link to="/forgot-password" className="text-muted login-link">Forgot password?</Link>
            </Col>
          </Row>

          {/* Sign Up */}
          <p className="mt-4 text-light text-center">
            New to <span className="text-danger">ReelCritic</span>?  
            <Link to="/register" className="text-danger ms-1 login-link">Sign up now</Link>
          </p>
        </Form>
      </Container>
    </div>
  );
}
