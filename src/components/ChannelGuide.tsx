"use client";

import { useState, useEffect } from 'react';

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

interface ChannelType {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  ch: number;
}

interface ChannelGuideProps {
  channels: ChannelType[];
  allContent: Record<string, VideoItem[]>;
  currentChannel: number;
  onSelectVideo: (video: VideoItem, channelIndex: number) => void;
  onClose: () => void;
  onFetchContent: (type: string, page: number) => Promise<VideoItem[]>;
}

export function ChannelGuide({
  channels,
  allContent,
  currentChannel,
  onSelectVideo,
  onClose,
  onFetchContent,
}: ChannelGuideProps) {
  const [selectedChannel, setSelectedChannel] = useState(currentChannel);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<VideoItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const currentChannelData = channels[selectedChannel];
  const channelContent = allContent[currentChannelData?.id] || [];

  // Load content when channel changes
  useEffect(() => {
    const type = channels[selectedChannel]?.id;
    if (type && (!allContent[type] || allContent[type].length === 0)) {
      setIsLoading(true);
      onFetchContent(type, 0).finally(() => setIsLoading(false));
    }
  }, [selectedChannel, channels, allContent, onFetchContent]);

  // Search handler
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${currentChannelData?.id}`);
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const displayContent = searchQuery ? searchResults : channelContent;

  return (
    <div className="channel-guide-overlay">
      <div className="channel-guide">
        {/* Guide Header */}
        <div className="guide-header">
          <div className="guide-title">
            <span className="guide-title-ar">دليل القنوات</span>
            <span className="guide-title-en">CHANNEL GUIDE</span>
          </div>
          <div className="guide-time">
            {new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <button className="guide-close-btn" onClick={onClose}>✕</button>
        </div>
        
        {/* Search Bar */}
        <div className="guide-search">
          <input
            type="text"
            placeholder="ابحث عن فيلم أو مسلسل... / Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            className="guide-search-input"
            dir="auto"
          />
          {isSearching && <span className="search-spinner">⟳</span>}
        </div>
        
        <div className="guide-body">
          {/* Channel List */}
          <div className="guide-channels-list">
            {channels.map((ch, index) => (
              <button
                key={ch.id}
                className={`guide-channel-item ${selectedChannel === index ? 'active' : ''}`}
                style={{ '--ch-color': ch.color } as React.CSSProperties}
                onClick={() => setSelectedChannel(index)}
              >
                <span className="guide-ch-num">CH {ch.ch}</span>
                <span className="guide-ch-icon">{ch.icon}</span>
                <div className="guide-ch-names">
                  <span className="guide-ch-ar">{ch.name}</span>
                  <span className="guide-ch-en">{ch.nameEn}</span>
                </div>
                <span className="guide-ch-count">
                  {allContent[ch.id]?.length || 0}
                </span>
              </button>
            ))}
          </div>
          
          {/* Content Grid */}
          <div className="guide-content-area">
            {isLoading ? (
              <div className="guide-loading">
                <div className="guide-loading-spinner">⟳</div>
                <div>جاري التحميل...</div>
              </div>
            ) : displayContent.length === 0 ? (
              <div className="guide-empty">
                <div className="guide-empty-icon">📺</div>
                <div className="guide-empty-text">لا يوجد محتوى متاح</div>
                <div className="guide-empty-subtext">No content available</div>
              </div>
            ) : (
              <div className="guide-video-grid">
                {displayContent.map((video) => (
                  <button
                    key={video.id}
                    className={`guide-video-card ${selectedVideo?.id === video.id ? 'selected' : ''}`}
                    onClick={() => setSelectedVideo(video)}
                    onDoubleClick={() => onSelectVideo(video, selectedChannel)}
                  >
                    <div className="guide-video-thumb">
                      {video.thumbnail && video.thumbnail !== '' ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={video.thumbnail} 
                          alt={video.titleAr}
                          className="guide-thumb-img"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="guide-thumb-placeholder">
                          {currentChannelData?.icon}
                        </div>
                      )}
                      <div className="guide-video-year">{video.year}</div>
                    </div>
                    <div className="guide-video-info">
                      <div className="guide-video-title-ar">{video.titleAr}</div>
                      {video.stars && (
                        <div className="guide-video-stars">⭐ {video.stars}</div>
                      )}
                      {video.duration && (
                        <div className="guide-video-duration">⏱ {video.duration}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Selected Video Preview */}
          {selectedVideo && (
            <div className="guide-preview">
              <div className="guide-preview-title">{selectedVideo.titleAr}</div>
              <div className="guide-preview-year">{selectedVideo.year}</div>
              {selectedVideo.description && (
                <div className="guide-preview-desc">{selectedVideo.description}</div>
              )}
              {selectedVideo.stars && (
                <div className="guide-preview-stars">بطولة: {selectedVideo.stars}</div>
              )}
              {selectedVideo.director && (
                <div className="guide-preview-director">إخراج: {selectedVideo.director}</div>
              )}
              <button
                className="guide-watch-btn"
                onClick={() => onSelectVideo(selectedVideo, selectedChannel)}
              >
                <span>▶ شاهد الآن</span>
                <span>Watch Now</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Guide Footer */}
        <div className="guide-footer">
          <span>↑↓ تصفح</span>
          <span>ENTER مشاهدة</span>
          <span>ESC إغلاق</span>
          <span className="guide-footer-brand">تلفزيون مصر 90s</span>
        </div>
      </div>
    </div>
  );
}
