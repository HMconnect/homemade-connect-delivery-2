import React, { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLocation } from '@/contexts/LocationContext';
import { SUPPORTED_STATES } from '@/lib/constants';

export const LocationSelector: React.FC = () => {
  const { selectedState, selectedCity, setSelectedState, setSelectedCity, availableCities } = useLocation();
  const [open, setOpen] = useState(false);
  const [tempState, setTempState] = useState(selectedState);
  const [tempCity, setTempCity] = useState(selectedCity);

  const handleStateChange = (code: string) => {
    setTempState(code);
    const stateData = SUPPORTED_STATES.find(s => s.code === code);
    if (stateData?.cities[0]) setTempCity(stateData.cities[0]);
  };

  const handleConfirm = () => {
    setSelectedState(tempState);
    setSelectedCity(tempCity);
    setOpen(false);
  };

  const tempCities = SUPPORTED_STATES.find(s => s.code === tempState)?.cities || [];

  return (
    <>
      <button
        onClick={() => { setTempState(selectedState); setTempCity(selectedCity); setOpen(true); }}
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-orange-600 transition-colors"
      >
        <MapPin className="w-4 h-4 text-orange-500" />
        <span className="font-medium">{selectedCity}, {selectedState}</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-500" />
              Choose Your Location
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Select State</p>
              <div className="grid grid-cols-2 gap-2">
                {SUPPORTED_STATES.map(state => (
                  <button
                    key={state.code}
                    onClick={() => handleStateChange(state.code)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      tempState === state.code
                        ? 'border-orange-500 bg-orange-50 text-orange-700 font-semibold'
                        : 'border-gray-200 hover:border-orange-300 text-gray-700'
                    }`}
                  >
                    <div className="font-medium">{state.name}</div>
                    <div className="text-xs text-gray-500">{state.cities.length} cities</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Select City</p>
              <div className="grid grid-cols-2 gap-2">
                {tempCities.map(city => (
                  <button
                    key={city}
                    onClick={() => setTempCity(city)}
                    className={`p-2 rounded-lg border text-sm transition-all ${
                      tempCity === city
                        ? 'border-orange-500 bg-orange-50 text-orange-700 font-medium'
                        : 'border-gray-200 hover:border-orange-300 text-gray-700'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleConfirm}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              Confirm Location
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
