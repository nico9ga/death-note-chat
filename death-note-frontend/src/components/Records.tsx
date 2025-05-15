import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSkull, FaHeart, FaImage, FaRegImage, FaSync } from 'react-icons/fa';

interface Victim {
  id: string;
  name: string;
  lastName: string;
  isAlive: boolean;
  createdAt: string;
  EditedAt?: string | null;
  images?: string[];
}
const RecordsContainer = styled.div`
  width: 100%;
  padding: 20px;
  background-color: #121212;
  color: white;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding-top: 80px;
    padding-left: 15px;
    padding-right: 15px;
  }
`;

const RecordsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #333;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #d63031;
  }
`;

const RecordsTable = styled.div`
  width: 90%;
  overflow-x: auto;
  background-color: #1a1a1a;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  margin: 0 auto;
  max-width: 100%;
`;

const Table = styled.table`
  width: 90%;
  border-collapse: collapse;
  min-width: 100%;

  @media (max-width: 768px) {
    min-width: 768px;
  }
`;

const TableHeader = styled.thead`
  background-color: #222;
`;

const TableHeaderCell = styled.th`
  padding: 15px;
  text-align: left;
  font-weight: 500;
  color: #d63031;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #1e1e1e;
  }
  &:hover {
    background-color: #252525;
  }
`;

const TableCell = styled.td`
  padding: 15px;
  border-bottom: 1px solid #333;
  vertical-align: middle;
`;

const StatusCell = styled(TableCell)<{ isalive: boolean }>`
  color: ${props => props.isalive ? '#2ecc71' : '#d63031'};
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ImageCell = styled(TableCell)`
  text-align: center;
`;

const RefreshButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background-color: #333;
    color: #d63031;
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: rotate(180deg);
  }
`;

const LoadingMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: #aaa;
`;

const ErrorMessage = styled.div`
  padding: 20px;
  background-color: #330000;
  color: #ff6b6b;
  border-radius: 4px;
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 15px;

  button {
    padding: 8px 16px;
    background-color: #d63031;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    align-self: flex-start;
  }
`;

const NoRecordsMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: #777;
  font-style: italic;
`;

const Records: React.FC = () => {
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
      const sortedVictims = data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setVictims(sortedVictims);
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
      <RecordsContainer>
        <RecordsHeader>
          <h2>All Records</h2>
        </RecordsHeader>
        <LoadingMessage>Loading records...</LoadingMessage>
      </RecordsContainer>
    );
  }

  if (error) {
    return (
      <RecordsContainer>
        <RecordsHeader>
          <h2>All Records</h2>
        </RecordsHeader>
        <ErrorMessage>
          <p>Error loading records: {error}</p>
          <button onClick={fetchVictims}>Retry</button>
        </ErrorMessage>
      </RecordsContainer>
    );
  }

  return (
    <RecordsContainer>
      <RecordsHeader>
        <h2>All Records</h2>
        <RefreshButton onClick={fetchVictims} title="Refresh records">
          <FaSync /> Refresh
        </RefreshButton>
      </RecordsHeader>

      {victims.length === 0 ? (
        <NoRecordsMessage>No records found.</NoRecordsMessage>
      ) : (
        <RecordsTable>
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Registered At</TableHeaderCell>
                <TableHeaderCell>Image</TableHeaderCell>
              </tr>
            </TableHeader>
            <tbody>
              {victims.map(victim => (
                <TableRow key={victim.id}>
                  <TableCell>
                    {victim.name} {victim.lastName}
                  </TableCell>
                  <StatusCell isalive={victim.isAlive}>
                    {victim.isAlive ? <FaHeart /> : <FaSkull />}
                    {victim.isAlive ? 'Alive' : 'Deceased'}
                  </StatusCell>
                  <TableCell>
                    {new Date(victim.createdAt).toLocaleString()}
                  </TableCell>
                  <ImageCell>
                    {victim.images && victim.images.length > 0 ? (
                      <FaImage color="#3498db" size={18} title="Has image" />
                    ) : (
                      <FaRegImage color="#7f8c8d" size={18} title="No image" />
                    )}
                  </ImageCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </RecordsTable>
      )}
    </RecordsContainer>
  );
};

export default Records;