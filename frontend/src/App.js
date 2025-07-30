import React, { useState, useMemo, useEffect } from 'react';
import styled from "styled-components";
import bg from './img/bg.png';
import { MainLayout } from './styles/Layouts';
import Orb from './Components/Orb/Orb';
import Navigation from './Components/Navigation/Navigation';
import Dashboard from './Components/Dashboard/Dashboard';
import Transactions from './Components/Transactions/Transactions';
import Income from './Components/Income/Income';
import Expenses from './Components/Expenses/Expenses';
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import { useGlobalContext } from './context/globalContext';

function App() {
  const [active, setActive] = useState(1);
  const [currentPage, setCurrentPage] = useState('login');

  const { isAuthenticated, checkAuth } = useGlobalContext();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Check URL for routing
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/signup') {
      setCurrentPage('signup');
    } else if (path === '/login') {
      setCurrentPage('login');
    }
  }, []);



  // Function to display the correct component based on authentication and active state
  const displayData = () => {
    if (!isAuthenticated) {
      if (currentPage === 'signup') return <Signup />;
      return <Login />;
    }
    
    if (active === 1) return <Dashboard />;
    if (active === 2) return <Transactions />;
    if (active === 3) return <Income />;
    if (active === 4) return <Expenses />;
    return <Dashboard />;
  };

  // Memoize the Orb component to avoid unnecessary re-renders
  const orbMemo = useMemo(() => <Orb />, []);

  return (
    <AppStyled bg={bg} className="App">
      {isAuthenticated && orbMemo}
      <MainLayout>
        {isAuthenticated && <Navigation active={active} setActive={setActive} />}
        <main role="main" aria-label="Main content">
          {displayData()}
        </main>
      </MainLayout>
    </AppStyled>
  );
}

// Styled component for the App container
const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${props => props.bg || 'defaultBackground.png'});
  position: relative;

  main {
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;

export default App; 