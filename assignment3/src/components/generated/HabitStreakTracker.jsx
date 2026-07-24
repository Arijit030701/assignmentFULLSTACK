import React, { useState } from 'react';

export default function HabitStreakTracker() {
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const [habits, setHabits] = useState([
    {
      id: 1,
      name: 'Read 10 Pages',
      emoji: '📚',
      days: [true, true, true, false, true, false, false]
    },
    {
      id: 2,
      name: 'Code for 1 Hour',
      emoji: '💻',
      days: [true, true, true, true, true, false, false]
    },
    {
      id: 3,
      name: 'Drink Water',
      emoji: '💧',
      days: [true, true, true, true, true, true, true]
    }
  ]);

  const [newHabitName, setNewHabitName] = useState('');

  const toggleDay = (habitId, dayIndex) => {
    setHabits(prevHabits =>
      prevHabits.map(habit => {
        if (habit.id === habitId) {
          const newDays = [...habit.days];
          newDays[dayIndex] = !newDays[dayIndex];
          return { ...habit, days: newDays };
        }
        return habit;
      })
    );
  };

  // Calculate max consecutive completed days (streak) for the habit
  const calculateStreak = (days) => {
    let maxStreak = 0;
    let currentStreak = 0;
    for (let i = 0; i < days.length; i++) {
      if (days[i]) {
        currentStreak++;
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
        }
      } else {
        currentStreak = 0;
      }
    }
    return maxStreak;
  };

  const addHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    const newHabit = {
      id: Date.now(),
      name: newHabitName.trim(),
      emoji: '🎯',
      days: [false, false, false, false, false, false, false]
    };
    setHabits([...habits, newHabit]);
    setNewHabitName('');
  };

  const deleteHabit = (id) => {
    if (habits.length <= 1) return;
    setHabits(habits.filter(h => h.id !== id));
  };

  const totalCompletions = habits.reduce((acc, h) => acc + h.days.filter(Boolean).length, 0);
  const totalPossible = habits.length * 7;
  const completionRate = totalPossible > 0 ? Math.round((totalCompletions / totalPossible) * 100) : 0;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#090d16',
      color: '#f3f4f6',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      padding: '40px 16px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      <div style={{ width: '100%', maxWidth: '760px' }}>
        {/* Header Section */}
        <header style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            color: '#10b981',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '12px'
          }}>
            <span>⚡ Daily Habit Tracker</span>
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            margin: '0 0 8px 0',
            letterSpacing: '-0.5px',
            background: 'linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Build Streaks, Stay Consistent
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '15px', margin: 0 }}>
            Click the day buttons to toggle completion and keep your momentum alive.
          </p>
        </header>

        {/* Overview Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div style={{
            backgroundColor: '#131b2e',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #1e293b'
          }}>
            <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>Active Habits</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#f8fafc' }}>{habits.length}</div>
          </div>
          <div style={{
            backgroundColor: '#131b2e',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #1e293b'
          }}>
            <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>Weekly Completion</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>{completionRate}%</div>
          </div>
          <div style={{
            backgroundColor: '#131b2e',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #1e293b'
          }}>
            <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>Completed Check-ins</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#38bdf8' }}>
              {totalCompletions} <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 'normal' }}>/ {totalPossible}</span>
            </div>
          </div>
        </div>

        {/* Main Habit Card Container */}
        <div style={{
          backgroundColor: '#131b2e',
          borderRadius: '24px',
          padding: '28px',
          border: '1px solid #1e293b',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)'
        }}>
          {/* Column Titles for Days */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            paddingBottom: '16px',
            borderBottom: '1px solid #1e293b',
            marginBottom: '20px'
          }}>
            <span style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              Habit Name
            </span>
            <span style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              Weekly Progress
            </span>
          </div>

          {/* Habit Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {habits.map((habit) => {
              const streak = calculateStreak(habit.days);
              const isCompletedAll = habit.days.every(Boolean);

              return (
                <div
                  key={habit.id}
                  style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    border: isCompletedAll ? '1px solid #10b981' : '1px solid #334155',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    transition: 'border-color 0.2s ease'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    {/* Habit Info & Icon */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        fontSize: '22px',
                        backgroundColor: '#0f172a',
                        padding: '8px 12px',
                        borderRadius: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justify: 'center'
                      }}>
                        {habit.emoji}
                      </span>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '16px', color: '#f8fafc' }}>
                          {habit.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                          {habit.days.filter(Boolean).length} of 7 days completed
                        </div>
                      </div>
                    </div>

                    {/* Right Action Bar: Streak Badge & Delete Button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* Current Streak Badge */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: streak > 0 ? 'rgba(245, 158, 11, 0.12)' : '#0f172a',
                        border: `1px solid ${streak > 0 ? 'rgba(245, 158, 11, 0.35)' : '#334155'}`,
                        padding: '6px 14px',
                        borderRadius: '20px'
                      }}>
                        <span style={{ fontSize: '14px' }}>🔥</span>
                        <span style={{
                          fontWeight: '700',
                          fontSize: '13px',
                          color: streak > 0 ? '#f59e0b' : '#64748b'
                        }}>
                          {streak} {streak === 1 ? 'Day' : 'Days'} Streak
                        </span>
                      </div>

                      {/* Delete Option (optional helper) */}
                      {habits.length > 1 && (
                        <button
                          onClick={() => deleteHabit(habit.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#64748b',
                            cursor: 'pointer',
                            fontSize: '16px',
                            padding: '4px 8px',
                            borderRadius: '6px'
                          }}
                          title="Delete Habit"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Days Circles Row */}
                  <div style={{
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    paddingTop: '8px',
                    borderTop: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    {DAYS.map((dayLabel, dayIdx) => {
                      const isDone = habit.days[dayIdx];
                      return (
                        <div
                          key={dayIdx}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                            {dayLabel}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleDay(habit.id, dayIdx)}
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              border: isDone ? 'none' : '2px solid #334155',
                              backgroundColor: isDone ? '#10b981' : '#0f172a',
                              color: isDone ? '#ffffff' : 'transparent',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justify: 'center',
                              fontSize: '14px',
                              fontWeight: '700',
                              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                              boxShadow: isDone ? '0 0 12px rgba(16, 185, 129, 0.45)' : 'none',
                              outline: 'none'
                            }}
                          >
                            ✓
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Habit Inline Form */}
          <form
            onSubmit={addHabit}
            style={{
              marginTop: '24px',
              display: 'flex',
              gap: '12px'
            }}
          >
            <input
              type="text"
              placeholder="Add a new custom habit..."
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              style={{
                flex: '1',
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '12px',
                padding: '12px 18px',
                color: '#f8fafc',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 20px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              + Add Habit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
