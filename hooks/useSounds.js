import { useRef, useEffect } from "react";

export function useSounds() {
    const sounds = useRef({});

    useEffect(() => {
        sounds.current = {
            start: new Audio("/sound/start.wav"),
            spawn: new Audio("/sound/spawn.wav"),
            prepare: new Audio("/sound/prepare.wav"),
            mid: new Audio("/sound/mid.wav"),
            last: new Audio("/sound/last.wav"),
            warning: new Audio("/sound/warning.wav"),
            end: new Audio("/sound/end.wav"),
            countdown: Array.from({ length: 10 }, (_, i) => new Audio(`/sound/countdown/${i}.wav`)),
        }

        const flatList = Object.values(sounds.current).flatMap((v) =>
        Array.isArray(v) ? v : [v]
        );    
                
        flatList.forEach((audio) => {       
            audio.preload = "auto";
            audio.volume = 1;
        });
        
        }, []);
    
    async function unlockSounds() {
        const flatList = Object.values(sounds.current).flatMap((v) =>
            Array.isArray(v) ? v : [v]
        );
        for (const audio of flatList) {
            audio.volume = 0;
            try {
                await audio.play();
                audio.pause();
                audio.currentTime = 0;
            } catch (e) {
                console.error(e);
            }
            audio.volume = 0.7;
        }
    }

    function playSound(audio) {
        audio.currentTime = 0; // 처음부터 재생
        audio.play();
    }

    function playRandomCountdown() {
        const pool = sounds.current.countdown;
        const idx = Math.floor(Math.random() * pool.length);
        playSound(pool[idx]);
    }

    return {
        sounds,
        unlockSounds,
        playSound,
        playRandomCountdown,
    }

}