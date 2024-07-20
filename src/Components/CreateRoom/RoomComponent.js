import React, { useContext } from "react";
import { AppContext } from "../../AppContext";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
const RoomComponent = () => {
  const navigate = useNavigate();
  const [roomState, setRoomState] = React.useState({
    isCreateRoom: true,
    isEnterRoom: false,
  });
  const { setRoomId, roomId } = useContext(AppContext);
  const handleRoomChange = (value) => {
    if (value === "enter") {
      setRoomState({ isCreateRoom: false, isEnterRoom: true });
    } else {
      setRoomState({ isCreateRoom: true, isEnterRoom: false });
    }
  };
  const createRoom = () => {
    const roomId = uuidv4();
    setRoomId(roomId);
    navigate(`/room/${roomId}`);
  };
  const joinRoom = () => {
    if (roomId) {
      navigate(`/room/${roomId}`);
    }
  };
  const setUserName = (e) => {
    localStorage.setItem("userName", JSON.stringify(e.target.value));
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-lg p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
          <ul
            className="flex flex-wrap -mb-px text-sm font-medium text-center"
            id="default-tab"
            data-tabs-toggle="#default-tab-content"
            role="tablist"
          >
            <li className="me-2" role="presentation">
              <button
                onClick={() => handleRoomChange("create")}
                className="inline-block p-4 border-b-2 rounded-t-lg"
                id="profile-tab"
                data-tabs-target="#createRoom"
                type="button"
                role="tab"
                aria-controls="profile"
                aria-selected="false"
              >
                Create Room
              </button>
            </li>
            <li className="me-2" role="presentation">
              <button
                onClick={() => handleRoomChange("enter")}
                className="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                id="dashboard-tab"
                data-tabs-target="#joinRoom"
                type="button"
                role="tab"
                aria-controls="dashboard"
                aria-selected="false"
              >
                Enter Room
              </button>
            </li>
          </ul>
        </div>
        <div id="default-tab-content">
          <div
            className={`${
              roomState.isCreateRoom ? "" : "hidden"
            } p-4 rounded-lg bg-gray-50 dark:bg-gray-800`}
            id="profile"
            role="tabpanel"
            aria-labelledby="profile-tab"
          >
            <div class="mb-2 flex flex-col gap-y-2 justify-center">
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Name
              </label>
              <input
                onChange={setUserName}
                placeholder="Enter your name"
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <button
                onClick={createRoom}
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center  mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Create Room
              </button>
            </div>
          </div>
          <div
            className={`${
              roomState.isEnterRoom ? "" : "hidden"
            } p-4 rounded-lg bg-gray-50 dark:bg-gray-800`}
            id="dashboard"
            role="tabpanel"
            aria-labelledby="dashboard-tab"
          >
            <div class="mb-2 flex flex-col gap-y-2 justify-center">
              <label
                for="default-input"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Name
              </label>
              <input
                onChange={setUserName}
                placeholder="Enter your name"
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Room ID
              </label>
              <input
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter your room id"
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <button
                onClick={joinRoom}
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center  mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomComponent;
