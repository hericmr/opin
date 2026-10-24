import React from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileToggle = ({ mobileMenuOpen, toggleMobileMenu, isMobileLandscape }) => {
  return (
    <div className="lg:hidden flex items-center">
      <button
        onClick={toggleMobileMenu}
        className={`rounded hover:bg-[#215A36] transition-colors 
                  focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                    isMobileLandscape ? 'p-2' : 'p-3'
                  }`}
        aria-label="Menu principal"
      >
        <motion.div
          initial={false}
          animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {mobileMenuOpen ? <X className={isMobileLandscape ? "w-4 h-4" : "w-6 h-6"} /> : <Menu className={isMobileLandscape ? "w-4 h-4" : "w-6 h-6"} />}
        </motion.div>
      </button>
    </div>
  );
};

export default MobileToggle; 