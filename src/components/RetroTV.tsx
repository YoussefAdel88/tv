"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { StaticNoise } from './StaticNoise';
import { DVDBouncer } from './DVDBouncer';
import { ChannelGuide } from './ChannelGuide';

interface VideoItem {
  id: string;
  youtubeId: string;
  title: string;
  titleAr: string;
  year: number;
  type: string;
  thumbnail: string;
  description?: string;
  stars?: string;
  director?: string;
  duration?: string;
}

const CHANNEL_TYPES = [
  { id: 'movie', name: 'أفلام', nameEn: 'Movies', icon: '🎬', color: '#FFD700', ch: 1 },
  { id: 'series', name: 'مسلسلات', nameEn: 'Series', icon: '📺', color: '#FF6B35', ch: 2 },
  { id: 'music', name: 'موسيقى', nameEn: 'Music', icon: '🎵', color: '#9B59B6', ch: 3 },
  { id: 'comedy', name: 'كوميديا', nameEn: 'Comedy', icon: '😂', color: '#2ECC71', ch: 4 },
  { id: 'sports', name: 'رياضة', nameEn: 'Sports', icon: '⚽', color: '#3498DB', ch: 5 },
  { id: 'cartoon', name: 'كرتون', nameEn: 'Cartoons', icon: '🎨', color: '#E74C3C', ch: 6 },
  { id: 'variety', name: 'برامج', nameEn: 'Variety', icon: '🌟', color: '#1ABC9C', ch: 7 },
  { id: 'drama', name: 'دراما', nameEn: 'Drama', icon: '🎭', color: '#E67E22', ch: 8 },
];

type ScreenState = 'off' | 'static' | 'loading' | 'playing' | 'guide' | 'dvd';

