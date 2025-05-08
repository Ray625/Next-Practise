'use client'

import React, { useState, useEffect, useRef } from "react"

const images = [
  "https://media.vogue.com.tw/photos/65e9ed954f9c672200185663/master/w_1600%2Cc_limit/d3313ff74e0fbfb49cef46d907c7103d.png",
  "https://im.marieclaire.com.tw/m800c533h100b0/assets/mc/202404/663183D42ADB21714521044.jpeg",
  "https://images-tw.girlstyle.com/wp-content/uploads/2024/06/b2b9d064.jpg?auto=format&w=1053",
]

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)

  const startX = useRef(0)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const extendedImages = [
    images[images.length - 1], // 假的最後一張
    ...images,
    images[0],                 // 假的第一張
  ]

  useEffect(() => {
    startAutoPlay()
    return () => stopAutoPlay()
  }, [])

  useEffect(() => {
    if (currentIndex === 0) {
      // 到了假的最左邊
      setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(images.length)
      }, 500)
    } else if (currentIndex === images.length + 1) {
      // 到了假的最右邊
      setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(1)
      }, 500)
    } else {
      setTimeout(() => {
        setIsTransitioning(true)
      }, 500)
    }
  }, [currentIndex])

  const startAutoPlay = () => {
    stopAutoPlay()
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => prev + 1)
    }, 3000)
  }

  const stopAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index + 1)
  }

  const handleDragStart = (x: number) => {
    stopAutoPlay()
    setIsDragging(true)
    startX.current = x
  }

  const handleDragMove = (x: number) => {
    if (!isDragging) return
    const offset = x - startX.current
    setDragOffset(offset)
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    if (dragOffset > 100) {
      setCurrentIndex((prev) => prev - 1)
    } else if (dragOffset < -100) {
      setCurrentIndex((prev) => prev + 1)
    }
    setIsDragging(false)
    setDragOffset(0)
    startAutoPlay()
  }

  return (
    <div
      className="relative w-[600px] h-[300px] overflow-hidden select-none"
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onMouseMove={(e) => handleDragMove(e.clientX)}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
      onTouchEnd={handleDragEnd}
    >
      {/* 圖片列 */}
      <div
        className="flex"
        style={{
          transform: `translateX(calc(${-currentIndex * 100}% + ${dragOffset}px))`,
          transition: isDragging || !isTransitioning ? "none" : "transform 0.5s ease",
          // ⭐ 拖曳中 or 關閉 transition 時，不要 transition
        }}
      >
        {extendedImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index}`}
            draggable={false}
            className="w-[600px] h-[300px] object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* 左右箭頭 */}
      <button
        onClick={() => setCurrentIndex((prev) => prev - 1)}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/50 p-2 rounded-full"
      >
        ◀
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => prev + 1)}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/50 p-2 rounded-full"
      >
        ▶
      </button>

      {/* 小圓點 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index + 1 === currentIndex || (currentIndex === 0 && index === images.length - 1) || (currentIndex === images.length + 1 && index === 0)
                ? "bg-blue-500"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default ImageCarousel