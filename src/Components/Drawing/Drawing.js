import React, { useContext, useEffect } from "react";
import Canvas from "../Canvas/Canvas";
import Sidebar from "../SideBar/Sidebar";
import { AppContext } from "../../AppContext";
import { useParams } from "react-router-dom";
import io from 'socket.io-client'
const Drawing = () => {
  const {canvasRef,socket}=useContext(AppContext)
  const {id}=useParams()
  const saveCanvasImage = () => {
    const canvas=canvasRef.current;
    const dataURL = canvas?.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "drawing.png";
    link.click();
  };
  useEffect(()=>{
    socket.current = io(`${process.env.SERVER||'http://localhost:4000'}`)
  },[])
  return (
    <>
      <Sidebar roomId={id} saveCanvasImage={saveCanvasImage} />
      <Canvas roomId={id}  />
    </>
  );
};

export default Drawing;
