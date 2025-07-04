import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EVENT_NAME = 'dimitris-matoula-wedding';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalImg, setModalImg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchImages() {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('/api/upload/images');
        setImages(res.data);
      } catch {
        setError('Could not load images.');
      }
      setLoading(false);
    }
    fetchImages();
  }, []);

  return (
    <div className="card" style={{ maxWidth: 960, margin: '40px auto' }}>
      <button onClick={() => navigate('/')} style={{ marginBottom: 16 }}>&larr; Επιστροφή</button>
      <h1 style={{ textAlign: 'center', marginBottom: 52, color: '#b48a78', fontWeight: 700, letterSpacing: '1px' }}>Wedding Gallery</h1>
      {loading && <div style={{ textAlign: 'center' }}>Loading...</div>}
      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      <div className="gallery-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {images.map((img, idx) => (
          <img
            key={idx}
            src={`/uploads/${EVENT_NAME}/images/${img}`}
            alt={`Wedding ${idx}`}
            className="gallery-image"
            loading="lazy"
            onClick={() => setModalImg(`/uploads/${EVENT_NAME}/images/${img}`)}
          />
        ))}
      </div>
      {!loading && images.length === 0 && <div style={{ textAlign: 'center', color: '#888', marginTop: 32 }}>No photos uploaded yet.</div>}
      {modalImg && (
        <div className="modal-overlay" onClick={() => setModalImg(null)}>
          <div className="gallery-modal-content" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setModalImg(null)}
              className="gallery-modal-close"
              aria-label="Close"
            >
              &times;
            </button>
            <img
              src={modalImg}
              alt="Full size wedding"
              style={{
                maxWidth: '90vw',
                maxHeight: '80vh',
                borderRadius: 16,
                boxShadow: '0 4px 32px #0008',
                display: 'block'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
} 