import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fileAPI } from '../services/api';

const MyUploads = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Load files from API
  useEffect(() => {
    if (isAuthenticated) {
      loadFiles();
    }
  }, [isAuthenticated]);

  const loadFiles = async () => {
    try {
      const result = await fileAPI.getFiles();
      if (result.success) {
        setUploadedFiles(result.files);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedFiles(uploadedFiles.map(file => file.fileId));
    } else {
      setSelectedFiles([]);
    }
  };

  const handleSelectFile = (fileId) => {
    setSelectedFiles(prev => {
      if (prev.includes(fileId)) {
        return prev.filter(id => id !== fileId);
      } else {
        return [...prev, fileId];
      }
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select files to delete');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedFiles.length} file(s)?`)) {
      try {
        // Delete all selected files
        await Promise.all(selectedFiles.map(fileId => fileAPI.deleteFile(fileId)));
        
        // Reload files
        await loadFiles();
        setSelectedFiles([]);
      } catch (error) {
        console.error('Error deleting files:', error);
        alert('Failed to delete some files');
      }
    }
  };

  const allSelected = uploadedFiles.length > 0 && selectedFiles.length === uploadedFiles.length;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Uploads</h2>
      
      {uploadedFiles.length === 0 ? (
        <div className="alert alert-info">
          <p className="mb-0">You haven't uploaded any files yet. Visit the Carousel page to upload files!</p>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="selectAll"
                checked={allSelected}
                onChange={handleSelectAll}
              />
              <label className="form-check-label" htmlFor="selectAll">
                Select All ({uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''})
              </label>
            </div>
            <button
              className="btn btn-danger"
              onClick={handleDeleteSelected}
              disabled={selectedFiles.length === 0}
            >
              Delete Selected ({selectedFiles.length})
            </button>
          </div>

          <div className="row">
            {uploadedFiles.map((file) => (
              <div key={file.fileId} className="col-md-4 col-lg-3 mb-4">
                <div className={`card h-100 ${selectedFiles.includes(file.fileId) ? 'border-primary' : ''}`}>
                  <div className="card-body">
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`file-${file.fileId}`}
                        checked={selectedFiles.includes(file.fileId)}
                        onChange={() => handleSelectFile(file.fileId)}
                      />
                      <label className="form-check-label" htmlFor={`file-${file.fileId}`}>
                        <small className="text-muted">Window #{file.slideId}</small>
                      </label>
                    </div>

                    <div className="text-center mb-3">
                      {file.data && typeof file.data === 'string' && file.data.startsWith('data:image') ? (
                        <img
                          src={file.data}
                          alt={file.name}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '150px',
                            borderRadius: '8px',
                            objectFit: 'contain'
                          }}
                        />
                      ) : file.data === 'pdf' ? (
                        <div style={{ fontSize: '4rem' }}>📄</div>
                      ) : file.data === 'doc' ? (
                        <div style={{ fontSize: '4rem' }}>📝</div>
                      ) : file.data && typeof file.data === 'object' && file.data.type === 'text' ? (
                        <div style={{
                          backgroundColor: '#f8f9fa',
                          padding: '10px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontFamily: 'monospace',
                          maxHeight: '100px',
                          overflow: 'hidden',
                          textAlign: 'left'
                        }}>
                          {file.data.preview}...
                        </div>
                      ) : (
                        <div style={{ fontSize: '4rem' }}>📄</div>
                      )}
                    </div>

                    <h6 className="card-title text-truncate" title={file.name}>
                      {file.name}
                    </h6>
                    <p className="card-text">
                      <small className="text-muted">
                        Size: {(file.size / 1024).toFixed(2)} KB
                      </small>
                    </p>
                    {file.uploadedAt && (
                      <p className="card-text">
                        <small className="text-muted">
                          Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}
                        </small>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyUploads;
