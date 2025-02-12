import React, { useState, useEffect } from 'react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);

  // Function to get days of the current month
  const getDaysInMonth = (date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const days = [];

    // Fill the first empty days of the previous month
    for (let i = startOfMonth.getDay(); i > 0; i--) {
      days.push(null);  // Empty days for the previous month
    }

    // Fill the current month's days
    for (let i = 1; i <= endOfMonth.getDate(); i++) {
      days.push(i);
    }

    return days;
  };

  useEffect(() => {
    setDaysInMonth(getDaysInMonth(currentDate));
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getMonthName = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[currentDate.getMonth()];
  };

  return (
    <div>
      <style>
        {`
          .calendar-container {
            position: fixed;
            left: 0;
            top: 0;
            height: 100vh;
            width: 300px;
            background-color: #f4f4f4;
            padding: 20px;
            z-index: 10;
            box-shadow: 4px 0px 8px rgba(0, 0, 0, 0.1);
          }

          .calendar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }

          .calendar-header button {
            background-color: #3b82f6;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
          }

          .calendar-header h3 {
            margin: 0;
            font-size: 1.2rem;
          }

          .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            grid-gap: 5px;
          }

          .calendar-day {
            text-align: center;
            padding: 10px;
            font-size: 1rem;
            border-radius: 4px;
          }

          .calendar-day.empty {
            background-color: #e0e0e0;
          }

          .calendar-day.header {
            font-weight: bold;
            background-color: #3b82f6;
            color: white;
          }
        `}
      </style>
      
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={handlePrevMonth}>Previous</button>
          <h3>{getMonthName()} {currentDate.getFullYear()}</h3>
          <button onClick={handleNextMonth}>Next</button>
        </div>
        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div key={index} className="calendar-day header">{day}</div>
          ))}
          {daysInMonth.map((day, index) => (
            <div key={index} className={`calendar-day ${day ? '' : 'empty'}`}>
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
