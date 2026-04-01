import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder } from '@react-three/drei';
import * as THREE from 'three';

export const MicrowaveBeam = ({ active, distance, paused }) => {
  const simBeamRef = useRef();
  const idleBeamRef = useRef();

  useFrame(({ clock }) => {
    // idle tiny yellow beam from the sun side
    if (!active && idleBeamRef.current && !paused) {
      idleBeamRef.current.material.opacity = 0.3 + Math.sin(clock.elapsedTime * 5) * 0.1;
    }

    // Active cyan beam to Earth
    if (active && simBeamRef.current && !paused) {
      // Fast pulsing core
      const scale = 1 + Math.sin(clock.elapsedTime * 25) * 0.1;
      simBeamRef.current.scale.x = scale;
      simBeamRef.current.scale.z = scale;
      // Lower base opacity for an ethereal UV ray look
      simBeamRef.current.material.opacity = 0.15 + Math.sin(clock.elapsedTime * 15) * 0.1;
    }
  });

  return (
    <group position={[0, -distance / 2 - 0.4, 0]}>
      {/* WHEN NOT SIMULATING - Thin UV Ray from Sun to Satellite */}
      {!active && (
        <Cylinder ref={idleBeamRef} args={[0.01, 0.05, 50, 8]} position={[-20, 10, -20]} rotation={[0, 0, Math.PI / 4]}>
          <meshBasicMaterial
            color="#ffffcc"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </Cylinder>
      )}

      {/* WHEN SIMULATING - Cyan/Blue UV Ray to Earth */}
      {active && (
        <group>
          {/* Outer Ethereal Glow */}
          <Cylinder ref={simBeamRef} args={[0.05, 0.4, distance, 32]}>
            <meshBasicMaterial
              color="hsla(46, 99%, 51%, 1.00)"
              transparent
              opacity={0.15}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </Cylinder>

          {/* Inner Intensely White Core */}
          <Cylinder args={[0.01, 0.08, distance, 16]}>
            <meshBasicMaterial
              color="#ff0000ff"
              transparent
              opacity={0.4}
              blending={THREE.AdditiveBlending}
            />
          </Cylinder>

          {/* Pulsing rings along the beam could be added here for extra realism */}
        </group>
      )}
    </group>
  );
};
