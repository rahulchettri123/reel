import React, { useState, useRef } from 'react';
import { Button, Image, Spinner, Modal } from 'react-bootstrap';
import { Camera } from 'lucide-react';

interface ProfilePictureUploadProps {
  currentPicture: string;
  onPictureUpdate: (newPictureUrl: string) => void;
  editable?: boolean;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ 
  currentPicture, 
  onPictureUpdate,
  editable = false
}) => {
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleModalClose = () => {
    setShowModal(false);
    setPreviewImage(null);
  };

  const handleSaveImage = () => {
    if (previewImage) {
      setUploading(true);
      
      // Simulate API call to upload image
      setTimeout(() => {
        onPictureUpdate(previewImage);
        setUploading(false);
        setShowModal(false);
        setPreviewImage(null);
      }, 1000);
    }
  };

  return (
    <>
      <div className="profile-picture-container position-relative">
        <Image 
          src={currentPicture} 
          roundedCircle 
          className="profile-picture mb-3"
          alt="Profile picture"
        />
        {editable && (
          <Button 
            variant="danger" 
            size="sm" 
            className="profile-picture-edit-btn"
            onClick={() => setShowModal(true)}
          >
            <Camera size={16} />
          </Button>
        )}
      </div>

      {/* Upload Modal */}
      <Modal show={showModal} onHide={handleModalClose} centered className="dark-modal">
        <Modal.Header closeButton>
          <Modal.Title>Update Profile Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <Image 
              src={previewImage || currentPicture} 
              roundedCircle 
              className="profile-picture-preview"
              alt="Profile picture preview"
            />
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            className="d-none"
            accept="image/*"
            onChange={handleFileSelect}
          />
          
          <div className="d-grid gap-2">
            <Button 
              variant="outline-light" 
              onClick={handleUploadClick}
              disabled={uploading}
            >
              Select Image
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleSaveImage}
            disabled={!previewImage || uploading}
          >
            {uploading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Uploading...
              </>
            ) : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfilePictureUpload; 