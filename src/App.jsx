import { DndContext } from '@dnd-kit/core';
import Calendar from './components/Calendar';
import { useEventStore } from './store/useEventStore';
import { useState } from 'react';

function App() {
  const updateEvent = useEventStore((state) => state.updateEvent);
  const updateRecurringEventDates = useEventStore((state) => state.updateRecurringEventDates);
  const events = useEventStore((state) => state.events);

  const [activeEvent, setActiveEvent] = useState(null);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveEvent(null);
      return;
    }

    const movedEvent = events.find((e) => e.id === active.id);
    const newDate = new Date(over.id);

    if (!movedEvent) return;

    if (movedEvent.recurrence && movedEvent.recurrence !== 'none') {
      const moveAll = window.confirm('Move all recurring events?');
      if (moveAll) {
        updateRecurringEventDates(movedEvent.recurrenceId, newDate);
      } else {
        updateEvent({ ...movedEvent, date: newDate });
      }
    } else {
      updateEvent({ ...movedEvent, date: newDate });
    }

    setActiveEvent(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <DndContext onDragEnd={handleDragEnd}>
        <Calendar />
      </DndContext>
    </div>
  );
}

export default App;
