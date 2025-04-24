import React from 'react';
import styled from 'styled-components';
import { FaBook, FaBell } from 'react-icons/fa';

type ActiveTabType = 'deathnote' | 'notifications';

interface SidebarProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
}

const SidebarContainer = styled.div`
  width: 80px;
  height: 100vh;
  background-color: #111;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    flex-direction: row;
    justify-content: space-around;
    padding: 10px 0;
    position: relative;
  }
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: #fff;
  font-size: 24px;
  margin: 20px 0;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    color: #ff0000;
    transform: scale(1.1);
  }

  &.active {
    color: #ff0000;
  }

  @media (max-width: 768px) {
    margin: 0 10px;
    font-size: 20px;
  }
`;

const BookIcon = styled(FaBook)`
  display: block;
`;

const BellIcon = styled(FaBell)`
  display: block;
`;

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <SidebarContainer>
      <IconButton 
        className={activeTab === 'deathnote' ? 'active' : ''}
        onClick={() => setActiveTab('deathnote')}
        aria-label="Death Note"
      >
        <BookIcon />
      </IconButton>
      <IconButton 
        className={activeTab === 'notifications' ? 'active' : ''}
        onClick={() => setActiveTab('notifications')}
        aria-label="Notifications"
      >
        <BellIcon />
      </IconButton>
    </SidebarContainer>
  );
};

export default Sidebar;