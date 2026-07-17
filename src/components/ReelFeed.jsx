import React, { useState } from 'react';
import ReelCard from './ReelCard';
import './ReelFeed.css';
import AIMentor from './AIMentor';

const DUMMY_REELS = [
  {
    id: 1,
    videoUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    creator: {
      name: 'Anika Rao',
      role: 'Machine Learning mentor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    title: 'Gradient descent, without the panic',
    description: 'Tiny corrections teach a model to make better predictions.',
    tags: ['Python', 'Beginner', '+80 XP']
  },
  {
    id: 2,
    videoUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    creator: {
      name: 'Rahul Sharma',
      role: 'Frontend Engineer',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    title: 'React Hooks in 60s',
    description: 'Master useState and useEffect with this simple mental model.',
    tags: ['React', 'Intermediate', '+100 XP']
  }
];

export default function ReelFeed() {
  const [activeReel, setActiveReel] = useState(0);

  const handleScroll = (e) => {
    const container = e.target;
    const index = Math.round(container.scrollTop / container.clientHeight);
    if (index !== activeReel) {
      setActiveReel(index);
    }
  };

  return (
    <div className="reel-feed no-scrollbar" onScroll={handleScroll}>
      {DUMMY_REELS.map((reel, index) => (
        <ReelCard 
          key={reel.id} 
          {...reel} 
          isPlaying={index === activeReel}
        />
      ))}
      <AIMentor />
    </div>
  );
}
