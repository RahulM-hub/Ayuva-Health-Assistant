import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MuscleGroup } from '../types';
import { Activity, Zap, Eye, RotateCw, Sparkles, HeartPulse, Flame, Target } from 'lucide-react';

interface BodyHologram3DProps {
  bmr: number;
  tdee: number;
  targetCalories: number;
  goalLabel: string;
  selectedMuscle?: MuscleGroup | null;
  onSelectMuscle?: (muscle: MuscleGroup) => void;
  hasCalculated?: boolean;
}

interface MuscleNode {
  id: MuscleGroup;
  label: string;
  position: [number, number, number];
  description: string;
  burnRate: string;
}

const MUSCLE_NODES: MuscleNode[] = [
  { id: 'chest', label: 'Chest (Pectorals)', position: [0, 2.1, 0.45], description: 'Major pushing power & upper torso mass', burnRate: '380-450 kcal/hr' },
  { id: 'back', label: 'Back (Lats & Traps)', position: [0, 2.2, -0.4], description: 'Postural foundation & heavy pulling power', burnRate: '400-500 kcal/hr' },
  { id: 'shoulders', label: 'Shoulders (Delts)', position: [0, 2.7, 0.3], description: 'Overhead strength & aesthetic V-taper width', burnRate: '350-400 kcal/hr' },
  { id: 'biceps', label: 'Biceps (Pull)', position: [1.3, 1.8, 0.2], description: 'Arm flexor peak & pulling mechanics', burnRate: '260-310 kcal/hr' },
  { id: 'triceps', label: 'Triceps (Push)', position: [-1.3, 1.8, -0.2], description: 'Arm extensor mass & pressing lockout', burnRate: '270-330 kcal/hr' },
  { id: 'core', label: 'Core (Abs & Obliques)', position: [0, 1.2, 0.4], description: 'Metabolic center & intra-abdominal bracing', burnRate: '300-380 kcal/hr' },
  { id: 'quads', label: 'Quads (Thighs)', position: [0.55, -0.6, 0.3], description: 'Primary lower body metabolic engine', burnRate: '500-650 kcal/hr' },
  { id: 'hamstrings', label: 'Hamstrings (Posterior)', position: [-0.55, -0.7, -0.3], description: 'Posterior chain explosive hip extension', burnRate: '480-580 kcal/hr' },
  { id: 'glutes', label: 'Glutes (Maximus)', position: [0, -0.4, -0.45], description: 'Hips power generation & glute bridge mechanics', burnRate: '450-550 kcal/hr' },
  { id: 'calves', label: 'Calves (Gastrocnemius)', position: [0.5, -2.4, 0.1], description: 'Ankle stabilization & ground force transfer', burnRate: '250-300 kcal/hr' },
  { id: 'cardio', label: 'Cardio-Vascular System', position: [0, 1.7, 0.35], description: 'Systemic VO2 Max & metabolic endurance', burnRate: '550-700 kcal/hr' },
];

