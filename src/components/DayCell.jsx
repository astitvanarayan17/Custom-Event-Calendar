import { format, isSameDay, isSameMonth } from 'date-fns';
import { useEventStore } from '../store/useEventStore';
import { useDroppable, useDraggable } from '@dnd-kit/core';

function DraggableEvent({ event }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: event.id,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        zIndex: 50,
      }
    : { zIndex: 0 };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="bg-blue-500 text-white rounded px-1 py-0.5 mb-1 text-xs cursor-move shadow hover:bg-blue-600 transition-all"
      style={style}
    >
      <div className="font-semibold truncate">{event.title}</div>
      {event.description && (
        <div className="text-[10px] truncate">{event.description}</div>
      )}
    </div>
  );
}

function DayCell({ day, monthStart, onClick }) {
  const { events } = useEventStore();
  const { setNodeRef } = useDroppable({ id: day.toString() });

  const dayEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    if (isSameDay(eventDate, day)) return true;
    if (event.recurrence === 'daily') return true;
    if (event.recurrence === 'weekly' && eventDate.getDay() === day.getDay())
      return true;
    if (event.recurrence === 'monthly' && eventDate.getDate() === day.getDate())
      return true;
    return false;
  });

  return (
    <div
      ref={setNodeRef}
      className={`border h-24 p-1 text-xs relative cursor-pointer rounded hover:bg-gray-50 transition ${
        !isSameMonth(day, monthStart) ? 'text-gray-400 bg-gray-50' : 'bg-white'
      }`}
      onClick={() => onClick(day)}
    >
      <div className="font-bold">{format(day, 'd')}</div>

      <div className="absolute top-6 left-0 right-0 px-1 space-y-1">
        {dayEvents.slice(0, 2).map((event) => (
          <DraggableEvent key={event.id} event={event} />
        ))}
        {dayEvents.length > 2 && (
          <div className="text-gray-500 text-[10px] text-center">
            +{dayEvents.length - 2} more
          </div>
        )}
      </div>
    </div>
  );
}

export default DayCell;
