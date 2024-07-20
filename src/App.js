
import { AppProvider } from "./AppContext";
import Drawing from "./Components/Drawing/Drawing";
import RoomComponent from "./Components/CreateRoom/RoomComponent";
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RoomComponent/>}/>
          <Route path="/room/:id" element={<Drawing/>}/>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
