import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { MilestoneItem, TransparencySummary } from '../types';

interface ThreeBeaconSceneProps {
  milestones: MilestoneItem[];
  summary: TransparencySummary;
  selectedMilestoneId: string | null;
  onSelectMilestone: (id: string | null) => void;
  explodedFactor: number; // 0 to 1
  autoRotate: boolean;
  cameraPreset: 'hero' | 'nerve' | 'core' | 'overhead';
}

// Module-level reusable math scratch objects for zero GC in animation loop
const _vec3Target = new THREE.Vector3();
const _vec3Current = new THREE.Vector3();
const _raycaster = new THREE.Raycaster();
const _mouse = new THREE.Vector2();

export const ThreeBeaconScene: React.FC<ThreeBeaconSceneProps> = ({
  milestones,
  summary,
  selectedMilestoneId,
  onSelectMilestone,
  explodedFactor,
  autoRotate,
  cameraPreset,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // References for dynamic animated sub-components
  const coreGroupRef = useRef<THREE.Group | null>(null);
  const acousticRingRef = useRef<THREE.Mesh | null>(null);
  const facialNerveArchRef = useRef<THREE.Mesh | null>(null);
  const innerGimbal1Ref = useRef<THREE.Mesh | null>(null);
  const innerGimbal2Ref = useRef<THREE.Mesh | null>(null);
  const gemCoreRef = useRef<THREE.Mesh | null>(null);
  const shardMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());

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

    // 2. Initialize renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.038);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 5, 11);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Keep above floor
    controls.minDistance = 3.5;
    controls.maxDistance = 22;
    controlsRef.current = controls;

    // 4. Studio Environment Reflection (RoomEnvironment + PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Studio Lighting Rig
    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.4);
    keyLight.position.set(6, 10, 5);
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

    // Cool Hemisphere Fill Light
    const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x0f172a, 1.1);
    hemiLight.position.set(0, 15, 0);
    scene.add(hemiLight);

    // Rim Light
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(-6, 7, -6);
    scene.add(rimLight);

    // Subtle Core Point Light
    const corePointLight = new THREE.PointLight(0xf59e0b, 1.8, 8);
    corePointLight.position.set(0, 2.5, 0);
    scene.add(corePointLight);

    // 6. Ground & Procedural Contact Shadow
    // Floor Disc
    const floorGeo = new THREE.CircleGeometry(16, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0e1726,
      roughness: 0.9,
      metalness: 0.1,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = !isSoftwareGl;
    scene.add(floorMesh);

    // Contact Shadow Disc
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d')!;
    const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
    grad.addColorStop(0.35, 'rgba(0, 0, 0, 0.45)');
    grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.15)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;
    const shadowGeo = new THREE.CircleGeometry(4.5, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.015; // Offset to avoid coplanar Z-fighting
    scene.add(shadowMesh);

    // 7. COMPOSITE PROCEDURAL HERO MODEL: "The Hope & Transparency Beacon"
    // Composed of 8 distinct parts adhering to Three.js composite craft guidelines
    const beaconGroup = new THREE.Group();
    beaconGroup.position.set(0, 0, 0);
    scene.add(beaconGroup);

    // Part 1: Stepped Hexagonal Foundation Plinth (Matte Slate Stone)
    const plinthGeo = new THREE.CylinderGeometry(3.6, 4.0, 0.4, 6);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.85,
      metalness: 0.15,
    });
    const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
    plinthMesh.position.y = 0.2;
    plinthMesh.receiveShadow = !isSoftwareGl;
    plinthMesh.castShadow = !isSoftwareGl;
    beaconGroup.add(plinthMesh);

    // Part 2: Gilded Retaining Collar & Ledger Trim (Brushed Brass/Gold)
    const collarGeo = new THREE.TorusGeometry(3.1, 0.12, 16, 48);
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.85,
    });
    const collarMesh = new THREE.Mesh(collarGeo, collarMat);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.position.y = 0.42;
    beaconGroup.add(collarMesh);

    // Secondary Beveled Inner Ring
    const innerRingGeo = new THREE.CylinderGeometry(2.6, 2.7, 0.15, 32);
    const innerRingMesh = new THREE.Mesh(innerRingGeo, collarMat);
    innerRingMesh.position.y = 0.48;
    beaconGroup.add(innerRingMesh);

    // Part 3: Faceted Crystal Transparency Core Pillar (Extruded optic quartz)
    const coreGroup = new THREE.Group();
    coreGroup.position.y = 0.55;
    beaconGroup.add(coreGroup);
    coreGroupRef.current = coreGroup;

    const coreGeo = new THREE.CylinderGeometry(1.2, 1.45, 3.8, 8, 1, false);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x67e8f9,
      roughness: 0.1,
      metalness: 0.15,
      transmission: isSoftwareGl ? 0 : 0.88,
      transparent: true,
      opacity: isSoftwareGl ? 0.35 : 0.9,
      ior: 1.55,
      thickness: 1.4,
      depthWrite: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.y = 1.9;
    coreGroup.add(coreMesh);

    // Part 4: Procedural Acoustic Wave Resonance Torus (Auditory & Tinnitus Awareness)
    const acousticGeo = new THREE.TorusGeometry(2.1, 0.08, 16, 64);
    const acousticMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35,
    });
    const acousticMesh = new THREE.Mesh(acousticGeo, acousticMat);
    acousticMesh.rotation.x = Math.PI / 2;
    acousticMesh.position.y = 2.4;
    coreGroup.add(acousticMesh);
    acousticRingRef.current = acousticMesh;

    // Part 5: Facial Nerve Dynamic Arch / Symmetry Wing (Cranial Nerve VII Symbol)
    // Modeled as a smooth curved tube
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.8, 0.8, -0.4),
      new THREE.Vector3(-1.4, 2.2, 0.8),
      new THREE.Vector3(0, 3.6, 1.2),
      new THREE.Vector3(1.4, 2.2, 0.8),
      new THREE.Vector3(1.8, 0.8, -0.4),
    ]);
    const archGeo = new THREE.TubeGeometry(curve, 48, 0.09, 12, false);
    const archMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.3,
      metalness: 0.7,
      emissive: 0xb45309,
      emissiveIntensity: 0.3,
    });
    const archMesh = new THREE.Mesh(archGeo, archMat);
    coreGroup.add(archMesh);
    facialNerveArchRef.current = archMesh;

    // Part 6: Kinetic Gyroscopic Balance Rings (Depicting Balanced Transparent Ledger)
    const gimbal1Geo = new THREE.TorusGeometry(1.0, 0.045, 12, 48);
    const gimbalMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.2,
      metalness: 0.9,
    });
    const gimbal1Mesh = new THREE.Mesh(gimbal1Geo, gimbalMat);
    gimbal1Mesh.position.y = 1.9;
    coreGroup.add(gimbal1Mesh);
    innerGimbal1Ref.current = gimbal1Mesh;

    const gimbal2Geo = new THREE.TorusGeometry(0.75, 0.035, 12, 48);
    const gimbal2Mesh = new THREE.Mesh(gimbal2Geo, gimbalMat);
    gimbal2Mesh.position.y = 1.9;
    gimbal2Mesh.rotation.y = Math.PI / 2;
    coreGroup.add(gimbal2Mesh);
    innerGimbal2Ref.current = gimbal2Mesh;

    // Part 7: Prismatic Radiant Heart Gem (Responds to donation target)
    const gemGeo = new THREE.OctahedronGeometry(0.5, 0);
    const gemMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.15,
      metalness: 0.4,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.9,
    });
    const gemMesh = new THREE.Mesh(gemGeo, gemMat);
    gemMesh.position.y = 1.9;
    coreGroup.add(gemMesh);
    gemCoreRef.current = gemMesh;

    // Part 8: 5 Floating Allocation Milestone Shards orbiting the beacon
    const shardMap = new Map<string, THREE.Mesh>();
    milestones.forEach((m, idx) => {
      const angle = (idx / milestones.length) * Math.PI * 2;
      const radius = 3.3;
      const sx = Math.cos(angle) * radius;
      const sz = Math.sin(angle) * radius;

      const shardGeo = new THREE.ConeGeometry(0.35, 0.9, 5);
      const shardMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(m.colorHex),
        roughness: 0.25,
        metalness: 0.65,
        emissive: new THREE.Color(m.colorHex),
        emissiveIntensity: 0.35,
      });
      const shardMesh = new THREE.Mesh(shardGeo, shardMat);
      shardMesh.position.set(sx, 1.6, sz);
      shardMesh.userData = { milestoneId: m.id, baseAngle: angle, baseRadius: radius };
      beaconGroup.add(shardMesh);
      shardMap.set(m.id, shardMesh);
    });
    shardMeshesRef.current = shardMap;

    // 8. Raycasting on Click / Hover
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
          propsRef.current.onSelectMilestone(id);
        }
      }
    };
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
          frameId = window.setTimeout(cb, 80);
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
        _vec3Target.set(0, 4.2, 10.5);
      } else if (preset === 'nerve') {
        _vec3Target.set(0, 3.2, 5.0);
      } else if (preset === 'core') {
        _vec3Target.set(2.8, 2.6, 4.2);
      } else if (preset === 'overhead') {
        _vec3Target.set(0, 11, 3.5);
      }
      camera.position.lerp(_vec3Target, 1 - Math.exp(-2.5 * dt));

      // Rotation & Kinematics
      if (shouldRotate) {
        beaconGroup.rotation.y += dt * 0.25;
      }

      // Exploded View kinematics: smooth translation on Y & outward radius
      if (coreGroupRef.current) {
        const targetCoreY = 0.55 + exploded * 1.8;
        coreGroupRef.current.position.y = THREE.MathUtils.damp(
          coreGroupRef.current.position.y,
          targetCoreY,
          5,
          dt
        );
      }

      // Kinetic Gimbal balance rotation
      if (innerGimbal1Ref.current) {
        innerGimbal1Ref.current.rotation.x = elapsed * 0.8;
        innerGimbal1Ref.current.rotation.y = elapsed * 0.5;
      }
      if (innerGimbal2Ref.current) {
        innerGimbal2Ref.current.rotation.y = -elapsed * 0.9;
        innerGimbal2Ref.current.rotation.z = elapsed * 0.6;
      }

      // Acoustic wave oscillation (symbolizing hearing sensitivity & resonance)
      if (acousticRingRef.current) {
        const waveScale = 1.0 + Math.sin(elapsed * 2.5) * 0.04;
        acousticRingRef.current.scale.set(waveScale, waveScale, 1.0);
      }

      // Prismatic core gem pulse
      if (gemCoreRef.current) {
        gemCoreRef.current.rotation.y = elapsed * 1.2;
        gemCoreRef.current.rotation.x = Math.sin(elapsed * 1.5) * 0.2;
      }

      // Floating allocation shards radial expansion
      shardMeshesRef.current.forEach((mesh, id) => {
        const { baseAngle, baseRadius } = mesh.userData;
        const currentRadius = baseRadius + exploded * 2.2;
        const targetX = Math.cos(baseAngle) * currentRadius;
        const targetZ = Math.sin(baseAngle) * currentRadius;
        const floatY = 1.6 + Math.sin(elapsed * 2.0 + baseAngle) * 0.15 + (exploded * 0.8);

        mesh.position.x = THREE.MathUtils.damp(mesh.position.x, targetX, 5, dt);
        mesh.position.z = THREE.MathUtils.damp(mesh.position.z, targetZ, 5, dt);
        mesh.position.y = THREE.MathUtils.damp(mesh.position.y, floatY, 5, dt);

        mesh.rotation.y = elapsed * 1.5;
        mesh.rotation.z = Math.sin(elapsed + baseAngle) * 0.2;

        // Highlight selected shard
        const isSelected = id === selectedId;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = isSelected ? 1.0 : 0.35;
        const targetScale = isSelected ? 1.35 : 1.0;
        mesh.scale.setScalar(THREE.MathUtils.damp(mesh.scale.x, targetScale, 6, dt));
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
      renderer.domElement.removeEventListener('click', onPointerDown);

      // Dispose Three.js objects
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
      className="w-full h-full relative cursor-grab active:cursor-grabbing select-none"
      data-testid="three-beacon-canvas"
      aria-label="3D Interactive Ramsay Hunt Transparency Beacon and Milestone Allocation Monument"
    />
  );
};
