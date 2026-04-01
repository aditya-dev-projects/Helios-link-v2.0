import { create } from 'zustand';

export const simulationRefs = {
  earthRotation: 0,
  earthAngle: 0,
};

export const useSimulationStore = create((set, get) => ({
  isSimulating: false,
  isPaused: false,
  targetCity: { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  orbitType: 'GEO',
  panelArea: 10000,
  frequency: 2.45,
  
  metrics: {
    powerGenerated: 0,
    transmissionEfficiency: 0,
    energyDelivered: 0,
    rectennaEfficiency: 85,
    frequencyGHz: 2.45,
  },
  
  logs: [
    { time: new Date().toLocaleTimeString(), message: '[SYSTEM] Navigation initialized.' },
    { time: new Date().toLocaleTimeString(), message: '[SYSTEM] Awaiting parameters...' },
  ],

  setTargetCity: (city) => set({ targetCity: city }),
  setOrbitType: (type) => set({ orbitType: type }),
  setPanelArea: (area) => set({ panelArea: area }),
  setFrequency: (freq) => set({ frequency: freq, metrics: { ...get().metrics, frequencyGHz: freq } }),

  startSimulation: () => {
    set({ isSimulating: true, isPaused: false });
    get().addLog(`[ORBITAL] Initiating lock on ${get().targetCity.name}...`);
    get().addLog('[TRANSMISSION] Calculating power link budget...');
  },

  stopSimulation: () => {
    set({ isSimulating: false, isPaused: false });
    get().addLog('[SYSTEM] Simulation aborted.');
    get().setMetrics({
      powerGenerated: 0,
      transmissionEfficiency: 0,
      energyDelivered: 0,
    });
  },

  pauseSimulation: () => {
    set({ isPaused: true });
    get().addLog('[SYSTEM] Simulation paused.');
  },

  resumeSimulation: () => {
    set({ isPaused: false });
    get().addLog('[SYSTEM] Simulation resumed.');
  },

  addLog: (message) => set((state) => ({
    logs: [...state.logs, { time: new Date().toLocaleTimeString(), message }]
  })),

  setMetrics: (newMetrics) => set((state) => ({
    metrics: { ...state.metrics, ...newMetrics }
  })),
}));
