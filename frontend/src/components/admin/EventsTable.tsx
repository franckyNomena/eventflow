// components/admin/EventTable.tsx
import type { FC } from 'react'

interface Event {
  id: string
  name: string
  date: string
  location: string
  attendees: number
  status: 'active' | 'cancelled' | 'completed'
}

interface EventTableProps {
  events: Event[]
  onEventsChange: (events: Event[]) => void
}

const EventTable: FC<EventTableProps> = ({ events, onEventsChange }) => {
  return (
    <div className="event-table">
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Date</th>
            <th>Lieu</th>
            <th>Participants</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.id}>
              <td>{event.name}</td>
              <td>{event.date}</td>
              <td>{event.location}</td>
              <td>{event.attendees}</td>
              <td>
                <span className={`status ${event.status}`}>
                  {event.status}
                </span>
              </td>
              <td>
                <button>Modifier</button>
                <button>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EventTable