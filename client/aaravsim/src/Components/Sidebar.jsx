import React, { useEffect, useState} from 'react';
import { House, ChartBar, UserCircle, SignOut, ChartLine,  } from '@phosphor-icons/react';
import { signOut } from '../utils/authUtils';
import '../styles/Sidebar.scss';
import useStore from '../store';

const Sidebar = () => {
  const setSelectedDashboard = useStore((state) => state.setSelectedDashboard);
  const selectedDashboard = useStore((state) => state.selectedDashboard);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => { 
    const handleResize = () => { 
      setIsMobile(window.innerWidth < 768);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])
  return (
    <div className="sidebar">
      <div className="nav-items">
        <div className="nav-item" onClick={() => setSelectedDashboard('home')}>
        <House size={isMobile ? 20 : 24} weight="bold" className={`${selectedDashboard === 'home' ? 'active' : ''}`}/>
          {/* <House size={24} weight="bold" color={`${selectedDashboard === 'home' ? '#fd77d7' : '#dde5ed'}`} /> */}
          {/* <span>Main Dashboard</span> */}
        </div>
        <div className="nav-item" onClick={() => setSelectedDashboard('stock')}>
          <ChartBar className={`icon ${selectedDashboard === 'stock' ? 'active' : ''}`} size={isMobile ? 20 : 24} weight="bold" />
          {/* <span>Stock Dashboard</span> */}
        </div>
        {/* <div className="nav-item" onClick={() => setSelectedDashboard('simulator')}> */}
          {/* <ChartBar size={24} weight="bold" /> */}
          {/* <ChartLine size={24} weight="bold" /> */}
          {/* <span>Stock Dashboard</span> */}
        {/* </div> */}
      </div>
      <div className="bottom-items">
        {/* <div className="nav-item" onClick={() => setSelectedDashboard('profile')}>
          <UserCircle size={isMobile ? 20 : 24} weight="bold" /> */}
          {/* <span>User Profile</span> */}
        {/* </div> */}
        <div className="nav-item logout" onClick={signOut}>
          <SignOut size={isMobile ? 20 : 24} weight="bold" />
          {/* <span>Log Out</span> */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;