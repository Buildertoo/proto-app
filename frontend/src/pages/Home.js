import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', padding: '60px 40px', marginTop: '50px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '30px', color: '#333' }}>
          Welcome to the File Upload App
        </h1>
        
        {!isAuthenticated && (
          <div style={{ 
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '30px',
            color: '#856404'
          }}>
            <p style={{ fontSize: '1.1rem', margin: 0 }}>
              ℹ️ You're viewing the app in <strong>demo mode</strong>. Sign in to unlock full file upload functionality!
            </p>
          </div>
        )}
        
        <p style={{ fontSize: '1.3rem', color: '#666', marginBottom: '40px', lineHeight: '1.8' }}>
          Choose your preferred view to start uploading files
        </p>

        <div style={{ 
          display: 'flex', 
          gap: '30px', 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          marginTop: '40px'
        }}>
          <Link to="/carousel" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '40px 50px',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'transform 0.3s, box-shadow 0.3s',
              minWidth: '280px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🎠</div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Carousel View</h2>
              <p style={{ fontSize: '1rem', opacity: 0.9 }}>
                Upload files with an auto-rotating carousel interface
              </p>
            </div>
          </Link>

          <Link to="/list" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#28a745',
              color: 'white',
              padding: '40px 50px',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'transform 0.3s, box-shadow 0.3s',
              minWidth: '280px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📋</div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>List View</h2>
              <p style={{ fontSize: '1rem', opacity: 0.9 }}>
                Upload files with a clean, organized list interface
              </p>
            </div>
          </Link>
        </div>

        <div style={{ 
          marginTop: '50px', 
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '10px' }}>
            <strong>Getting Started:</strong>
          </p>
          <p style={{ fontSize: '1rem', color: '#666', lineHeight: '1.6' }}>
            Click on either the <strong>Carousel</strong> or <strong>List</strong> tab above,
            or select one of the options below to begin uploading your files.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
