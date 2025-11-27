/**
 * xQubit.AI - Three.js 3D Scenes
 * Quantum Computing and AI Agent visualizations
 * Theme-aware colors for dark/light mode support
 */

// Theme color management - Vibrant Scientific Palette
const ThemeColors = {
    dark: {
        primary: 0x0EA5E9,      // Sky Blue
        secondary: 0x06B6D4,    // Cyan
        highlight: 0x14B8A6,    // Teal
        background: 0x1a1a25,
        particleOpacity: 0.8,
        lineOpacity: 0.3,
        glowOpacity: 0.9
    },
    light: {
        // Vibrant scientific colors for light theme - inspired by quantum phenomena
        primary: 0xFF006E,      // Hot Magenta - quantum energy state
        secondary: 0x00D9FF,    // Electric Cyan - quantum computing
        highlight: 0xFFB700,    // Golden Amber - photonic energy
        tertiary: 0x8B5CF6,     // Violet - quantum entanglement
        quaternary: 0x10B981,   // Emerald - quantum coherence
        accent: 0xFF5E5B,       // Coral - excited states

        // Gradient array for multi-color effects
        gradientColors: [0xFF006E, 0x00D9FF, 0xFFB700, 0x8B5CF6, 0x10B981],

        background: 0xfafbfd,
        particleOpacity: 0.95,
        lineOpacity: 0.6,
        glowOpacity: 1.0,

        // Special effects
        iridescent: true,
        holographic: true
    }
};

function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
}

function getThemeColors() {
    return ThemeColors[getCurrentTheme()];
}

