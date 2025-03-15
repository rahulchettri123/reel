import React, { useState } from 'react';
import { Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { Save, X } from 'lucide-react';

interface UserProfile {
  username: string;
  name: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  phone: string;
}

interface EditProfileFormProps {
  show: boolean;
  onHide: () => void;
  currentProfile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  show,
  onHide,
  currentProfile,
  onSave
}) => {
  const [profile, setProfile] = useState<UserProfile>(currentProfile);
  const [errors, setErrors] = useState<Partial<Record<keyof UserProfile, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof UserProfile]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserProfile, string>> = {};
    let isValid = true;

    // Username validation
    if (!profile.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (profile.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      isValid = false;
    }

    // Email validation
    if (!profile.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    // Name validation
    if (!profile.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Bio validation (optional but with max length)
    if (profile.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
      isValid = false;
    }

    // Website validation (optional but must be valid URL if provided)
    if (profile.website && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(profile.website)) {
      newErrors.website = 'Website URL is invalid';
      isValid = false;
    }
    
    // Phone validation (optional but must be valid if provided)
    if (profile.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(profile.phone)) {
      newErrors.phone = 'Phone number is invalid';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(profile);
      onHide();
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide}
      centered
      contentClassName="bg-dark text-light"
      size="lg"
    >
      <Modal.Header className="border-secondary">
        <Modal.Title>Edit Profile</Modal.Title>
        <Button 
          variant="link" 
          className="close-button text-light p-0 ms-auto" 
          onClick={onHide}
        >
          <X size={24} />
        </Button>
      </Modal.Header>
      
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  isInvalid={!!errors.username}
                  className="bg-dark-secondary text-light border-secondary"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Your username is visible to everyone
                </Form.Text>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                  className="bg-dark-secondary text-light border-secondary"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Your full name is visible to everyone
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
              className="bg-dark-secondary text-light border-secondary"
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Your email is only visible to you
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              isInvalid={!!errors.phone}
              className="bg-dark-secondary text-light border-secondary"
              placeholder="(123) 456-7890"
            />
            <Form.Control.Feedback type="invalid">
              {errors.phone}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Your phone number is only visible to you
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              isInvalid={!!errors.bio}
              className="bg-dark-secondary text-light border-secondary"
              placeholder="Tell us about yourself..."
            />
            <Form.Text className="text-muted">
              {profile.bio.length}/500 characters
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              {errors.bio}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  className="bg-dark-secondary text-light border-secondary"
                  placeholder="City, Country"
                />
                <Form.Text className="text-muted">
                  Your location is visible to everyone
                </Form.Text>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Website</Form.Label>
                <Form.Control
                  type="text"
                  name="website"
                  value={profile.website}
                  onChange={handleChange}
                  isInvalid={!!errors.website}
                  className="bg-dark-secondary text-light border-secondary"
                  placeholder="https://example.com"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.website}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Your website is visible to everyone
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      
      <Modal.Footer className="border-secondary">
        <Button variant="outline-light" onClick={onHide}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          className="d-flex align-items-center"
        >
          <Save size={16} className="me-2" />
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfileForm; 