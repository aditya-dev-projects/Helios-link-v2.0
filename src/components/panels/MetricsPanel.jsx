import React, { useEffect } from 'react';
import { useSimulationStore } from '../../store/simulationStore';

const MetricCard = ({ label, value, unit, isSimulating }) => (
  <div className="bg-dark/40 border border-white/10 p-3 rounded">
    <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">{label}</div>
    <div className="flex items-baseline">
      <div className={`text-2xl font-mono font-bold ${isSimulating ? 'text-neon-cyan text-shadow-neon' : 'text-white'}`}>
        {value}
      </div>
      <div className="ml-1 text-sm text-gray-500">{unit}</div>
    </div>
  </div>
);

export const MetricsPanel = () => {
  const { metrics, isSimulating, isPaused, setMetrics, panelArea } = useSimulationStore();

  useEffect(() => {
    if (!isSimulating || isPaused) return;

    const interval = setInterval(() => {
      setMetrics({
        // Simulate dynamic fluctuations
        powerGenerated: (panelArea * 0.35 * (1 + (Math.random()*0.02 - 0.01))) / 1000, 
        transmissionEfficiency: 82.5 + (Math.random() - 0.5),
        energyDelivered: metrics.energyDelivered + 0.5,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating, isPaused, panelArea, metrics.energyDelivered, setMetrics]);

  return (
    <div className="glass-panel p-6">
      <h2 className="text-xl font-bold text-neon-blue mb-4 flex items-center">
        <div className={`w-2 h-2 rounded-full mr-3 ${isSimulating ? (isPaused ? 'bg-yellow-500 animate-pulse' : 'bg-red-500 animate-pulse shadow-[0_0_8px_#f00]') : 'bg-gray-500'}`}></div>
        Live Telemetry
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        <MetricCard 
          label="Power Generated" 
          value={metrics.powerGenerated.toFixed(2)} 
          unit="MW" 
          isSimulating={isSimulating} 
        />
        <MetricCard 
          label="Link Efficiency" 
          value={metrics.transmissionEfficiency.toFixed(1)} 
          unit="%" 
          isSimulating={isSimulating} 
        />
        <MetricCard 
          label="Energy Delivered" 
          value={metrics.energyDelivered.toFixed(1)} 
          unit="GJ" 
          isSimulating={isSimulating} 
        />
        <MetricCard 
          label="Rectenna Eff." 
          value={metrics.rectennaEfficiency.toFixed(1)} 
          unit="%" 
          isSimulating={isSimulating} 
        />
      </div>
      
      <div className="mt-4 bg-dark/40 border border-white/10 p-3 rounded">
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-1 flex justify-between">
            <span>Beam Frequency</span>
            <span className="text-neon-cyan">{metrics.frequencyGHz} GHz</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1 mt-2 overflow-hidden">
             <div className={`h-1 bg-neon-cyan rounded-full transition-all duration-300 ${isSimulating && !isPaused ? 'w-full origin-left animate-[pulse_1s_infinite]' : 'w-0'}`}></div>
          </div>
      </div>
    </div>
  );
};
