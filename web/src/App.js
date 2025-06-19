import { Routes, Route } from 'react-router-dom';

import Dashboard from './pages/dashboard';
import SignUp from './pages/auth/signUp';
import Login from './pages/auth/login';


export default function App() {
  return (
    <div className="App flex flex-col items-center justify-center w-full min-h-screen">
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/auth">
          <Route path="sign-up" element={<SignUp />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </div>
  );
};
