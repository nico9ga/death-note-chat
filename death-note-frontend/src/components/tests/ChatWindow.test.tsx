import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatWindow from '../ChatWindow';
import '@testing-library/jest-dom';

jest.useFakeTimers();

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ id: '12345' }),
  })
) as jest.Mock;

describe('ChatWindow Component', () => {
    it('muestra un mensaje de bienvenida al principio', () => {
        render(<ChatWindow victims={[]} setVictims={() => {}} />);
        
        expect(screen.getByText('Bienvenido a la Death Note. Reglas:')).toBeInTheDocument();
      });

      it('envía un mensaje cuando el nombre está completo', async () => {
        const setVictimsMock = jest.fn();
    
        render(<ChatWindow victims={[]} setVictims={setVictimsMock} />);
    
        const input = screen.getByRole('textbox') as HTMLInputElement;
        const button = screen.getByRole('button');
    
        fireEvent.change(input, { target: { value: 'Juan Pérez' } });
        fireEvent.click(button);
    
        await waitFor(() => expect(screen.getByText(/Juan Pérez/i)).toBeInTheDocument());
    });

    it('limpia el campo de texto después de enviar el mensaje', async () => {
        render(<ChatWindow victims={[]} setVictims={() => {}}  />);
    
        const input = screen.getByRole('textbox') as HTMLInputElement;
        const button = screen.getByRole('button');
    
        fireEvent.change(input, { target: { value: 'Juan Pérez' } });
        fireEvent.click(button);
        await waitFor(() => expect(input).not.toBeInTheDocument());
    
    });
    
      it('inicia un temporizador al ingresar el nombre', () => {
        render(<ChatWindow victims={[]} setVictims={() => {}} />);
    
        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button');
        
        fireEvent.change(input, { target: { value: 'Juan Pérez' } });
        fireEvent.click(button);
        jest.advanceTimersByTime(1000); 
        const timerDisplay = screen.getByText(/0:\d{2}/);
        expect(timerDisplay).toBeInTheDocument();
        
        
        jest.advanceTimersByTime(1000); 
        const updatedTimerDisplay = screen.getByText(/0:\d{2}/);
        expect(updatedTimerDisplay).toBeInTheDocument();
    });
    
      it('no envia un mensaje si el campo de texto está vacío', () => {
        render(<ChatWindow victims={[]} setVictims={() => {}} />);
        
        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button');
        
        fireEvent.change(input, { target: { value: '' } });
    
        const previousMessages = screen.queryAllByRole('status');
        
        fireEvent.click(button);
        
        expect(screen.queryAllByRole('status')).toEqual(previousMessages);
    });
    
    
      it('envia un mensaje de error cuando no se envia un nombre completo', () => {
        render(<ChatWindow victims={[]} setVictims={() => {}} />);
        
        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button');
        
        fireEvent.change(input, { target: { value: 'Juan' } });
        fireEvent.click(button);
        
        expect(screen.getByText((content, element) => content.includes('Debes ingresar nombre y apellido'))).toBeInTheDocument();
    });    

  it('procede al paso de imagen tras ingresar nombre completo válido', async () => {
    render(<ChatWindow victims={[]} setVictims={() => {}} />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Juan Pérez' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/¿Quieres subir una foto/i)).toBeInTheDocument();
    });
  });


  it('sube una imagen correctamente', async () => {
    render(<ChatWindow victims={[]} setVictims={() => {}} />);
    
    // Paso nombre válido
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');
    fireEvent.change(input, { target: { value: 'Pedro Pascal' } });
    fireEvent.click(button);
  
    // Simula imagen
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    const uploadInput = screen.getByTestId('file-input');
    fireEvent.change(uploadInput, { target: { files: [file] } });
  
    await waitFor(() => {
      expect(screen.getByText(/Imagen subida/i)).toBeInTheDocument();
      expect(screen.getByText(/Especifica la causa de muerte/i)).toBeInTheDocument();
    });
  });

  
});
