// pages/EventManagement.tsx
import type { FC } from 'react'
import { useState } from 'react'
import EventTable from '../components/admin/EventsTable.tsx'

interface Event {
  id: string
  name: string
  date: string
  location: string
  attendees: number
  status: 'active' | 'cancelled' | 'completed'
}

const EventManagement: FC = () => {
  const [events, setEvents] = useState<Event[]>([])

  return (
    <div className="event-management">
      <h1>Gestion des Événements</h1>
      <EventTable events={events} onEventsChange={setEvents} />
    </div>
  )
}

export default EventManagement