import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar'; // Assuming you're using react-calendar library
import 'react-calendar/dist/Calendar.css';
import './CalendarComponent.css'; // Import your component-specific CSS file
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import { startOfDay, endOfDay } from 'date-fns';


function CalendarComponent() {
  const [selectedDate, setSelectedDate] = useState(null); // State to track selected date
  const [wardrobeData, setWardrobeData] = useState([]); // State to store wardrobe data for selected date
  const [loading, setLoading] = useState(false); // State to track loading state
  const popupRef = useRef(null); // Ref for the popup card

  // Function to handle date click
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    if (selectedDate) {
      console.log('Fetching wardrobe data...');
      setLoading(true);
      
      const fetchWardrobeData = async () => {
        const start = startOfDay(selectedDate); // Get the start of the selected date
        const end = endOfDay(selectedDate);     // Get the end of the selected date
    
        const q = query(collection(firestore, 'wardrobe'), 
                        where('date', '>=', start), // Use start directly
                        where('date', '<=', end));  // Use end directly
    
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => doc.data());
        setWardrobeData(data);
        setLoading(false);
      };
    
      fetchWardrobeData();
    }
  }, [selectedDate]);
  
  // Function to handle click outside the popup card
  const handleClickOutsidePopup = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setSelectedDate(null); // Close the popup
    }
  };

  useEffect(() => {
    // Add event listener when component mounts
    document.addEventListener("mousedown", handleClickOutsidePopup);
    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutsidePopup);
    };
  }, []);

  console.log('Selected date:', selectedDate);
  console.log('Wardrobe data:', wardrobeData);

  return (
    <div>
      <Calendar
        onClickDay={handleDateClick}
      />
      {/* Popup card to display wardrobe data */}
      {selectedDate && (
        <div className="popup-overlay">
          <div ref={popupRef} className="popup">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {wardrobeData.length > 0 ? (
                  <>
                    {wardrobeData.map(item => (
                      <div key={item.id}>
                        <img className="wardrobe-image" src={item.imageUrl} alt="Wardrobe" />
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <p>Category: {item.category}</p>
                      </div>
                    ))}
                  </>
                ) : (
                  <p>No data available for selected date</p>
                )}
                <button onClick={() => setSelectedDate(null)}>Close</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarComponent;
  