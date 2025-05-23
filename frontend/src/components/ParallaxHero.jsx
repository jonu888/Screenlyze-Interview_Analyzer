import React from 'react';

export default function ParallaxHero() {
  return (
    <div className="relative h-screen bg-fixed bg-center bg-cover" style={{ backgroundImage: `url('/hero-bg.jpg')` }}>
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-5xl font-bold">Intelligent Video Interview Analyzer</h1>
          <p className="mt-4 text-xl">Upload. Analyze. Improve Your Interviews.</p>
        </div>
      </div>
    </div>
  );
}
