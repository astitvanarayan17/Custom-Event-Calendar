import { useState, useEffect } from 'react';
import { useEventStore } from '../store/useEventStore';

function EventModal({ selectedDate, closeModal, existingEvent = null }) {
  const { addEvent, updateEvent, deleteEvent } = useEventStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [recurrence, setRecurrence] = useState('none');
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);

  useEffect(() => {
    if (existingEvent) {
      setTitle(existingEvent.title);
      setDescription(existingEvent.description);
      setRecurrence(existingEvent.recurrence || 'none');
    } else {
      setTitle('');
      setDescription('');
      setRecurrence('none');
    }
  }, [existingEvent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Title is required');

    if (existingEvent) {
      updateEvent({
        ...existingEvent,
        title: title.trim(),
        description: description.trim(),
        recurrence,
      });
    } else {
      addEvent({
        title: title.trim(),
        description: description.trim(),
        date: selectedDate,
        recurrence,
      });
    }
    closeModal();
  };

  const handleDelete = (deleteAll) => {
    if (!existingEvent) return;
    if (deleteAll && existingEvent.recurrenceId) {
      deleteEvent(existingEvent.recurrenceId, { deleteAllRecurrences: true });
    } else {
      deleteEvent(existingEvent.id);
    }
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-96 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">
          {existingEvent ? 'Edit Event' : 'Add Event'}
        </h2>

        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 p-2 w-full rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
          rows="2"
        />

        <select
          value={recurrence}
          onChange={(e) => setRecurrence(e.target.value)}
          className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="none">No Recurrence</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        <div className="flex justify-between items-center">
          {existingEvent && !showDeleteOptions && (
            <button
              type="button"
              onClick={() => setShowDeleteOptions(true)}
              className="text-red-600 hover:text-red-800 underline text-sm"
            >
              Delete
            </button>
          )}

          {existingEvent && showDeleteOptions && (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleDelete(false)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
              >
                Delete This Event
              </button>
              {existingEvent.recurrence !== 'none' && (
                <button
                  type="button"
                  onClick={() => handleDelete(true)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                >
                  Delete All Recurrences
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowDeleteOptions(false)}
                className="bg-gray-300 px-3 py-1 rounded-md hover:bg-gray-400 text-sm"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="flex gap-2 ml-auto">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-200 px-4 py-1 rounded-md hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 text-sm"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EventModal;
