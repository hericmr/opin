import React from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileToggle = ({ mobileMenuOpen, toggleMobileMenu, isMobileLandscape }) => {
  return (
    <div className="lg:hidden flex items-center">
      <button
        onClick={toggleMobileMenu}
        className={`rounded-full hover:bg-amber-800/50 transition-all duration-200 active:scale-95 
                  focus:outline-none focus:ring-2 focus:ring-amber-400 touch-manipulation ${
                    isMobileLandscape ? 'p-2' : 'p-3'
                  }`}
        aria-label="Menu principal"
      >
        <motion.div
          initial={false}
          animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {mobileMenuOpen ? <X className={isMobileLandscape ? "w-5 h-5" : "w-7 h-7"} /> : <Menu className={isMobileLandscape ? "w-5 h-5" : "w-7 h-7"} />}
        </motion.div>
      </button>
    </div>
  );
};

export default MobileToggle; 