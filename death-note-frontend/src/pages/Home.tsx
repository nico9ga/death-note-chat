import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import Notification from '../components/Notification';
import Records from '../components/Records';
import { Victim } from '../types';

const HomeContainer = styled.div`
  display: flex;
  height: 100vh;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'deathnote' | 'notifications' | 'records'>('deathnote');
  const [victims, setVictims] = useState<Victim[]>([]);

  return (
    <HomeContainer>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === 'deathnote' ? (
        <ChatWindow victims={victims} setVictims={setVictims} />
      ) : activeTab === 'notifications' ? (
        <Notification />
      ) : (
        <Records />
      )}
    </HomeContainer>
  );
};

export default Home;