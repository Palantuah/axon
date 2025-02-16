import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

interface PodcastPlayerProps {
    audioUrl: string | null;
}

export const PodcastPlayer = ({ audioUrl }: PodcastPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!audioUrl) {
            console.log('No audio URL provided');
            return;
        }

        if (audioRef.current) {
            const audio = audioRef.current;

            const handleError = (e: ErrorEvent) => {
                console.error('Audio error:', e);
                setError('Failed to load audio');
            };

            const handleLoadedMetadata = () => {
                console.log('Audio metadata loaded');
                setDuration(audio.duration || 0);
                setError(null);
            };

            const handleTimeUpdate = () => {
                setCurrentTime(audio.currentTime || 0);
            };

            audio.addEventListener('error', handleError);
            audio.addEventListener('loadedmetadata', handleLoadedMetadata);
            audio.addEventListener('timeupdate', handleTimeUpdate);

            return () => {
                audio.removeEventListener('error', handleError);
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audio.removeEventListener('timeupdate', handleTimeUpdate);
            };
        }
    }, [audioUrl]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(err => {
                    console.error('Play error:', err);
                    setError('Failed to play audio');
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (!audioUrl) {
        console.log('Audio URL is missing');
        return null;
    }

    return (
        <div className="flex items-center gap-4 px-4 py-2 bg-muted/30 rounded-full">
            <audio 
                ref={audioRef} 
                src={audioUrl}
                onError={(e) => {
                    console.error('Audio element error:', e);
                    setError('Failed to load audio');
                }}
            />
            
            {error ? (
                <div className="text-sm text-destructive">{error}</div>
            ) : (
                <>
                    <button
                        onClick={togglePlay}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                        {isPlaying ? (
                            <Pause className="w-4 h-4" />
                        ) : (
                            <Play className="w-4 h-4 ml-0.5" />
                        )}
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground min-w-[40px]">
                            {formatTime(currentTime)}
                        </span>
                        
                        <div className="relative w-32 h-1 bg-muted rounded-full overflow-hidden">
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-primary rounded-full"
                                style={{
                                    width: `${(currentTime / duration) * 100}%`,
                                }}
                            />
                        </div>

                        <span className="text-xs text-muted-foreground min-w-[40px]">
                            {formatTime(duration)}
                        </span>
                    </div>

                    <button
                        onClick={toggleMute}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                    >
                        {isMuted ? (
                            <VolumeX className="w-4 h-4 text-muted-foreground" />
                        ) : (
                            <Volume2 className="w-4 h-4 text-muted-foreground" />
                        )}
                    </button>
                </>
            )}
        </div>
    );
}; 