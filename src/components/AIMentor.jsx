import React, { useState } from 'react';
import { Bot, X, Sparkles, HelpCircle, BookOpen } from 'lucide-react';
import './AIMentor.css';

export default function AIMentor() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button 
        className="ai-mentor-fab glass-panel"
        onClick={() => setIsOpen(true)}
      >
        <Bot size={20} className="ai-icon" />
        <span>AI Mentor</span>
      </button>

      {/* Overlay Panel */}
      {isOpen && (
        <div className="ai-mentor-overlay">
          <div className="ai-mentor-backdrop" onClick={() => setIsOpen(false)} />
          <div className="ai-mentor-panel slide-up glass-panel">
            <div className="ai-panel-header">
              <div className="ai-title">
                <Bot size={24} className="ai-icon" />
                <h2>Saksham AI</h2>
              </div>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="ai-panel-content">
              <p className="ai-greeting">Hi! I'm your AI Mentor. How can I help you understand this concept better?</p>
              
              <div className="ai-actions">
                <button className="pill-button action-btn">
                  <Sparkles size={16} /> Explain simpler
                </button>
                <button className="pill-button action-btn">
                  <HelpCircle size={16} /> Generate a quiz
                </button>
                <button className="pill-button action-btn">
                  <BookOpen size={16} /> Give me an example
                </button>
              </div>

              {/* Chat area placeholder */}
              <div className="ai-chat-area">
                <div className="chat-bubble ai">
                  This video explains Gradient Descent. Think of it like walking down a mountain blindfolded, taking steps in the steepest downward direction until you reach the bottom!
                </div>
              </div>
            </div>

            <div className="ai-panel-footer">
              <input type="text" placeholder="Ask anything about this video..." className="ai-input" />
              <button className="pill-button primary send-btn">Send</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
