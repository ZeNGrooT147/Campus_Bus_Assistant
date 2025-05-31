import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface Creator {
  name: string;
  role: string;
  photo: string;
}

const creators: Creator[] = [
  {
    name: "Suhas Gosal",
    role: "Team Member",
    photo: "/team-photos/member1.jpg"
  },
  {
    name: "Tanzeel Ahamed",
    role: "Team Member",
    photo: "/team-photos/member2.jpg"
  },
  {
    name: "Veeresh Dhamnemath",
    role: "Team Member",
    photo: "/team-photos/member3.jpg"
  },
  {
    name: "Shivanand Aralikatti",
    role: "Team Member",
    photo: "/team-photos/member4.jpg"
  }
];

export function AboutSection() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    // Only add scroll listener if we're on the landing page
    if (location.pathname !== '/') {
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollBottom = currentScrollY + windowHeight;
      
      // If scrolling up, close the panel
      if (currentScrollY < lastScrollY) {
        setIsOpen(false);
      }
      
      // If near bottom of page, open the panel
      if (documentHeight - scrollBottom < 100) {
        setIsOpen(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, location.pathname]);

  // Return null if not on landing page
  if (location.pathname !== '/') {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-0 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed bottom-4 right-0 w-64 bg-white shadow-2xl border-l border-gray-200 rounded-l-lg"
          >
            <div className="p-3">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold text-gray-800">Our Team</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-2">
                {creators.map((creator, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <img
                      src={creator.photo}
                      alt={creator.name}
                      className="w-8 h-8 rounded-full border border-blue-500 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.name}`;
                      }}
                    />
                    <div>
                      <h3 className="font-medium text-sm text-gray-800">{creator.name}</h3>
                      <p className="text-xs text-blue-600">{creator.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 