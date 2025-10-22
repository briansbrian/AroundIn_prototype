
import React, { useCallback, useMemo } from 'react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Container, Engine, ISourceOptions } from "tsparticles-engine";

interface ParticlesBackgroundProps {
    theme: 'light' | 'dark';
}

const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({ theme }) => {

    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine);
    }, []);

    const options = useMemo((): ISourceOptions => {
        const isDark = theme === 'dark';
        return {
            background: {
                color: {
                    value: isDark ? '#111827' : '#f9fafb', // Corresponds to dark:bg-gray-900 and bg-gray-50
                },
            },
            fpsLimit: 60,
            interactivity: {
                events: {
                    onHover: {
                        enable: true,
                        mode: "repulse",
                    },
                    resize: true,
                },
                modes: {
                    repulse: {
                        distance: 100,
                        duration: 0.4,
                    },
                },
            },
            particles: {
                color: {
                    value: isDark ? "#fcd34d" : "#f59e0b", // amber-300 on dark, amber-500 on light
                },
                links: {
                    color: isDark ? "#fbbf24" : "#fcd34d", // amber-400 on dark, amber-300 on light
                    distance: 150,
                    enable: true,
                    opacity: 0.4,
                    width: 1,
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                        default: "bounce",
                    },
                    random: false,
                    speed: 1,
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                        area: 800,
                    },
                    value: 80,
                },
                opacity: {
                    value: 0.6,
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 1, max: 2.5 },
                },
            },
            detectRetina: true,
        };
    }, [theme]);

    return (
        <div className="absolute top-0 left-0 w-full h-full z-0">
             <Particles
                id="tsparticles"
                init={particlesInit}
                options={options}
            />
        </div>
    );
};

export default ParticlesBackground;