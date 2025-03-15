import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const OptimizedVideo = () => {
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  
  // Animation variants
  const otherVariants = {
    initial: {
      y: 50,
      opacity: 0.5
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  // Create Intersection Observer to lazy load video
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '100px', // Load when within 100px of viewport
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  // Load video only when in viewport
  useEffect(() => {
    if (isVisible && videoRef.current) {
      // Set the src attribute only when visible
      const videoElement = videoRef.current;
      
      // 1. Use a thumbnail/poster instead of the video initially
      videoElement.poster = "./demo-thumbnail.jpg"; // Create this thumbnail from your video
      
      // 2. Add event listeners for better user feedback
      const handleCanPlay = () => {
        setIsLoaded(true);
        setShowVideo(true);
      };

      videoElement.addEventListener('canplay', handleCanPlay);
      
      // 3. Set source to a compressed version first
      const source = videoElement.querySelector('source');
      source.src = "./demo-compressed.mp4"; // This should be a lower quality version
      videoElement.load();
      
      return () => {
        videoElement.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [isVisible]);

  return (
    <div className="videocontbg">
      <motion.div 
        className="videocont"
        initial="initial"
        whileInView="animate"
        variants={otherVariants}
      >
        {/* Loading placeholder with thumbnail */}
        {!showVideo && (
          <div className="video-placeholder">
            {/* This can be a static image from your video */}
            <img 
              src="./demo-thumbnail.jpg" 
              alt="Video thumbnail" 
              style={{ width: '100%', height: 'auto' }}
            />
            {isVisible && !isLoaded && (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <p>Loading video...</p>
              </div>
            )}
          </div>
        )}
        
        {/* Video element */}
        <motion.video
          ref={videoRef}
          autoPlay
          controls
          loop
          muted
          playsInline
          style={{ 
            display: showVideo ? 'block' : 'none',
            width: '100%',
            height: 'auto'
          }}
          variants={otherVariants}
          preload="metadata"
        >
          <source type="video/mp4" />
          <source type="video/webm" /> {/* Add WebM as a fallback format */}
          Your browser does not support the video tag.
        </motion.video>
      </motion.div>
    </div>
  );
};

export default OptimizedVideo;