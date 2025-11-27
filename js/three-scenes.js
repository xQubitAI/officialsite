/**
 * xQubit.AI - Three.js 3D Scenes
 * Quantum Computing and AI Agent visualizations
 * Theme-aware colors for dark/light mode support
 */

// Theme color management - Minimalist Monochrome Design
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
        // Monochrome depth-based color system for light theme
        // Using deep blue as the single color family with varying shades
        primary: 0x1e40af,      // Deep Blue - darkest (main elements)
        secondary: 0x3b82f6,    // Medium Blue - mid-tone (secondary elements)
        highlight: 0x60a5fa,    // Light Blue - brightest (accents)

        // Depth levels for layered effects
        depth1: 0x1e3a8a,       // Darkest - core elements
        depth2: 0x2563eb,       // Dark - primary structures
        depth3: 0x3b82f6,       // Medium - mid-layer elements
        depth4: 0x60a5fa,       // Light - highlights
        depth5: 0x93c5fd,       // Lightest - subtle accents

        background: 0xfafbfd,
        particleOpacity: 0.75,   // Slightly more subtle
        lineOpacity: 0.35,       // Refined opacity
        glowOpacity: 0.5,        // Softer glow

        // Material properties for depth
        wireframeOpacity: 0.6,
        solidOpacity: 0.85,
        emissiveIntensity: 0.15  // Subtle emissive glow
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
            // Monochrome depth-based coloring for light theme
            if (this.core) {
                this.core.material.color.setHex(colors.depth1); // Darkest for core
                this.core.material.opacity = colors.wireframeOpacity;
            }
            if (this.innerCore) {
                this.innerCore.material.color.setHex(colors.depth2); // Dark for inner
                this.innerCore.material.opacity = colors.wireframeOpacity * 0.8;
            }
            if (this.glowSphere) {
                this.glowSphere.material.color.setHex(colors.depth3); // Medium for glow
                this.glowSphere.material.opacity = colors.glowOpacity;
            }
            if (this.particleSystem) {
                this.particleSystem.material.opacity = colors.particleOpacity;
            }

            // Gradient depth for orbital rings (darkest to lightest)
            this.quantumOrbitals.forEach((orbital, i) => {
                const depthColors = [colors.depth2, colors.depth3, colors.depth4];
                orbital.mesh.material.color.setHex(depthColors[i % 3]);
                orbital.mesh.material.opacity = 0.5 - (i * 0.1); // Decreasing opacity for depth
            });

            // Subtle entanglement lines
            this.entanglementLines.forEach((line, i) => {
                line.mesh.material.color.setHex(colors.depth4); // Light blue for all lines
                line.mesh.material.opacity = colors.lineOpacity;
            });
        } else {
            // Original dark theme colors
            if (this.core) {
                this.core.material.color.setHex(colors.primary);
                this.core.material.opacity = 0.8;
            }
            if (this.innerCore) {
                this.innerCore.material.color.setHex(colors.secondary);
                this.innerCore.material.opacity = 0.6;
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

        // Central quantum core with glow
        const coreGeometry = new THREE.IcosahedronGeometry(2, 2);
        const coreMaterial = new THREE.MeshBasicMaterial({
            color: colors.primary,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        this.core = new THREE.Mesh(coreGeometry, coreMaterial);
        this.scene.add(this.core);

        // Inner core
        const innerGeometry = new THREE.IcosahedronGeometry(1, 1);
        const innerMaterial = new THREE.MeshBasicMaterial({
            color: colors.secondary,
            wireframe: true,
            transparent: true,
            opacity: 0.6
        });
        this.innerCore = new THREE.Mesh(innerGeometry, innerMaterial);
        this.scene.add(this.innerCore);

        // Glowing sphere
        const glowGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: colors.primary,
            transparent: true,
            opacity: colors.glowOpacity
        });
        this.glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
        this.scene.add(this.glowSphere);
    }

    createParticles() {
        const colors = getThemeColors();
        const theme = getCurrentTheme();
        const particleCount = 500;
        const positions = new Float32Array(particleCount * 3);
        const particleColors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        if (theme === 'light') {
            // Monochrome gradient particles for light theme
            const colorDark = new THREE.Color(colors.depth2);   // Darker blue
            const colorLight = new THREE.Color(colors.depth5);  // Lighter blue

            for (let i = 0; i < particleCount; i++) {
                // Spherical distribution
                const radius = 8 + Math.random() * 20;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);

                positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
                positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                positions[i * 3 + 2] = radius * Math.cos(phi);

                // Depth-based color - closer particles are darker, farther are lighter
                const depthRatio = (radius - 8) / 20; // 0 to 1
                const color = colorDark.clone().lerp(colorLight, depthRatio);
                particleColors[i * 3] = color.r;
                particleColors[i * 3 + 1] = color.g;
                particleColors[i * 3 + 2] = color.b;

                // Varying sizes for depth perception
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
        } else {
            // Original dark theme particles
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
        const ringCount = 3;
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
                this.gridHelper.material.color.setHex(colors.depth4); // Light blue for grid
                this.gridHelper.material.opacity = 0.25;
            } else {
                this.gridHelper.material.color.setHex(colors.primary);
                this.gridHelper.material.opacity = 0.3;
            }
        }

        // Update qubits with monochrome depth
        if (theme === 'light') {
            this.qubits.forEach((qubit, i) => {
                // Alternate between depth levels for variety
                const depthLevel = [colors.depth2, colors.depth3, colors.depth4][i % 3];
                qubit.mesh.material.color.setHex(depthLevel);
                qubit.mesh.material.opacity = colors.solidOpacity;
                qubit.ring.material.color.setHex(depthLevel);
                qubit.ring.material.opacity = 0.5;
            });
        } else {
            this.qubits.forEach(qubit => {
                const qubitColor = Math.random() > 0.5 ? colors.primary : colors.secondary;
                qubit.mesh.material.color.setHex(qubitColor);
                qubit.mesh.material.opacity = 0.9;
                qubit.ring.material.color.setHex(colors.primary);
                qubit.ring.material.opacity = 0.5;
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
        const spacing = 3;

        for (let x = -2; x <= 2; x++) {
            for (let z = -2; z <= 2; z++) {
                // Qubit sphere
                const geometry = new THREE.SphereGeometry(0.3, 16, 16);
                const material = new THREE.MeshBasicMaterial({
                    color: Math.random() > 0.5 ? colors.primary : colors.secondary,
                    transparent: true,
                    opacity: 0.9
                });
                const qubit = new THREE.Mesh(geometry, material);
                qubit.position.set(x * spacing, 0, z * spacing);

                // Ring around qubit
                const ringGeometry = new THREE.TorusGeometry(0.5, 0.02, 8, 32);
                const ringMaterial = new THREE.MeshBasicMaterial({
                    color: colors.primary,
                    transparent: true,
                    opacity: 0.5
                });
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
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
            }
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

        if (theme === 'light') {
            // Monochrome depth gradient for neural network
            this.nodes.forEach(node => {
                // Layer-based depth: input/output layers darker, hidden layers lighter
                let nodeColor;
                if (node.layer === 0 || node.layer === 4) {
                    nodeColor = colors.depth2; // Darker for input/output
                } else if (node.layer === 2) {
                    nodeColor = colors.depth4; // Lightest for middle layer
                } else {
                    nodeColor = colors.depth3; // Medium for other layers
                }
                node.mesh.material.color.setHex(nodeColor);
                node.mesh.material.opacity = colors.solidOpacity;
            });

            // Subtle connections
            this.connections.forEach(connection => {
                connection.mesh.material.color.setHex(colors.depth5); // Lightest blue
                connection.mesh.material.opacity = colors.lineOpacity * 0.6;
            });
        } else {
            // Original dark theme
            this.nodes.forEach(node => {
                const nodeColor = node.layer === 0 || node.layer === 4 ? colors.primary : colors.secondary;
                node.mesh.material.color.setHex(nodeColor);
                node.mesh.material.opacity = 0.8;
            });

            this.connections.forEach(connection => {
                connection.mesh.material.color.setHex(colors.primary);
                connection.mesh.material.opacity = 0.2;
            });
        }
    }

    createNeuralNetwork() {
        const colors = getThemeColors();
        const layers = [4, 6, 8, 6, 4];
        const layerSpacing = 8;
        const nodeSpacing = 4;

        layers.forEach((nodeCount, layerIndex) => {
            const layerX = (layerIndex - (layers.length - 1) / 2) * layerSpacing;

            for (let i = 0; i < nodeCount; i++) {
                const nodeY = (i - (nodeCount - 1) / 2) * nodeSpacing;

                const geometry = new THREE.SphereGeometry(0.4, 16, 16);
                const material = new THREE.MeshBasicMaterial({
                    color: layerIndex === 0 || layerIndex === layers.length - 1 ? colors.primary : colors.secondary,
                    transparent: true,
                    opacity: 0.8
                });
                const node = new THREE.Mesh(geometry, material);
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
        const theme = getCurrentTheme();

        if (this.particles) {
            if (theme === 'light') {
                this.particles.material.opacity = colors.particleOpacity * 0.8; // Slightly more subtle
            } else {
                this.particles.material.opacity = colors.particleOpacity;
            }
        }
    }

    createParticles() {
        const colors = getThemeColors();
        const theme = getCurrentTheme();
        const particleCount = 200;
        const positions = new Float32Array(particleCount * 3);
        const particleColors = new Float32Array(particleCount * 3);

        if (theme === 'light') {
            // Monochrome gradient for light theme
            const colorDark = new THREE.Color(colors.depth3);
            const colorLight = new THREE.Color(colors.depth5);

            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 60;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

                const color = colorDark.clone().lerp(colorLight, Math.random());
                particleColors[i * 3] = color.r;
                particleColors[i * 3 + 1] = color.g;
                particleColors[i * 3 + 2] = color.b;
            }
        } else {
            // Original dark theme
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
        const theme = getCurrentTheme();

        if (theme === 'light') {
            // Monochrome depth for feature quantum scene
            if (this.core) {
                this.core.material.color.setHex(colors.depth2);
                this.core.material.opacity = colors.wireframeOpacity;
            }

            this.orbits.forEach((orbit, i) => {
                // Gradient from darker to lighter
                const orbitColors = [colors.depth2, colors.depth3, colors.depth4];
                const orbitColor = orbitColors[i % 3];
                orbit.material.color.setHex(orbitColor);
                orbit.material.opacity = 0.6;

                // Update electron color
                if (orbit.children[0]) {
                    orbit.children[0].material.color.setHex(orbitColor);
                    orbit.children[0].material.opacity = colors.solidOpacity;
                }
            });
        } else {
            // Original dark theme
            if (this.core) {
                this.core.material.color.setHex(colors.primary);
                this.core.material.opacity = 0.8;
            }

            this.orbits.forEach((orbit, i) => {
                const orbitColor = i % 2 === 0 ? colors.primary : colors.secondary;
                orbit.material.color.setHex(orbitColor);
                orbit.material.opacity = 0.5;

                // Update electron color
                if (orbit.children[0]) {
                    orbit.children[0].material.color.setHex(orbitColor);
                }
            });
        }
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
