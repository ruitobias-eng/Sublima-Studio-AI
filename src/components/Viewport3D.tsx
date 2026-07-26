import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  RotateCcw,
  Sparkles,
  Maximize2,
  Box,
  Shirt,
  Coffee,
  GlassWater,
  Square,
  Smartphone,
  Container,
  Grid,
  Mouse,
  Key,
  Focus,
  Sun,
} from 'lucide-react';
import { ProductType } from '../types';
import { SUBLIMATION_PRODUCTS } from '../data/initialData';

interface Viewport3DProps {
  selectedProduct: ProductType;
  onSelectProduct: (product: ProductType) => void;
  artworkSvg: string;
  theme?: 'dark' | 'light';
}

export const Viewport3D: React.FC<Viewport3DProps> = ({
  selectedProduct,
  onSelectProduct,
  artworkSvg,
  theme = 'dark',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [materialFinish, setMaterialFinish] = useState<'glossy' | 'matte' | 'metallic'>('glossy');
  const [isRotating, setIsRotating] = useState(true);
  const [lightingPreset, setLightingPreset] = useState<'studio' | 'dramatic' | 'soft'>('studio');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rootObjectRef = useRef<THREE.Object3D | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const lightsRef = useRef<{ ambient: THREE.AmbientLight; dir1: THREE.DirectionalLight } | null>(null);

  // Helper to convert SVG string to Canvas Texture with direct canvas vector fallback
  const createSvgTexture = (svgContent: string): Promise<THREE.CanvasTexture> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');

      const finalizeTexture = () => {
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;
        resolve(texture);
      };

      if (!ctx) {
        finalizeTexture();
        return;
      }

      // 1. Draw rich base tropical vector design directly on Canvas
      const drawDirectArtwork = () => {
        // Deep tropical background
        const grad = ctx.createLinearGradient(0, 0, 1080, 1350);
        grad.addColorStop(0, '#0f2027');
        grad.addColorStop(0.5, '#203a43');
        grad.addColorStop(1, '#2c5364');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1350);

        // Sun / Gold Circle Aura
        const sunGrad = ctx.createRadialGradient(540, 500, 50, 540, 500, 380);
        sunGrad.addColorStop(0, 'rgba(255, 154, 158, 0.9)');
        sunGrad.addColorStop(0.5, 'rgba(254, 207, 239, 0.6)');
        sunGrad.addColorStop(1, 'rgba(255, 221, 225, 0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(540, 500, 380, 0, Math.PI * 2);
        ctx.fill();

        // Tropical Monstera Leaves Left & Right
        ctx.fillStyle = '#10b981';
        ctx.globalAlpha = 0.85;

        // Left leaf
        ctx.beginPath();
        ctx.ellipse(250, 600, 160, 320, -Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();

        // Right leaf
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.ellipse(830, 620, 170, 340, Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1.0;

        // Tropical Branch
        ctx.fillStyle = '#4a2e18';
        ctx.beginPath();
        ctx.rect(150, 780, 780, 35);
        ctx.fill();

        // Toucan Character Body
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(540, 520, 150, 0, Math.PI * 2);
        ctx.fill();

        // Toucan White Chest
        ctx.fillStyle = '#fffbeb';
        ctx.beginPath();
        ctx.arc(510, 530, 100, 0, Math.PI * 2);
        ctx.fill();

        // Toucan Beak (Vibrant Gradient)
        const beakGrad = ctx.createLinearGradient(400, 420, 720, 500);
        beakGrad.addColorStop(0, '#ff4e50');
        beakGrad.addColorStop(0.4, '#f9d423');
        beakGrad.addColorStop(0.8, '#22c1c3');
        beakGrad.addColorStop(1, '#0072ff');
        ctx.fillStyle = beakGrad;
        ctx.beginPath();
        ctx.moveTo(420, 460);
        ctx.bezierCurveTo(320, 480, 300, 540, 440, 550);
        ctx.closePath();
        ctx.fill();

        // Eye
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(480, 480, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(480, 480, 8, 0, Math.PI * 2);
        ctx.fill();

        // Title Typography
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 68px "Playfair Display", Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('TROPICAL VIBES', 540, 1140);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText('SUBLIMA STUDIO CREATIVE AI', 540, 1190);
      };

      // Draw direct artwork first as guaranteed base
      drawDirectArtwork();

      // Safely attempt SVG Image overlay
      try {
        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        const img = new Image();

        let isResolved = false;
        const safeResolve = () => {
          if (!isResolved) {
            isResolved = true;
            URL.revokeObjectURL(url);
            finalizeTexture();
          }
        };

        img.onload = () => {
          try {
            if (img.naturalWidth > 0 && img.naturalHeight > 0) {
              ctx.drawImage(img, 0, 0, 1080, 1350);
            }
          } catch (e) {
            console.warn('Canvas drawImage SVG exception:', e);
          }
          safeResolve();
        };

        img.onerror = () => {
          // If SVG image load fails, direct vector artwork is already drawn!
          safeResolve();
        };

        img.src = url;
      } catch (err) {
        finalizeTexture();
      }
    });
  };

  // Auto-fit camera to framed object bounding box cleanly
  const fitCameraToFrame = (animate = true) => {
    if (!cameraRef.current || !controlsRef.current || !rootObjectRef.current) return;

    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const object = rootObjectRef.current;

    const box = new THREE.Box3().setFromObject(object);
    if (box.isEmpty()) return;

    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    const aspect = (camera.aspect && !isNaN(camera.aspect) && isFinite(camera.aspect)) ? camera.aspect : 1;
    const vFovRad = (camera.fov * Math.PI) / 180;
    const hFovRad = 2 * Math.atan(Math.tan(vFovRad / 2) * aspect);

    // Calculate required distance for vertical & horizontal bounds
    const distV = (size.y / 2) / Math.tan(vFovRad / 2);
    const distH = (size.x / 2) / Math.tan(hFovRad / 2);

    // Distance multiplier ensures safe padding around the product
    const cameraDistance = Math.max(distV, distH, size.z) * 1.30;

    const targetPos = new THREE.Vector3(
      center.x,
      center.y,
      center.z + cameraDistance
    );

    if (animate) {
      const startPos = camera.position.clone();
      const startTarget = controls.target.clone();
      const startTime = performance.now();
      const duration = 300; // ms

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);

        camera.position.lerpVectors(startPos, targetPos, ease);
        controls.target.lerpVectors(startTarget, center, ease);
        controls.update();

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    } else {
      camera.position.copy(targetPos);
      controls.target.copy(center);
      controls.update();
    }
  };

  // 1. Initial WebGL Canvas Setup (runs once on mount)
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 320;
    const height = mountRef.current.clientHeight || 500;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(theme === 'light' ? '#f8fafc' : '#0b0e14');
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 4);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    rendererRef.current = renderer;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    // 4. Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      lightingPreset === 'dramatic' ? 0.6 : lightingPreset === 'soft' ? 1.6 : 1.2
    );
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(
      0xffffff,
      lightingPreset === 'dramatic' ? 2.5 : 1.8
    );
    dirLight1.position.set(5, 8, 5);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 1024;
    dirLight1.shadow.mapSize.height = 1024;
    scene.add(dirLight1);

    lightsRef.current = { ambient: ambientLight, dir1: dirLight1 };

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.8);
    dirLight2.position.set(-5, -2, -5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xc084fc, 1.5, 10);
    pointLight.position.set(0, 3, 2);
    scene.add(pointLight);

    // 5. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = isRotating;
    controls.autoRotateSpeed = 2.0;
    controlsRef.current = controls;

    // 6. Floor Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(10, 10);
    const shadowMat = new THREE.ShadowMaterial({
      opacity: theme === 'light' ? 0.15 : 0.35,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Render loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Auto-fit on window & panel resize via ResizeObserver
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      if (w > 0 && h > 0) {
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h, false);
        if (rendererRef.current.domElement) {
          rendererRef.current.domElement.style.width = '100%';
          rendererRef.current.domElement.style.height = '100%';
        }
        fitCameraToFrame(false);
      }
    };

    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    if (mountRef.current) {
      resizeObserver.observe(mountRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);

      controls.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.forceContextLoss();
      renderer.dispose();
    };
  }, []); // Run once on mount to establish single WebGL context

  // 1b. Light/Dark Theme Live Update
  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.background = new THREE.Color(
      theme === 'light' ? '#f8fafc' : '#0b0e14'
    );
  }, [theme]);

  // 2. Product Geometry & Material Creation
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Remove previous object
    if (rootObjectRef.current) {
      scene.remove(rootObjectRef.current);
      rootObjectRef.current = null;
    }

    const roughness = materialFinish === 'glossy' ? 0.1 : materialFinish === 'matte' ? 0.6 : 0.2;
    const metalness = materialFinish === 'metallic' ? 0.85 : 0.05;

    createSvgTexture(artworkSvg).then((texture) => {
      const mainMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness,
        metalness,
      });

      const rootGroup = new THREE.Group();

      if (selectedProduct === 'mug') {
        const cylinderGeo = new THREE.CylinderGeometry(0.75, 0.75, 1.6, 64);
        const mugMesh = new THREE.Mesh(cylinderGeo, mainMaterial);
        mugMesh.castShadow = true;
        rootGroup.add(mugMesh);

        const innerGeo = new THREE.CylinderGeometry(0.70, 0.70, 1.58, 64);
        const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15 });
        const innerMesh = new THREE.Mesh(innerGeo, whiteMat);
        innerMesh.position.y = 0.02;
        rootGroup.add(innerMesh);

        const handleGeo = new THREE.TorusGeometry(0.48, 0.09, 20, 36, Math.PI);
        const handleMesh = new THREE.Mesh(handleGeo, whiteMat);
        handleMesh.position.set(-0.75, 0, 0);
        handleMesh.rotation.z = Math.PI / 2;
        handleMesh.castShadow = true;
        rootGroup.add(handleMesh);

      } else if (selectedProduct === 'tumbler') {
        const tumblerGeo = new THREE.CylinderGeometry(0.68, 0.58, 2.1, 64);
        const tumblerMesh = new THREE.Mesh(tumblerGeo, mainMaterial);
        tumblerMesh.castShadow = true;
        rootGroup.add(tumblerMesh);

        const lidGeo = new THREE.CylinderGeometry(0.70, 0.70, 0.15, 32);
        const lidMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.8 });
        const lidMesh = new THREE.Mesh(lidGeo, lidMat);
        lidMesh.position.y = 1.1;
        rootGroup.add(lidMesh);

      } else if (selectedProduct === 'pillow') {
        const pillowGeo = new THREE.BoxGeometry(1.5, 1.5, 0.35, 32, 32, 8);
        const pillowMesh = new THREE.Mesh(pillowGeo, mainMaterial);
        pillowMesh.castShadow = true;
        rootGroup.add(pillowMesh);

      } else if (selectedProduct === 'phonecase') {
        const caseGeo = new THREE.BoxGeometry(0.85, 1.7, 0.14, 16, 16, 4);
        const caseMesh = new THREE.Mesh(caseGeo, mainMaterial);
        caseMesh.castShadow = true;
        rootGroup.add(caseMesh);

        const camGeo = new THREE.BoxGeometry(0.28, 0.28, 0.05);
        const camMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
        const camMesh = new THREE.Mesh(camGeo, camMat);
        camMesh.position.set(-0.2, 0.6, 0.08);
        rootGroup.add(camMesh);

      } else if (selectedProduct === 'bottle') {
        const bodyGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.7, 64);
        const bodyMesh = new THREE.Mesh(bodyGeo, mainMaterial);
        bodyMesh.castShadow = true;
        rootGroup.add(bodyMesh);

        const neckGeo = new THREE.CylinderGeometry(0.25, 0.6, 0.35, 32);
        const capMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
        const neckMesh = new THREE.Mesh(neckGeo, capMat);
        neckMesh.position.y = 1.0;
        rootGroup.add(neckMesh);

        const capGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.25, 32);
        const capMesh = new THREE.Mesh(capGeo, capMat);
        capMesh.position.y = 1.3;
        rootGroup.add(capMesh);

      } else if (selectedProduct === 'mousepad') {
        const padGeo = new THREE.BoxGeometry(1.8, 1.4, 0.04);
        const padMesh = new THREE.Mesh(padGeo, mainMaterial);
        padMesh.castShadow = true;
        rootGroup.add(padMesh);

      } else if (selectedProduct === 'puzzle') {
        const puzzleGeo = new THREE.BoxGeometry(1.7, 1.3, 0.05);
        const puzzleMesh = new THREE.Mesh(puzzleGeo, mainMaterial);
        puzzleMesh.castShadow = true;
        rootGroup.add(puzzleMesh);

      } else if (selectedProduct === 'keychain') {
        const keyGeo = new THREE.BoxGeometry(0.8, 0.8, 0.06);
        const keyMesh = new THREE.Mesh(keyGeo, mainMaterial);
        keyMesh.castShadow = true;
        rootGroup.add(keyMesh);

        const ringGeo = new THREE.TorusGeometry(0.2, 0.03, 16, 32);
        const ringMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9, roughness: 0.1 });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.position.set(0, 0.55, 0);
        rootGroup.add(ringMesh);

      } else {
        const shirtGeo = new THREE.BoxGeometry(1.5, 1.8, 0.06);
        const shirtMesh = new THREE.Mesh(shirtGeo, mainMaterial);
        shirtMesh.castShadow = true;
        rootGroup.add(shirtMesh);
      }

      scene.add(rootGroup);
      rootObjectRef.current = rootGroup;

      fitCameraToFrame(false);
    });
  }, [selectedProduct, artworkSvg, materialFinish]);

  // 3. Dynamic Rotation
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isRotating;
    }
  }, [isRotating]);

  // 4. Dynamic Lighting Preset
  useEffect(() => {
    if (lightsRef.current) {
      lightsRef.current.ambient.intensity =
        lightingPreset === 'dramatic' ? 0.6 : lightingPreset === 'soft' ? 1.6 : 1.2;
      lightsRef.current.dir1.intensity =
        lightingPreset === 'dramatic' ? 2.5 : 1.8;
    }
  }, [lightingPreset]);

  const currentProduct = SUBLIMATION_PRODUCTS.find((p) => p.id === selectedProduct);
  const isLight = theme === 'light';

  return (
    <div
      className={`w-80 flex flex-col h-full z-20 shrink-0 select-none shadow-2xl border-l transition-colors duration-200 ${
        isLight
          ? 'bg-slate-50 border-slate-200 text-slate-800'
          : 'bg-slate-950 border-slate-800 text-slate-200'
      }`}
    >
      {/* 3D Viewport Header */}
      <div
        className={`p-3.5 border-b flex items-center justify-between transition-colors ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-md">
            <Box className="w-4 h-4 text-cyan-200" />
          </div>
          <span
            className={`font-bold text-xs uppercase tracking-wider ${
              isLight
                ? 'text-slate-800'
                : 'bg-gradient-to-r from-cyan-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent'
            }`}
          >
            Visualização 3D Realista
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* AUTO-FIT FRAME BUTTON IN HEADER */}
          <button
            onClick={() => fitCameraToFrame(true)}
            className={`p-1.5 rounded-lg text-xs transition flex items-center gap-1 shadow-sm border ${
              isLight
                ? 'bg-cyan-50 border-cyan-300 text-cyan-800 hover:bg-cyan-100'
                : 'bg-cyan-950/80 border-cyan-700/80 text-cyan-300 hover:bg-cyan-900'
            }`}
            title="Ajustar Automático ao Quadro"
          >
            <Focus className="w-3.5 h-3.5 text-cyan-500" />
            <span className="text-[10px] font-semibold hidden sm:inline">Ajustar</span>
          </button>

          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 rounded-lg text-xs transition border ${
              isRotating
                ? isLight
                  ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                  : 'bg-indigo-950 border-indigo-700/80 text-indigo-300'
                : isLight
                ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
            }`}
            title="Giro Automático 360°"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D WebGL Viewport Render Container */}
      <div
        className={`relative flex-1 overflow-hidden transition-colors ${
          isLight ? 'bg-slate-100' : 'bg-slate-950'
        }`}
      >
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Floating Controls Overlay (Top Right) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          {/* Main "Enquadrar Quadro / Fit Frame" floating action */}
          <button
            onClick={() => fitCameraToFrame(true)}
            className={`px-2.5 py-1.5 rounded-lg border shadow-xl backdrop-blur-md flex items-center gap-1.5 text-[11px] font-bold transition transform active:scale-95 ${
              isLight
                ? 'bg-white/90 hover:bg-white border-cyan-400 text-cyan-800'
                : 'bg-cyan-950/90 hover:bg-cyan-900 border-cyan-500/80 text-cyan-200'
            }`}
            title="Ajustar e centralizar o produto na tela automaticamente"
          >
            <Maximize2 className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
            <span>Colar Frame Auto</span>
          </button>

          {/* Finish selector */}
          <button
            onClick={() =>
              setMaterialFinish(
                materialFinish === 'glossy'
                  ? 'matte'
                  : materialFinish === 'matte'
                  ? 'metallic'
                  : 'glossy'
              )
            }
            className={`p-2 rounded-lg border shadow-xl backdrop-blur-md flex items-center justify-between gap-1.5 text-[10px] font-medium ${
              isLight
                ? 'bg-white/90 hover:bg-slate-50 border-slate-300 text-slate-700'
                : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-slate-200'
            }`}
            title="Mudar Acabamento do Material"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span className="capitalize">{materialFinish}</span>
            </div>
          </button>

          {/* Lighting Preset Selector */}
          <button
            onClick={() =>
              setLightingPreset(
                lightingPreset === 'studio'
                  ? 'dramatic'
                  : lightingPreset === 'dramatic'
                  ? 'soft'
                  : 'studio'
              )
            }
            className={`p-2 rounded-lg border shadow-xl backdrop-blur-md flex items-center justify-between gap-1.5 text-[10px] font-medium ${
              isLight
                ? 'bg-white/90 hover:bg-slate-50 border-slate-300 text-slate-700'
                : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-slate-200'
            }`}
            title="Mudar Iluminação 3D"
          >
            <div className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="capitalize">{lightingPreset}</span>
            </div>
          </button>
        </div>

        {/* Active Product Info Badge */}
        <div
          className={`absolute bottom-3 left-3 border px-3 py-1.5 rounded-lg backdrop-blur-md shadow-lg text-xs ${
            isLight
              ? 'bg-white/90 border-slate-300 text-slate-800'
              : 'bg-slate-900/90 border-slate-800 text-slate-100'
          }`}
        >
          <div className="font-bold flex items-center gap-1.5">
            <span>{currentProduct?.thumbnail}</span>
            <span>{currentProduct?.name}</span>
          </div>
          <div className={`text-[10px] ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>
            Sublimação: {currentProduct?.sublimationTemp} | {currentProduct?.sublimationTime}
          </div>
        </div>
      </div>

      {/* Product Thumbnails Selector Grid */}
      <div
        className={`p-3 border-t space-y-2 transition-colors ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-[10px] font-semibold uppercase tracking-wider ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            Selecione o Produto Sublimático
          </span>
          <span className="text-[9px] text-cyan-600 font-medium">Auto-Ajuste Ativo</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {SUBLIMATION_PRODUCTS.slice(0, 8).map((p) => {
            const isSelected = selectedProduct === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectProduct(p.id)}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                  isSelected
                    ? isLight
                      ? 'bg-indigo-50 border-cyan-500 text-indigo-900 shadow-md ring-1 ring-cyan-500/50'
                      : 'bg-gradient-to-b from-indigo-900/60 to-purple-900/60 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400/50'
                    : isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className="text-base">{p.thumbnail}</span>
                <span className="text-[9px] font-medium truncate w-full text-center">
                  {p.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
