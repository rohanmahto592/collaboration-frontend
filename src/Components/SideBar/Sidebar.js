import React, { useContext, useEffect } from "react";
import { AppContext } from "../../AppContext";
import {useNavigate} from 'react-router-dom'
const Sidebar = ({ roomId, saveCanvasImage }) => {
  const navigate=useNavigate();
  const [isPencilToggle, setPencilToggle] = React.useState(false);
  const [toggler, setToggler] = React.useState(false);
  const [styleToggler, setStyleToggler] = React.useState(false);
  const [settingToggler, setSettingToggler] = React.useState(false);
  const {
    lineColor,
    setLineColor,
    lineWidth,
    setLineWidth,
    styleChange,
    setStyleChange,
    socket,
    setCanvasBackgroundColor,
    canvasBackgroundColor,
    setEraserEnabed,
    isEraserEnabled,
  } = useContext(AppContext);
  const [isIdCopied, setIdCopied] = React.useState(false);
  const [activeUsers, setActiveUsers] = React.useState([]);
  const handlePencilToggle = () => {
    setPencilToggle(!isPencilToggle);
  };
  const handlePencilStyleToggle = () => {
    setStyleToggler(!styleToggler);
  };
  useEffect(() => {
    socket.current?.on("active_user", (activeUsers) => {
      setActiveUsers(activeUsers);
    });
  }, []);
  const leaveRoom = () => {
    socket.current?.emit("leave_room", roomId);
    window.location.href="/";
  };
  const onBackgroundColorChange = (e) => {
    setCanvasBackgroundColor(e.target.value);
    socket.current.emit("change_BackgroundColor", {
      color: e.target.value,
      roomId: roomId,
    });
  };
  const CopyRoomId = () => {
    navigator.clipboard
      .writeText(roomId)
      .then(() => {
        setIdCopied(true);
      })
      .catch((err) => {
        setIdCopied(false);
      });
  };
  const handleSettingToggler = () => {
    setSettingToggler(!settingToggler);
  };
  const handleDrawingState = (e) => {
    setEraserEnabed(!isEraserEnabled);
  };
  const handleClearCanvas=()=>{
    socket.current.emit("clear_canvas",{roomId:roomId})
  }
  return (
    <div>
      <button
        onClick={() => setToggler(!toggler)}
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span class="sr-only">Open sidebar</span>
        <svg
          class="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        class={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          toggler ? "" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <label class="inline-flex mb-2 items-center cursor-pointer">
            <input
              onChange={(e) => handleDrawingState(e)}
              type="checkbox"
              value=""
              class="sr-only peer"
            />
            <div class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              {isEraserEnabled ? "Eraser Enabled" : "Drawing Enabled"}
            </span>
          </label>

          <button
            onClick={CopyRoomId}
            type="button"
            class="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-sm text-sm px-2 py-2 text-center  mb-2"
          >
            {isIdCopied ? "Copied" : "Copy room ID"}
          </button>
          <ul class="space-y-2 font-medium">
            <li>
              <button
                onClick={handlePencilToggle}
                type="button"
                class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                aria-controls="dropdown-example"
                data-collapse-toggle="dropdown-example"
              >
                <svg
                  class="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z"
                    clip-rule="evenodd"
                  />
                </svg>

                <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                  Writing Tools
                </span>
                <svg
                  class="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                id="dropdown-example"
                class={`${isPencilToggle ? "block" : "hidden"} py-2 space-y-2`}
              >
                <li>
                  <div className="flex items-center ">
                    <label
                      for="first_name"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Choose Color
                    </label>
                    <span
                      style={{ backgroundColor: `${lineColor}` }}
                      class="flex w-5 h-5 ml-3 mb-1  rounded-full"
                    ></span>
                  </div>
                  <input
                    onChange={(e) => setLineColor(e.target.value)}
                    type="color"
                    class=" w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </li>
                <li>
                  <label
                    for="line-width"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Line Width{" "}
                    <span style={{ marginLeft: "5px", color: "teal" }}>
                      {lineWidth}px
                    </span>
                  </label>
                  <input
                    id="line-width"
                    onChange={(e) => setLineWidth(e.target.value)}
                    type="range"
                    min={2}
                    max={50}
                    value={lineWidth}
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </li>
              </ul>
            </li>
            <li>
              <button
                onClick={handlePencilStyleToggle}
                type="button"
                class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                aria-controls="dropdown-example"
                data-collapse-toggle="dropdown-example"
              >
                <svg
                  class="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.782 5.72a4.773 4.773 0 0 0-4.8 4.173 3.43 3.43 0 0 1 2.741-1.687c1.689 0 2.974 1.972 3.758 2.587a5.733 5.733 0 0 0 5.382.935c2-.638 2.934-2.865 3.137-3.921-.969 1.379-2.44 2.207-4.259 1.231-1.253-.673-2.19-3.438-5.959-3.318ZM6.8 11.979A4.772 4.772 0 0 0 2 16.151a3.431 3.431 0 0 1 2.745-1.687c1.689 0 2.974 1.972 3.758 2.587a5.733 5.733 0 0 0 5.382.935c2-.638 2.933-2.865 3.137-3.921-.97 1.379-2.44 2.208-4.259 1.231-1.253-.673-2.19-3.443-5.963-3.317Z" />
                </svg>

                <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                  Brush Style
                </span>
                <svg
                  class="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                class={`${
                  styleToggler ? "" : "hidden"
                } w-full text-sm font-medium text-gray-900 bg-white  rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
              >
                <li class="w-full  border-gray-200 rounded-t-lg dark:border-gray-600">
                  <div class="flex items-center ps-3">
                    <input
                      checked={styleChange === "solid"}
                      onChange={(e) => setStyleChange(e.target.value)}
                      id="list-radio-license"
                      type="radio"
                      value="solid"
                      name="list-radio"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      for="list-radio-license"
                      class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Solid
                    </label>
                  </div>
                </li>
                <li class="w-full  border-gray-200 rounded-t-lg dark:border-gray-600">
                  <div class="flex items-center ps-3">
                    <input
                      checked={styleChange === "dotted"}
                      onChange={(e) => setStyleChange(e.target.value)}
                      id="list-radio-id"
                      type="radio"
                      value="dotted"
                      name="list-radio"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      for="list-radio-id"
                      class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Dotted
                    </label>
                  </div>
                </li>
                <li class="w-full  border-gray-200 rounded-t-lg dark:border-gray-600">
                  <div class="flex items-center ps-3">
                    <input
                      checked={styleChange === "dashed"}
                      onChange={(e) => setStyleChange(e.target.value)}
                      id="list-radio-military"
                      type="radio"
                      value="dashed"
                      name="list-radio"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      for="list-radio-military"
                      class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Dashed
                    </label>
                  </div>
                </li>
                <li class="w-full  border-gray-200 rounded-t-lg dark:border-gray-600">
                  <div class="flex items-center ps-3">
                    <input
                      checked={styleChange === "dash-dotted"}
                      onChange={(e) => setStyleChange(e.target.value)}
                      id="list-radio-passport"
                      type="radio"
                      value="dash-dotted"
                      name="list-radio"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      for="list-radio-passport"
                      class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Dash Dotted
                    </label>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
          <ul class="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            <label class="w-full py-3  text-md font-bold text-gray-900 dark:text-gray-300">
              Background Color
            </label>
            <div class="flex flex-wrap">
              <div class="flex items-center me-4">
                <input
                  onChange={onBackgroundColorChange}
                  id="white-radio"
                  checked={canvasBackgroundColor === "white"}
                  type="radio"
                  value="white"
                  name="colored-radio"
                  class="w-4 h-4 text-white-600 bg-gray-100 border-gray-300 focus:ring-white-500 dark:focus:ring-white-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  for="white-radio"
                  class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  White
                </label>
              </div>
              <div class="flex items-center me-4">
                <input
                  onChange={onBackgroundColorChange}
                  id="red-radio"
                  checked={canvasBackgroundColor === "red"}
                  type="radio"
                  value="red"
                  name="colored-radio"
                  class="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  for="red-radio"
                  class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Red
                </label>
              </div>
              <div class="flex items-center me-4">
                <input
                  onChange={onBackgroundColorChange}
                  checked={canvasBackgroundColor === "green"}
                  id="green-radio"
                  type="radio"
                  value="green"
                  name="colored-radio"
                  class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  for="green-radio"
                  class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Green
                </label>
              </div>
              <div class="flex items-center me-4">
                <input
                  onChange={onBackgroundColorChange}
                  checked={canvasBackgroundColor === "purple"}
                  id="purple-radio"
                  type="radio"
                  value="purple"
                  name="colored-radio"
                  class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  for="purple-radio"
                  class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Purple
                </label>
              </div>
              <div class="flex items-center me-4">
                <input
                  onChange={onBackgroundColorChange}
                  checked={canvasBackgroundColor === "teal"}
                  id="teal-radio"
                  type="radio"
                  value="teal"
                  name="colored-radio"
                  class="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  for="teal-radio"
                  class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Teal
                </label>
              </div>
              <div class="flex items-center me-4">
                <input
                  onChange={onBackgroundColorChange}
                  checked={canvasBackgroundColor === "yellow"}
                  id="yellow-radio"
                  type="radio"
                  value="yellow"
                  name="colored-radio"
                  class="w-4 h-4 text-yellow-400 bg-gray-100 border-gray-300 focus:ring-yellow-500 dark:focus:ring-yellow-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  for="yellow-radio"
                  class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Yellow
                </label>
              </div>
              <div class="flex items-center me-4">
                <input
                  checked={canvasBackgroundColor === "orange"}
                  id="orange-radio"
                  type="radio"
                  value="orange"
                  name="colored-radio"
                  onChange={onBackgroundColorChange}
                  class="w-4 h-4 text-orange-500 bg-gray-100 border-gray-300 focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  for="orange-radio"
                  class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Orange
                </label>
              </div>
            </div>
          </ul>

          <ul class="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            <li>
              <button
                onClick={handleSettingToggler}
                type="button"
                class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                aria-controls="dropdown-example"
                data-collapse-toggle="dropdown-example"
              >
                <svg
                  class="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M17 10v1.126c.367.095.714.24 1.032.428l.796-.797 1.415 1.415-.797.796c.188.318.333.665.428 1.032H21v2h-1.126c-.095.367-.24.714-.428 1.032l.797.796-1.415 1.415-.796-.797a3.979 3.979 0 0 1-1.032.428V20h-2v-1.126a3.977 3.977 0 0 1-1.032-.428l-.796.797-1.415-1.415.797-.796A3.975 3.975 0 0 1 12.126 16H11v-2h1.126c.095-.367.24-.714.428-1.032l-.797-.796 1.415-1.415.796.797A3.977 3.977 0 0 1 15 11.126V10h2Zm.406 3.578.016.016c.354.358.574.85.578 1.392v.028a2 2 0 0 1-3.409 1.406l-.01-.012a2 2 0 0 1 2.826-2.83ZM5 8a4 4 0 1 1 7.938.703 7.029 7.029 0 0 0-3.235 3.235A4 4 0 0 1 5 8Zm4.29 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h6.101A6.979 6.979 0 0 1 9 15c0-.695.101-1.366.29-2Z"
                    clip-rule="evenodd"
                  />
                </svg>

                <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                  Settings
                </span>
                <svg
                  class="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                class={`${
                  settingToggler ? "" : "hidden"
                } w-full text-sm font-medium text-gray-900 bg-white  rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
              >
                <li onClick={leaveRoom}>
                  <a
                    href="#"
                    class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <svg
                      class="w-6 h-6 text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.5 2c-.178 0-.356.013-.492.022l-.074.005a1 1 0 0 0-.934.998V11a1 1 0 0 0 1 1h7.975a1 1 0 0 0 .998-.934l.005-.074A7.04 7.04 0 0 0 22 10.5 8.5 8.5 0 0 0 13.5 2Z" />
                      <path d="M11 6.025a1 1 0 0 0-1.065-.998 8.5 8.5 0 1 0 9.038 9.039A1 1 0 0 0 17.975 13H11V6.025Z" />
                    </svg>

                    <span class="flex-1 ms-3 whitespace-nowrap">
                      Leave Room
                    </span>
                  </a>
                </li>
                <li onClick={() => setToggler(!toggler)}>
                  <a
                    href="#"
                    class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <svg
                      class="w-6 h-6 text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z"
                        clip-rule="evenodd"
                      />
                    </svg>

                    <span class="flex-1 ms-3 whitespace-nowrap">Close</span>
                  </a>
                </li>
                <li onClick={handleClearCanvas}>
                  <a
                    href="#"
                    class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
