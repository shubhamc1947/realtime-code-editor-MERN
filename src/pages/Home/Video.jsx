import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const OptimizedVideo = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [hasError, setHasError] = useState(false);
  
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
      rootMargin: '200px', // Load when within 200px of viewport
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log("Element is now visible in viewport");
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Load video when visible - with explicit error handling and fallbacks
  useEffect(() => {
    if (isVisible && videoRef.current) {
      console.log("Loading video now that it's visible");
      const videoElement = videoRef.current;
      
      // Set poster
      try {
        videoElement.poster = "./demo-thumbnail.jpg";
        console.log("Poster set successfully");
      } catch (e) {
        console.error("Error setting poster:", e);
      }
      
      // Event handlers with detailed logging
      const handleCanPlay = () => {
        console.log("Video can play event triggered");
        setIsLoaded(true);
        setShowVideo(true);
      };
      
      const handleError = () => {
        console.error("Video error occurred");
        if (videoElement.error) {
          console.error("Error code:", videoElement.error.code);
          console.error("Error message:", videoElement.error.message);
        }
        setHasError(true);
      };
      
      const handleLoadedMetadata = () => {
        console.log("Video metadata loaded");
      };

      // Add event listeners
      videoElement.addEventListener('canplay', handleCanPlay);
      videoElement.addEventListener('error', handleError);
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      // Try different approaches to setting the source
      try {
        // First, create the source elements programmatically
        const sourceMP4 = document.createElement('source');
        sourceMP4.src = "./demo.mp4";
        sourceMP4.type = "video/mp4";
        
        // Clear any existing sources
        while (videoElement.firstChild) {
          videoElement.removeChild(videoElement.firstChild);
        }
        
        // Add the new source
        videoElement.appendChild(sourceMP4);
        
        // Load the video
        videoElement.load();
        console.log("Video source set and load() called");
        
        // Try to play after a short delay
        setTimeout(() => {
          const playPromise = videoElement.play();
          if (playPromise !== undefined) {
            playPromise.catch(e => {
              console.log("Autoplay prevented:", e);
              // Show the video anyway even if autoplay fails
              setIsLoaded(true);
              setShowVideo(true);
            });
          }
        }, 1000);
      } catch (e) {
        console.error("Error setting video source:", e);
        setHasError(true);
      }
      
      // Cleanup
      return () => {
        videoElement.removeEventListener('canplay', handleCanPlay);
        videoElement.removeEventListener('error', handleError);
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [isVisible]);

  // Create a fallback div with a link to the video if loading fails
  const renderFallback = () => {
    if (hasError) {
      return (
        <div style={{ 
          backgroundColor: "#282c34", 
          aspectRatio: "16/9",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          color: "white",
          flexDirection: "column",
          padding: "20px",
          textAlign: "center"
        }}>
          <p>Sorry, we couldn't load the video automatically.</p>
          <a 
            href="./demo.mp4" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              padding: "10px 15px",
              backgroundColor: "#71d5b4",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              marginTop: "15px"
            }}
          >
            Click here to open the video
          </a>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="videocontbg">
      <motion.div 
        className="videocont"
        initial="initial"
        whileInView="animate"
        variants={otherVariants}
        ref={containerRef}
      >
        {!showVideo && !hasError && (
          <div className="video-placeholder" style={{ 
            backgroundColor: "#282c34", 
            aspectRatio: "16/9",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            color: "white"
          }}>
            <div>
              <div className="spinner" style={{
                border: "4px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "50%",
                borderTop: "4px solid #71d5b4",
                width: "40px",
                height: "40px",
                margin: "0 auto 10px auto",
                animation: "spin 1s linear infinite"
              }}></div>
              <p>Loading video...</p>
            </div>
          </div>
        )}
        
        {hasError && renderFallback()}
        
        {!hasError && (
          <video
            ref={videoRef}
            controls
            muted
            playsInline
            preload="metadata"
            style={{ 
              display: showVideo ? 'block' : 'none',
              width: '100%',
              height: 'auto',
              borderRadius: '8px'
            }}
          >
            <source src="./demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </motion.div>
    </div>
  );
};

export default OptimizedVideo;