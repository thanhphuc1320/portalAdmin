import React from 'react';
import EventForm from '../components/EventForm';

interface Props {}

const CreateUpdateEvent: React.FC<Props> = () => {
  return (
    <div style={{ maxWidth: 1400, margin: 'auto' }}>
      <EventForm />
    </div>
  );
};
export default React.memo(CreateUpdateEvent);
