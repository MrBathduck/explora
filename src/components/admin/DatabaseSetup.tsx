/**
 * Database Setup Component
 * Temporary component to initialize the enhanced database schema
 * 
 * Instructions:
 * 1. Import this component in your App.tsx
 * 2. Add it to your JSX temporarily
 * 3. Click the "Setup Database" button once
 * 4. Remove this component after setup is complete
 */

import React, { useState } from 'react';
import setupDatabase from '../../utils/setupDatabase';

const DatabaseSetup: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'setting-up' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const handleSetupDatabase = async () => {
    setStatus('setting-up');
    setMessage('Setting up database...');

    try {
      await setupDatabase();
      setStatus('success');
      setMessage('✅ Database setup completed successfully! You can now remove this component.');
    } catch (error) {
      setStatus('error');
      setMessage(`❌ Setup failed: ${error}`);
      console.error('Database setup error:', error);
    }
  };

  const buttonStyle: React.CSSProperties = {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: status === 'setting-up' ? 'not-allowed' : 'pointer',
    backgroundColor: status === 'success' ? '#10b981' : status === 'error' ? '#ef4444' : '#3b82f6',
    color: 'white',
    transition: 'all 0.2s ease',
    opacity: status === 'setting-up' ? 0.7 : 1
  };

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    border: '2px solid #e5e7eb',
    zIndex: 1000,
    maxWidth: '400px'
  };

  const titleStyle: React.CSSProperties = {
    margin: '0 0 12px 0',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937'
  };

  const messageStyle: React.CSSProperties = {
    margin: '12px 0',
    fontSize: '14px',
    color: status === 'error' ? '#dc2626' : status === 'success' ? '#059669' : '#6b7280',
    lineHeight: '1.5'
  };

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>🚀 Database Setup</h3>
      
      <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#6b7280' }}>
        Click to initialize the enhanced database schema with categories, tags, and Vienna location data.
      </p>

      <button
        onClick={handleSetupDatabase}
        disabled={status === 'setting-up'}
        style={buttonStyle}
      >
        {status === 'setting-up' ? 'Setting up...' : 
         status === 'success' ? '✅ Setup Complete' :
         status === 'error' ? '❌ Setup Failed' :
         '🚀 Setup Database'}
      </button>

      {message && (
        <div style={messageStyle}>
          {message}
        </div>
      )}

      {status === 'success' && (
        <div style={{ marginTop: '16px', fontSize: '12px', color: '#6b7280' }}>
          <strong>Next steps:</strong>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>Remove this component from your App.tsx</li>
            <li>Use EnhancedLocationService for advanced features</li>
            <li>Existing components will continue to work unchanged</li>
          </ul>
        </div>
      )}

      {status === 'error' && (
        <div style={{ marginTop: '16px', fontSize: '12px', color: '#dc2626' }}>
          <strong>Troubleshooting:</strong>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>Check Firebase configuration</li>
            <li>Ensure Firestore is enabled</li>
            <li>Check browser console for details</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DatabaseSetup;