// ==========================================
// Hero Section - Quantum Particle System
// ==========================================
class QuantumHeroScene {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.offsetWidth / this.container.offsetHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.particles = [];
        this.quantumOrbitals = [];
        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2();

        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0); // Transparent background
        this.container.appendChild(this.renderer.domElement);

        // Camera position
        this.camera.position.z = 30;

        // Create quantum elements
        this.createQuantumCore();
        this.createParticles();
        this.createOrbitalRings();
        this.createEntanglementLines();

        // Event listeners
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));

        // Listen for theme changes
        this.setupThemeObserver();

        // Start animation
        this.animate();
    }

    setupThemeObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    this.updateColors();
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });
    }

    updateColors() {
        const colors = getThemeColors();
        const theme = getCurrentTheme();

        if (theme === 'light') {
            // Vibrant multi-color scheme for light theme
            if (this.core) {
                this.core.material.color.setHex(colors.primary);
                this.core.material.emissive = new THREE.Color(colors.primary);
                this.core.material.emissiveIntensity = 0.5;
            }
            if (this.innerCore) {
                this.innerCore.material.color.setHex(colors.secondary);
                this.innerCore.material.emissive = new THREE.Color(colors.secondary);
                this.innerCore.material.emissiveIntensity = 0.3;
            }
            if (this.glowSphere) {
                // Animated gradient effect for glow sphere
                this.glowSphere.material.color.setHex(colors.highlight);
                this.glowSphere.material.opacity = colors.glowOpacity;
            }
            if (this.particleSystem) {
                this.particleSystem.material.opacity = colors.particleOpacity;
                this.particleSystem.material.size = 0.25; // Larger particles for light theme
            }

            // Rainbow orbital rings
            this.quantumOrbitals.forEach((orbital, i) => {
                const ringColors = colors.gradientColors || [colors.primary, colors.secondary, colors.highlight];
                orbital.mesh.material.color.setHex(ringColors[i % ringColors.length]);
                orbital.mesh.material.emissive = new THREE.Color(ringColors[i % ringColors.length]);
                orbital.mesh.material.emissiveIntensity = 0.2;
                orbital.mesh.material.opacity = 0.8;
            });

            // Multi-colored entanglement lines
            this.entanglementLines.forEach((line, i) => {
                const lineColors = colors.gradientColors || [colors.primary, colors.secondary];
                line.mesh.material.color.setHex(lineColors[i % lineColors.length]);
                line.mesh.material.opacity = 0.5;
            });
        } else {
            // Original dark theme colors
            if (this.core) {
                this.core.material.color.setHex(colors.primary);
            }
            if (this.innerCore) {
                this.innerCore.material.color.setHex(colors.secondary);
            }
            if (this.glowSphere) {
                this.glowSphere.material.color.setHex(colors.primary);
                this.glowSphere.material.opacity = colors.glowOpacity;
            }
            if (this.particleSystem) {
                this.particleSystem.material.opacity = colors.particleOpacity;
            }

            // Update orbital rings
            this.quantumOrbitals.forEach((orbital, i) => {
                const ringColors = [colors.primary, colors.secondary, colors.highlight];
                orbital.mesh.material.color.setHex(ringColors[i % 3]);
                orbital.mesh.material.opacity = 0.4;
            });

            // Update entanglement lines
            this.entanglementLines.forEach(line => {
                line.mesh.material.color.setHex(Math.random() > 0.5 ? colors.primary : colors.secondary);
                line.mesh.material.opacity = 0.2;
            });
        }
    }

    createQuantumCore() {
        const colors = getThemeColors();
        const theme = getCurrentTheme();

        // Central quantum core with glow
        const coreGeometry = new THREE.IcosahedronGeometry(2, 2);
        const coreMaterial = theme === 'light'
            ? new THREE.MeshPhongMaterial({
                color: colors.primary,
                wireframe: true,
                transparent: true,
                opacity: 0.9,
                emissive: colors.primary,
                emissiveIntensity: 0.5
            })
            : new THREE.MeshBasicMaterial({
                color: colors.primary,
                wireframe: true,
                transparent: true,
                opacity: 0.8
            });
        this.core = new THREE.Mesh(coreGeometry, coreMaterial);
        this.scene.add(this.core);

        // Inner core
        const innerGeometry = new THREE.IcosahedronGeometry(1, 1);
        const innerMaterial = theme === 'light'
            ? new THREE.MeshPhongMaterial({
                color: colors.secondary,
                wireframe: true,
                transparent: true,
                opacity: 0.8,
                emissive: colors.secondary,
                emissiveIntensity: 0.3
            })
            : new THREE.MeshBasicMaterial({
                color: colors.secondary,
                wireframe: true,
                transparent: true,
                opacity: 0.6
            });
        this.innerCore = new THREE.Mesh(innerGeometry, innerMaterial);
        this.scene.add(this.innerCore);

        // Glowing sphere - extra vibrant for light theme
        const glowGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: theme === 'light' ? colors.highlight : colors.primary,
            transparent: true,
            opacity: colors.glowOpacity
        });
        this.glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
        this.scene.add(this.glowSphere);

        // Add ambient light for light theme to make colors pop
        if (theme === 'light' && !this.ambientLight) {
            this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
            this.scene.add(this.ambientLight);

            // Add point lights for iridescent effects
            const pointLight1 = new THREE.PointLight(colors.primary, 0.5, 100);
            pointLight1.position.set(10, 10, 10);
            this.scene.add(pointLight1);

            const pointLight2 = new THREE.PointLight(colors.secondary, 0.5, 100);
            pointLight2.position.set(-10, -10, 10);
            this.scene.add(pointLight2);
        }
    }

    createParticles() {
        const colors = getThemeColors();
        const theme = getCurrentTheme();
        const particleCount = theme === 'light' ? 800 : 500; // More particles for light theme
        const positions = new Float32Array(particleCount * 3);
        const particleColors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        if (theme === 'light' && colors.gradientColors) {
            // Multi-color particle system for light theme
            const gradColors = colors.gradientColors.map(c => new THREE.Color(c));

            for (let i = 0; i < particleCount; i++) {
                // Spherical distribution with varied density
                const radius = 8 + Math.random() * 20;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);

                positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
                positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                positions[i * 3 + 2] = radius * Math.cos(phi);

                // Pick random color from gradient palette
                const colorIndex = Math.floor(Math.random() * gradColors.length);
                const nextColorIndex = (colorIndex + 1) % gradColors.length;
                const mixRatio = Math.random();

                const color = gradColors[colorIndex].clone().lerp(gradColors[nextColorIndex], mixRatio);
                particleColors[i * 3] = color.r;
                particleColors[i * 3 + 1] = color.g;
                particleColors[i * 3 + 2] = color.b;

                sizes[i] = Math.random() * 3 + 1; // Larger, varied sizes for light theme

                // Store particle data for animation
                this.particles.push({
                    index: i,
                    radius: radius,
                    theta: theta,
                    phi: phi,
                    speed: 0.001 + Math.random() * 0.003,
                    phaseOffset: Math.random() * Math.PI * 2,
                    colorShift: Math.random() * Math.PI * 2 // For color animation
                });
            }
        } else {
            // Original dark theme particle system
            const colorPrimary = new THREE.Color(colors.primary);
            const colorSecondary = new THREE.Color(colors.secondary);

            for (let i = 0; i < particleCount; i++) {
                // Spherical distribution
                const radius = 8 + Math.random() * 20;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);

                positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
                positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                positions[i * 3 + 2] = radius * Math.cos(phi);

                // Color interpolation
                const mixRatio = Math.random();
                const color = colorPrimary.clone().lerp(colorSecondary, mixRatio);
                particleColors[i * 3] = color.r;
                particleColors[i * 3 + 1] = color.g;
                particleColors[i * 3 + 2] = color.b;

                sizes[i] = Math.random() * 2 + 0.5;

                // Store particle data for animation
                this.particles.push({
                    index: i,
                    radius: radius,
                    theta: theta,
                    phi: phi,
                    speed: 0.001 + Math.random() * 0.002,
                    phaseOffset: Math.random() * Math.PI * 2
                });
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: colors.particleOpacity,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }

    createOrbitalRings() {
        const colors = getThemeColors();
        const theme = getCurrentTheme();
        const ringCount = theme === 'light' ? 5 : 3; // More rings for light theme

        if (theme === 'light' && colors.gradientColors) {
            // Create rainbow orbital rings for light theme
            for (let i = 0; i < ringCount; i++) {
                const radius = 5 + i * 2.5;
                const geometry = new THREE.TorusGeometry(radius, 0.05, 16, 100);

                // Use gradient colors for rings
                const ringColor = colors.gradientColors[i % colors.gradientColors.length];

                const material = new THREE.MeshPhongMaterial({
                    color: ringColor,
                    emissive: ringColor,
                    emissiveIntensity: 0.3,
                    transparent: true,
                    opacity: 0.8,
                    shininess: 100
                });

                const ring = new THREE.Mesh(geometry, material);

                ring.rotation.x = Math.PI / 2 + (i * 0.25);
                ring.rotation.y = i * 0.4;

                this.quantumOrbitals.push({
                    mesh: ring,
                    rotationSpeed: {
                        x: 0.002 * (i + 1),
                        y: 0.003 * (ringCount - i),
                        z: 0.0025 * (i + 1)
                    }
                });

                this.scene.add(ring);
            }
        } else {
            // Original dark theme rings
            const ringColors = [colors.primary, colors.secondary, colors.highlight];

            for (let i = 0; i < ringCount; i++) {
                const radius = 5 + i * 3;
                const geometry = new THREE.TorusGeometry(radius, 0.02, 16, 100);
                const material = new THREE.MeshBasicMaterial({
                    color: ringColors[i],
                    transparent: true,
                    opacity: 0.4
                });
                const ring = new THREE.Mesh(geometry, material);

                ring.rotation.x = Math.PI / 2 + (i * 0.3);
                ring.rotation.y = i * 0.5;

                this.quantumOrbitals.push({
                    mesh: ring,
                    rotationSpeed: {
                        x: 0.001 * (i + 1),
                        y: 0.002 * (ringCount - i),
                        z: 0.0015 * (i + 1)
                    }
                });

                this.scene.add(ring);
            }
        }
    }

    createEntanglementLines() {
        const colors = getThemeColors();
        // Create lines representing quantum entanglement
        const lineCount = 20;
        this.entanglementLines = [];

        for (let i = 0; i < lineCount; i++) {
            const points = [];
            const startAngle = Math.random() * Math.PI * 2;
            const radius = 4 + Math.random() * 8;

            for (let j = 0; j <= 50; j++) {
                const t = j / 50;
                const angle = startAngle + t * Math.PI * 2;
                const r = radius * (1 + 0.3 * Math.sin(t * Math.PI * 4));
                points.push(new THREE.Vector3(
                    r * Math.cos(angle),
                    (Math.random() - 0.5) * 10 * Math.sin(t * Math.PI),
                    r * Math.sin(angle)
                ));
            }

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: Math.random() > 0.5 ? colors.primary : colors.secondary,
                transparent: true,
                opacity: 0.2
            });
            const line = new THREE.Line(geometry, material);

            this.entanglementLines.push({
                mesh: line,
                phase: Math.random() * Math.PI * 2
            });

            this.scene.add(line);
        }
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onResize() {
        if (!this.container) return;

        this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = this.clock.getElapsedTime();

        // Rotate core
        if (this.core) {
            this.core.rotation.x = time * 0.2;
            this.core.rotation.y = time * 0.3;
        }

        if (this.innerCore) {
            this.innerCore.rotation.x = -time * 0.3;
            this.innerCore.rotation.y = -time * 0.2;
        }

        // Pulse glow sphere
        if (this.glowSphere) {
            const scale = 1 + 0.2 * Math.sin(time * 2);
            this.glowSphere.scale.set(scale, scale, scale);
        }

        // Animate particles
        if (this.particleSystem) {
            const positions = this.particleSystem.geometry.attributes.position.array;

            this.particles.forEach(particle => {
                particle.theta += particle.speed;

                const r = particle.radius + Math.sin(time + particle.phaseOffset) * 2;
                positions[particle.index * 3] = r * Math.sin(particle.phi) * Math.cos(particle.theta);
                positions[particle.index * 3 + 1] = r * Math.sin(particle.phi) * Math.sin(particle.theta);
                positions[particle.index * 3 + 2] = r * Math.cos(particle.phi);
            });

            this.particleSystem.geometry.attributes.position.needsUpdate = true;
            this.particleSystem.rotation.y = time * 0.05;
        }

        // Rotate orbital rings
        this.quantumOrbitals.forEach(orbital => {
            orbital.mesh.rotation.x += orbital.rotationSpeed.x;
            orbital.mesh.rotation.y += orbital.rotationSpeed.y;
            orbital.mesh.rotation.z += orbital.rotationSpeed.z;
        });

        // Animate entanglement lines
        this.entanglementLines.forEach(line => {
            line.mesh.rotation.y = time * 0.1 + line.phase;
            line.mesh.material.opacity = 0.1 + 0.1 * Math.sin(time * 2 + line.phase);
        });

        // Camera follows mouse slightly
        this.camera.position.x += (this.mouse.x * 5 - this.camera.position.x) * 0.02;
        this.camera.position.y += (this.mouse.y * 3 - this.camera.position.y) * 0.02;
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    }
}

