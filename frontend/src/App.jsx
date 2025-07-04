import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import UploadForm from './components/UploadForm';
import Gallery from './components/Gallery';

function Home() {
  const navigate = useNavigate();
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
      <div className="qr-center" style={{ marginBottom: 24 }}>
        <img src="../qr-code/wedding-qr-code.png" alt="Wedding Upload QR Code" style={{ width: 180, height: 180, borderRadius: 12, border: '1px solid #eee' }} />
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
