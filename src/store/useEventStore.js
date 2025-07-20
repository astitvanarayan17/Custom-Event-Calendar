import { create } from 'zustand';
import { nanoid } from 'nanoid';

export const useEventStore = create((set) => ({
  events: JSON.parse(localStorage.getItem('events')) || [],

  addEvent: (event) =>
    set((state) => {
      const newEvent = {
        ...event,
        id: nanoid(),
        recurrenceId: event.recurrence !== 'none' ? nanoid() : null,
      };
      const updatedEvents = [...state.events, newEvent];
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      return { events: updatedEvents };
    }),

  updateEvent: (updatedEvent) =>
    set((state) => {
      const updatedEvents = state.events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      );
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      return { events: updatedEvents };
    }),

  deleteEvent: (identifier, options = { deleteAllRecurrences: false }) =>
    set((state) => {
      const updatedEvents = options.deleteAllRecurrences
        ? state.events.filter((event) => event.recurrenceId !== identifier)
        : state.events.filter((event) => event.id !== identifier);

      localStorage.setItem('events', JSON.stringify(updatedEvents));
      return { events: updatedEvents };
    }),

  updateEventDate: (id, newDate) =>
    set((state) => {
      const updatedEvents = state.events.map((event) =>
        event.id === id ? { ...event, date: newDate } : event
      );
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      return { events: updatedEvents };
    }),
    updateRecurringEventDates: (recurrenceId, newDate) =>
  set((state) => {
    const updatedEvents = state.events.map((event) =>
      event.recurrenceId === recurrenceId ? { ...event, date: newDate } : event
    );
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    return { events: updatedEvents };
  }),
}));