// ==========================================
// Technology Section - Quantum Processor
// ==========================================
class QuantumProcessorScene {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, this.container.offsetWidth / this.container.offsetHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.qubits = [];
        this.clock = new THREE.Clock();

        this.init();
    }

    init() {
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.set(0, 15, 25);
        this.camera.lookAt(0, 0, 0);

        this.createQuantumGrid();
        this.createQubits();
        this.createConnections();

        window.addEventListener('resize', () => this.onResize());
        this.setupThemeObserver();
        this.animate();
    }

    setupThemeObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    this.updateColors();
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });
    }

    updateColors() {
        const colors = getThemeColors();
        const theme = getCurrentTheme();

        // Update grid
        if (this.gridHelper) {
            if (theme === 'light') {
                // Gradient-like grid for light theme
                this.gridHelper.material.color.setHex(colors.tertiary || colors.primary);
                this.gridHelper.material.opacity = 0.4;
            } else {
                this.gridHelper.material.color.setHex(colors.primary);
                this.gridHelper.material.opacity = 0.3;
            }
        }

        // Update qubits with vibrant colors for light theme
        if (theme === 'light' && colors.gradientColors) {
            this.qubits.forEach((qubit, i) => {
                const qubitColor = colors.gradientColors[i % colors.gradientColors.length];
                qubit.mesh.material.color.setHex(qubitColor);
                if (qubit.mesh.material.emissive) {
                    qubit.mesh.material.emissive = new THREE.Color(qubitColor);
                    qubit.mesh.material.emissiveIntensity = 0.4;
                }
                qubit.ring.material.color.setHex(qubitColor);
                qubit.ring.material.opacity = 0.8;
            });
        } else {
            this.qubits.forEach(qubit => {
                const qubitColor = Math.random() > 0.5 ? colors.primary : colors.secondary;
                qubit.mesh.material.color.setHex(qubitColor);
                qubit.ring.material.color.setHex(colors.primary);
            });
        }
    }

    createQuantumGrid() {
        const colors = getThemeColors();
        const theme = getCurrentTheme();
        // Grid lines
        const gridSize = 20;
        const divisions = 20;
        const gridColor = theme === 'light' ? 0x0284C7 : colors.primary;
        const bgColor = theme === 'light' ? 0xe5e7eb : 0x1a1a25;
        this.gridHelper = new THREE.GridHelper(gridSize, divisions, gridColor, bgColor);
        this.gridHelper.material.opacity = theme === 'light' ? 0.2 : 0.3;
        this.gridHelper.material.transparent = true;
        this.scene.add(this.gridHelper);
    }

    createQubits() {
        const colors = getThemeColors();
        const theme = getCurrentTheme();
        const spacing = 3;
        let qubitIndex = 0;

        for (let x = -2; x <= 2; x++) {
            for (let z = -2; z <= 2; z++) {
                let material, ringMaterial;

                if (theme === 'light' && colors.gradientColors) {
                    // Use vibrant gradient colors for light theme
                    const qubitColor = colors.gradientColors[qubitIndex % colors.gradientColors.length];

                    // Qubit sphere with emissive glow
                    const geometry = new THREE.SphereGeometry(0.4, 32, 32);
                    material = new THREE.MeshPhongMaterial({
                        color: qubitColor,
                        emissive: qubitColor,
                        emissiveIntensity: 0.4,
                        transparent: true,
                        opacity: 0.95,
                        shininess: 200
                    });

                    // Glowing ring with matching color
                    const ringGeometry = new THREE.TorusGeometry(0.6, 0.03, 16, 64);
                    ringMaterial = new THREE.MeshPhongMaterial({
                        color: qubitColor,
                        emissive: qubitColor,
                        emissiveIntensity: 0.3,
                        transparent: true,
                        opacity: 0.8
                    });
                } else {
                    // Original dark theme materials
                    const geometry = new THREE.SphereGeometry(0.3, 16, 16);
                    material = new THREE.MeshBasicMaterial({
                        color: Math.random() > 0.5 ? colors.primary : colors.secondary,
                        transparent: true,
                        opacity: 0.9
                    });

                    const ringGeometry = new THREE.TorusGeometry(0.5, 0.02, 8, 32);
                    ringMaterial = new THREE.MeshBasicMaterial({
                        color: colors.primary,
                        transparent: true,
                        opacity: 0.5
                    });
                }

                const qubit = new THREE.Mesh(
                    theme === 'light' ? new THREE.SphereGeometry(0.4, 32, 32) : new THREE.SphereGeometry(0.3, 16, 16),
                    material
                );
                qubit.position.set(x * spacing, 0, z * spacing);

                // Ring around qubit
                const ring = new THREE.Mesh(
                    theme === 'light' ? new THREE.TorusGeometry(0.6, 0.03, 16, 64) : new THREE.TorusGeometry(0.5, 0.02, 8, 32),
                    ringMaterial
                );
                ring.rotation.x = Math.PI / 2;
                qubit.add(ring);

                this.qubits.push({
                    mesh: qubit,
                    ring: ring,
                    baseY: 0,
                    phase: Math.random() * Math.PI * 2,
                    frequency: 1 + Math.random()
                });

                this.scene.add(qubit);
                qubitIndex++;
            }
        }

        // Add lights for light theme
        if (theme === 'light') {
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            this.scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
            directionalLight.position.set(5, 10, 5);
            this.scene.add(directionalLight);
        }
    }

    createConnections() {
        const colors = getThemeColors();
        // Create lines between adjacent qubits
        const lineMaterial = new THREE.LineBasicMaterial({
            color: colors.primary,
            transparent: true,
            opacity: 0.3
        });

        this.qubits.forEach((qubit, i) => {
            this.qubits.forEach((otherQubit, j) => {
                if (i < j) {
                    const dist = qubit.mesh.position.distanceTo(otherQubit.mesh.position);
                    if (dist < 4) {
                        const geometry = new THREE.BufferGeometry().setFromPoints([
                            qubit.mesh.position,
                            otherQubit.mesh.position
                        ]);
                        const line = new THREE.Line(geometry, lineMaterial.clone());
                        this.scene.add(line);
                    }
                }
            });
        });
    }

    onResize() {
        if (!this.container) return;
        this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = this.clock.getElapsedTime();

        // Animate qubits
        this.qubits.forEach(qubit => {
            qubit.mesh.position.y = qubit.baseY + Math.sin(time * qubit.frequency + qubit.phase) * 0.5;
            qubit.ring.rotation.z = time * 2;

            // Pulse effect
            const scale = 1 + 0.1 * Math.sin(time * 3 + qubit.phase);
            qubit.mesh.scale.set(scale, scale, scale);
        });

        // Rotate camera around scene
        this.camera.position.x = Math.sin(time * 0.2) * 25;
        this.camera.position.z = Math.cos(time * 0.2) * 25;
        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
    }
}

