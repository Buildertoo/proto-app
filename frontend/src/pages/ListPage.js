import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import { fileAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ListPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState({});
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

  const handleFileSelect = async (itemId, file, fileData) => {
    if (!isAuthenticated) return;

    try {
      const result = await fileAPI.saveFile(itemId, file, fileData);
      
      if (result.success) {
        const updatedFiles = {
          ...uploadedFiles,
          [itemId]: result.file
        };
        setUploadedFiles(updatedFiles);
        console.log(`File uploaded to item ${itemId}:`, file.name);
      }
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Failed to save file');
    }
  };

  // List items data
  const items = [
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
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '10px' }}>
          List View
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>
          Browse and upload files for each item
        </p>
      </div>

      {/* List Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: item.bg,
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '20px'
            }}>
              {/* Item Info */}
              <div style={{ color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                  <span style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: '5px 15px',
                    borderRadius: '20px'
                  }}>
                    #{item.id}
                  </span>
                  <h2 style={{ fontSize: '1.8rem', margin: 0, fontWeight: 'bold' }}>
                    {item.title}
                  </h2>
                </div>
                <p style={{ fontSize: '1.1rem', margin: 0, opacity: 0.9 }}>
                  {item.description}
                </p>
              </div>

              {/* File Upload Component */}
              <FileUpload 
                slideId={item.id} 
                onFileSelect={handleFileSelect}
                savedFile={uploadedFiles[item.id]}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListPage;
