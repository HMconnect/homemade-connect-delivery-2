import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_STATES } from '@/lib/constants';

interface LocationContextType {
  selectedState: string;
  selectedCity: string;
  setSelectedState: (state: string) => void;
  setSelectedCity: (city: string) => void;
  availableCities: string[];
  stateLabel: string;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedState, setSelectedStateRaw] = useState<string>(() => 
    localStorage.getItem('hmc_state') || 'IL'
  );
  const [selectedCity, setSelectedCityRaw] = useState<string>(() =>
    localStorage.getItem('hmc_city') || 'Chicago'
  );

  const stateData = SUPPORTED_STATES.find(s => s.code === selectedState);
  const availableCities = stateData?.cities || [];
  const stateLabel = stateData?.name || selectedState;

  const setSelectedState = (state: string) => {
    const newStateData = SUPPORTED_STATES.find(s => s.code === state);
    setSelectedStateRaw(state);
    localStorage.setItem('hmc_state', state);
    // Reset city to first city of new state
    if (newStateData?.cities[0]) {
      setSelectedCityRaw(newStateData.cities[0]);
      localStorage.setItem('hmc_city', newStateData.cities[0]);
    }
  };

  const setSelectedCity = (city: string) => {
    setSelectedCityRaw(city);
    localStorage.setItem('hmc_city', city);
  };

  return (
    <LocationContext.Provider value={{
      selectedState,
      selectedCity,
      setSelectedState,
      setSelectedCity,
      availableCities,
      stateLabel,
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within LocationProvider');
  return context;
};
