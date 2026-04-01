import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { Play, Square, Pause, PlayCircle } from 'lucide-react';

const cities = [
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Delhi', lat: 28.7041, lng: 77.1025 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'New York', lat: 40.7128, lng: -74.0060 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 }
];

export const InputPanel = () => {
  const { 
    isSimulating, isPaused, targetCity, orbitType, panelArea, frequency,
    setTargetCity, setOrbitType, setPanelArea, setFrequency,
    startSimulation, stopSimulation, pauseSimulation, resumeSimulation 
  } = useSimulationStore();

  const handleCityChange = (e) => {
    const city = cities.find(c => c.name === e.target.value);
    if(city) setTargetCity(city);
  };

  return (
    <div className="glass-panel p-6 flex-1 flex flex-col h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-neon-blue mb-6">Mission Parameters</h2>
      
      <div className="space-y-5 flex-1">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Target Receiver City</label>
          <select 
            className="w-full bg-dark/50 border border-white/20 rounded px-3 py-2 text-white focus:border-neon-cyan focus:outline-none"
            value={targetCity.name}
            onChange={handleCityChange}
            disabled={isSimulating}
          >
            {cities.map(city => (
              <option key={city.name} value={city.name}>{city.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Orbit Type</label>
          <select 
            className="w-full bg-dark/50 border border-white/20 rounded px-3 py-2 text-white focus:border-neon-cyan focus:outline-none"
            value={orbitType}
            onChange={(e) => setOrbitType(e.target.value)}
            disabled={isSimulating}
          >
            <option value="GEO">Geostationary (GEO)</option>
            <option value="LEO">Low Earth Orbit (LEO)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Solar Panel Area (m²)</label>
          <input 
            type="number"
            className="w-full bg-dark/50 border border-white/20 rounded px-3 py-2 text-white focus:border-neon-cyan focus:outline-none"
            value={panelArea}
            onChange={(e) => setPanelArea(Number(e.target.value))}
            disabled={isSimulating}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Frequency (GHz)</label>
          <input 
            type="number"
            step="0.1"
            className="w-full bg-dark/50 border border-white/20 rounded px-3 py-2 text-white focus:border-neon-cyan focus:outline-none"
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
            disabled={isSimulating}
          />
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {!isSimulating ? (
          <button 
            onClick={startSimulation}
            className="w-full bg-neon-blue/20 hover:bg-neon-blue/40 border border-neon-blue text-white py-3 rounded flex items-center justify-center font-bold transition-all shadow-[0_0_10px_rgba(0,243,255,0.3)] hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]"
          >
            <Play className="mr-2 h-5 w-5" /> Start Transmission
          </button>
        ) : (
          <>
            {!isPaused ? (
              <button 
                onClick={pauseSimulation}
                className="w-full bg-yellow-500/20 hover:bg-yellow-500/40 border border-yellow-500 text-white py-3 rounded flex items-center justify-center font-bold transition-all"
              >
                <Pause className="mr-2 h-5 w-5" /> Pause Transmission
              </button>
            ) : (
              <button 
                onClick={resumeSimulation}
                className="w-full bg-green-500/20 hover:bg-green-500/40 border border-green-500 text-white py-3 rounded flex items-center justify-center font-bold transition-all"
              >
                <PlayCircle className="mr-2 h-5 w-5" /> Resume Transmission
              </button>
            )}
            <button 
              onClick={stopSimulation}
              className="w-full bg-red-500/20 hover:bg-red-500/40 border border-red-500 text-white py-3 rounded flex items-center justify-center font-bold transition-all"
            >
              <Square className="mr-2 h-5 w-5" /> Abort Mission
            </button>
          </>
        )}
      </div>
    </div>
  );
};
