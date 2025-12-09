import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import FileUpload from '../components/FileUpload';
import { fileAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CarouselPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [hoveredSlide, setHoveredSlide] = useState(null);
  const { isAuthenticated } = useAuth();

  // Load files from API on mount
  useEffect(() => {
    if (!isAuthenticated) {
      setUploadedFiles({});
      return;
    }

    const loadFiles = async () => {
      try {
        const result = await fileAPI.getFiles();
        if (result.success) {
          // Convert array to object keyed by slideId
          const filesObject = {};
          result.files.forEach(file => {
            filesObject[file.slideId] = file;
          });
          setUploadedFiles(filesObject);
        }
      } catch (error) {
        console.error('Error loading files:', error);
      }
    };

    loadFiles();
  }, [isAuthenticated]);

  const handleFileSelect = async (slideId, file, fileData) => {
    if (!isAuthenticated) return;

    try {
      const result = await fileAPI.saveFile(slideId, file, fileData);
      
      if (result.success) {
        const updatedFiles = {
          ...uploadedFiles,
          [slideId]: result.file
        };
        setUploadedFiles(updatedFiles);
        console.log(`File uploaded to slide ${slideId}:`, file.name);
      }
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Failed to save file');
    }
  };

  const handleInteractionStart = () => {
    // Interaction callbacks for FileUpload component
  };

  const handleInteractionEnd = () => {
    // Interaction callbacks for FileUpload component
  };

  // Carousel slides data
  const slides = [
    { id: 1, title: 'Welcome to Our App', description: 'Building amazing experiences with React and Node.js', bg: '#007bff' },
    { id: 2, title: 'Modern Design', description: 'Clean and responsive user interface', bg: '#6610f2' },
    { id: 3, title: 'Fast Performance', description: 'Optimized for speed and efficiency', bg: '#6f42c1' },
    { id: 4, title: 'Secure & Reliable', description: 'Built with security best practices', bg: '#e83e8c' },
    { id: 5, title: 'Easy Integration', description: 'RESTful API for seamless connectivity', bg: '#dc3545' },
    { id: 6, title: 'Scalable Architecture', description: 'Ready to grow with your needs', bg: '#fd7e14' },
    { id: 7, title: 'Developer Friendly', description: 'Clean code and comprehensive documentation', bg: '#ffc107' },
    { id: 8, title: 'Cross-Platform', description: 'Works everywhere, on any device', bg: '#28a745' },
    { id: 9, title: 'Active Support', description: 'Regular updates and maintenance', bg: '#20c997' },
    { id: 10, title: 'Open Source', description: 'Free to use and customize', bg: '#17a2b8' },
  ];

  return (
    <div className="container">
      {/* Carousel Section */}
      <div style={{ marginBottom: '30px' }}>
        <Carousel interval={5000} pause="hover">
          {slides.map((slide) => (
            <Carousel.Item key={slide.id}>
              <div
                onMouseEnter={() => setHoveredSlide(slide.id)}
                onMouseLeave={() => setHoveredSlide(null)}
                style={{
                  minHeight: '500px',
                  backgroundColor: slide.bg,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  padding: '20px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease',
                  transform: hoveredSlide === slide.id ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                {/* Darker overlay that expands on hover */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    opacity: hoveredSlide === slide.id ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                    borderRadius: '8px',
                    pointerEvents: 'none',
                  }}
                />
                <div style={{ textAlign: 'center', color: 'white', padding: '20px', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
                  <h2 style={{ fontSize: '2.5rem', marginBottom: '15px', fontWeight: 'bold' }}>
                    {slide.title}
                  </h2>
                  <p style={{ fontSize: '1.3rem', maxWidth: '600px', margin: '0 auto' }}>
                    {slide.description}
                  </p>
                </div>
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <FileUpload 
                    slideId={slide.id} 
                    onFileSelect={handleFileSelect}
                    onInteractionStart={handleInteractionStart}
                    onInteractionEnd={handleInteractionEnd}
                    savedFile={uploadedFiles[slide.id]}
                  />
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default CarouselPage;
