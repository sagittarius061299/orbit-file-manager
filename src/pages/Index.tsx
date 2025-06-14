
import React from 'react';
import MainContent from '../components/MainContent';
import BreadcrumbNavigation from '../components/BreadcrumbNavigation';

const Index = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-6 pb-4">
        <BreadcrumbNavigation />
      </div>
      <MainContent sidebarOpen={true} />
    </div>
  );
};

export default Index;
