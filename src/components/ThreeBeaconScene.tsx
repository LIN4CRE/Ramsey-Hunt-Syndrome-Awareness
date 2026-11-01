import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { MilestoneItem, TransparencySummary } from '../types';
import { sound } from '../utils/audio';
import { formatGBP } from '../utils/transparency';
import { Sparkles, Eye, CheckCircle2 } from 'lucide-react';

interface ThreeBeaconSceneProps {
  milestones: MilestoneItem[];
  summary: TransparencySummary;
  selectedMilestoneId: string | null;
  onSelectMilestone: (id: string | null) => void;
  explodedFactor: number; // 0 to 1
  autoRotate: boolean;
  cameraPreset: 'hero' | 'nerve' | 'core' | 'overhead';
  pulseTrigger?: number; // increments on donation
}

// Module-level reusable math scratch objects for zero GC in animation loop
const _vec3Target = new THREE.Vector3();
const _raycaster = new THREE.Raycaster();
const _mouse = new THREE.Vector2();
const _screenPos = new THREE.Vector3();

interface HoveredObjectInfo {
  id: string;
  type: 'milestone' | 'nerve' | 'core' | 'plinth';
  title: string;
  subtitle: string;
  colorHex: string;
  screenX: number;
  screenY: number;
  amount?: string;
  metric?: string;
}

