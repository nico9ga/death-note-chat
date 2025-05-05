import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSkull, FaSync } from 'react-icons/fa';

interface Victim {
  id: string;
  name: string;
  lastName: string;
  deathType?: string | null;
  details?: string | null;
  isAlive: boolean;
  createdAt: string;
  EditedAt?: string | null;
  images?: string[]; 
}

const SkullIcon = styled(FaSkull)`
  margin-right: 10px;
`;

const RefreshIcon = styled(FaSync)`
  cursor: pointer;
  margin-left: 10px;
  transition: transform 0.3s ease;

  &:hover {
    transform: rotate(180deg);
  }
`;

const NotificationContainer = styled.div`
  margin-left: 80px;
  padding: 20px;
  height: 100vh;
  overflow-y: auto;
  width: calc(100% - 80px);
  background-color: #121212;

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

const NotificationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const NotificationItem = styled.div`
  background-color: #111;
  padding: 15px;
  margin-bottom: 15px;
  border-left: 3px solid #ff0000;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 2px 10px rgba(255, 0, 0, 0.2);
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

const Notification: React.FC = () => {
  const [victims, setVictims] = useState<Victim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVictims = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/victim?limit=100&offset=0');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data: Victim[] = await response.json();
      const deceasedVictims = data
        .filter(victim => !victim.isAlive)
        .sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      setVictims(deceasedVictims);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching victims:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVictims();
    
    const interval = setInterval(fetchVictims, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && victims.length === 0) {
    return (
      <NotificationContainer>
        <p>Loading death records...</p>
      </NotificationContainer>
    );
  }

  if (error) {
    return (
      <NotificationContainer>
        <p>Error loading notifications: {error}</p>
        <button onClick={fetchVictims}>Retry</button>
      </NotificationContainer>
    );
  }

  return (
    <NotificationContainer>
      <NotificationHeader>
        <h2>Death Notifications</h2>
        <RefreshIcon 
          onClick={fetchVictims} 
          title="Refresh notifications"
        />
      </NotificationHeader>

      {victims.length === 0 ? (
        <p>No death records found.</p>
      ) : (
        victims.map(victim => (
          <NotificationItem key={victim.id}>
            <NotificationTitle>
              <SkullIcon />
              {victim.name} {victim.lastName}
            </NotificationTitle>
            <p><strong>Cause of Death:</strong> {victim.deathType || 'Unknown'}</p>
            <p><strong>Details:</strong> {victim.details || 'No additional details'}</p>
            <p><strong>Date:</strong> {new Date(victim.createdAt).toLocaleString()}</p>
          </NotificationItem>
        ))
      )}
    </NotificationContainer>
  );
};

export default Notification;