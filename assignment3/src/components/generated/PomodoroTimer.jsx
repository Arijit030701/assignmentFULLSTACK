import React, { useState, useEffect } from 'react';

export default function PomodoroTimer() {
  const MODES = {
    work: { name: 'Work', time: 25 * 60, color: '#f43f5e', lightColor: '#fb7185', label: 'Time to focus!' },
    shortBreak: { name: 'Short Break', time: 5 * 60, color: '#10b981', lightColor: '#34d399', label: 'Take a breather' },
    longBreak: { name: 'Long Break', time: 15 * 60, color: '#3b82f6', lightColor: '#60a5fa', label: 'Rest & recharge' }
  };

  const [mode, setMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(MODES.work.time);
  const [isActive, setIsActive] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  const currentMode = MODES[mode];
  const totalTime = currentMode.time;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (mode === 'work') {
        setCompletedSessions((prev) => prev + 1);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(MODES[newMode].time);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(currentMode.time);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div style={styles.outerContainer}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.titleGroup}>
            <div style={{
              ...styles.badge,
              backgroundColor: `${currentMode.color}20`,
              color: currentMode.lightColor,
              border: `1px solid ${currentMode.color}40`
            }}>
              <span style={{ ...styles.dot, backgroundColor: currentMode.color }}></span>
              {currentMode.name}
            </div>
            <h1 style={styles.heading}>Pomodoro Dashboard</h1>
          </div>
        </div>

        {/* Mode Selector */}
        <div style={styles.modeTabs}>
          {Object.keys(MODES).map((mKey) => {
            const isSelected = mode === mKey;
            return (
              <button
                key={mKey}
                onClick={() => handleModeChange(mKey)}
                style={{
                  ...styles.tabButton,
                  backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  color: isSelected ? '#ffffff' : '#94a3b8',
                  borderColor: isSelected ? MODES[mKey].color : 'transparent',
                  boxShadow: isSelected ? `0 4px 14px ${MODES[mKey].color}30` : 'none',
                }}
              >
                {MODES[mKey].name}
              </button>
            );
          })}
        </div>

        {/* Circular Progress & Display */}
        <div style={styles.timerWrapper}>
          <svg width="300" height="300" style={styles.svg}>
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke={currentMode.color}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.8s ease, stroke 0.5s ease',
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%',
              }}
            />
          </svg>

          <div style={styles.timerDisplay}>
            <span style={styles.timeText}>{formatTime(timeLeft)}</span>
            <span style={styles.labelText}>{currentMode.label}</span>
          </div>
        </div>

        {/* Controls */}
        <div style={styles.controls}>
          <button
            onClick={resetTimer}
            title="Reset Timer"
            style={styles.secondaryButton}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>

          <button
            onClick={toggleTimer}
            style={{
              ...styles.primaryButton,
              backgroundColor: currentMode.color,
              boxShadow: `0 8px 25px ${currentMode.color}50`,
            }}
          >
            {isActive ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
                <span>Pause</span>
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Start</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              const nextMode = mode === 'work' ? 'shortBreak' : 'work';
              handleModeChange(nextMode);
            }}
            title="Skip Session"
            style={styles.secondaryButton}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1="19" y1="5" x2="19" y2="19" />
            </svg>
          </button>
        </div>

        {/* Footer Stats */}
        <div style={styles.footer}>
          <div style={styles.statBox}>
            <span style={styles.statValue}>{completedSessions}</span>
            <span style={styles.statLabel}>Completed</span>
          </div>
          <div style={styles.divider} />
          <div style={styles.statBox}>
            <span style={styles.statValue}>{completedSessions * 25}m</span>
            <span style={styles.statLabel}>Total Focus</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  outerContainer: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#090d16',
    backgroundImage: 'radial-gradient(circle at 50% 20%, #1e1b4b 0%, #090d16 80%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    padding: '20px',
    boxSizing: 'border-box',
    color: '#f8fafc',
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '28px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  header: {
    marginBottom: '24px',
    textAlign: 'center',
  },
  titleGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  heading: {
    margin: 0,
    fontSize: '22px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
    color: '#ffffff',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },
  modeTabs: {
    display: 'flex',
    backgroundColor: 'rgba(2, 6, 23, 0.6)',
    padding: '4px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    marginBottom: '32px',
    width: '100%',
    gap: '4px',
  },
  tabButton: {
    flex: 1,
    padding: '10px 12px',
    border: '1px solid transparent',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    outline: 'none',
  },
  timerWrapper: {
    position: 'relative',
    width: '300px',
    height: '300px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '32px',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  timerDisplay: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1,
  },
  timeText: {
    fontSize: '56px',
    fontWeight: '800',
    fontFamily: '"JetBrains Mono", "SF Mono", "Fira Code", "Roboto Mono", monospace',
    letterSpacing: '-2px',
    color: '#ffffff',
    textShadow: '0 0 20px rgba(255, 255, 255, 0.15)',
  },
  labelText: {
    fontSize: '14px',
    color: '#94a3b8',
    marginTop: '4px',
    fontWeight: '500',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '32px',
    width: '100%',
    justifyContent: 'center',
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 36px',
    borderRadius: '18px',
    border: 'none',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'transform 0.15s ease, box-shadow 0.2s ease, background-color 0.3s ease',
    outline: 'none',
  },
  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#94a3b8',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  footer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#f1f5f9',
  },
  statLabel: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '2px',
    fontWeight: '500',
  },
  divider: {
    width: '1px',
    height: '28px',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
};
