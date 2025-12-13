import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ChatPanel } from './ChatPanel';
import { useChatStore } from '@/store/chatStore';

export const Layout = () => {
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const { isOpen: chatOpen } = useChatStore();

  useEffect(() => {
    const handleResize = () => {
      // Detect sidebar collapse state from DOM if needed
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header sidebarWidth={sidebarWidth} />
      <main
        className="pt-16 min-h-screen transition-all duration-300"
        style={{
          marginLeft: sidebarWidth,
          marginRight: chatOpen ? 400 : 0,
        }}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
      <ChatPanel />
    </div>
  );
};
