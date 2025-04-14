"use client";

import React, { useState } from 'react';

const UploadProfileImage: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    setUploading(true);
    setError('');
    
    try {
      // Convert to base64
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        
        // Send to API
        const response = await fetch('/api/save-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageData: base64 }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          setUploadSuccess(true);
          // Force reload page to see changes
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          setError(data.message || 'Failed to upload image');
        }
      };
      
      reader.onerror = () => {
        setError('Error reading file');
      };
      
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-secondary rounded-lg shadow-lg p-4 border border-accent-cyan/30">
        <h3 className="text-accent-cyan text-sm font-medium mb-2">Profile Image Upload</h3>
        
        <label className="flex items-center justify-center w-full border-2 border-dashed border-accent-cyan/50 rounded-md p-2 cursor-pointer hover:bg-accent-cyan/10 transition-colors">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileUpload} 
            disabled={uploading}
          />
          <span className="text-xs text-text-light">
            {uploading ? 'Uploading...' : 'Click to select profile image'}
          </span>
        </label>
        
        {error && (
          <p className="text-red-400 text-xs mt-2">{error}</p>
        )}
        
        {uploadSuccess && (
          <p className="text-green-400 text-xs mt-2">Image uploaded successfully! Reloading...</p>
        )}
      </div>
    </div>
  );
};

export default UploadProfileImage; 