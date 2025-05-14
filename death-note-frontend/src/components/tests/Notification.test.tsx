
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Notification from '../Notification';

global.fetch = jest.fn(); 

const mockVictims = [
  {
    id: '1',
    name: 'John',
    lastName: 'Doe',
    isAlive: false,
    createdAt: new Date().toISOString(),
    deathType: 'Heart Attack',
    details: 'Sudden cardiac arrest',
    images: [],
  },
  {
    id: '2',
    name: 'Jane',
    lastName: 'Smith',
    isAlive: false,
    createdAt: new Date(Date.now() - 100000).toISOString(),
    deathType: null,
    details: null,
    images: [],
  },
];

describe('Notification Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra mensaje de carga al inicio', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<Notification />);
    expect(screen.getByText(/Loading death records/i)).toBeInTheDocument();
    await waitFor(() => expect(fetch).toHaveBeenCalled());
  });

  it('muestra mensaje de error si fetch falla', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));

    render(<Notification />);
    await waitFor(() => expect(screen.getByText(/Error loading notifications/i)).toBeInTheDocument());
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('muestra lista de víctimas fallecidas', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockVictims,
    });

    render(<Notification />);
    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
      expect(screen.getByText(/Heart Attack/i)).toBeInTheDocument();
      expect(screen.getByText(/Unknown/i)).toBeInTheDocument(); // para deathType null
    });
  });

  it('refresca las notificaciones al hacer clic en el ícono', async () => {
    const fakeVictims = [
      {
        id: '1',
        name: 'John',
        lastName: 'Doe',
        isAlive: false,
        createdAt: new Date().toISOString(),
      },
    ];
  
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => fakeVictims,
    });
  
    render(<Notification />);
  
    await waitFor(() => expect(screen.queryByText(/loading death records/i)).not.toBeInTheDocument());
  
    const refreshIcon = screen.getByTitle(/refresh notifications/i);
    fireEvent.click(refreshIcon);
  

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  });  
});