// ==========================================
// About Section - AI Neural Network
// ==========================================
class NeuralNetworkScene {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, this.container.offsetWidth / this.container.offsetHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.nodes = [];
        this.connections = [];
        this.clock = new THREE.Clock();

        this.init();
    }

    init() {
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.z = 40;

        this.createNeuralNetwork();

        window.addEventListener('resize', () => this.onResize());
        this.setupThemeObserver();
        this.animate();
    }

    setupThemeObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    this.updateColors();
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });
    }

    updateColors() {
        const colors = getThemeColors();
        const theme = getCurrentTheme();

        if (theme === 'light' && colors.gradientColors) {
            // Rainbow gradient for neural network nodes
            this.nodes.forEach(node => {
                const colorIndex = (node.layer + node.index) % colors.gradientColors.length;
                const nodeColor = colors.gradientColors[colorIndex];
                node.mesh.material.color.setHex(nodeColor);
                if (node.mesh.material.emissive) {
                    node.mesh.material.emissive = new THREE.Color(nodeColor);
                    node.mesh.material.emissiveIntensity = 0.3;
                }
            });

            // Colorful connections
            this.connections.forEach((connection, i) => {
                const connColor = colors.gradientColors[i % colors.gradientColors.length];
                connection.mesh.material.color.setHex(connColor);
                connection.mesh.material.opacity = 0.4;
            });
        } else {
            // Original dark theme colors
            this.nodes.forEach(node => {
                const nodeColor = node.layer === 0 || node.layer === 4 ? colors.primary : colors.secondary;
                node.mesh.material.color.setHex(nodeColor);
            });

            this.connections.forEach(connection => {
                connection.mesh.material.color.setHex(colors.primary);
            });
        }
    }

    createNeuralNetwork() {
        const colors = getThemeColors();
        const theme = getCurrentTheme();
        const layers = [4, 6, 8, 6, 4];
        const layerSpacing = 8;
        const nodeSpacing = 4;

        layers.forEach((nodeCount, layerIndex) => {
            const layerX = (layerIndex - (layers.length - 1) / 2) * layerSpacing;

            for (let i = 0; i < nodeCount; i++) {
                const nodeY = (i - (nodeCount - 1) / 2) * nodeSpacing;

                let material;
                if (theme === 'light' && colors.gradientColors) {
                    // Vibrant gradient materials for light theme
                    const colorIndex = (layerIndex + i) % colors.gradientColors.length;
                    const nodeColor = colors.gradientColors[colorIndex];

                    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
                    material = new THREE.MeshPhongMaterial({
                        color: nodeColor,
                        emissive: nodeColor,
                        emissiveIntensity: 0.3,
                        transparent: true,
                        opacity: 0.9,
                        shininess: 150
                    });
                } else {
                    // Original dark theme
                    const geometry = new THREE.SphereGeometry(0.4, 16, 16);
                    material = new THREE.MeshBasicMaterial({
                        color: layerIndex === 0 || layerIndex === layers.length - 1 ? colors.primary : colors.secondary,
                        transparent: true,
                        opacity: 0.8
                    });
                }

                const node = new THREE.Mesh(
                    theme === 'light' ? new THREE.SphereGeometry(0.5, 32, 32) : new THREE.SphereGeometry(0.4, 16, 16),
                    material
                );
                node.position.set(layerX, nodeY, 0);

                this.nodes.push({
                    mesh: node,
                    layer: layerIndex,
                    index: i,
                    phase: Math.random() * Math.PI * 2
                });

                this.scene.add(node);
            }
        });

        // Add lighting for light theme
        if (theme === 'light') {
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            this.scene.add(ambientLight);

            const pointLight = new THREE.PointLight(0xffffff, 0.5);
            pointLight.position.set(0, 0, 20);
            this.scene.add(pointLight);
        }

        // Create connections
        for (let l = 0; l < layers.length - 1; l++) {
            const currentLayerNodes = this.nodes.filter(n => n.layer === l);
            const nextLayerNodes = this.nodes.filter(n => n.layer === l + 1);

            currentLayerNodes.forEach(node => {
                nextLayerNodes.forEach(nextNode => {
                    if (Math.random() > 0.3) {
                        const points = [node.mesh.position, nextNode.mesh.position];
                        const geometry = new THREE.BufferGeometry().setFromPoints(points);
                        const material = new THREE.LineBasicMaterial({
                            color: colors.primary,
                            transparent: true,
                            opacity: 0.2
                        });
                        const line = new THREE.Line(geometry, material);

                        this.connections.push({
                            mesh: line,
                            from: node,
                            to: nextNode,
                            phase: Math.random() * Math.PI * 2
                        });

                        this.scene.add(line);
                    }
                });
            });
        }
    }

    onResize() {
        if (!this.container) return;
        this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = this.clock.getElapsedTime();

        // Animate nodes
        this.nodes.forEach(node => {
            const scale = 1 + 0.2 * Math.sin(time * 2 + node.phase);
            node.mesh.scale.set(scale, scale, scale);
            node.mesh.material.opacity = 0.6 + 0.4 * Math.sin(time * 3 + node.phase);
        });

        // Animate connections
        this.connections.forEach(connection => {
            connection.mesh.material.opacity = 0.1 + 0.2 * Math.sin(time * 4 + connection.phase);
        });

        // Slight rotation
        this.scene.rotation.y = Math.sin(time * 0.3) * 0.2;
        this.scene.rotation.x = Math.sin(time * 0.2) * 0.1;

        this.renderer.render(this.scene, this.camera);
    }
}

