import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CalendarComponent from '../../components/Calendar/CalendarComponent';
import '../home/home.css';
import { auth } from '../../firebaseConfig';

function Home() {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName || 'User'); // Use 'User' as a fallback if displayName is not available
    }
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('User signed out');
      navigate('/'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="Home">
      <header>
        <h1>{userName}'s Wardrobe</h1>
      </header>
      <main className="main-container">
        <div className="wardrobe-tabs">
          {/* View wardrobe tab */}
          <div className="wardrobe-tab view-wardrobe-tab">
            <h3>Today's collections</h3>
            <img src="/images/harvey.jpg" alt="Model" />
            <Link to="/veiw">
            <button>View</button>
            </Link>
          </div>
          {/* Modify wardrobe tab */}
          <div className="wardrobe-tab modify-wardrobe-tab">
            <h3>Modify Wardrobe</h3>
            <img src="/images/image.png" alt="Model" />
            {/* Link to the UploadForm page */}
            <Link to="/upload">
              <button>Modify</button>
            </Link>
          </div>
        </div>
        <CalendarComponent />
      </main>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;
