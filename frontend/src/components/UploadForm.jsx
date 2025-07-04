import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ACCEPTED_TYPES = '.jpg,.jpeg,.png,.gif,.bmp,.webp,.heic';

export default function UploadForm() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [modal, setModal] = useState({ open: false, success: true, message: '' });
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setModal({ open: false, success: true, message: '' });
    setProgress(0);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
      setModal({ open: false, success: true, message: '' });
      setProgress(0);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files.length) {
      setModal({ open: true, success: false, message: 'Παρακαλώ επιλέξτε τουλάχιστον μία εικόνα.' });
      return;
    }
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    try {
      setProgress(0);
      await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (p) => setProgress(Math.round((p.loaded * 100) / p.total)),
      });
      setFiles([]);
      setProgress(0);
      setModal({ open: true, success: true, message: 'Οι φωτογραφίες σας ανέβηκαν με επιτυχία!' });
    } catch (err) {
      setProgress(0);
      setModal({ open: true, success: false, message: err.response?.data?.error || 'Αποτυχία αποστολής.' });
    }
  };

  const closeModal = () => setModal({ ...modal, open: false });

  return (
    <div className="card" style={{ maxWidth: 580, margin: '40px auto' }}>
      <button onClick={() => navigate('/')} style={{ marginBottom: 24, marginTop: 8 }}>&larr; Επιστροφή</button>
      <h1 style={{ textAlign: 'center', marginBottom: 24, marginTop: 8, color: '#b48a78', fontWeight: 700, letterSpacing: '1px' }}>
        Upload your photos
      </h1>
      <p style={{ textAlign: 'center', color: '#000', marginBottom: 24, marginTop: 8, fontSize: 20 }}>
        Μοιραστείτε τις αγαπημένες σας στιγμές από τον γάμο ανεβάζοντας τις φωτογραφίες σας εδώ.
      </p>
      <span style={{ fontSize: 32}}>👇🏻</span>
      <form onSubmit={handleUpload}>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`upload-dropzone${dragActive ? ' active' : ''}`}
          style={{ marginBottom: 24, marginTop: 8 }}
        >
          <input
            type="file"
            accept={ACCEPTED_TYPES}
            multiple
            style={{ display: 'none' }}
            id="fileInput"
            onChange={handleFileChange}
          />
          <label htmlFor="fileInput" style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: 20, color: '#b48a78', marginBottom: 16, marginTop: 8, display: 'block' }}>
            {files.length > 0 ? `${files.length} εικόνα/ες επιλεγμένες` : 'Επιλέξτε μία ή περισσότερες εικόνες'}
          </label>
        </div>
        {progress > 0 && <div style={{ marginBottom: 16, marginTop: 8, color: '#b48a78' }}>Αποστολή: {progress}%</div>}
        <button type="submit" disabled={!files.length} style={{ marginBottom: 16, marginTop: 8 }}>
          Υποβολή
        </button>
      </form>
      {modal.open && (
        <div className="modal-overlay" style={{ zIndex: 2000 }} onClick={closeModal}>
          <div className="modal-content" style={{ minWidth: 400, padding: 32, textAlign: 'center', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 22, color: modal.success ? '#3a7a3a' : '#a06c5a', marginBottom: 24, fontWeight: 700 }}>
              {modal.message}
            </div>
            <button
              onClick={closeModal}
              style={{ background: '#b48a78', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontSize: 18, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 