export default function RetroTV() {
  const [isPowered, setIsPowered] = useState(false);
  const [screenState, setScreenState] = useState<ScreenState>('off');
  const [currentChannel, setCurrentChannel] = useState(0);
  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null);
  const [contentList, setContentList] = useState<VideoItem[]>([]);
  const [contentIndex, setContentIndex] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [brightness, setBrightness] = useState(80);
  const [showChannelBanner, setShowChannelBanner] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [channelPage, setChannelPage] = useState(0);
  const [staticIntensity, setStaticIntensity] = useState(1);
  const [showVolumeBar, setShowVolumeBar] = useState(false);
  const [channelInputBuffer, setChannelInputBuffer] = useState('');
  const [showChannelInput, setShowChannelInput] = useState(false);
  const [scanlineEffect, setScanlineEffect] = useState(true);
  const [crtEffect, setCrtEffect] = useState(true);
  const [allContent, setAllContent] = useState<Record<string, VideoItem[]>>({});
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const channelBannerTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const volumeBarTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const channelInputTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const staticTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentChannelData = CHANNEL_TYPES[currentChannel];

  // Fetch content for a channel type
  const fetchContent = useCallback(async (type: string, page: number = 0) => {
    setIsLoadingContent(true);
    try {
      const response = await fetch(`/api/content?type=${type}&page=${page}`);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        setAllContent(prev => ({
          ...prev,
          [type]: [...(prev[type] || []), ...data.results],
        }));
        return data.results as VideoItem[];
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setIsLoadingContent(false);
    }
    return [];
  }, []);

  // Power on/off
  const handlePower = useCallback(() => {
    if (isPowered) {
      // Power off
      setScreenState('static');
      setStaticIntensity(1);
      setTimeout(() => {
        setScreenState('off');
        setIsPowered(false);
        setCurrentVideo(null);
      }, 800);
    } else {
      // Power on
      setIsPowered(true);
      setScreenState('static');
      setStaticIntensity(1);
      
      // Show static for 1.5 seconds then load content
      staticTimeout.current = setTimeout(async () => {
        setScreenState('loading');
        const type = CHANNEL_TYPES[currentChannel].id;
        
        // Check if we have cached content
        const cached = allContent[type];
        if (cached && cached.length > 0) {
          setContentList(cached);
          setCurrentVideo(cached[0]);
          setContentIndex(0);
          setScreenState('playing');
        } else {
          const content = await fetchContent(type, 0);
          if (content.length > 0) {
            setContentList(content);
            setCurrentVideo(content[0]);
            setContentIndex(0);
            setScreenState('playing');
          } else {
            setScreenState('dvd'); // Fallback to DVD bouncer
          }
        }
      }, 1500);
    }
  }, [isPowered, currentChannel, allContent, fetchContent]);

  // Channel up
  const handleChannelUp = useCallback(async () => {
    if (!isPowered) return;
    
    const nextChannel = (currentChannel + 1) % CHANNEL_TYPES.length;
    setCurrentChannel(nextChannel);
    setScreenState('static');
    setStaticIntensity(0.8);
    setShowChannelBanner(true);
    
    if (channelBannerTimeout.current) clearTimeout(channelBannerTimeout.current);
    channelBannerTimeout.current = setTimeout(() => setShowChannelBanner(false), 3000);
    
    setTimeout(async () => {
      const type = CHANNEL_TYPES[nextChannel].id;
      const cached = allContent[type];
      
      if (cached && cached.length > 0) {
        setContentList(cached);
        setCurrentVideo(cached[0]);
        setContentIndex(0);
        setScreenState('playing');
      } else {
        setScreenState('loading');
        const content = await fetchContent(type, 0);
        if (content.length > 0) {
          setContentList(content);
          setCurrentVideo(content[0]);
          setContentIndex(0);
          setScreenState('playing');
        } else {
          setScreenState('dvd');
        }
      }
    }, 600);
  }, [isPowered, currentChannel, allContent, fetchContent]);

  // Channel down
  const handleChannelDown = useCallback(async () => {
    if (!isPowered) return;
    
    const prevChannel = (currentChannel - 1 + CHANNEL_TYPES.length) % CHANNEL_TYPES.length;
    setCurrentChannel(prevChannel);
    setScreenState('static');
    setStaticIntensity(0.8);
    setShowChannelBanner(true);
    
    if (channelBannerTimeout.current) clearTimeout(channelBannerTimeout.current);
    channelBannerTimeout.current = setTimeout(() => setShowChannelBanner(false), 3000);
    
    setTimeout(async () => {
      const type = CHANNEL_TYPES[prevChannel].id;
      const cached = allContent[type];
      
      if (cached && cached.length > 0) {
        setContentList(cached);
        setCurrentVideo(cached[0]);
        setContentIndex(0);
        setScreenState('playing');
      } else {
        setScreenState('loading');
        const content = await fetchContent(type, 0);
        if (content.length > 0) {
          setContentList(content);
          setCurrentVideo(content[0]);
          setContentIndex(0);
          setScreenState('playing');
        } else {
          setScreenState('dvd');
        }
      }
    }, 600);
  }, [isPowered, currentChannel, allContent, fetchContent]);

  // Next video
  const handleNextVideo = useCallback(async () => {
    if (!isPowered || contentList.length === 0) return;
    
    setScreenState('static');
    setStaticIntensity(0.5);
    
    setTimeout(async () => {
      const nextIndex = contentIndex + 1;
      
      if (nextIndex < contentList.length) {
        setContentIndex(nextIndex);
        setCurrentVideo(contentList[nextIndex]);
        setScreenState('playing');
      } else {
        // Load more content
        const type = currentChannelData.id;
        const newContent = await fetchContent(type, channelPage + 1);
        setChannelPage(prev => prev + 1);
        
        if (newContent.length > 0) {
          const combined = [...contentList, ...newContent];
          setContentList(combined);
          setCurrentVideo(combined[nextIndex] || newContent[0]);
          setContentIndex(nextIndex < combined.length ? nextIndex : 0);
          setScreenState('playing');
        } else {
          // Loop back to start
          setContentIndex(0);
          setCurrentVideo(contentList[0]);
          setScreenState('playing');
        }
      }
    }, 400);
  }, [isPowered, contentList, contentIndex, currentChannelData, channelPage, fetchContent]);

  // Volume control
  const handleVolumeUp = useCallback(() => {
    if (!isPowered) return;
    setVolume(prev => Math.min(100, prev + 10));
    setIsMuted(false);
    setShowVolumeBar(true);
    if (volumeBarTimeout.current) clearTimeout(volumeBarTimeout.current);
    volumeBarTimeout.current = setTimeout(() => setShowVolumeBar(false), 2000);
  }, [isPowered]);

  const handleVolumeDown = useCallback(() => {
    if (!isPowered) return;
    setVolume(prev => Math.max(0, prev - 10));
    setShowVolumeBar(true);
    if (volumeBarTimeout.current) clearTimeout(volumeBarTimeout.current);
    volumeBarTimeout.current = setTimeout(() => setShowVolumeBar(false), 2000);
  }, [isPowered]);

  const handleMute = useCallback(() => {
    if (!isPowered) return;
    setIsMuted(prev => !prev);
    setShowVolumeBar(true);
    if (volumeBarTimeout.current) clearTimeout(volumeBarTimeout.current);
    volumeBarTimeout.current = setTimeout(() => setShowVolumeBar(false), 2000);
  }, [isPowered]);

  // Guide toggle
  const handleGuide = useCallback(() => {
    if (!isPowered) return;
    setShowGuide(prev => !prev);
  }, [isPowered]);

  // Select video from guide
  const handleSelectVideo = useCallback(async (video: VideoItem, channelIndex: number) => {
    setShowGuide(false);
    setCurrentChannel(channelIndex);
    setScreenState('static');
    setStaticIntensity(0.8);
    
    setTimeout(() => {
      setCurrentVideo(video);
      setScreenState('playing');
    }, 600);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          handlePower();
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleChannelUp();
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleChannelDown();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNextVideo();
          break;
        case '+':
        case '=':
          handleVolumeUp();
          break;
        case '-':
          handleVolumeDown();
          break;
        case 'm':
        case 'M':
          handleMute();
          break;
        case 'g':
        case 'G':
          handleGuide();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePower, handleChannelUp, handleChannelDown, handleNextVideo, handleVolumeUp, handleVolumeDown, handleMute, handleGuide]);

  // Preload content for all channels in background
  useEffect(() => {
    if (isPowered) {
      // Preload other channels in background
      const preloadChannels = async () => {
        for (const ch of CHANNEL_TYPES) {
          if (!allContent[ch.id]) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Stagger requests
            fetchContent(ch.id, 0);
          }
        }
      };
      preloadChannels();
    }
  }, [isPowered, allContent, fetchContent]);

  const youtubeEmbedUrl = currentVideo 
    ? `https://www.youtube.com/embed/${currentVideo.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0&iv_load_policy=3&cc_load_policy=0&disablekb=1&fs=0&playsinline=1`
    : '';

  return (
    <div className="retro-tv-wrapper">
      {/* TV Cabinet */}
      <div className="tv-cabinet">
        
        {/* TV Screen Area */}
        <div className="tv-screen-bezel">
          <div 
            className="tv-screen"
            style={{ filter: `brightness(${brightness / 100})` }}
          >
            {/* CRT Scanlines Overlay */}
            {scanlineEffect && isPowered && (
              <div className="scanlines-overlay" />
            )}
            
            {/* CRT Curvature Effect */}
            {crtEffect && (
              <div className="crt-overlay" />
            )}
            
            {/* Screen Content */}
            {screenState === 'off' && (
              <div className="screen-off">
                <div className="power-dot" />
              </div>
            )}
            
            {screenState === 'static' && (
              <StaticNoise intensity={staticIntensity} />
            )}
            
            {screenState === 'loading' && (
              <div className="screen-loading">
                <StaticNoise intensity={0.3} />
                <div className="loading-overlay">
                  <div className="loading-text">
                    <span className="arabic-text">جاري التحميل...</span>
                    <div className="loading-dots">
                      <span>●</span><span>●</span><span>●</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {screenState === 'dvd' && (
              <DVDBouncer />
            )}
            
            {screenState === 'playing' && currentVideo && (
              <div className="video-container">
                <iframe
                  ref={iframeRef}
                  src={youtubeEmbedUrl}
                  title={currentVideo.titleAr}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="youtube-iframe"
                />
              </div>
            )}
            
            {/* Channel Banner */}
            {showChannelBanner && isPowered && (
              <div className="channel-banner">
                <div className="channel-number">
                  CH {currentChannelData.ch}
                </div>
                <div className="channel-info">
                  <span className="channel-icon">{currentChannelData.icon}</span>
                  <div>
                    <div className="channel-name-ar">{currentChannelData.name}</div>
                    <div className="channel-name-en">{currentChannelData.nameEn}</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Volume Bar */}
            {showVolumeBar && isPowered && (
              <div className="volume-bar-overlay">
                <div className="volume-label">
                  {isMuted ? '🔇 MUTE' : `🔊 VOL ${volume}`}
                </div>
                <div className="volume-track">
                  <div 
                    className="volume-fill"
                    style={{ width: `${isMuted ? 0 : volume}%` }}
                  />
                </div>
              </div>
            )}
            
            {/* Now Playing Info */}
            {screenState === 'playing' && currentVideo && (
              <div className="now-playing-bar">
                <div className="now-playing-content">
                  <span className="now-playing-label">▶ الآن يُعرض</span>
                  <span className="now-playing-title">{currentVideo.titleAr}</span>
                  <span className="now-playing-year">{currentVideo.year}</span>
                </div>
              </div>
            )}
            
            {/* Channel Guide Overlay */}
            {showGuide && (
              <ChannelGuide
                channels={CHANNEL_TYPES}
                allContent={allContent}
                currentChannel={currentChannel}
                onSelectVideo={handleSelectVideo}
                onClose={() => setShowGuide(false)}
                onFetchContent={fetchContent}
              />
            )}
          </div>
        </div>
        
        {/* TV Controls Panel */}
        <div className="tv-controls">
          
          {/* Left Controls - Channel & Volume Knobs */}
          <div className="controls-left">
            <div className="knob-group">
              <div className="knob-label">CHANNEL</div>
              <div 
                className="knob channel-knob"
                onClick={handleChannelUp}
                title="Channel Up"
              >
                <div className="knob-indicator" />
              </div>
              <div className="knob-buttons">
                <button className="knob-btn" onClick={handleChannelUp} title="CH+">▲</button>
                <button className="knob-btn" onClick={handleChannelDown} title="CH-">▼</button>
              </div>
            </div>
            
            <div className="knob-group">
              <div className="knob-label">VOLUME</div>
              <div 
                className="knob volume-knob"
                title="Volume"
              >
                <div className="knob-indicator" style={{ transform: `rotate(${(volume / 100) * 270 - 135}deg)` }} />
              </div>
              <div className="knob-buttons">
                <button className="knob-btn" onClick={handleVolumeUp} title="VOL+">+</button>
                <button className="knob-btn" onClick={handleVolumeDown} title="VOL-">-</button>
              </div>
            </div>
          </div>
          
          {/* Center - Channel Buttons */}
          <div className="controls-center">
            <div className="channel-buttons-grid">
              {CHANNEL_TYPES.map((ch, index) => (
                <button
                  key={ch.id}
                  className={`channel-preset-btn ${currentChannel === index && isPowered ? 'active' : ''}`}
                  style={{ 
                    '--ch-color': ch.color,
                    borderColor: currentChannel === index && isPowered ? ch.color : 'transparent',
                  } as React.CSSProperties}
                  onClick={async () => {
                    if (!isPowered) return;
                    setCurrentChannel(index);
                    setScreenState('static');
                    setStaticIntensity(0.8);
                    setShowChannelBanner(true);
                    if (channelBannerTimeout.current) clearTimeout(channelBannerTimeout.current);
                    channelBannerTimeout.current = setTimeout(() => setShowChannelBanner(false), 3000);
                    
                    setTimeout(async () => {
                      const type = ch.id;
                      const cached = allContent[type];
                      if (cached && cached.length > 0) {
                        setContentList(cached);
                        setCurrentVideo(cached[0]);
                        setContentIndex(0);
                        setScreenState('playing');
                      } else {
                        setScreenState('loading');
                        const content = await fetchContent(type, 0);
                        if (content.length > 0) {
                          setContentList(content);
                          setCurrentVideo(content[0]);
                          setContentIndex(0);
                          setScreenState('playing');
                        } else {
                          setScreenState('dvd');
                        }
                      }
                    }, 600);
                  }}
                  title={`${ch.nameEn} - ${ch.name}`}
                >
                  <span className="ch-btn-icon">{ch.icon}</span>
                  <span className="ch-btn-num">{ch.ch}</span>
                  <span className="ch-btn-name">{ch.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Right Controls - Power & Action Buttons */}
          <div className="controls-right">
            {/* Power Button */}
            <button
              className={`power-button ${isPowered ? 'on' : 'off'}`}
              onClick={handlePower}
              title="Power"
            >
              <span className="power-icon">⏻</span>
              <span className="power-label">POWER</span>
            </button>
            
            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                className="action-btn mute-btn"
                onClick={handleMute}
                title="Mute"
                disabled={!isPowered}
              >
                {isMuted ? '🔇' : '🔊'}
                <span>MUTE</span>
              </button>
              
              <button 
                className="action-btn next-btn"
                onClick={handleNextVideo}
                title="Next Video"
                disabled={!isPowered}
              >
                ⏭
                <span>NEXT</span>
              </button>
              
              <button 
                className="action-btn guide-btn"
                onClick={handleGuide}
                title="Channel Guide"
                disabled={!isPowered}
              >
                📋
                <span>GUIDE</span>
              </button>
            </div>
            
            {/* Brightness Slider */}
            <div className="brightness-control">
              <div className="brightness-label">☀ BRIGHT</div>
              <input
                type="range"
                min="30"
                max="120"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className="brightness-slider"
                title="Brightness"
              />
            </div>
          </div>
        </div>
        
        {/* TV Brand Label */}
        <div className="tv-brand">
          <span className="brand-arabic">تلفزيون مصر</span>
          <span className="brand-english">EGYPTIAN TV 90s</span>
          <span className="brand-model">MODEL: EGY-1990</span>
        </div>
        
        {/* TV Legs */}
        <div className="tv-legs">
          <div className="tv-leg left" />
          <div className="tv-leg right" />
        </div>
      </div>
      
      {/* Keyboard Shortcuts Help */}
      <div className="keyboard-help">
        <span>SPACE: Power</span>
        <span>↑↓: Channel</span>
        <span>→: Next</span>
        <span>+/-: Volume</span>
        <span>M: Mute</span>
        <span>G: Guide</span>
      </div>
    </div>
  );
}
