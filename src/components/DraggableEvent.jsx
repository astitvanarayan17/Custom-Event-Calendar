import { useDraggable } from '@dnd-kit/core';

function DraggableEvent({ event }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: event.id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    zIndex: 50,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="bg-blue-500 text-white rounded px-1 mb-1 text-xs truncate cursor-grab relative"
    >
      {event.title}
    </div>
  );
}

export default DraggableEvent;