export const ThreeBeaconScene: React.FC<ThreeBeaconSceneProps> = ({
  milestones,
  summary,
  selectedMilestoneId,
  onSelectMilestone,
  explodedFactor,
  autoRotate,
  cameraPreset,
  pulseTrigger = 0,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // References for dynamic animated sub-components
  const coreGroupRef = useRef<THREE.Group | null>(null);
  const innerColumnRef = useRef<THREE.Mesh | null>(null);
  const acousticRingRef = useRef<THREE.Mesh | null>(null);
  const acousticRingOuterRef = useRef<THREE.Mesh | null>(null);
  const nerveArchViiRef = useRef<THREE.Mesh | null>(null);
  const nerveArchViiiRef = useRef<THREE.Mesh | null>(null);
  const nerveNodesViiRef = useRef<THREE.Mesh[]>([]);
  const nerveNodesViiiRef = useRef<THREE.Mesh[]>([]);
  const nerveCurveViiRef = useRef<THREE.CatmullRomCurve3 | null>(null);
  const nerveCurveViiiRef = useRef<THREE.CatmullRomCurve3 | null>(null);

  const innerGimbal1Ref = useRef<THREE.Mesh | null>(null);
  const innerGimbal2Ref = useRef<THREE.Mesh | null>(null);
  const innerGimbal3Ref = useRef<THREE.Mesh | null>(null);
  const gemCoreRef = useRef<THREE.Mesh | null>(null);
  const outerGemRef = useRef<THREE.Mesh | null>(null);

  const shardMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const shardAuraRingsRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const shardBeamsRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const shardBasePadsRef = useRef<Map<string, THREE.Mesh>>(new Map());

  const particlesRef = useRef<THREE.Points | null>(null);
  const innerAuraRef = useRef<THREE.Points | null>(null);
  const pulseIntensityRef = useRef<number>(0);

  // Hover state for interactive HUD tooltip
  const [hoveredInfo, setHoveredInfo] = useState<HoveredObjectInfo | null>(null);

  // Store interactive props in refs to avoid restarting canvas on prop change
  const propsRef = useRef({
    explodedFactor,
    autoRotate,
    cameraPreset,
    selectedMilestoneId,
    milestones,
    summary,
    onSelectMilestone,
  });

  useEffect(() => {
    propsRef.current = {
      explodedFactor,
      autoRotate,
      cameraPreset,
      selectedMilestoneId,
      milestones,
      summary,
      onSelectMilestone,
    };
  }, [explodedFactor, autoRotate, cameraPreset, selectedMilestoneId, milestones, summary, onSelectMilestone]);

  // Trigger visual celebration pulse on donation
  useEffect(() => {
    if (pulseTrigger > 0) {
      pulseIntensityRef.current = 1.0;
    }
  }, [pulseTrigger]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL from renderer string (Ultra-mode & Three.js skill)
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Initialize renderer with ACESFilmic tone mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Scene & Camera
    const scene = new THREE.Scene();
    const bgColor = 0x070b16; // Deep observatory midnight
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.FogExp2(bgColor, 0.034);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 4.4, 11.2);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.03; // Keep camera above floor
    controls.minDistance = 3.5;
    controls.maxDistance = 20;
    controls.target.set(0, 2.0, 0); // Focus at beacon optical center
    controlsRef.current = controls;

    // 4. Studio Environment Reflection (RoomEnvironment + PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Studio Lighting Rig
    // Warm Key Light (Front-Right Top)
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.6);
    keyLight.position.set(6, 12, 6);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.shadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 25;
      keyLight.shadow.camera.left = -6;
      keyLight.shadow.camera.right = 6;
      keyLight.shadow.camera.top = 6;
      keyLight.shadow.camera.bottom = -6;
    }
    scene.add(keyLight);

    // Cool Rim Light (Back-Left) for crisp edge highlights
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    rimLight.position.set(-7, 8, -6);
    scene.add(rimLight);

    // Soft Cyan Under-Fill Light
    const underFill = new THREE.DirectionalLight(0x06b6d4, 0.8);
    underFill.position.set(0, -5, 4);
    scene.add(underFill);

    // Hemisphere Ambient Sky & Ground
    const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x020617, 1.2);
    hemiLight.position.set(0, 16, 0);
    scene.add(hemiLight);

    // Core Radiant Point Light (Warm Amber)
    const corePointLight = new THREE.PointLight(0xf59e0b, 2.2, 9);
    corePointLight.position.set(0, 2.4, 0);
    scene.add(corePointLight);

    // 6. Seamless Procedural Dais Floor with Concentric Hologram Rings
    // Generates a high-res radial canvas texture that softly fades to 0 opacity at the edges
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 1024;
    floorCanvas.height = 1024;
    const fCtx = floorCanvas.getContext('2d')!;
    const center = 512;

    // Dark radial backdrop with soft edge fade
    const fGrad = fCtx.createRadialGradient(center, center, 40, center, center, 510);
    fGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
    fGrad.addColorStop(0.35, 'rgba(11, 17, 32, 0.85)');
    fGrad.addColorStop(0.7, 'rgba(7, 11, 22, 0.45)');
    fGrad.addColorStop(1.0, 'rgba(7, 11, 22, 0.0)');
    fCtx.fillStyle = fGrad;
    fCtx.fillRect(0, 0, 1024, 1024);

    // Concentric precision alignment rings
    const ringRadii = [80, 140, 210, 280, 360, 440];
    ringRadii.forEach((r, idx) => {
      fCtx.beginPath();
      fCtx.arc(center, center, r, 0, Math.PI * 2);
      fCtx.strokeStyle = idx % 2 === 0 ? 'rgba(56, 189, 248, 0.35)' : 'rgba(245, 158, 11, 0.25)';
      fCtx.lineWidth = idx === 2 ? 3 : 1.5;
      fCtx.stroke();
    });

    // Radial compass tick marks
    for (let i = 0; i < 48; i++) {
      const angle = (i / 48) * Math.PI * 2;
      const isMajor = i % 4 === 0;
      const innerR = 345;
      const outerR = isMajor ? 365 : 355;
      fCtx.beginPath();
      fCtx.moveTo(center + Math.cos(angle) * innerR, center + Math.sin(angle) * innerR);
      fCtx.lineTo(center + Math.cos(angle) * outerR, center + Math.sin(angle) * outerR);
      fCtx.strokeStyle = isMajor ? 'rgba(245, 158, 11, 0.5)' : 'rgba(148, 163, 184, 0.25)';
      fCtx.lineWidth = isMajor ? 2 : 1;
      fCtx.stroke();
    }

    const floorTex = new THREE.CanvasTexture(floorCanvas);
    floorTex.colorSpace = THREE.SRGBColorSpace;

    const floorGeo = new THREE.PlaneGeometry(28, 28, 32, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      transparent: true,
      roughness: 0.85,
      metalness: 0.2,
      depthWrite: false,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = !isSoftwareGl;
    scene.add(floorMesh);

    // Contact Ambient Shadow beneath the plinth
    const shadowGeo = new THREE.CircleGeometry(4.4, 32);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d')!;
    const sGrad = sCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
    sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
    sGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0.6)');
    sGrad.addColorStop(0.75, 'rgba(0, 0, 0, 0.2)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 256, 256);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;

    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.01;
    scene.add(shadowMesh);

    // 7. COMPOSITE PROCEDURAL HERO MONUMENT: "The Hope & Transparency Beacon"
    const beaconGroup = new THREE.Group();
    beaconGroup.position.set(0, 0, 0);
    scene.add(beaconGroup);

    // Part 1: Stepped Two-Tier Hexagonal Foundation Plinth (Obsidian Stone + Brushed Gold)
    const lowerPlinthGeo = new THREE.CylinderGeometry(3.8, 4.2, 0.25, 6);
    const obsidianMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.6,
      metalness: 0.35,
    });
    const lowerPlinthMesh = new THREE.Mesh(lowerPlinthGeo, obsidianMat);
    lowerPlinthMesh.position.y = 0.125;
    lowerPlinthMesh.receiveShadow = !isSoftwareGl;
    lowerPlinthMesh.castShadow = !isSoftwareGl;
    beaconGroup.add(lowerPlinthMesh);

    const upperPlinthGeo = new THREE.CylinderGeometry(3.3, 3.6, 0.22, 6);
    const upperPlinthMesh = new THREE.Mesh(upperPlinthGeo, obsidianMat);
    upperPlinthMesh.position.y = 0.35;
    upperPlinthMesh.receiveShadow = !isSoftwareGl;
    upperPlinthMesh.castShadow = !isSoftwareGl;
    beaconGroup.add(upperPlinthMesh);

    // Gilded Retaining Collar & Ledger Trim (Brushed Brass/Gold)
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xeab308,
      roughness: 0.22,
      metalness: 0.88,
    });
    const collarGeo = new THREE.TorusGeometry(3.0, 0.1, 16, 64);
    const collarMesh = new THREE.Mesh(collarGeo, goldMat);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.position.y = 0.48;
    beaconGroup.add(collarMesh);

    // Glowing Inner Ring Inlay (Bioluminescent Cyan)
    const innerRingGeo = new THREE.TorusGeometry(2.5, 0.04, 12, 48);
    const innerRingMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
    });
    const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRingMesh.rotation.x = Math.PI / 2;
    innerRingMesh.position.y = 0.51;
    beaconGroup.add(innerRingMesh);

    // Part 2: Faceted Fluted Crystal Transparency Core Pillar
    const coreGroup = new THREE.Group();
    coreGroup.position.y = 0.55;
    beaconGroup.add(coreGroup);
    coreGroupRef.current = coreGroup;

    // Outer 12-sided fluted optic quartz column
    const coreGeo = new THREE.CylinderGeometry(1.2, 1.4, 3.8, 12, 1, false);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      roughness: 0.08,
      metalness: 0.1,
      transmission: isSoftwareGl ? 0 : 0.92,
      transparent: true,
      opacity: isSoftwareGl ? 0.35 : 0.88,
      ior: 1.54,
      thickness: 1.6,
      depthWrite: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, crystalMat);
    coreMesh.position.y = 1.9;
    coreMesh.userData = { isCore: true };
    coreGroup.add(coreMesh);

    // Inner glowing luminescent light plasma shaft
    const innerColumnGeo = new THREE.CylinderGeometry(0.5, 0.65, 3.4, 16);
    const innerColumnMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const innerColumn = new THREE.Mesh(innerColumnGeo, innerColumnMat);
    innerColumn.position.y = 1.9;
    coreGroup.add(innerColumn);
    innerColumnRef.current = innerColumn;

    // Top and Bottom Crystal Beveled Endcaps
    const capGeo = new THREE.CylinderGeometry(1.28, 1.22, 0.14, 12);
    const bottomCap = new THREE.Mesh(capGeo, goldMat);
    bottomCap.position.y = 0.07;
    coreGroup.add(bottomCap);

    const topCap = new THREE.Mesh(capGeo, goldMat);
    topCap.position.y = 3.82;
    coreGroup.add(topCap);

    // Part 3: Dual Cranial Nerve Pathways (CN VII Facial & CN VIII Auditory)
    // Pathway A: Cranial Nerve VII (Facial motor nerve) - Amber Gold Helix Arch
    const curveVii = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.8, 0.6, -0.4),
      new THREE.Vector3(-1.5, 1.8, 0.9),
      new THREE.Vector3(0.0, 3.6, 1.35),
      new THREE.Vector3(1.5, 2.2, 0.6),
      new THREE.Vector3(1.8, 0.7, -0.4),
    ]);
    nerveCurveViiRef.current = curveVii;

    const archViiGeo = new THREE.TubeGeometry(curveVii, 64, 0.08, 12, false);
    const archViiMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.25,
      metalness: 0.8,
      emissive: 0xb45309,
      emissiveIntensity: 0.45,
    });
    const archViiMesh = new THREE.Mesh(archViiGeo, archViiMat);
    archViiMesh.userData = { isNerve: true, nerveName: 'Cranial Nerve VII (Facial Motor Pathway)' };
    coreGroup.add(archViiMesh);
    nerveArchViiRef.current = archViiMesh;

    // Traveling synapse light pulses on CN VII
    const nodeViiGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const nodeViiMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      blending: THREE.AdditiveBlending,
    });
    const nodesVii: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const nMesh = new THREE.Mesh(nodeViiGeo, nodeViiMat);
      coreGroup.add(nMesh);
      nodesVii.push(nMesh);
    }
    nerveNodesViiRef.current = nodesVii;

    // Pathway B: Cranial Nerve VIII (Vestibulocochlear auditory nerve) - Bioluminescent Teal Arch
    const curveViii = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.7, 0.6, 0.4),
      new THREE.Vector3(1.3, 1.9, -0.8),
      new THREE.Vector3(0.0, 3.4, -1.25),
      new THREE.Vector3(-1.3, 2.1, -0.7),
      new THREE.Vector3(-1.7, 0.7, 0.4),
    ]);
    nerveCurveViiiRef.current = curveViii;

    const archViiiGeo = new THREE.TubeGeometry(curveViii, 64, 0.075, 12, false);
    const archViiiMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.25,
      metalness: 0.8,
      emissive: 0x0891b2,
      emissiveIntensity: 0.5,
    });
    const archViiiMesh = new THREE.Mesh(archViiiGeo, archViiiMat);
    archViiiMesh.userData = { isNerve: true, nerveName: 'Cranial Nerve VIII (Auditory & Balance Pathway)' };
    coreGroup.add(archViiiMesh);
    nerveArchViiiRef.current = archViiiMesh;

    // Traveling synapse light pulses on CN VIII
    const nodeViiiGeo = new THREE.SphereGeometry(0.11, 12, 12);
    const nodeViiiMat = new THREE.MeshBasicMaterial({
      color: 0xa5f3fc,
      blending: THREE.AdditiveBlending,
    });
    const nodesViii: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const nMesh = new THREE.Mesh(nodeViiiGeo, nodeViiiMat);
      coreGroup.add(nMesh);
      nodesViii.push(nMesh);
    }
    nerveNodesViiiRef.current = nodesViii;

    // Part 4: Concentric Acoustic Wave Resonance Rings (Auditory & Tinnitus Awareness)
    const acousticGeo = new THREE.TorusGeometry(2.1, 0.065, 16, 64);
    const acousticMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.2,
      metalness: 0.85,
      emissive: 0x0284c7,
      emissiveIntensity: 0.45,
    });
    const acousticMesh = new THREE.Mesh(acousticGeo, acousticMat);
    acousticMesh.rotation.x = Math.PI / 2;
    acousticMesh.position.y = 2.4;
    coreGroup.add(acousticMesh);
    acousticRingRef.current = acousticMesh;

    const acousticOuterGeo = new THREE.TorusGeometry(2.35, 0.035, 12, 64);
    const acousticOuterMat = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const acousticOuterMesh = new THREE.Mesh(acousticOuterGeo, acousticOuterMat);
    acousticOuterMesh.rotation.x = Math.PI / 2;
    acousticOuterMesh.position.y = 2.4;
    coreGroup.add(acousticOuterMesh);
    acousticRingOuterRef.current = acousticOuterMesh;

    // Part 5: Kinetic Gyroscopic Balance Rings (Vestibular Balance Awareness)
    const gimbalMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.15,
      metalness: 0.95,
    });
    const gimbal1Geo = new THREE.TorusGeometry(1.05, 0.045, 12, 48);
    const gimbal1Mesh = new THREE.Mesh(gimbal1Geo, gimbalMat);
    gimbal1Mesh.position.y = 1.9;
    coreGroup.add(gimbal1Mesh);
    innerGimbal1Ref.current = gimbal1Mesh;

    const gimbal2Geo = new THREE.TorusGeometry(0.85, 0.035, 12, 48);
    const gimbal2Mesh = new THREE.Mesh(gimbal2Geo, gimbalMat);
    gimbal2Mesh.position.y = 1.9;
    gimbal2Mesh.rotation.y = Math.PI / 2;
    coreGroup.add(gimbal2Mesh);
    innerGimbal2Ref.current = gimbal2Mesh;

    const gimbal3Geo = new THREE.TorusGeometry(0.68, 0.025, 12, 48);
    const gimbal3Mesh = new THREE.Mesh(gimbal3Geo, goldMat);
    gimbal3Mesh.position.y = 1.9;
    gimbal3Mesh.rotation.x = Math.PI / 2;
    coreGroup.add(gimbal3Mesh);
    innerGimbal3Ref.current = gimbal3Mesh;

    // Part 6: Prismatic Radiant Heart Gem (100% Transparent Financial Core)
    const gemGeo = new THREE.OctahedronGeometry(0.48, 0);
    const gemMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.12,
      metalness: 0.45,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.95,
    });
    const gemMesh = new THREE.Mesh(gemGeo, gemMat);
    gemMesh.position.y = 1.9;
    gemMesh.userData = { isCoreHeart: true };
    coreGroup.add(gemMesh);
    gemCoreRef.current = gemMesh;

    // Outer refractive diamond cage
    const outerGemGeo = new THREE.IcosahedronGeometry(0.62, 0);
    const outerGemMat = new THREE.MeshPhysicalMaterial({
      color: 0xfef08a,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.9,
      transparent: true,
      opacity: 0.7,
      ior: 1.6,
      depthWrite: false,
    });
    const outerGemMesh = new THREE.Mesh(outerGemGeo, outerGemMat);
    outerGemMesh.position.y = 1.9;
    coreGroup.add(outerGemMesh);
    outerGemRef.current = outerGemMesh;

    // Part 7: 5 Faceted Milestone Allocation Crystals Orbiting the Monument
    const shardMap = new Map<string, THREE.Mesh>();
    const shardAuraMap = new Map<string, THREE.Mesh>();
    const shardBeamMap = new Map<string, THREE.Mesh>();
    const shardBasePadMap = new Map<string, THREE.Mesh>();

    milestones.forEach((m, idx) => {
      const angle = (idx / milestones.length) * Math.PI * 2;
      const radius = 3.35;
      const sx = Math.cos(angle) * radius;
      const sz = Math.sin(angle) * radius;

      // Faceted crystal octahedron/dodecahedron
      const shardGeo = new THREE.OctahedronGeometry(0.38, 0);
      const shardMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(m.colorHex),
        roughness: 0.2,
        metalness: 0.75,
        emissive: new THREE.Color(m.colorHex),
        emissiveIntensity: 0.4,
      });
      const shardMesh = new THREE.Mesh(shardGeo, shardMat);
      shardMesh.position.set(sx, 1.7, sz);
      shardMesh.userData = { milestoneId: m.id, baseAngle: angle, baseRadius: radius, milestone: m };
      beaconGroup.add(shardMesh);
      shardMap.set(m.id, shardMesh);

      // Micro equatorial aura ring for each shard
      const auraRingGeo = new THREE.TorusGeometry(0.48, 0.02, 8, 32);
      const auraRingMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(m.colorHex),
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });
      const auraRingMesh = new THREE.Mesh(auraRingGeo, auraRingMat);
      auraRingMesh.rotation.x = Math.PI / 2;
      auraRingMesh.position.copy(shardMesh.position);
      beaconGroup.add(auraRingMesh);
      shardAuraMap.set(m.id, auraRingMesh);

      // Vertical holographic light projection beam connecting floor to shard
      const beamGeo = new THREE.CylinderGeometry(0.08, 0.22, 1.65, 12, 1, true);
      const beamMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(m.colorHex),
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const beamMesh = new THREE.Mesh(beamGeo, beamMat);
      beamMesh.position.set(sx, 0.825, sz);
      beaconGroup.add(beamMesh);
      shardBeamMap.set(m.id, beamMesh);

      // Glowing circular projection pad on the floor beneath each shard
      const padGeo = new THREE.CircleGeometry(0.45, 24);
      const padMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(m.colorHex),
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const padMesh = new THREE.Mesh(padGeo, padMat);
      padMesh.rotation.x = -Math.PI / 2;
      padMesh.position.set(sx, 0.02, sz);
      beaconGroup.add(padMesh);
      shardBasePadMap.set(m.id, padMesh);
    });

    shardMeshesRef.current = shardMap;
    shardAuraRingsRef.current = shardAuraMap;
    shardBeamsRef.current = shardBeamMap;
    shardBasePadsRef.current = shardBasePadMap;

    // Part 8: Golden Particle Momentum Aura (Rising cylindrical stardust)
    const particleCount = 120;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const pAngle = Math.random() * Math.PI * 2;
      const pRadius = 1.1 + Math.random() * 2.8;
      particlePositions[i * 3] = Math.cos(pAngle) * pRadius;
      particlePositions[i * 3 + 1] = 0.5 + Math.random() * 4.2;
      particlePositions[i * 3 + 2] = Math.sin(pAngle) * pRadius;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfbbf24,
      size: 0.09,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    beaconGroup.add(particles);
    particlesRef.current = particles;

    // Inner bioluminescent aura particles
    const innerAuraCount = 40;
    const innerAuraPositions = new Float32Array(innerAuraCount * 3);
    for (let i = 0; i < innerAuraCount; i++) {
      const iAngle = Math.random() * Math.PI * 2;
      const iRadius = 0.4 + Math.random() * 0.8;
      innerAuraPositions[i * 3] = Math.cos(iAngle) * iRadius;
      innerAuraPositions[i * 3 + 1] = 1.0 + Math.random() * 2.2;
      innerAuraPositions[i * 3 + 2] = Math.sin(iAngle) * iRadius;
    }
    const innerAuraGeo = new THREE.BufferGeometry();
    innerAuraGeo.setAttribute('position', new THREE.BufferAttribute(innerAuraPositions, 3));
    const innerAuraMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const innerAura = new THREE.Points(innerAuraGeo, innerAuraMat);
    coreGroup.add(innerAura);
    innerAuraRef.current = innerAura;

    // 8. Raycasting on Pointer Move (Hover) and Pointer Down (Click)
    const onPointerMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      _mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      _raycaster.setFromCamera(_mouse, camera);

      // Check milestone shards
      const targetMeshes = Array.from(shardMeshesRef.current.values());
      const intersects = _raycaster.intersectObjects(targetMeshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const m = hit.userData?.milestone as MilestoneItem | undefined;
        if (m) {
          renderer.domElement.style.cursor = 'pointer';
          hit.getWorldPosition(_screenPos);
          _screenPos.project(camera);
          const screenX = ((_screenPos.x + 1) * rect.width) / 2;
          const screenY = ((-_screenPos.y + 1) * rect.height) / 2;

          setHoveredInfo({
            id: m.id,
            type: 'milestone',
            title: m.name,
            subtitle: m.description,
            colorHex: m.colorHex,
            amount: `${formatGBP(m.spentGBP)} / ${formatGBP(m.budgetGBP)}`,
            metric: m.impactMetric,
            screenX,
            screenY,
          });
          return;
        }
      }

      // Check Cranial Nerve Arch
      const nerveMeshes = [archViiMesh, archViiiMesh];
      const nerveIntersects = _raycaster.intersectObjects(nerveMeshes, false);
      if (nerveIntersects.length > 0) {
        renderer.domElement.style.cursor = 'pointer';
        const hitNerve = nerveIntersects[0].object;
        hitNerve.getWorldPosition(_screenPos);
        _screenPos.project(camera);
        const screenX = ((_screenPos.x + 1) * rect.width) / 2;
        const screenY = ((-_screenPos.y + 1) * rect.height) / 2;

        setHoveredInfo({
          id: 'cranial-nerve-pathways',
          type: 'nerve',
          title: hitNerve.userData?.nerveName || 'Cranial Nerve Pathway',
          subtitle: 'Dual motor (CN VII) and auditory/vestibular (CN VIII) conduits affected in Ramsay Hunt syndrome.',
          colorHex: hitNerve === archViiMesh ? '#f59e0b' : '#06b6d4',
          screenX,
          screenY,
        });
        return;
      }

      // Check Transparency Core
      const coreIntersects = _raycaster.intersectObjects([coreMesh, gemMesh, outerGemMesh], false);
      if (coreIntersects.length > 0) {
        renderer.domElement.style.cursor = 'pointer';
        gemMesh.getWorldPosition(_screenPos);
        _screenPos.project(camera);
        const screenX = ((_screenPos.x + 1) * rect.width) / 2;
        const screenY = ((-_screenPos.y + 1) * rect.height) / 2;

        setHoveredInfo({
          id: 'transparency-core',
          type: 'core',
          title: '100% Transparent Financial Core',
          subtitle: 'Every penny tracked in real-time with verified merchant receipts and zero administrative overhead.',
          colorHex: '#fbbf24',
          amount: `${formatGBP(propsRef.current.summary.totalInflowsGBP)} Total Inflows`,
          screenX,
          screenY,
        });
        return;
      }

      // Default state
      renderer.domElement.style.cursor = 'grab';
      setHoveredInfo(null);
    };

    const onPointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      _mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      _raycaster.setFromCamera(_mouse, camera);
      const targetMeshes = Array.from(shardMeshesRef.current.values());
      const intersects = _raycaster.intersectObjects(targetMeshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const id = hit.userData?.milestoneId;
        if (id) {
          sound.playBeaconPulse(1.2);
          propsRef.current.onSelectMilestone(id);
        }
      }
    };

    renderer.domElement.addEventListener('mousemove', onPointerMove);
    renderer.domElement.addEventListener('click', onPointerDown);

    // 9. Resize Handling
    const onResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 10. LOSSLESS PACED ANIMATION LOOP
    let frameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 60);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const dt = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const {
        explodedFactor: exploded,
        autoRotate: shouldRotate,
        cameraPreset: preset,
        selectedMilestoneId: selectedId,
      } = propsRef.current;

      // Camera preset smooth exponential damping (1 - Math.exp(-k * dt))
      if (preset === 'hero') {
        _vec3Target.set(0, 4.4, 11.2);
      } else if (preset === 'nerve') {
        _vec3Target.set(0, 3.2, 5.2);
      } else if (preset === 'core') {
        _vec3Target.set(2.8, 2.7, 4.4);
      } else if (preset === 'overhead') {
        _vec3Target.set(0, 11.5, 3.8);
      }
      camera.position.lerp(_vec3Target, 1 - Math.exp(-2.5 * dt));

      // Gentle Monument Orbit
      if (shouldRotate) {
        beaconGroup.rotation.y += dt * 0.2;
      }

      // Exploded View kinematics
      if (coreGroupRef.current) {
        const targetCoreY = 0.55 + exploded * 1.9;
        coreGroupRef.current.position.y = THREE.MathUtils.damp(
          coreGroupRef.current.position.y,
          targetCoreY,
          5,
          dt
        );
      }

      // Traveling Synapse Nodes on CN VII (Facial Nerve Pathway)
      if (nerveCurveViiRef.current && nerveNodesViiRef.current.length > 0) {
        nerveNodesViiRef.current.forEach((node, idx) => {
          const t = (elapsed * 0.25 + idx / 3) % 1.0;
          const pos = nerveCurveViiRef.current!.getPoint(t);
          node.position.copy(pos);
          const nScale = 0.8 + Math.sin(elapsed * 4.0 + idx) * 0.3;
          node.scale.setScalar(nScale);
        });
      }

      // Traveling Synapse Nodes on CN VIII (Auditory Pathway)
      if (nerveCurveViiiRef.current && nerveNodesViiiRef.current.length > 0) {
        nerveNodesViiiRef.current.forEach((node, idx) => {
          const t = (elapsed * 0.3 + idx / 3) % 1.0;
          const pos = nerveCurveViiiRef.current!.getPoint(t);
          node.position.copy(pos);
          const nScale = 0.75 + Math.cos(elapsed * 4.0 + idx) * 0.25;
          node.scale.setScalar(nScale);
        });
      }

      // Kinetic Gimbal balance rotations
      if (innerGimbal1Ref.current) {
        innerGimbal1Ref.current.rotation.x = elapsed * 0.7;
        innerGimbal1Ref.current.rotation.y = elapsed * 0.45;
      }
      if (innerGimbal2Ref.current) {
        innerGimbal2Ref.current.rotation.y = -elapsed * 0.8;
        innerGimbal2Ref.current.rotation.z = elapsed * 0.55;
      }
      if (innerGimbal3Ref.current) {
        innerGimbal3Ref.current.rotation.x = elapsed * 0.9;
        innerGimbal3Ref.current.rotation.z = -elapsed * 0.6;
      }

      // Acoustic wave oscillations
      if (acousticRingRef.current) {
        const waveScale = 1.0 + Math.sin(elapsed * 2.8) * 0.045;
        acousticRingRef.current.scale.set(waveScale, waveScale, 1.0);
      }
      if (acousticRingOuterRef.current) {
        const outerWave = 1.0 + Math.sin(elapsed * 2.8 + 0.5) * 0.06;
        acousticRingOuterRef.current.scale.set(outerWave, outerWave, 1.0);
      }

      // Inner plasma column breathing
      if (innerColumnRef.current) {
        const cPulse = 0.2 + Math.sin(elapsed * 2.0) * 0.08;
        (innerColumnRef.current.material as THREE.MeshBasicMaterial).opacity = cPulse;
      }

      // Prismatic core gem pulse & celebration decay
      if (gemCoreRef.current) {
        gemCoreRef.current.rotation.y = elapsed * 1.3;
        gemCoreRef.current.rotation.x = Math.sin(elapsed * 1.6) * 0.25;

        if (pulseIntensityRef.current > 0) {
          pulseIntensityRef.current = Math.max(0, pulseIntensityRef.current - dt * 1.2);
          const pScale = 1.0 + pulseIntensityRef.current * 0.65;
          gemCoreRef.current.scale.set(pScale, pScale, pScale);
          (gemCoreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
            0.95 + pulseIntensityRef.current * 2.2;
        } else {
          gemCoreRef.current.scale.set(1.0, 1.0, 1.0);
          (gemCoreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.95;
        }
      }

      if (outerGemRef.current) {
        outerGemRef.current.rotation.y = -elapsed * 0.6;
        outerGemRef.current.rotation.z = Math.cos(elapsed * 0.8) * 0.2;
      }

      // Particle aura slow upward swirl
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsed * 0.12;
      }
      if (innerAuraRef.current) {
        innerAuraRef.current.rotation.y = -elapsed * 0.2;
      }

      // Floating allocation shards radial expansion & animations
      shardMeshesRef.current.forEach((mesh, id) => {
        const { baseAngle, baseRadius } = mesh.userData;
        const currentRadius = baseRadius + exploded * 2.4;
        const targetX = Math.cos(baseAngle) * currentRadius;
        const targetZ = Math.sin(baseAngle) * currentRadius;
        const floatY = 1.7 + Math.sin(elapsed * 2.2 + baseAngle) * 0.16 + exploded * 0.8;

        mesh.position.x = THREE.MathUtils.damp(mesh.position.x, targetX, 5, dt);
        mesh.position.z = THREE.MathUtils.damp(mesh.position.z, targetZ, 5, dt);
        mesh.position.y = THREE.MathUtils.damp(mesh.position.y, floatY, 5, dt);

        mesh.rotation.y = elapsed * 1.4;
        mesh.rotation.z = Math.sin(elapsed + baseAngle) * 0.25;

        const isSelected = id === selectedId;
        const isHovered = hoveredInfo?.id === id;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = isSelected ? 1.2 : isHovered ? 0.9 : 0.4;
        const targetScale = isSelected ? 1.4 : isHovered ? 1.25 : 1.0;
        mesh.scale.setScalar(THREE.MathUtils.damp(mesh.scale.x, targetScale, 6, dt));

        // Sync equatorial aura ring with shard
        const aura = shardAuraRingsRef.current.get(id);
        if (aura) {
          aura.position.copy(mesh.position);
          aura.rotation.z = elapsed * 0.8;
          aura.scale.setScalar(isSelected ? 1.35 : 1.0);
        }

        // Sync vertical holographic beam
        const beam = shardBeamsRef.current.get(id);
        if (beam) {
          beam.position.x = mesh.position.x;
          beam.position.z = mesh.position.z;
          beam.scale.y = mesh.position.y / 1.65;
          beam.position.y = mesh.position.y / 2;
          (beam.material as THREE.MeshBasicMaterial).opacity = isSelected ? 0.6 : isHovered ? 0.45 : 0.2;
        }

        // Sync ground pad
        const pad = shardBasePadsRef.current.get(id);
        if (pad) {
          pad.position.x = mesh.position.x;
          pad.position.z = mesh.position.z;
          (pad.material as THREE.MeshBasicMaterial).opacity = isSelected ? 0.85 : isHovered ? 0.7 : 0.4;
        }
      });

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('mousemove', onPointerMove);
      renderer.domElement.removeEventListener('click', onPointerDown);

      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [milestones]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full relative cursor-grab active:cursor-grabbing select-none overflow-hidden"
      data-testid="three-beacon-canvas"
      aria-label="3D Interactive Ramsay Hunt Transparency Beacon and Milestone Allocation Monument"
    >
      {/* Interactive 3D Holographic Tooltip on Hover */}
      {hoveredInfo && (
        <div
          className="absolute z-40 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 transition-opacity duration-200"
          style={{
            left: `${hoveredInfo.screenX}px`,
            top: `${hoveredInfo.screenY - 12}px`,
          }}
        >
          <div className="backdrop-blur-xl bg-slate-950/90 border border-slate-700/80 rounded-xl p-3 shadow-2xl max-w-xs text-xs text-slate-100 ring-1 ring-white/10">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse"
                style={{ backgroundColor: hoveredInfo.colorHex }}
              />
              <span className="font-bold text-slate-100 text-[13px] truncate">
                {hoveredInfo.title}
              </span>
            </div>

            <p className="text-slate-300 text-[11px] leading-relaxed mb-1.5">
              {hoveredInfo.subtitle}
            </p>

            {hoveredInfo.amount && (
              <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-800 font-mono">
                <span className="text-slate-400">Tracked Allocation:</span>
                <span className="text-amber-400 font-bold">{hoveredInfo.amount}</span>
              </div>
            )}

            {hoveredInfo.metric && (
              <div className="flex items-center gap-1 text-[10px] text-cyan-300 mt-1 font-mono">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>{hoveredInfo.metric}</span>
              </div>
            )}

            <div className="text-[9px] text-slate-500 uppercase tracking-wider text-right mt-1.5">
              Click to inspect milestone
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