export const BodyHologram3D: React.FC<BodyHologram3DProps> = ({
  bmr,
  tdee,
  targetCalories,
  goalLabel,
  selectedMuscle,
  onSelectMuscle,
  hasCalculated = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeNode, setActiveNode] = useState<MuscleNode | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframeMode, setWireframeMode] = useState<'hologram' | 'particles' | 'solid'>('hologram');
  const [hoveredNode, setHoveredNode] = useState<MuscleNode | null>(null);

  useEffect(() => {
    if (selectedMuscle) {
      const match = MUSCLE_NODES.find(n => n.id === selectedMuscle);
      if (match) setActiveNode(match);
    }
  }, [selectedMuscle]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060d1d, 0.08);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 9.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);

    // Group for the entire human anatomical figure
    const bodyGroup = new THREE.Group();
    scene.add(bodyGroup);

    // Hologram materials with glowing cyan/neon blue aesthetics matching bmr-hero.jpg
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    const innerCoreMaterial = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });

    // --- Anatomical Geometry Construction ---
    // Head
    const headGeo = new THREE.SphereGeometry(0.55, 16, 16);
    const head = new THREE.Mesh(headGeo, wireMaterial);
    head.position.y = 3.6;
    head.scale.set(0.85, 1.1, 0.9);
    bodyGroup.add(head);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.25, 0.32, 0.45, 12);
    const neck = new THREE.Mesh(neckGeo, wireMaterial);
    neck.position.y = 2.95;
    bodyGroup.add(neck);

    // Chest & Upper Torso (Trapezoidal / Inverted V)
    const chestGeo = new THREE.CylinderGeometry(0.95, 0.75, 1.1, 16);
    const chest = new THREE.Mesh(chestGeo, wireMaterial);
    chest.position.y = 2.2;
    chest.scale.set(1.2, 1, 0.68);
    bodyGroup.add(chest);

    const chestCore = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.65, 0.95, 12), glowMaterial);
    chestCore.position.y = 2.2;
    chestCore.scale.set(1.1, 1, 0.6);
    bodyGroup.add(chestCore);

    // Abdomen / Waist
    const absGeo = new THREE.CylinderGeometry(0.72, 0.68, 0.95, 14);
    const abs = new THREE.Mesh(absGeo, wireMaterial);
    abs.position.y = 1.25;
    abs.scale.set(1.05, 1, 0.62);
    bodyGroup.add(abs);

    // Pelvis / Hips
    const pelvisGeo = new THREE.CylinderGeometry(0.7, 0.78, 0.65, 14);
    const pelvis = new THREE.Mesh(pelvisGeo, wireMaterial);
    pelvis.position.y = 0.5;
    pelvis.scale.set(1.12, 1, 0.65);
    bodyGroup.add(pelvis);

    // Shoulders
    const leftShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), wireMaterial);
    leftShoulder.position.set(-1.3, 2.65, 0);
    bodyGroup.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), wireMaterial);
    rightShoulder.position.set(1.3, 2.65, 0);
    bodyGroup.add(rightShoulder);

    // Upper Arms (Biceps/Triceps)
    const upperArmGeo = new THREE.CylinderGeometry(0.24, 0.2, 1.0, 12);
    
    const leftUpperArm = new THREE.Mesh(upperArmGeo, wireMaterial);
    leftUpperArm.position.set(-1.45, 1.95, 0);
    leftUpperArm.rotation.z = 0.18;
    bodyGroup.add(leftUpperArm);

    const rightUpperArm = new THREE.Mesh(upperArmGeo, wireMaterial);
    rightUpperArm.position.set(1.45, 1.95, 0);
    rightUpperArm.rotation.z = -0.18;
    bodyGroup.add(rightUpperArm);

    // Forearms & Hands
    const forearmGeo = new THREE.CylinderGeometry(0.19, 0.14, 1.0, 10);

    const leftForearm = new THREE.Mesh(forearmGeo, wireMaterial);
    leftForearm.position.set(-1.68, 0.95, 0.05);
    leftForearm.rotation.z = 0.25;
    bodyGroup.add(leftForearm);

    const rightForearm = new THREE.Mesh(forearmGeo, wireMaterial);
    rightForearm.position.set(1.68, 0.95, 0.05);
    rightForearm.rotation.z = -0.25;
    bodyGroup.add(rightForearm);

    // Thighs (Quads & Hamstrings)
    const thighGeo = new THREE.CylinderGeometry(0.38, 0.27, 1.6, 14);

    const leftThigh = new THREE.Mesh(thighGeo, wireMaterial);
    leftThigh.position.set(-0.52, -0.65, 0);
    leftThigh.rotation.z = -0.04;
    bodyGroup.add(leftThigh);

    const rightThigh = new THREE.Mesh(thighGeo, wireMaterial);
    rightThigh.position.set(0.52, -0.65, 0);
    rightThigh.rotation.z = 0.04;
    bodyGroup.add(rightThigh);

    // Shins & Calves
    const shinGeo = new THREE.CylinderGeometry(0.26, 0.18, 1.6, 12);

    const leftShin = new THREE.Mesh(shinGeo, wireMaterial);
    leftShin.position.set(-0.54, -2.25, 0);
    bodyGroup.add(leftShin);

    const rightShin = new THREE.Mesh(shinGeo, wireMaterial);
    rightShin.position.set(0.54, -2.25, 0);
    bodyGroup.add(rightShin);

    // Feet
    const footGeo = new THREE.BoxGeometry(0.28, 0.18, 0.65);
    const leftFoot = new THREE.Mesh(footGeo, wireMaterial);
    leftFoot.position.set(-0.54, -3.1, 0.18);
    bodyGroup.add(leftFoot);

    const rightFoot = new THREE.Mesh(footGeo, wireMaterial);
    rightFoot.position.set(0.54, -3.1, 0.18);
    bodyGroup.add(rightFoot);

    // Spine and Neural Energy Line
    const spineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 3.6, 0),
      new THREE.Vector3(0, 2.9, 0),
      new THREE.Vector3(0, 2.2, 0.05),
      new THREE.Vector3(0, 1.25, 0),
      new THREE.Vector3(0, 0.5, -0.05),
    ]);
    const spineMat = new THREE.LineBasicMaterial({ color: 0x67e8f9, linewidth: 2 });
    const spineLine = new THREE.Line(spineGeo, spineMat);
    bodyGroup.add(spineLine);

    // Floating Biometric Constellation Particles (Plexus)
    const particleCount = 220;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Scatter particles roughly within human silhouette boundary
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() * 6.5) - 3.0; // from -3 to 3.5
      let radius = 0.5;
      if (y > 2.0) radius = 1.4; // chest/shoulders
      else if (y > 0.5) radius = 0.9; // waist
      else if (y > -1.5) radius = 1.0; // thighs
      else radius = 0.8; // calves

      const r = Math.random() * radius;
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = y + (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 2] = Math.sin(angle) * (r * 0.6);

      // Cyan to vibrant blue hues
      colors[i * 3] = 0.05 + Math.random() * 0.3;     // R
      colors[i * 3 + 1] = 0.75 + Math.random() * 0.25; // G
      colors[i * 3 + 2] = 0.95 + Math.random() * 0.05; // B
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    bodyGroup.add(particlePoints);

    // Glowing Circular Holographic Pedestal at base
    const ringGeo = new THREE.RingGeometry(1.6, 2.2, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
      wireframe: true,
    });
    const baseRing = new THREE.Mesh(ringGeo, ringMat);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = -3.2;
    bodyGroup.add(baseRing);

    // Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0x06b6d4, 1.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 3, 10);
    pointLight.position.set(0, 2, 4);
    scene.add(pointLight);

    // Center body group
    bodyGroup.position.y = 0.1;

    // Mouse / Touch Interaction for 3D Orbiting
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      bodyGroup.rotation.y += deltaX * 0.008;
      bodyGroup.rotation.x = Math.max(-0.35, Math.min(0.35, bodyGroup.rotation.x + deltaY * 0.005));

      previousMousePosition = { x: clientX, y: clientY };
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    dom.addEventListener('touchstart', handlePointerDown);
    window.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('touchend', handlePointerUp);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth idle rotation
      if (autoRotate && !isDragging) {
        bodyGroup.rotation.y += 0.006;
      }

      // Breathing / pulse scale oscillation
      const pulse = Math.sin(elapsedTime * 1.8) * 0.015;
      chest.scale.set(1.2 + pulse, 1, 0.68 + pulse);
      chestCore.scale.set(1.1 + pulse * 1.5, 1, 0.6 + pulse * 1.5);

      // Rotate particles slightly
      particlePoints.rotation.y = elapsedTime * 0.05;
      baseRing.rotation.z = elapsedTime * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handling with ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      dom.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      dom.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      renderer.dispose();
    };
  }, [autoRotate, wireframeMode]);

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[580px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#060e20] via-[#040a18] to-[#02050c] border border-cyan-500/20 shadow-2xl glow-cyan flex flex-col items-center justify-center p-3 sm:p-4 touch-pan-y">
      {/* Background Bio-Grid & Scanning Ambience */}
      <div className="absolute inset-0 holo-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 scanline-bg opacity-40 pointer-events-none" />

      {/* Cybernetic HUD Frame Accents */}
      <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>3D BIO-SCANNER ACTIVE</span>
        </div>
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-lg border backdrop-blur-md transition-all text-xs flex items-center gap-1.5 ${
            autoRotate 
              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-500/20' 
              : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white'
          }`}
          title="Toggle 360° Auto-Rotation"
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          <span className="hidden sm:inline font-mono">ROTATE</span>
        </button>
      </div>

      {/* 3D Three.js Container Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing relative z-0" />

      {/* Interactive Muscle Group Quick-Select Pills Overlay */}
      <div className="absolute bottom-4 left-3 right-3 z-10 flex flex-col gap-2">
        {/* Active Selected Node Readout Card */}
        {activeNode && (
          <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/40 backdrop-blur-md shadow-lg flex items-center justify-between transition-all animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Flame className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <span>TARGET MUSCLE: {activeNode.label}</span>
                </div>
                <div className="text-xs text-slate-300">{activeNode.description}</div>
              </div>
            </div>
            <div className="text-right pl-2">
              <div className="text-[10px] font-mono text-slate-400">METABOLIC EXPENDITURE</div>
              <div className="text-xs font-bold text-cyan-300 font-mono">{activeNode.burnRate}</div>
            </div>
          </div>
        )}

        {/* Muscle Selector Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar mask-gradient">
          {MUSCLE_NODES.map((node) => {
            const isSelected = selectedMuscle === node.id || activeNode?.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => {
                  setActiveNode(node);
                  onSelectMuscle?.(node.id);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all flex items-center gap-1.5 border backdrop-blur-md ${
                  isSelected
                    ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20 scale-105'
                    : 'bg-slate-900/70 border-slate-700/60 text-slate-300 hover:border-cyan-500/50 hover:text-white'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`} />
                {node.label.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Holographic Telemetry Cards */}
      <div className="absolute top-14 left-4 z-10 pointer-events-none hidden md:flex flex-col gap-2">
        <div className="p-2.5 rounded-xl bg-slate-950/75 border border-cyan-500/30 backdrop-blur-md text-left max-w-[170px]">
          <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
            <HeartPulse className="w-3 h-3 text-cyan-400" /> BMR BASELINE
          </div>
          <div className="text-lg font-bold text-white font-mono tracking-tight">
            {hasCalculated ? bmr : '--'} <span className="text-[10px] text-cyan-400 font-normal">kcal</span>
          </div>
          <div className="text-[9px] text-slate-400">{hasCalculated ? 'Resting Cellular Burn' : 'Click Calculate BMR'}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/75 border border-cyan-500/30 backdrop-blur-md text-left max-w-[170px]">
          <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400" /> MAINTENANCE
          </div>
          <div className="text-lg font-bold text-white font-mono tracking-tight">
            {hasCalculated ? tdee : '--'} <span className="text-[10px] text-emerald-400 font-normal">kcal</span>
          </div>
          <div className="text-[9px] text-slate-400">{hasCalculated ? 'Total Daily Energy (TDEE)' : 'Click Calculate TDEE'}</div>
        </div>
      </div>

      <div className="absolute top-14 right-4 z-10 pointer-events-none hidden md:flex flex-col gap-2">
        <div className="p-2.5 rounded-xl bg-slate-950/75 border border-cyan-500/30 backdrop-blur-md text-right max-w-[170px]">
          <div className="text-[10px] font-mono text-slate-400 flex items-center justify-end gap-1">
            <Target className="w-3 h-3 text-amber-400" /> ACTIVE TARGET
          </div>
          <div className="text-lg font-bold text-cyan-300 font-mono tracking-tight">
            {hasCalculated ? targetCalories : '--'} <span className="text-[10px] text-slate-300 font-normal">kcal</span>
          </div>
          <div className="text-[9px] text-slate-400 truncate">{hasCalculated ? goalLabel : 'Awaiting Calculation'}</div>
        </div>
      </div>
    </div>
  );
};
