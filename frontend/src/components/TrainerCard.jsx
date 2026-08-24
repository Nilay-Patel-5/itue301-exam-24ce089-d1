import React from 'react';
import { UserCheck, UserX, Award } from 'lucide-react';

const availabilityMap = {
  true: 'Available',
  false: 'Fully Booked'
};

const availabilityClassMap = {
  true: 'status-badge available',
  false: 'status-badge fully-booked'
};

const TrainerCard = ({ name, specialization, available }) => {
  const isAvailable = Boolean(available);

  return (
    <div className="glass-card trainer-card">
      <div>
        <div className="trainer-header">
          <h3 className="trainer-name">{name}</h3>
          <span className={availabilityClassMap[isAvailable]}>
            {isAvailable ? <UserCheck size={14} /> : <UserX size={14} />}
            {availabilityMap[isAvailable]}
          </span>
        </div>
        <div className="trainer-specialization">
          <Award size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
          {specialization}
        </div>
      </div>
    </div>
  );
};

export default TrainerCard;
