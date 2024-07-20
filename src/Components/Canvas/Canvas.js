import React, { useContext, useEffect } from "react";
import { AppContext } from "../../AppContext";
const Canvas = ({ roomId }) => {
  const {
    canvasRef,
    lineColor,
    lineWidth,
    styleChange,
    socket,
    canvasBackgroundColor,
    setCanvasBackgroundColor,
    pointers,
    setPointers,
    isEraserEnabled
  } = useContext(AppContext);
  const [isDrawing, setDrawing] = React.useState(false);
  const userName = JSON.parse(localStorage.getItem("userName")) ?? "Guest";
  useEffect(() => {
    socket.current?.emit("join_room", {
      roomId: roomId,
      userName: userName,
    });
    socket.current?.on("pointer_location", ({ socketId, location, color,userName }) => {
      setPointers((prevPointers) => ({
        ...prevPointers,
        [socketId]: { location: location, color: color,userName:userName },
      }));
    });
    socket.current?.on("clear_canvas",()=>{
      const canvas=canvasRef.current;
      const context=canvas.getContext("2d");
      context.fillStyle=canvasBackgroundColor;
      context.fillRect(0,0,canvas.width,canvas.height);

    })
    const canvas = canvasRef.current;
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = window.innerHeight;
    socket.current?.on("drawing", (data) => {
      const {
        lastX,
        lastY,
        offsetX,
        offsetY,
        lineColor,
        lineWidth,
        linePattern,
      } = data;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.beginPath();
      context.moveTo(lastX, lastY);
      context.lineTo(offsetX, offsetY);
      context.lineWidth = lineWidth;
      context.setLineDash(linePattern);
      context.strokeStyle = isEraserEnabled?canvasBackgroundColor:lineColor;
      context.stroke();
      context.closePath();
    });
    socket.current?.on("change_BackgroundColor", (color) => {
      setCanvasBackgroundColor(color);
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.fillStyle = color;
      context.fillRect(0, 0, canvas.width, canvas.height);
    });
    const handleResize = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Create an off-screen canvas to store the current content
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempContext = tempCanvas.getContext("2d");
      tempContext.drawImage(canvas, 0, 0);

      // Resize the canvas
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = window.innerHeight;

      // Draw the saved content back onto the resized canvas
      context.drawImage(tempCanvas, 0, 0);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [roomId]);
  const startDrawing = (e) => {
    setDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    canvas.lastX = offsetX;
    canvas.lastY = offsetY;
    socket.current.emit("playBack", {
      type: "start",
      offsetX: offsetX,
      offsetY: offsetY,
      lineColor: lineColor,
      lineWidth: lineWidth,
      linePattern: getLineDashPattern(styleChange),
      roomId: roomId,
    });
  };
  const Draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.beginPath();
    context.moveTo(canvas.lastX, canvas.lastY);
    context.strokeStyle = isEraserEnabled?canvasBackgroundColor: lineColor;
    context.lineWidth = lineWidth;
    context.setLineDash(getLineDashPattern(styleChange));
    context.lineTo(offsetX, offsetY);
    context.stroke();
    context.closePath();
    socket.current.emit("drawing", {
      lastX: canvas.lastX,
      lastY: canvas.lastY,
      offsetX: offsetX,
      offsetY: offsetY,
      lineColor: isEraserEnabled?canvasBackgroundColor: lineColor,
      lineWidth: lineWidth,
      linePattern: getLineDashPattern(styleChange),
      roomId: roomId,
    });
    canvas.lastX = offsetX;
    canvas.lastY = offsetY;
    socket.current.emit("playBack", {
      type: "draw",
      offsetX: offsetX,
      offsetY: offsetY,
      lineColor: isEraserEnabled?canvasBackgroundColor: lineColor,
      lineWidth: lineWidth,
      linePattern: getLineDashPattern(styleChange),
      roomId: roomId,
    });
  };
  const stopDrawing = (e) => {
    setDrawing(false);
    socket.current.emit("playBack",{type:"stop",roomId:roomId})
  };
  const getLineDashPattern = (style) => {
    switch (style) {
      case "dotted":
        return [2, 2];
      case "dashed":
        return [10, 10];
      case "dash-dotted":
        return [10, 5, 2, 5];
      default:
        return [];
    }
  };
  function getRandomColor() {
    // Generate random values for RGB components
    const r = Math.floor(Math.random() * 256); // Random integer between 0 and 255
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Construct the RGB string
    const color = `rgb(${r},${g},${b})`;

    return color;
  }
  const handlePointerMove = (e) => {
    const location = { x: e.clientX, y: e.clientY };
    socket.current?.emit("location", {
      location: location,
      roomId: roomId,
      color: getRandomColor(),
      userName:userName
    });
  };
  const fetchDrawingHistory=()=>{
    socket.current.emit("fetchHistory",{roomId:roomId});
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    socket.current.on("fetchHistory",(data)=>{
      const {history}=data;
      history?.forEach((action)=>{
        setTimeout(()=>{
          switch(action.type){
            case 'start':
              context.beginPath();
              context.moveTo(action.offsetX,action.offsetY);
              break;
            case 'draw':
              context.lineTo(action.offsetX,action.offsetY);
              context.strokeStyle = action.lineColor;
              context.lineWidth = action.lineWidth;
              context.setLineDash(action.linePattern);
              context.stroke();
              break;
            case 'stop':
              context.closePath()
              break;
            default:
              break;

          }
        },10)
      })
    })
  }
  return (
    <div>
      <div class="p-4 sm:ml-64">
        <div
          style={{ position: "relative" }}
          onPointerMove={handlePointerMove}
          class="border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700"
        >
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={Draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
          />
          <button
           style={{position:'absolute',top:0,right:0,textAlign:'center'}}
              onClick={fetchDrawingHistory}
              className="py-1 w-20 bg-blue-500 text-white rounded"
            >
              Playback
            </button>
          {Object.entries(pointers).map(([socketId, data]) => (
            <div
            key={socketId}
            style={{
              position: "absolute",
              top: data.location.y,
              left: data.location.x,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={`https://avatar.iran.liara.run/username?username=${data.userName}`}
              alt="Avatar"
              style={{
                width: "30px", // Adjust the size as needed
                height: "30px",
                borderRadius: "50%",
                marginBottom: "5px", // Space between the image and the circle
              }}
            />
            <div
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: data.color,
                borderRadius: "50%",
              }}
            ></div>
          </div>
          
          ))}
        </div>
      </div>
    </div>
  );
};

export default Canvas;
