'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface WaveBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

const WaveMaterial = {
    uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2() },
        u_amplitude: { value: [25, 15, 10] },
        u_frequency: { value: [0.008, 0.012, 0.016] },
        u_phase: { value: [0.4, 0.3, 0.5] },
        u_colors: {
            value: [
                new THREE.Color('#8B5CF6').multiplyScalar(0.3), // violet-500/30
                new THREE.Color('#3B82F6').multiplyScalar(0.2), // blue-500/20
                new THREE.Color('#10B981').multiplyScalar(0.2), // emerald-500/20
            ],
        },
        u_opacity: { value: [0.4, 0.3, 0.2] },
    },
    vertexShader: `
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform float u_amplitude[3];
        uniform float u_frequency[3];
        uniform float u_phase[3];
        
        varying vec3 v_position;
        varying vec2 v_uv;
        
        void main() {
            float displacement = 0.0;
            
            for(int i = 0; i < 3; i++) {
                displacement += u_amplitude[i] * sin(
                    position.x * u_frequency[i] + 
                    u_time * u_phase[i] + 
                    position.z * u_frequency[i] * 0.5
                );
            }
            
            float edgeFade = smoothstep(0.0, 0.1, uv.y) * 
                            smoothstep(1.0, 0.9, uv.y);
                            
            vec3 newPosition = position;
            newPosition.y += displacement * edgeFade;
            
            v_position = newPosition;
            v_uv = uv;
            
            gl_Position = projectionMatrix * 
                         modelViewMatrix * 
                         vec4(newPosition, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 u_colors[3];
        uniform float u_opacity[3];
        uniform float u_time;
        
        varying vec3 v_position;
        varying vec2 v_uv;
        
        void main() {
            vec4 finalColor = vec4(0.0);
            
            for(int i = 0; i < 3; i++) {
                float depth = (v_position.z + 1.0) * 0.5;
                float layerOpacity = u_opacity[i] * 
                                   smoothstep(0.0, 0.3, depth) * 
                                   smoothstep(1.0, 0.7, depth);
                                   
                float shimmer = sin(u_time * 0.5 + v_uv.x * 10.0) * 0.05;
                
                vec4 layerColor = vec4(u_colors[i], layerOpacity + shimmer);
                finalColor += layerColor;
            }
            
            gl_FragColor = finalColor;
        }
    `,
};

function WaveMesh() {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { theme } = useTheme();

    const geometry = useMemo(() => new THREE.PlaneGeometry(100, 50, 100, 50), []);
    const material = useMemo(() => {
        const mat = new THREE.ShaderMaterial({
            ...WaveMaterial,
            transparent: true,
            side: THREE.DoubleSide,
        });
        return mat;
    }, []);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.u_time.value = state.clock.getElapsedTime();
            
            // Update colors based on theme
            const colors = materialRef.current.uniforms.u_colors.value;
            if (theme === 'dark') {
                colors[0].setStyle('#8B5CF6').multiplyScalar(0.3);
                colors[1].setStyle('#3B82F6').multiplyScalar(0.2);
                colors[2].setStyle('#10B981').multiplyScalar(0.2);
            } else {
                colors[0].setStyle('#8B5CF6').multiplyScalar(0.15);
                colors[1].setStyle('#3B82F6').multiplyScalar(0.1);
                colors[2].setStyle('#10B981').multiplyScalar(0.1);
            }
        }
    });

    return (
        <mesh ref={meshRef} geometry={geometry} material={material} rotation={[-Math.PI / 4, 0, 0]} position={[0, 0, -20]}>
            <shaderMaterial ref={materialRef} attach="material" {...WaveMaterial} />
        </mesh>
    );
}

export function WaveBackground({ className, ...props }: WaveBackgroundProps) {
    return (
        <div className={cn('fixed inset-0 -z-10', className)} {...props}>
            <Canvas
                camera={{ position: [0, 20, 100], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
                dpr={Math.min(2, window.devicePixelRatio)}
            >
                <WaveMesh />
            </Canvas>
        </div>
    );
} 