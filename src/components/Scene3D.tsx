// src/components/Scene3D.tsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Scene3D() {
	const mountRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!mountRef.current) return;

		const scene = new THREE.Scene();
		scene.background = new THREE.Color('#ffffff');

		// Camera
		const camera = new THREE.PerspectiveCamera(
			45,
			mountRef.current.clientWidth / mountRef.current.clientHeight,
			0.1,
			1000
		);
		camera.position.set(4, 4, 6);

		// Renderer
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(
			mountRef.current.clientWidth,
			mountRef.current.clientHeight
		);
		mountRef.current.appendChild(renderer.domElement);

		// Light
		const light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(3, 5, 4);
		scene.add(light);

		// A 3D plane (your "surface")
		const geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
		const material = new THREE.MeshBasicMaterial({
			color: '#e6e6e6',
			wireframe: true,
		});
		const plane = new THREE.Mesh(geometry, material);
		plane.rotation.x = -Math.PI / 2;
		scene.add(plane);

		// Controls
		// const controls = new OrbitControls(camera, renderer.domElement);

		const animate = () => {
			requestAnimationFrame(animate);
			// controls.update();
			renderer.render(scene, camera);
		};
		animate();

		return () => {
			renderer.dispose();
			mountRef.current?.removeChild(renderer.domElement);
		};
	}, []);

	return <div ref={mountRef} className='w-full h-full absolute inset-0' />;
}
