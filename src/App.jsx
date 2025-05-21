import {useEffect} from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/common/Sidebar.jsx';
import AppRoutes from './routes.jsx';
import { useSelector, useDispatch } from 'react-redux';
import {setLogoutTimer} from "./features/auth/authUtils.js";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

    useEffect(() => {
        const events = ['click', 'load', 'keydown'];
        const resetTimer = () => {
            const token = sessionStorage.getItem('token');
            if (token) {
                setLogoutTimer(dispatch, token);
            }
        };

        events.forEach(event => window.removeEventListener(event,resetTimer));

        return () => events.forEach(event => window.removeEventListener(event, resetTimer));
    }, [dispatch]);

  return (
    <Router>
      <div className="flex">
        {isAuthenticated && <Sidebar />}
        <div className="flex-1 bg-customLightGray">
          <AppRoutes />
        </div>
      </div>
    </Router>
  );
}

export default App;
