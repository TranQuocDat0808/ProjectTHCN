import React, { useState, useEffect } from 'react';
import '../styles/Slider.css';

const Slider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            image: '/images/Slide1.jpg',  
        },
        {
            image: '/images/Slide2.jpg',
        },
        {
            image: '/images/Banner-sách_1920_tinified.jpg',
        },
        {
            image: '/images/banner2.jpg',
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prevSlide) => 
                prevSlide === slides.length - 1 ? 0 : prevSlide + 1
            );
        }, 5000);

        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
    };

    const prevSlide = () => {
        setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
    };

    return (
        <div className="slider">
            <button className="slider-button prev" onClick={prevSlide}>❮</button>
            <button className="slider-button next" onClick={nextSlide}>❯</button>
            
            {slides.map((slide, index) => (
                <div 
                    key={index} 
                    className={`slide ${index === currentSlide ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${slide.image})` }}
                >
                    <div className="slide-content">
                        <h2>{slide.title}</h2>
                        <p>{slide.description}</p>
                    </div>
                </div>
            ))}

            <div className="slider-dots">
                {slides.map((_, index) => (
                    <span 
                        key={index} 
                        className={`dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default Slider;