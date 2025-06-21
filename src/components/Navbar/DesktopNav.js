import React from 'react';
import NavButtons from './NavButtons';
import NavLogos from './NavLogos';
import AdminPanel from './AdminPanel';
import SearchBar from './SearchBar';

const DesktopNav = ({ 
  isConteudoPage, 
  isAdmin, 
  onAdminClick, 
  isMobileLandscape,
  onSearch,
  onResultClick,
  dataPoints
}) => {
  return (
    <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
      <NavButtons isConteudoPage={isConteudoPage} isMobileLandscape={isMobileLandscape} />
      
      {/* Barra de busca */}
      <SearchBar 
        onSearch={onSearch} 
        onResultClick={onResultClick}
        isMobile={false} 
        isMobileLandscape={isMobileLandscape}
        dataPoints={dataPoints}
      />
      
      <NavLogos isMobileLandscape={isMobileLandscape} />
      
      <AdminPanel 
        isAdmin={isAdmin} 
        onAdminClick={onAdminClick} 
        isMobileLandscape={isMobileLandscape} 
      />
    </div>
  );
};

export default DesktopNav; 