// ==========================================
// CTA Section - Floating Particles
// ==========================================
class FloatingParticlesScene {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.offsetWidth / this.container.offsetHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.clock = new THREE.Clock();

        this.init();
    }

    init() {
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.z = 30;

        this.createParticles();

        window.addEventListener('resize', () => this.onResize());
        this.setupThemeObserver();
        this.animate();
    }

    setupThemeObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    this.updateColors();
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });
    }

    updateColors() {
        const colors = getThemeColors();
        if (this.particles) {
            this.particles.material.opacity = colors.particleOpacity;
        }
    }

    createParticles() {
        const colors = getThemeColors();
        const particleCount = 200;
        const positions = new Float32Array(particleCount * 3);
        const particleColors = new Float32Array(particleCount * 3);

        const colorPrimary = new THREE.Color(colors.primary);
        const colorSecondary = new THREE.Color(colors.secondary);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 60;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

            const color = colorPrimary.clone().lerp(colorSecondary, Math.random());
            particleColors[i * 3] = color.r;
            particleColors[i * 3 + 1] = color.g;
            particleColors[i * 3 + 2] = color.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.3,
            vertexColors: true,
            transparent: true,
            opacity: colors.particleOpacity,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    onResize() {
        if (!this.container) return;
        this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = this.clock.getElapsedTime();

        if (this.particles) {
            this.particles.rotation.y = time * 0.05;
            this.particles.rotation.x = Math.sin(time * 0.1) * 0.1;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// ==========================================
// Feature Visual - Mini Quantum Animation
// ==========================================
class FeatureQuantumScene {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, this.container.offsetWidth / this.container.offsetHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.clock = new THREE.Clock();

        this.init();
    }

    init() {
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.z = 10;

        this.createScene();

        window.addEventListener('resize', () => this.onResize());
        this.setupThemeObserver();
        this.animate();
    }

    setupThemeObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    this.updateColors();
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });
    }

    updateColors() {
        const colors = getThemeColors();

        if (this.core) {
            this.core.material.color.setHex(colors.primary);
        }

        this.orbits.forEach((orbit, i) => {
            const orbitColor = i % 2 === 0 ? colors.primary : colors.secondary;
            orbit.material.color.setHex(orbitColor);
            // Update electron color
            if (orbit.children[0]) {
                orbit.children[0].material.color.setHex(orbitColor);
            }
        });
    }

    createScene() {
        const colors = getThemeColors();

        // Central atom
        const coreGeometry = new THREE.IcosahedronGeometry(1, 1);
        const coreMaterial = new THREE.MeshBasicMaterial({
            color: colors.primary,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        this.core = new THREE.Mesh(coreGeometry, coreMaterial);
        this.scene.add(this.core);

        // Electron orbits
        this.orbits = [];
        for (let i = 0; i < 3; i++) {
            const orbitGeometry = new THREE.TorusGeometry(2 + i * 0.8, 0.02, 8, 64);
            const orbitMaterial = new THREE.MeshBasicMaterial({
                color: i % 2 === 0 ? colors.primary : colors.secondary,
                transparent: true,
                opacity: 0.5
            });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2 + i * 0.4;
            orbit.rotation.y = i * 0.3;
            this.orbits.push(orbit);
            this.scene.add(orbit);

            // Electron
            const electronGeometry = new THREE.SphereGeometry(0.15, 16, 16);
            const electronMaterial = new THREE.MeshBasicMaterial({
                color: i % 2 === 0 ? colors.primary : colors.secondary
            });
            const electron = new THREE.Mesh(electronGeometry, electronMaterial);
            orbit.add(electron);
            electron.position.x = 2 + i * 0.8;
        }
    }

    onResize() {
        if (!this.container) return;
        this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = this.clock.getElapsedTime();

        if (this.core) {
            this.core.rotation.x = time * 0.5;
            this.core.rotation.y = time * 0.3;
        }

        this.orbits.forEach((orbit, i) => {
            orbit.rotation.z = time * (1 + i * 0.5);
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize scenes when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize hero scene
    new QuantumHeroScene('hero-canvas');

    // Initialize technology scene
    new QuantumProcessorScene('tech-canvas');

    // Initialize about scene
    new NeuralNetworkScene('about-canvas');

    // Initialize CTA scene
    new FloatingParticlesScene('cta-canvas');

    // Initialize feature visual
    new FeatureQuantumScene('feature-visual-1');
});
