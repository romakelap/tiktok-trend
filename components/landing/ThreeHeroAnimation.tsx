"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeHeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 550;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Clear any previous canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Parent group for smooth rotation and floating
    const group = new THREE.Group();
    scene.add(group);

    // 1. Central Core: Geometric Icosahedron with cyan/teal wireframe
    const coreGeo = new THREE.IcosahedronGeometry(3.6, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7, // vibrant cyan/blue
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const coreMesh = new THREE.Mesh(coreGeo, wireMat);
    group.add(coreMesh);

    // Inner geometric ring/octahedron
    const innerGeo = new THREE.OctahedronGeometry(2.2, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    group.add(innerMesh);

    // 2. Data Orbit Ring 1 (Torus)
    const ringGeo1 = new THREE.TorusGeometry(5.2, 0.02, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    group.add(ring1);

    // Data Orbit Ring 2
    const ringGeo2 = new THREE.TorusGeometry(6.0, 0.02, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.22,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = -Math.PI / 5;
    group.add(ring2);

    // 3. Floating Data Nodes (Particles along vertices & orbits)
    const particlesCount = 75;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 3.5 + Math.random() * 3.5;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    // Minimalist data node dots
    const particleMat = new THREE.PointsMaterial({
      color: 0x0284c7,
      size: 0.14,
      transparent: true,
      opacity: 0.75,
    });
    const points = new THREE.Points(particlesGeo, particleMat);
    group.add(points);

    // Gentle ambient lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Interactive subtle mouse tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      targetX = (x / rect.width) * 0.6;
      targetY = -(y / rect.height) * 0.6;
    };

    window.addEventListener("mousemove", onMouseMove);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Subtle self rotation
      coreMesh.rotation.y = elapsedTime * 0.08;
      coreMesh.rotation.x = elapsedTime * 0.04;

      innerMesh.rotation.y = -elapsedTime * 0.12;
      innerMesh.rotation.z = elapsedTime * 0.06;

      ring1.rotation.z = elapsedTime * 0.05;
      ring2.rotation.z = -elapsedTime * 0.04;

      points.rotation.y = elapsedTime * 0.03;

      // Float effect
      group.position.y = Math.sin(elapsedTime * 0.8) * 0.25;

      // Smooth mouse tilt
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      group.rotation.y += mouseX * 0.02;
      group.rotation.x += mouseY * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handling
    const onWindowResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || 550;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onWindowResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 flex items-center justify-center opacity-80"
      style={{ overflow: "hidden" }}
    />
  );
}
