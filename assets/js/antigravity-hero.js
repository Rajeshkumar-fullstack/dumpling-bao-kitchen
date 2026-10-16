/**
 * ANTIGRAVITY-HERO.JS
 * Next-Generation Zero-G Physics & 3D Interactive WebGL Hero Engine
 * 
 * Capabilities:
 * - 3D floating glassmorphic shards, neon spheres, crystalline icosahedrons, and gyroscopic torus rings
 * - Real-time zero-G upward drift, multi-axis harmonic bobbing and rotational inertia
 * - Cursor raycasting repellent force field with natural Hooke's spring restoration & angular momentum
 * - Dynamic scroll-velocity integration: fast scroll causes explosive zero-G dispersion & upward acceleration
 * - Multi-layer 3D parallax depth separation (foreground, midground, cosmic background)
 * - Touch & mobile-optimized 60 FPS WebGL rendering with live telemetry HUD
 */

(function () {
  'use strict';

  // Wait for DOM & Three.js to be ready
  const init = () => {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded. Retrying in 100ms...');
      setTimeout(init, 100);
      return;
    }

    const canvas = document.getElementById('antigravityCanvas');
    if (!canvas) return;

    // --- Performance & Configuration State ---
    const config = {
      particleCount: 500,
      objectCount: 38,
      repulsionRadius: 4.8,
      repulsionStrength: 18.0,
      springTension: 0.045,
      friction: 0.91,
      scrollLiftMultiplier: 0.035,
      dispersionThreshold: 28,
      zeroGLiftActive: true,
      accentColors: [0x00F0FF, 0x8A2BE2, 0xFF007F, 0xFFB800, 0x38BDF8]
    };

    // --- Three.js Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090E, 0.018);

    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 150);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // --- Dynamic Lighting Setup ---
    const ambientLight = new THREE.AmbientLight(0x0F172A, 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xFFFFFF, 2.2);
    dirLight.position.set(12, 18, 14);
    scene.add(dirLight);

    // Glowing Neon Point Lights (Orbiting in Zero-G)
    const cyanLight = new THREE.PointLight(0x00F0FF, 3.5, 30);
    cyanLight.position.set(-8, 6, 4);
    scene.add(cyanLight);

    const magentaLight = new THREE.PointLight(0xFF007F, 3.5, 30);
    magentaLight.position.set(8, -6, 5);
    scene.add(magentaLight);

    const violetLight = new THREE.PointLight(0x8A2BE2, 2.8, 25);
    violetLight.position.set(0, 10, -4);
    scene.add(violetLight);

    // --- Materials Palette ---
    // 1. Refractive Glassmorphic Material
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xE0F2FE,
      metalness: 0.08,
      roughness: 0.12,
      transmission: 0.88,
      transparent: true,
      opacity: 0.85,
      ior: 1.52,
      reflectivity: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide
    });

    // 2. High-Reflectance Dark Chrome
    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0x1E293B,
      metalness: 0.95,
      roughness: 0.08,
      emissive: 0x0A0F1D,
      emissiveIntensity: 0.3
    });

    // 3. Glowing Neon Accent Materials
    const neonMaterials = [
      new THREE.MeshStandardMaterial({ color: 0x00F0FF, emissive: 0x00F0FF, emissiveIntensity: 0.8, roughness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0xFF007F, emissive: 0xFF007F, emissiveIntensity: 0.85, roughness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0x8A2BE2, emissive: 0x8A2BE2, emissiveIntensity: 0.9, roughness: 0.25 }),
      new THREE.MeshStandardMaterial({ color: 0xFFB800, emissive: 0xFFB800, emissiveIntensity: 0.8, roughness: 0.3 })
    ];

    // 4. Subtle Wireframe Cyber Overlay
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });

    // --- Geometric Object Creation ---
    const geometries = [
      new THREE.IcosahedronGeometry(1.2, 0),        // Faceted crystal
      new THREE.OctahedronGeometry(1.1, 0),         // Diamond octahedron
      new THREE.TetrahedronGeometry(1.3, 0),        // Sharp pyramid shard
      new THREE.TorusGeometry(0.9, 0.25, 16, 40),   // Gyro torus
      new THREE.SphereGeometry(0.75, 32, 32),       // Radiant sphere
      new THREE.ConeGeometry(0.9, 1.8, 5),          // Prismatic crystal
      new THREE.DodecahedronGeometry(1.0, 0)        // Polyhedron
    ];

    const physicsObjects = [];

    // Create Cluster of Floating Zero-G Objects
    for (let i = 0; i < config.objectCount; i++) {
      const geoIndex = i % geometries.length;
      const geom = geometries[geoIndex];

      let mat;
      const randType = Math.random();
      if (randType < 0.45) {
        mat = glassMaterial;
      } else if (randType < 0.72) {
        mat = chromeMaterial;
      } else {
        mat = neonMaterials[Math.floor(Math.random() * neonMaterials.length)];
      }

      const mesh = new THREE.Mesh(geom, mat);

      // Add delicate wireframe cage to select glass elements
      if (randType < 0.35) {
        const wireMesh = new THREE.Mesh(geom, wireframeMaterial);
        wireMesh.scale.setScalar(1.02);
        mesh.add(wireMesh);
      }

      // Distribute across 3D depth space (Foreground, Midground, Background)
      const u = (Math.random() - 0.5) * 2;
      const radius = 3.5 + Math.random() * 8.5;
      const theta = Math.random() * Math.PI * 2;

      const x = Math.cos(theta) * radius * (1.1 - Math.abs(u) * 0.3);
      const y = (Math.random() - 0.45) * 12.0;
      const z = (Math.random() - 0.5) * 16.0;

      mesh.position.set(x, y, z);

      const scale = 0.55 + Math.random() * 0.75;
      mesh.scale.setScalar(scale);

      // Random initial orientation
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      scene.add(mesh);

      // Register with physics simulator
      physicsObjects.push({
        mesh: mesh,
        home: new THREE.Vector3(x, y, z),
        pos: new THREE.Vector3(x, y, z),
        vel: new THREE.Vector3(0, 0, 0),
        rotVel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.018,
          (Math.random() - 0.5) * 0.012
        ),
        mass: 0.7 + scale * 0.8,
        phase: Math.random() * Math.PI * 2,
        bobSpeed: 0.6 + Math.random() * 0.7,
        bobAmp: 0.35 + Math.random() * 0.45,
        depthFactor: (z + 10) / 20 // 0 for far, 1 for close foreground
      });
    }

    // --- Cosmic Stardust Particle Cloud ---
    const starGeo = new THREE.BufferGeometry();
    const starCoords = new Float32Array(config.particleCount * 3);
    const starColors = new Float32Array(config.particleCount * 3);

    const c1 = new THREE.Color(0x00F0FF);
    const c2 = new THREE.Color(0x8A2BE2);
    const c3 = new THREE.Color(0xFFFFFF);

    for (let i = 0; i < config.particleCount * 3; i += 3) {
      starCoords[i] = (Math.random() - 0.5) * 36;
      starCoords[i + 1] = (Math.random() - 0.5) * 36;
      starCoords[i + 2] = (Math.random() - 0.5) * 28;

      const mix = Math.random();
      const col = mix < 0.4 ? c1 : (mix < 0.8 ? c2 : c3);
      starColors[i] = col.r;
      starColors[i + 1] = col.g;
      starColors[i + 2] = col.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    const starField = new THREE.Points(starGeo, starMaterial);
    scene.add(starField);

    // --- Pointer / Cursor Raycasting & Force Field ---
    const pointer = new THREE.Vector2(-999, -999);
    const worldPointer = new THREE.Vector3(0, 0, 0);
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // Intersection plane at z = 0
    let isPointerActive = false;

    const onPointerMove = (e) => {
      let clientX = e.clientX;
      let clientY = e.clientY;

      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      pointer.x = (clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(clientY / window.innerHeight) * 2 + 1;
      isPointerActive = true;

      // Project pointer into 3D world space
      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(plane, worldPointer);
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchstart', onPointerMove, { passive: true });

    window.addEventListener('mouseleave', () => {
      isPointerActive = false;
      pointer.set(-999, -999);
    });

    // --- Scroll Velocity & Parallax Engine ---
    let lastScrollY = window.scrollY || window.pageYOffset;
    let scrollVelocity = 0;
    let accumulatedScroll = 0;
    let maxObservedVelocity = 0;

    const onScroll = () => {
      const currentScrollY = window.scrollY || window.pageYOffset;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // Calculate instantaneous scroll impulse
      scrollVelocity = delta * 0.85;
      accumulatedScroll = currentScrollY;

      if (Math.abs(scrollVelocity) > maxObservedVelocity) {
        maxObservedVelocity = Math.abs(scrollVelocity);
      }

      // Trigger explosive zero-G dispersion if downward scroll is very rapid
      if (scrollVelocity > config.dispersionThreshold) {
        triggerDispersion(scrollVelocity * 0.08);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Explosive Radial Dispersion Impulse
    const triggerDispersion = (forceMultiplier = 1.0) => {
      physicsObjects.forEach((item) => {
        const dir = item.pos.clone().normalize();
        if (dir.lengthSq() < 0.001) dir.set(Math.random() - 0.5, Math.random() - 0.5, 1).normalize();

        const impulse = (2.2 + Math.random() * 3.5) * forceMultiplier / item.mass;
        item.vel.add(dir.multiplyScalar(impulse));

        // Add wild tumbling spin
        item.rotVel.x += (Math.random() - 0.5) * 0.12;
        item.rotVel.y += (Math.random() - 0.5) * 0.15;
        item.rotVel.z += (Math.random() - 0.5) * 0.12;
      });
    };

    // --- Interactive Telemetry HUD Updating ---
    const hudFps = document.getElementById('agHudFps');
    const hudObjects = document.getElementById('agHudObjects');
    const hudVelocity = document.getElementById('agHudVelocity');
    const hudForce = document.getElementById('agHudForce');
    const btnDisperse = document.getElementById('agBtnDisperse');
    const btnToggleZeroG = document.getElementById('agBtnToggleZeroG');
    const sliderRepulsion = document.getElementById('agSliderRepulsion');

    if (hudObjects) hudObjects.textContent = config.objectCount;

    if (btnDisperse) {
      btnDisperse.addEventListener('click', () => {
        triggerDispersion(1.5);
      });
    }

    if (btnToggleZeroG) {
      btnToggleZeroG.addEventListener('click', () => {
        config.zeroGLiftActive = !config.zeroGLiftActive;
        btnToggleZeroG.innerHTML = config.zeroGLiftActive 
          ? '<i class="bi bi-pause-circle"></i> Zero-G Active' 
          : '<i class="bi bi-play-circle"></i> Zero-G Paused';
      });
    }

    if (sliderRepulsion) {
      sliderRepulsion.addEventListener('input', (e) => {
        config.repulsionStrength = parseFloat(e.target.value);
        if (hudForce) hudForce.textContent = Math.round(config.repulsionStrength);
      });
    }

    // --- Main Physics & Render Loop (60 FPS) ---
    let clock = new THREE.Clock();
    let frameCount = 0;
    let fpsTime = 0;

    const animate = () => {
      requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      // FPS Calculation
      frameCount++;
      fpsTime += delta;
      if (fpsTime >= 0.5) {
        const currentFps = Math.round(frameCount / fpsTime);
        if (hudFps) hudFps.textContent = currentFps;
        frameCount = 0;
        fpsTime = 0;
      }

      // Smooth decay of scroll velocity
      scrollVelocity *= 0.88;
      const effectiveVelocity = Math.abs(scrollVelocity);
      if (hudVelocity) hudVelocity.textContent = effectiveVelocity.toFixed(1);

      // Orbit Neon Accent Point Lights
      cyanLight.position.x = Math.sin(time * 0.7) * 9;
      cyanLight.position.y = Math.cos(time * 0.5) * 7;
      cyanLight.position.z = 4 + Math.sin(time * 0.9) * 3;

      magentaLight.position.x = Math.cos(time * 0.6) * 9;
      magentaLight.position.y = Math.sin(time * 0.8) * 8;
      magentaLight.position.z = 4 + Math.cos(time * 0.7) * 3;

      violetLight.position.y = 8 + Math.sin(time * 1.1) * 3;

      // Starfield subtle cosmic drift
      starField.rotation.y = time * 0.02;
      starField.rotation.x = time * 0.01;

      // Parallax Camera Depth Navigation
      const scrollFactor = accumulatedScroll * 0.003;
      camera.position.y = -scrollFactor * 3.5;
      camera.position.z = 16 - Math.min(scrollFactor * 2.5, 6);
      camera.lookAt(0, -scrollFactor * 3.5, 0);

      // --- Per-Object Antigravity Physics Simulation ---
      physicsObjects.forEach((item, index) => {
        // 1. Organic Harmonic Bobbing in Zero-G
        let targetX = item.home.x;
        let targetY = item.home.y;
        let targetZ = item.home.z;

        if (config.zeroGLiftActive) {
          // Lissajous curve floating paths
          targetX += Math.sin(time * item.bobSpeed + item.phase) * item.bobAmp * 0.7;
          targetY += Math.cos(time * item.bobSpeed * 1.2 + item.phase) * item.bobAmp * 1.1;
          targetZ += Math.sin(time * item.bobSpeed * 0.8 + item.phase) * (item.bobAmp * 0.5);

          // Upward lift triggered by scroll velocity
          targetY += (scrollVelocity * config.scrollLiftMultiplier) / item.mass;
        }

        // 2. Cursor Force Field (Repulsion & Dynamic Deflection)
        if (isPointerActive) {
          const dx = item.pos.x - worldPointer.x;
          const dy = item.pos.y - worldPointer.y;
          const dz = item.pos.z - worldPointer.z;
          const distSq = dx * dx + dy * dy + dz * dz;
          const dist = Math.sqrt(distSq);

          if (dist < config.repulsionRadius && dist > 0.001) {
            // Non-linear quadratic repulsion gradient
            const force = (1.0 - dist / config.repulsionRadius);
            const repelStrength = force * force * config.repulsionStrength / item.mass;

            // Push outward radially with slight camera depth burst
            item.vel.x += (dx / dist) * repelStrength * delta;
            item.vel.y += (dy / dist) * repelStrength * delta;
            item.vel.z += (dz / dist + 0.3) * repelStrength * delta * 0.6;

            // Impart rotational momentum on repulsion
            item.rotVel.x += (Math.random() - 0.5) * force * 0.04;
            item.rotVel.y += (Math.random() - 0.5) * force * 0.04;
            item.rotVel.z += (Math.random() - 0.5) * force * 0.04;
          }
        }

        // 3. Hooke's Elastic Spring Force towards Target Base Position
        const springX = (targetX - item.pos.x) * config.springTension;
        const springY = (targetY - item.pos.y) * config.springTension;
        const springZ = (targetZ - item.pos.z) * config.springTension;

        item.vel.x += springX;
        item.vel.y += springY;
        item.vel.z += springZ;

        // 4. Drag & Friction
        item.vel.multiplyScalar(config.friction);
        item.rotVel.multiplyScalar(0.96);

        // 5. Integrate Position & Rotation
        item.pos.add(item.vel);
        item.mesh.position.copy(item.pos);

        // Apply angular spin
        item.mesh.rotation.x += item.rotVel.x + 0.002;
        item.mesh.rotation.y += item.rotVel.y + 0.003;
        item.mesh.rotation.z += item.rotVel.z;
      });

      renderer.render(scene, camera);
    };

    // --- Viewport Resize Handler ---
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onResize);

    // Start Simulation Loop
    animate();
  };

  // Launch on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