</svg>


                    <span class="flex-1 ms-3 whitespace-nowrap">
                      Clear Canvas
                    </span>
                  </a>
                </li>
                <li onClick={saveCanvasImage}>
                  <a
                    href="#"
                    class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <svg
                      class="w-6 h-6 text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M13 10a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H14a1 1 0 0 1-1-1Z"
                        clip-rule="evenodd"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12c0 .556-.227 1.06-.593 1.422A.999.999 0 0 1 20.5 20H4a2.002 2.002 0 0 1-2-2V6Zm6.892 12 3.833-5.356-3.99-4.322a1 1 0 0 0-1.549.097L4 12.879V6h16v9.95l-3.257-3.619a1 1 0 0 0-1.557.088L11.2 18H8.892Z"
                        clip-rule="evenodd"
                      />
                    </svg>

                    <span class="flex-1 ms-3 whitespace-nowrap">
                      Save Canvas
                    </span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>

          <ul class="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            {activeUsers?.map((user, index) => (
              <li key={index}>
                <div class="flex items-center space-x-3 rtl:space-x-reverse">
                  <div class="flex-shrink-0">
                    <img
                      class="w-8 h-8 rounded-full"
                      src={`https://avatar.iran.liara.run/username?username=${user.userName}`}
                      alt="user profile"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                      {user.userName}
                    </p>
                  </div>
                  <span class="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                    <span class="w-2 h-2 me-1 bg-green-500 rounded-full"></span>
                    Online
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
