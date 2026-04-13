import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Environment, Grid } from '@react-three/drei';
import { Suspense, useState } from 'react';
import { soundManager } from '@/lib/audio';
import { cn } from '@/lib/utils';
import { MachineType } from '@/store/useStore';

function DrillingModel({ onSelect }: { onSelect: (part: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  const handlePointerOver = (part: string) => (e: any) => {
    e.stopPropagation();
    setHovered(part);
    soundManager.play('hover');
  };

  const handlePointerOut = () => setHovered(null);

  const handleClick = (part: string) => (e: any) => {
    e.stopPropagation();
    soundManager.play('click');
    onSelect(part);
  };

  return (
    <group>
      <Box args={[4, 0.5, 2]} position={[0, 0.25, 0]} onPointerOver={handlePointerOver('Base')} onPointerOut={handlePointerOut} onClick={handleClick('Base')}>
        <meshStandardMaterial color={hovered === 'Base' ? '#333A4A' : '#222733'} metalness={0.8} roughness={0.2} />
      </Box>
      <Box args={[1, 3, 1]} position={[-1, 2, 0]} onPointerOver={handlePointerOver('Column')} onPointerOut={handlePointerOut} onClick={handleClick('Column')}>
        <meshStandardMaterial color={hovered === 'Column' ? '#2A2F3A' : '#1A1D24'} metalness={0.6} roughness={0.4} />
      </Box>
      <Box args={[1.5, 1, 1.2]} position={[0, 3, 0]} onPointerOver={handlePointerOver('Drill Head')} onPointerOut={handlePointerOut} onClick={handleClick('Drill Head')}>
        <meshStandardMaterial color={hovered === 'Drill Head' ? '#60A5FA' : '#2563EB'} metalness={0.5} roughness={0.5} />
      </Box>
      <Cylinder args={[0.1, 0.1, 0.8]} position={[0.5, 2.1, 0]} onPointerOver={handlePointerOver('Drill Bit')} onPointerOut={handlePointerOut} onClick={handleClick('Drill Bit')}>
        <meshStandardMaterial color={hovered === 'Drill Bit' ? '#FFFFFF' : '#E6EAF0'} metalness={0.9} roughness={0.1} />
      </Cylinder>
      <Box args={[2, 0.2, 1.5]} position={[0.5, 1, 0]} onPointerOver={handlePointerOver('Table')} onPointerOut={handlePointerOut} onClick={handleClick('Table')}>
        <meshStandardMaterial color={hovered === 'Table' ? '#B0BAC7' : '#9AA4B2'} metalness={0.7} roughness={0.3} />
      </Box>
    </group>
  );
}

function MillingModel({ onSelect }: { onSelect: (part: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  const handlePointerOver = (part: string) => (e: any) => {
    e.stopPropagation();
    setHovered(part);
    soundManager.play('hover');
  };

  const handlePointerOut = () => setHovered(null);

  const handleClick = (part: string) => (e: any) => {
    e.stopPropagation();
    soundManager.play('click');
    onSelect(part);
  };

  return (
    <group>
      {/* CNC Router / Mill Base */}
      <Box args={[6, 0.5, 4]} position={[0, 0.25, 0]} onPointerOver={handlePointerOver('Machine Base')} onPointerOut={handlePointerOut} onClick={handleClick('Machine Base')}>
        <meshStandardMaterial color={hovered === 'Machine Base' ? '#333A4A' : '#222733'} metalness={0.8} roughness={0.2} />
      </Box>
      
      {/* Work Table (Bed) */}
      <Box args={[5, 0.2, 3]} position={[0, 0.6, 0]} onPointerOver={handlePointerOver('Work Table')} onPointerOut={handlePointerOut} onClick={handleClick('Work Table')}>
        <meshStandardMaterial color={hovered === 'Work Table' ? '#B0BAC7' : '#9AA4B2'} metalness={0.7} roughness={0.3} />
      </Box>

      {/* Gantry Legs */}
      <Box args={[0.5, 3, 1]} position={[-2.5, 2.1, 0]} onPointerOver={handlePointerOver('Left Gantry')} onPointerOut={handlePointerOut} onClick={handleClick('Left Gantry')}>
        <meshStandardMaterial color={hovered === 'Left Gantry' ? '#2A2F3A' : '#1A1D24'} metalness={0.6} roughness={0.4} />
      </Box>
      <Box args={[0.5, 3, 1]} position={[2.5, 2.1, 0]} onPointerOver={handlePointerOver('Right Gantry')} onPointerOut={handlePointerOut} onClick={handleClick('Right Gantry')}>
        <meshStandardMaterial color={hovered === 'Right Gantry' ? '#2A2F3A' : '#1A1D24'} metalness={0.6} roughness={0.4} />
      </Box>

      {/* Gantry Crossbeam (X-Axis) */}
      <Box args={[5.5, 0.8, 1]} position={[0, 3.2, 0]} onPointerOver={handlePointerOver('Gantry Beam')} onPointerOut={handlePointerOut} onClick={handleClick('Gantry Beam')}>
        <meshStandardMaterial color={hovered === 'Gantry Beam' ? '#333A4A' : '#222733'} metalness={0.7} roughness={0.3} />
      </Box>

      {/* Spindle Carriage (Y/Z Axis) */}
      <Box args={[1.2, 1.5, 1.2]} position={[0, 3.2, 0.5]} onPointerOver={handlePointerOver('Spindle Carriage')} onPointerOut={handlePointerOut} onClick={handleClick('Spindle Carriage')}>
        <meshStandardMaterial color={hovered === 'Spindle Carriage' ? '#F59E0B' : '#D97706'} metalness={0.5} roughness={0.5} />
      </Box>

      {/* Milling Tool */}
      <Cylinder args={[0.15, 0.15, 1.2]} position={[0, 2.2, 0.5]} onPointerOver={handlePointerOver('End Mill')} onPointerOut={handlePointerOut} onClick={handleClick('End Mill')}>
        <meshStandardMaterial color={hovered === 'End Mill' ? '#FFFFFF' : '#E6EAF0'} metalness={0.9} roughness={0.1} />
      </Cylinder>
    </group>
  );
}

function TurningModel({ onSelect }: { onSelect: (part: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  const handlePointerOver = (part: string) => (e: any) => {
    e.stopPropagation();
    setHovered(part);
    soundManager.play('hover');
  };

  const handlePointerOut = () => setHovered(null);

  const handleClick = (part: string) => (e: any) => {
    e.stopPropagation();
    soundManager.play('click');
    onSelect(part);
  };

  return (
    <group>
      <Box args={[6, 0.5, 2]} position={[0, 0.25, 0]} onPointerOver={handlePointerOver('Lathe Bed')} onPointerOut={handlePointerOut} onClick={handleClick('Lathe Bed')}>
        <meshStandardMaterial color={hovered === 'Lathe Bed' ? '#333A4A' : '#222733'} metalness={0.8} roughness={0.2} />
      </Box>
      <Box args={[1.5, 2, 1.5]} position={[-2, 1.5, 0]} onPointerOver={handlePointerOver('Headstock')} onPointerOut={handlePointerOut} onClick={handleClick('Headstock')}>
        <meshStandardMaterial color={hovered === 'Headstock' ? '#10B981' : '#059669'} metalness={0.6} roughness={0.4} />
      </Box>
      <Cylinder args={[0.4, 0.4, 1]} position={[-1, 1.5, 0]} rotation={[0, 0, Math.PI / 2]} onPointerOver={handlePointerOver('Chuck')} onPointerOut={handlePointerOut} onClick={handleClick('Chuck')}>
        <meshStandardMaterial color={hovered === 'Chuck' ? '#B0BAC7' : '#9AA4B2'} metalness={0.8} roughness={0.3} />
      </Cylinder>
      <Box args={[1, 1.5, 1]} position={[1, 1.25, 0.5]} onPointerOver={handlePointerOver('Carriage')} onPointerOut={handlePointerOut} onClick={handleClick('Carriage')}>
        <meshStandardMaterial color={hovered === 'Carriage' ? '#2A2F3A' : '#1A1D24'} metalness={0.6} roughness={0.4} />
      </Box>
      <Box args={[1, 1.5, 1]} position={[2.5, 1.25, 0]} onPointerOver={handlePointerOver('Tailstock')} onPointerOut={handlePointerOut} onClick={handleClick('Tailstock')}>
        <meshStandardMaterial color={hovered === 'Tailstock' ? '#60A5FA' : '#2563EB'} metalness={0.6} roughness={0.4} />
      </Box>
    </group>
  );
}

export function DigitalTwinViewport({ machineType = 'drilling' }: { machineType?: MachineType }) {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  return (
    <div className="w-full h-full bg-bg-secondary rounded-lg overflow-hidden relative border border-border">
      <Canvas camera={{ position: [5, 5, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Environment preset="city" />
          {machineType === 'drilling' && <DrillingModel onSelect={setSelectedPart} />}
          {machineType === 'milling' && <MillingModel onSelect={setSelectedPart} />}
          {machineType === 'turning' && <TurningModel onSelect={setSelectedPart} />}
          <Grid infiniteGrid fadeDistance={20} sectionColor="#2563EB" cellColor="#262626" />
          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
        </Suspense>
      </Canvas>
      <div className="absolute top-4 left-4 bg-bg-primary/90 backdrop-blur-md border border-border p-4 rounded-lg font-mono text-xs shadow-lg">
        <div className="text-accent-primary mb-2 font-bold tracking-wider">VIEWPORT ACTIVE</div>
        <div className="text-text-secondary uppercase">MACHINE: {machineType}</div>
        <div className="text-text-secondary">X: 124.500</div>
        <div className="text-text-secondary">Y: 82.100</div>
        <div className="text-text-secondary">Z: -15.000</div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-text-secondary mb-1">SELECTED COMPONENT</div>
          <div className={cn("font-bold text-sm", selectedPart ? "text-white" : "text-text-secondary/50")}>
            {selectedPart || "NONE"}
          </div>
        </div>
      </div>
    </div>
  );
}
