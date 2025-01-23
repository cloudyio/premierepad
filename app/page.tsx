"use client";

import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useRef, useState, useEffect } from "react";
import { Group } from "three";
import * as THREE from "three";

function CustomModel({ isScrolled, scale, onLoaded }) {
  const gltf = useLoader(GLTFLoader, "/models/pad.gltf", undefined, () => onLoaded());
  const pivot = useRef<Group>(null);

  useFrame(() => {
    if (pivot.current) {
      // Simple rotation animation
      if (!isScrolled) {
        pivot.current.rotation.x = 0.4;
        pivot.current.rotation.y += 0.01;
      } else {
        // Smooth transition to top-down view
        pivot.current.rotation.x = THREE.MathUtils.lerp(pivot.current.rotation.x, 0, 0.1);
        pivot.current.rotation.y = THREE.MathUtils.lerp(pivot.current.rotation.y, 0, 0.1);
      }
    }
  });

  return (
    <group ref={pivot} scale={scale}>
      <primitive object={gltf.scene} position={[-0.055, 0, 0]} />
    </group>
  );
}

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scale, setScale] = useState([1, 1, 1]);
  const [isKeybindsVisible, setIsKeybindsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const keybindsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const secondPageTop = windowHeight;
      const secondPageBottom = windowHeight * 2;
      setIsScrolled(scrollY > secondPageTop * 0.65 && scrollY < secondPageBottom * 1.1);

      if (scrollY > secondPageTop) {
        const scaleValue = Math.max(0, 1 - (scrollY - secondPageTop) / (windowHeight * 0.65));
        setScale([scaleValue, scaleValue, scaleValue]);
      } else {
        setScale([1, 1, 1]);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []); 

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsKeybindsVisible(entry.isIntersecting);
      },
      {
        root: null, 
        rootMargin: "0px",
        threshold: 0.5, 
      }
    );

    if (keybindsRef.current) observer.observe(keybindsRef.current);

    return () => {
      if (keybindsRef.current) observer.unobserve(keybindsRef.current);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="w-full relative">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
          <div className="text-2xl font-bold text-gray-800">Loading...</div>
        </div>
      )}
      <nav className="fixed top-0 left-0 right-0 z-20 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-800">PremierePad</h1>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a href="#about" className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">About</a>
                  <a href="#features" className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">Features</a>
                  <a href="#open-source" className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">Open Source</a>
                  <a href="#extra-info" className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">Extra Info</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="fixed inset-0 z-10 mt-16">
        <Canvas camera={{ position: [0, 0, 0.175] }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls enableZoom={false} enableRotate={false} enabled={!isScrolled} />
          <CustomModel isScrolled={isScrolled} scale={scale} onLoaded={() => setIsLoading(false)} />
        </Canvas>
      </div>

      <div className="relative z-0">
        <div className="h-screen flex justify-center items-start pt-20 bg-gradient-to-b from-blue-500 to-indigo-600">
          <h1 className="text-white font-bold text-4xl">PremierePad</h1>
        </div>

        <div id="about" className="h-screen bg-white p-8 shadow-lg rounded-t-3xl flex">
          <div className="w-1/4 p-4 bg-gray-100 rounded-l-3xl">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">About macropad</h3>
            <p className="text-gray-600">
              The macropad is mainly made for editing, it allows you to bind specific actions you may use often to save a bit of time, macros can also be setup to peform a large amount of actions such as changing the edit layout and much more.
            </p>
            <h4 className="text-xl font-bold mt-6 mb-2 text-gray-800">Macropad Features</h4>
            <p className="text-gray-600">
              The macropad comes with 3 scenes and 6 customizable buttons. You can configure these buttons using VIA, a powerful tool that allows you to set up your keybinds and macros easily.
            </p>
          </div>
        </div>


        <div id="open-source" className="min-h-screen bg-gray-100 p-8 shadow-lg rounded-t-3xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Open Source</h2>
            <p className="text-gray-600">
              This project is open source, meaning that anyone can view, modify, and contribute to the code. We believe in the power of community and collaboration, and we welcome contributions from developers of all skill levels.
            </p>
            <p className="text-gray-600 mt-4">
              You can find the source code on our GitHub repository. Feel free to fork the project, make changes, and submit pull requests. Together, we can make this project even better!
            </p>
            <div className="mt-8">
              <a href="https://github.com/your-repo" className="text-blue-500 underline">
                Visit our GitHub Repository
              </a>
            </div>
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-800">Extra info</h3>
              <ul className="list-disc list-inside text-gray-600 mt-2">
                <li>PCB designed in KiCad</li>
                <li>Case designed with Fusion360</li>
                <li>Microcontroller firmware made with QMK</li>
                <li>Made for a YSWS by Hack Club</li>
              </ul>
              
            </div>
          </div>
        </div>

      

        <footer className="bg-gray-800 text-white py-4">
          <div className="max-w-4xl mx-auto text-center">
            <p>Made by Cloudy</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
