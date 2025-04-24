import React from 'react';
import styled from 'styled-components';
import { FaSkull } from 'react-icons/fa';
import { Victim } from '../types';

const SkullIcon = styled(FaSkull)`
  margin-right: 10px;
`;

interface NotificationProps {
  victims: Victim[];
}

const NotificationContainer = styled.div`
  margin-left: 80px;
  padding: 20px;
  height: 100vh;
  overflow-y: auto;
  width: calc(100% - 80px);

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    padding-top: 60px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    padding-top: 60px;
  }
`;

const NotificationItem = styled.div`
  background-color: #111;
  padding: 15px;
  margin-bottom: 15px;
  border-left: 3px solid #ff0000;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateX(5px);
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const NotificationTitle = styled.h3`
  color: #ff0000;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
`;

const Notification: React.FC<NotificationProps> = ({ victims }) => {
  return (
    <NotificationContainer>
      <h2>Death Notifications</h2>
      {victims.length === 0 ? (
        <p>No deaths recorded yet.</p>
      ) : (
        victims.map(victim => (
          <NotificationItem key={victim.id}>
            <NotificationTitle>
            <SkullIcon />
            {victim.name}
            </NotificationTitle>
            <p>Cause: {victim.cause}</p>
            <p>Details: {victim.details || 'None'}</p>
            <p>Time: {victim.deathTime}</p>
          </NotificationItem>
        ))
      )}
    </NotificationContainer>
  );
};

export default Notification;