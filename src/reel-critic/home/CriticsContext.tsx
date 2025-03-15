import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback, useEffect } from 'react';
import { User, userAPI, popularCriticAPI } from '../../services/api';
import { authAPI } from '../../services/api';

interface CriticsContextType {
  critics: User[];
  followCritic: (criticId: string) => void;
  getCriticById: (criticId: string) => User | undefined;
}

const CriticsContext = createContext<CriticsContextType | undefined>(undefined);

export const CriticsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [critics, setCritics] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch critics on mount
  useEffect(() => {
    const fetchCritics = async () => {
      try {
        setLoading(true);
        const popularCritics = await popularCriticAPI.getAllWithDetails();
        setCritics(popularCritics);
      } catch (error) {
        console.error('Error fetching critics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCritics();
  }, []);

  const followCritic = useCallback(async (criticId: string) => {
    const isLoggedIn = authAPI.isLoggedIn();
    
    if (!isLoggedIn) {
      alert('Please log in to follow critics');
      return;
    }

    try {
      await userAPI.toggleFollow(criticId);
      
      // Update local state
      setCritics(prevCritics =>
        prevCritics.map(critic =>
          critic.id === criticId
            ? { 
                ...critic, 
                isFollowing: !critic.isFollowing, 
                followers: critic.isFollowing ? critic.followers - 1 : critic.followers + 1 
              }
            : critic
        )
      );
    } catch (error) {
      console.error('Error following critic:', error);
    }
  }, []);

  const getCriticById = useCallback((criticId: string) => {
    return critics.find(critic => critic.id === criticId);
  }, [critics]);

  const contextValue = useMemo(() => ({
    critics,
    followCritic,
    getCriticById
  }), [critics, followCritic, getCriticById]);

  if (loading) {
    return <div>Loading critics...</div>;
  }

  return (
    <CriticsContext.Provider value={contextValue}>
      {children}
    </CriticsContext.Provider>
  );
};

export const useCritics = (): CriticsContextType => {
  const context = useContext(CriticsContext);
  if (context === undefined) {
    throw new Error('useCritics must be used within a CriticsProvider');
  }
  return context;
}; 