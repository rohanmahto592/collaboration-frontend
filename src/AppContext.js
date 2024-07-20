import React, { createContext } from "react";

export const AppContext = createContext();
export const AppProvider = ({ children }) => {
  const canvasRef = React.useRef(null);
  const [lineWidth, setLineWidth] = React.useState(2);
  const [spreadArea, setSpreadArea] = React.useState(0);
  const [lineColor, setLineColor] = React.useState("#000000");
  const [styleChange, setStyleChange] = React.useState("solid");
  const [roomId, setRoomId] = React.useState("");
  const [canvasBackgroundColor,setCanvasBackgroundColor]=React.useState('white')
  const [pointers, setPointers] = React.useState({});
  const socket = React.useRef(null);
  const [drawingHistory,setDrawingHistory]=React.useState([])
  const [isEraserEnabled,setEraserEnabed]=React.useState(false)
  return (
    <AppContext.Provider
      value={{
        canvasRef,
        lineWidth,
        setLineWidth,
        spreadArea,
        setSpreadArea,
        lineColor,
        setLineColor,
        styleChange,
        setStyleChange,
        socket,
        roomId,
        setRoomId,
        setCanvasBackgroundColor,
        canvasBackgroundColor,
        pointers,
        setPointers,
        drawingHistory,
        setDrawingHistory,
        isEraserEnabled,
        setEraserEnabed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
