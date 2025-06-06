import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/AudioBook.css';

const AudioBook = () => {
    const { id } = useParams();
    const [audioBook, setAudioBook] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch thông tin sách nói theo id
        fetch(`http://localhost:8080/api/audiobooks/${id}`)
            .then(res => res.json())
            .then(data => setAudioBook(data))
            .catch(() => setAudioBook(null));
    }, [id]);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Hàm xử lý tua khi click vào progress bar
    const handleSeek = (e) => {
        const bar = e.currentTarget;
        const rect = bar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = clickX / rect.width;
        const seekTime = percent * duration;
        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

    if (!audioBook) {
        return <div className="single-audiobook-container"><p>Đang tải sách nói...</p></div>;
    }

    return (
        <div className="single-audiobook-container">
            <button className="single-back-button" onClick={() => navigate(-1)}>
                ❮ 
            </button>
            <div className="single-audiobook-header">
                <div className="single-audiobook-cover">
                    <img src={audioBook.cover_image} alt={audioBook.title} />
                </div>
                <div className="single-audiobook-info">
                    <h1 className="single-audiobook-title">{audioBook.title}</h1>
                    <p className="single-audiobook-author">Tác giả: {audioBook.author}</p>
                    <p className="single-audiobook-category">Thể loại: {audioBook.category}</p>
                    <div className="single-audio-player">
                        <audio
                            ref={audioRef}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            src={audioBook.audio_url}
                        />
                        <div className="single-audio-controls">
                            <button className="single-play-button" onClick={togglePlay}>
                                <span className="circle-btn">
                                    {isPlaying ? (
                                        // Biểu tượng dừng (pause)
                                        <svg width="40" height="40" viewBox="0 0 40 40">
                                            <rect x="12" y="10" width="5" height="20" rx="2" fill="#2563eb"/>
                                            <rect x="23" y="10" width="5" height="20" rx="2" fill="#2563eb"/>
                                        </svg>
                                    ) : (
                                        // Biểu tượng phát (play)
                                        <svg width="40" height="40" viewBox="0 0 40 40">
                                            <polygon points="15,10 30,20 15,30" fill="#2563eb"/>
                                        </svg>
                                    )}
                                </span>
                            </button>
                            <div className="single-progress-container">
                                <div
                                    className="single-progress-bar"
                                    onClick={handleSeek}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div
                                        className="single-progress"
                                        style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                                    ></div>
                                    {/* Cục tròn trên thanh tua */}
                                    {duration > 0 && (
                                        <div
                                            className="single-progress-thumb"
                                            style={{
                                                left: `calc(${(currentTime / duration) * 100}% - 10px)`
                                            }}
                                        ></div>
                                    )}
                                </div>
                                <div className="single-time-info">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="single-audiobook-description">
                        <p>{audioBook.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AudioBook;