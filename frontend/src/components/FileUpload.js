import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import './FileUpload.css';

// Configure PDF.js worker - use local worker file
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const FileUpload = ({ slideId, onFileSelect, onInteractionStart, onInteractionEnd, savedFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const fileInputRef = useRef(null);
  const { isAuthenticated } = useAuth();

  // Load saved file on mount
  useEffect(() => {
    if (savedFile) {
      setSelectedFile(savedFile);
      setThumbnail(savedFile.data);
    }
  }, [savedFile]);

  const generateThumbnail = async (file) => {
    return new Promise(async (resolve, reject) => {
      const reader = new FileReader();

      if (file.type.startsWith('image/')) {
        // For images, create a thumbnail
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const maxSize = 300;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxSize) {
                height *= maxSize / width;
                width = maxSize;
              }
            } else {
              if (height > maxSize) {
                width *= maxSize / height;
                height = maxSize;
              }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        // For PDFs, render first page as thumbnail
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          const page = await pdf.getPage(1);
          
          const viewport = page.getViewport({ scale: 1 });
          const scale = Math.min(300 / viewport.width, 300 / viewport.height);
          const scaledViewport = page.getViewport({ scale });
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = scaledViewport.width;
          canvas.height = scaledViewport.height;
          
          await page.render({
            canvasContext: context,
            viewport: scaledViewport
          }).promise;
          
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        } catch (error) {
          console.error('Error rendering PDF:', error);
          resolve('pdf'); // Fallback to icon
        }
      } else if (
        file.type === 'application/msword' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        // For Word docs, convert to HTML and render as thumbnail
        try {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.convertToHtml({ arrayBuffer });
          const html = result.value;
          
          // Create a temporary container to render HTML
          const container = document.createElement('div');
          container.style.width = '600px';
          container.style.padding = '20px';
          container.style.backgroundColor = 'white';
          container.style.fontFamily = 'Arial, sans-serif';
          container.style.fontSize = '12px';
          container.style.lineHeight = '1.5';
          container.innerHTML = html;
          document.body.appendChild(container);
          
          // Use html2canvas to capture the first portion
          const html2canvas = (await import('html2canvas')).default;
          const canvas = await html2canvas(container, {
            width: 600,
            height: 400,
            scale: 1
          });
          
          document.body.removeChild(container);
          
          // Scale down to thumbnail size
          const thumbnailCanvas = document.createElement('canvas');
          const ctx = thumbnailCanvas.getContext('2d');
          const maxSize = 300;
          const scale = maxSize / canvas.width;
          thumbnailCanvas.width = maxSize;
          thumbnailCanvas.height = Math.min(canvas.height * scale, 400);
          
          ctx.drawImage(canvas, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);
          resolve(thumbnailCanvas.toDataURL('image/jpeg', 0.7));
        } catch (error) {
          console.error('Error rendering Word document:', error);
          resolve('doc'); // Fallback to icon
        }
      } else if (file.type === 'text/plain') {
        // For text files, read first 100 characters
        reader.onload = (e) => {
          resolve({ type: 'text', preview: e.target.result.substring(0, 100) });
        };
        reader.readAsText(file);
      } else {
        // For other files, just use generic icon
        resolve('file');
      }

      reader.onerror = reject;
    });
  };

  const processFile = async (file) => {
    setSelectedFile(file);
    const thumbnailData = await generateThumbnail(file);
    setThumbnail(thumbnailData);
    
    if (onFileSelect) {
      onFileSelect(slideId, file, thumbnailData);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    setIsDragging(true);
    if (onInteractionStart) onInteractionStart();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    setIsDragging(false);
    if (onInteractionEnd) onInteractionEnd();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    setIsDragging(false);
    if (onInteractionEnd) onInteractionEnd();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileSelect = async (e) => {
    if (!isAuthenticated) return;
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleButtonClick = () => {
    if (!isAuthenticated) return;
    if (onInteractionStart) onInteractionStart();
    fileInputRef.current.click();
  };

  const handleMouseEnter = () => {
    if (onInteractionStart) onInteractionStart();
  };

  const handleMouseLeave = () => {
    if (onInteractionEnd) onInteractionEnd();
  };

  return (
    <div
      className={`file-upload-container ${isDragging ? 'dragging' : ''} ${!isAuthenticated ? 'disabled' : ''}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!isAuthenticated && (
        <div className="auth-overlay">
          <div className="auth-message">
            <p>🔒 Sign in to upload files</p>
          </div>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={!isAuthenticated}
      />
      
      {selectedFile ? (
        <div className="file-selected" style={{ textAlign: 'center' }}>
          {thumbnail && typeof thumbnail === 'string' && thumbnail.startsWith('data:image') ? (
            <img 
              src={thumbnail} 
              alt="Thumbnail" 
              style={{
                maxWidth: '350px',
                maxHeight: '250px',
                borderRadius: '8px',
                marginBottom: '15px',
                objectFit: 'contain',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }}
            />
          ) : thumbnail === 'pdf' ? (
            <div style={{ fontSize: '5rem', marginBottom: '15px' }}>📄</div>
          ) : thumbnail === 'doc' ? (
            <div style={{ fontSize: '5rem', marginBottom: '15px' }}>📝</div>
          ) : thumbnail && typeof thumbnail === 'object' && thumbnail.type === 'text' ? (
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '15px',
              maxWidth: '350px',
              fontSize: '0.9rem',
              fontFamily: 'monospace',
              color: '#333',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'pre-wrap',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              margin: '0 auto 15px auto'
            }}>
              {thumbnail.preview}...
            </div>
          ) : (
            <div style={{ fontSize: '5rem', marginBottom: '15px' }}>📄</div>
          )}
          <div className="file-name" style={{ marginBottom: '8px', fontWeight: '500' }}>{selectedFile.name}</div>
          <div className="file-size" style={{ marginBottom: '15px', color: '#666' }}>
            {(selectedFile.size / 1024).toFixed(2)} KB
          </div>
          <button 
            className="browse-button" 
            onClick={handleButtonClick}
            disabled={!isAuthenticated}
            style={{ marginTop: '10px' }}
          >
            Change File
          </button>
        </div>
      ) : (
        <>
          <div className="file-upload-content">
            <div className="upload-icon">📁</div>
            <p className="upload-text">Drag & Drop your file here</p>
            <p className="upload-subtext">or</p>
          </div>
          <button 
            className="browse-button" 
            onClick={handleButtonClick}
            disabled={!isAuthenticated}
          >
            Browse Files
          </button>
        </>
      )}
    </div>
  );
};

export default FileUpload;
