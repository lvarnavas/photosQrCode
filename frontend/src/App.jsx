import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import UploadForm from './components/UploadForm';
import Gallery from './components/Gallery';
import React, { useState } from 'react';

function Home() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: document.title,
      text: 'Δείτε τις φωτογραφίες του γάμου μας!',
      url: window.location.origin,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or error
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.origin);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        // Clipboard error
      }
    }
  };

  return (
    <div className="card" style={{ maxWidth: 780, margin: '40px auto' }}>
      <h1 style={{ textAlign: 'center', color: '#b48a78', marginBottom: 8 }}>Dimitris & Matoula</h1>
      <p style={{ textAlign: 'center', color: '#3a2c2a', marginBottom: 24, fontSize: 20 }}>
        Είμαστε πολύ χαρούμενοι που είστε εδώ! 
        <br/>
        Μοιραστείτε τις αγαπημένες σας στιγμές ανεβάζοντας τις φωτογραφίες σας. 
        <br/>
        Σας ευχαριστούμε που κάνατε τη μέρα μας αξέχαστη!
      </p>
      <div className="qr-center" style={{ marginBottom: 12 }}>
        <img src="../qr-code/wedding-qr-code.png" alt="Wedding Upload QR Code" style={{ width: 180, height: 180, borderRadius: 12, border: '1px solid #eee' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
        <div className="share-btn-wrapper">
          <span className="share-btn-mobile-text">Κοινοποιήστε το</span>
          <button
            className="share-btn"
            onClick={handleShare}
            aria-label="Κοινοποιήστε το σύνδεσμο"
            type="button"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b48a78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            <span className="share-btn-tooltip">Κοινοποιήστε</span>
          </button>
          <span className="share-btn-label">Κοινοποιήστε</span>
        </div>
        {copied && (
          <span style={{ marginTop: 8, background: '#fffbe6', color: '#b48a78', border: '1px solid #b48a78', borderRadius: 8, padding: '4px 12px', fontSize: 14, boxShadow: '0 2px 8px #e9d6d6cc' }}>
            Αντιγράφηκε!
          </span>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around'}}>
        <button onClick={() => navigate('/upload')}>
          Ανεβάστε φωτογραφίες
        </button>
        <button onClick={() => navigate('/gallery')} style={{ background: '#fff', color: '#b48a78', border: '2px solid #b48a78' }}>
          Δείτε τις φωτογραφίες
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<UploadForm />} />
      <Route path="/gallery" element={<Gallery />} />
    </Routes>
  );
}

export default App;
