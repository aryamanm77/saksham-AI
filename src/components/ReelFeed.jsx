import React, { useState } from 'react';
import ReelCard from './ReelCard';
import './ReelFeed.css';
import AIMentor from './AIMentor';

const DUMMY_REELS = [
  {
    id: 1,
    videoUrl: 'https://cdn.coverr.co/videos/coverr-a-person-typing-on-a-laptop-4482/1080p.mp4',
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
    videoUrl: 'https://cdn.coverr.co/videos/coverr-software-code-on-a-computer-screen-2158/1080p.mp4',
    creator: {
      name: 'Rahul Sharma',
      role: 'Frontend Engineer',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    title: 'React Hooks in 60s',
    description: 'Master useState and useEffect with this simple mental model.',
    tags: ['React', 'Intermediate', '+100 XP']
  },
  {
    id: 3,
    videoUrl: 'https://cdn.coverr.co/videos/coverr-server-room-1549/1080p.mp4',
    creator: {
      name: 'Priya Patel',
      role: 'DevOps Architect',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    title: 'Kubernetes for absolute beginners',
    description: 'Stop being afraid of containers. Here is how they actually work.',
    tags: ['DevOps', 'Cloud', '+150 XP']
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
