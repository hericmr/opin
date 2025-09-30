import React from 'react';
import { motion } from 'framer-motion';
import useScrollAnimation from '../hooks/useScrollAnimation';

const ScrollAnimatedWrapper = ({ 
  children, 
  animationType = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  className = ''
}) => {
  const [ref, isVisible] = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    triggerOnce: true
  });

  const animations = {
    fadeInUp: {
      hidden: { 
        opacity: 0, 
        y: 50,
        scale: 0.95
      },
      visible: { 
        opacity: 1, 
        y: 0,
        scale: 1
      }
    },
    fadeInLeft: {
      hidden: { 
        opacity: 0, 
        x: -50,
        scale: 0.95
      },
      visible: { 
        opacity: 1, 
        x: 0,
        scale: 1
      }
    },
    fadeInRight: {
      hidden: { 
        opacity: 0, 
        x: 50,
        scale: 0.95
      },
      visible: { 
        opacity: 1, 
        x: 0,
        scale: 1
      }
    },
    scaleIn: {
      hidden: { 
        opacity: 0, 
        scale: 0.8
      },
      visible: { 
        opacity: 1, 
        scale: 1
      }
    }
  };

  const selectedAnimation = animations[animationType] || animations.fadeInUp;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={selectedAnimation}
      transition={{
        duration,
        delay,
        ease: "easeOut"
      }}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimatedWrapper;