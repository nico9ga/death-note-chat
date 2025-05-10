import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Sidebar from "../Sidebar";

global.fetch = jest.fn();

describe("Sidebar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza los iconos correctamente", () => {
    const setActiveTabMock = jest.fn;

    render(<Sidebar activeTab="deathnote" setActiveTab={setActiveTabMock} />);

    expect(screen.getByLabelText("Death Note")).toBeInTheDocument();
    expect(screen.getByLabelText("Notifications")).toBeInTheDocument();
  });

  it('resalta el ícono activo', () => {
    const setActiveTabMock = jest.fn();
    render(<Sidebar activeTab="notifications" setActiveTab={setActiveTabMock} />);
    
    const notificationsIcon = screen.getByLabelText('Notifications');
    expect(notificationsIcon.className).toContain('active');
  });

  it('llama a setActiveTab con "deathnote" al hacer clic en el ícono del libro', () => {
    const setActiveTabMock = jest.fn();

    render(
      <Sidebar activeTab="notifications" setActiveTab={setActiveTabMock} />
    );

    const bookIcon = screen.getByLabelText("Death Note");
    fireEvent.click(bookIcon);

    expect(setActiveTabMock).toHaveBeenCalledWith("deathnote");
  });

  it('llama a setActiveTab con "notifications" al hacer clic en el ícono de la campana', () => {
    const setActiveTabMock = jest.fn();

    render(<Sidebar activeTab="deathnote" setActiveTab={setActiveTabMock} />);

    const bellIcon = screen.getByLabelText("Notifications");
    fireEvent.click(bellIcon);

    expect(setActiveTabMock).toHaveBeenCalledWith("notifications");
  });
});
