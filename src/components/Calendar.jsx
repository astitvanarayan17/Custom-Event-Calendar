import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
} from 'date-fns';
import DayCell from './DayCell';
import { useEventStore } from '../store/useEventStore';
import EventModal from './EventModal';

function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { events } = useEventStore();

  const handleDayClick = (clickedDay) => {
    setSelectedDate(clickedDay);
    const eventForDay = events.find(
      (event) => new Date(event.date).toDateString() === clickedDay.toDateString()
    );
    setSelectedEvent(eventForDay || null);
    setIsModalOpen(true);
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4 px-4 py-2 bg-blue-50 rounded shadow">
      <button
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
      >
        ❮
      </button>
      <h2 className="text-2xl font-bold text-gray-700">
        {format(currentMonth, 'MMMM yyyy')}
      </h2>
      <button
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
      >
        ❯
      </button>
    </div>
  );

  const renderDays = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 bg-gray-100 rounded text-center text-gray-700 font-semibold py-2">
        {weekDays.map((day) => (
          <div key={day} className="uppercase text-xs">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        days.push(
          <DayCell
            key={day.toString()}
            day={day}
            monthStart={monthStart}
            onClick={handleDayClick}
          />
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }

    return <div className="space-y-1 mt-2">{rows}</div>;
  };

  return (
    <div className="p-4 max-w-5xl mx-auto bg-white rounded-lg shadow-md">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {isModalOpen && (
        <EventModal
          selectedDate={selectedDate}
          existingEvent={selectedEvent}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Calendar;
