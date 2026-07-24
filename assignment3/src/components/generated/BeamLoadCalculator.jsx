import React, { useState } from 'react';

export default function BeamLoadCalculator() {
  const [length, setLength] = useState('6.0');
  const [load, setLoad] = useState('15.0');
  
  const [results, setResults] = useState({
    maxMoment: 67.5,
    maxShear: 45.0,
    totalLoad: 90.0,
    lengthVal: 6.0,
    loadVal: 15.0,
    hasCalculated: true
  });

  const [error, setError] = useState('');

  const handleCalculate = () => {
    const l = parseFloat(length);
    const w = parseFloat(load);

    if (isNaN(l) || l <= 0) {
      setError('Please enter a valid beam length greater than 0.');
      return;
    }
    if (isNaN(w) || w < 0) {
      setError('Please enter a valid non-negative load value.');
      return;
    }

    setError('');
    const maxMoment = (w * Math.pow(l, 2)) / 8;
    const maxShear = (w * l) / 2;
    const totalLoad = w * l;

    setResults({
      maxMoment,
      maxShear,
      totalLoad,
      lengthVal: l,
      loadVal: w,
      hasCalculated: true
    });
  };

  const applyPreset = (lVal, wVal) => {
    setLength(lVal.toString());
    setLoad(wVal.toString());
    setError('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.badge}>CIVIL & STRUCTURAL TOOL</div>
          <h1 style={styles.title}>Simply Supported Beam Calculator</h1>
          <p style={styles.subtitle}>
            Calculate maximum bending moment and shear force under Uniformly Distributed Load (UDL).
          </p>
        </div>

        {/* Presets */}
        <div style={styles.presetContainer}>
          <span style={styles.presetLabel}>Quick Presets:</span>
          <button style={styles.presetBtn} onClick={() => applyPreset(4, 10)}>4m @ 10 kN/m</button>
          <button style={styles.presetBtn} onClick={() => applyPreset(6, 15)}>6m @ 15 kN/m</button>
          <button style={styles.presetBtn} onClick={() => applyPreset(10, 25)}>10m @ 25 kN/m</button>
        </div>

        {/* Diagram Section */}
        <div style={styles.diagramCard}>
          <div style={styles.diagramHeader}>Structural Diagram</div>
          <svg viewBox="0 0 500 130" style={styles.svg}>
            {/* Dimension Line & Text */}
            <line x1="60" y1="115" x2="440" y2="115" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="60" y1="110" x2="60" y2="120" stroke="#64748b" strokeWidth="1.5" />
            <line x1="440" y1="110" x2="440" y2="120" stroke="#64748b" strokeWidth="1.5" />
            <text x="250" y="112" fill="#94a3b8" fontSize="12" textAnchor="middle" fontFamily="monospace">
              L = {length || '0'} m
            </text>

            {/* UDL Background Box & Arrows */}
            <rect x="60" y="30" width="380" height="30" fill="rgba(56, 189, 248, 0.08)" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" rx="2" />
            <text x="250" y="22" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
              w = {load || '0'} kN/m
            </text>
            
            {/* Arrow pattern for UDL */}
            {[70, 115, 160, 205, 250, 295, 340, 385, 430].map((x, i) => (
              <g key={i}>
                <line x1={x} y1="30" x2={x} y2="58" stroke="#38bdf8" strokeWidth="1.5" />
                <polygon points={`${x-3},53 ${x+3},53 ${x},60`} fill="#38bdf8" />
              </g>
            ))}

            {/* Beam Body */}
            <rect x="60" y="60" width="380" height="12" fill="#475569" rx="2" stroke="#94a3b8" strokeWidth="1.5" />

            {/* Left Support (Pin) */}
            <polygon points="60,72 48,92 72,92" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
            <line x1="42" y1="92" x2="78" y2="92" stroke="#94a3b8" strokeWidth="2" />

            {/* Right Support (Roller) */}
            <polygon points="440,72 428,88 452,88" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
            <circle cx="434" cy="92" r="3" fill="#f59e0b" />
            <circle cx="446" cy="92" r="3" fill="#f59e0b" />
            <line x1="422" y1="96" x2="458" y2="96" stroke="#94a3b8" strokeWidth="2" />
          </svg>
        </div>

        {/* Main Section: Form Controls & Output */}
        <div style={styles.grid}>
          {/* Inputs Panel */}
          <div style={styles.inputSection}>
            <h2 style={styles.sectionTitle}>Input Parameters</h2>
            
            {error && <div style={styles.errorBox}>{error}</div>}

            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                Beam Length (L)
                <span style={styles.unitBadge}>meters</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="e.g. 6.0"
                style={styles.input}
              />
              <input
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={parseFloat(length) || 1}
                onChange={(e) => setLength(e.target.value)}
                style={styles.slider}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                Uniform Distributed Load (w)
                <span style={styles.unitBadge}>kN/m</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={load}
                onChange={(e) => setLoad(e.target.value)}
                placeholder="e.g. 15.0"
                style={styles.input}
              />
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={parseFloat(load) || 0}
                onChange={(e) => setLoad(e.target.value)}
                style={styles.slider}
              />
            </div>

            <button onClick={handleCalculate} style={styles.calcBtn}>
              Calculate Load Parameters
            </button>
          </div>

          {/* Results Panel */}
          <div style={styles.resultSection}>
            <h2 style={styles.sectionTitle}>Calculation Results</h2>
            
            {/* Primary Result Box */}
            <div style={styles.primaryResultCard}>
              <span style={styles.resultLabel}>MAXIMUM BENDING MOMENT (M<sub>max</sub>)</span>
              <div style={styles.primaryValue}>
                {results.maxMoment.toFixed(2)} <span style={styles.primaryUnit}>kN·m</span>
              </div>
              <div style={styles.locationTag}>
                Occurs at mid-span (x = {(results.lengthVal / 2).toFixed(2)} m)
              </div>
            </div>

            {/* Secondary Results Grid */}
            <div style={styles.secondaryGrid}>
              <div style={styles.secondaryCard}>
                <span style={styles.secLabel}>Max Shear Force (V<sub>max</sub>)</span>
                <div style={styles.secValue}>
                  {results.maxShear.toFixed(2)} <span style={styles.secUnit}>kN</span>
                </div>
                <span style={styles.secDesc}>At beam supports</span>
              </div>

              <div style={styles.secondaryCard}>
                <span style={styles.secLabel}>Total Applied Load</span>
                <div style={styles.secValue}>
                  {results.totalLoad.toFixed(2)} <span style={styles.secUnit}>kN</span>
                </div>
                <span style={styles.secDesc}>w × L total weight</span>
              </div>
            </div>

            {/* Formula Breakdown Card */}
            <div style={styles.formulaCard}>
              <div style={styles.formulaTitle}>Applied Formula & Substitution</div>
              <div style={styles.formulaText}>
                M<sub>max</sub> = (w · L²) / 8
              </div>
              <div style={styles.formulaSub}>
                = ({results.loadVal} kN/m × ({results.lengthVal} m)²) / 8
              </div>
              <div style={styles.formulaSub}>
                = ({results.loadVal} × {(results.lengthVal ** 2).toFixed(2)}) / 8 = <strong>{results.maxMoment.toFixed(2)} kN·m</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#090d16',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#f8fafc'
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: '16px',
    border: '1px solid #1e293b',
    width: '100%',
    maxWidth: '900px',
    padding: '32px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)'
  },
  header: {
    marginBottom: '20px',
    borderBottom: '1px solid #1e293b',
    paddingBottom: '20px'
  },
  badge: {
    display: 'inline-block',
    backgroundColor: '#0284c7',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1px',
    padding: '4px 8px',
    borderRadius: '4px',
    marginBottom: '8px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    margin: '0 0 8px 0',
    color: '#f8fafc',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#94a3b8',
    margin: '0'
  },
  presetContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  presetLabel: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600'
  },
  presetBtn: {
    backgroundColor: '#1e293b',
    color: '#38bdf8',
    border: '1px solid #334155',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  diagramCard: {
    backgroundColor: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '28px',
    textAlign: 'center'
  },
  diagramHeader: {
    fontSize: '11px',
    textTransform: 'uppercase',
    color: '#64748b',
    fontWeight: '700',
    letterSpacing: '0.5px',
    marginBottom: '8px',
    textAlign: 'left'
  },
  svg: {
    width: '100%',
    maxHeight: '140px',
    overflow: 'visible'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '28px'
  },
  inputSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  resultSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#e2e8f0',
    margin: '0 0 4px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#cbd5e1',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  unitBadge: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '400'
  },
  input: {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#f8fafc',
    fontSize: '16px',
    fontWeight: '600',
    outline: 'none'
  },
  slider: {
    accentColor: '#0284c7',
    cursor: 'pointer',
    marginTop: '4px'
  },
  calcBtn: {
    backgroundColor: '#0284c7',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '14px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '8px',
    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid #ef4444',
    color: '#fca5a5',
    padding: '10px 12px',
    borderRadius: '6px',
    fontSize: '13px'
  },
  primaryResultCard: {
    backgroundColor: '#0284c7',
    backgroundImage: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 10px 15px -3px rgba(2, 132, 199, 0.4)'
  },
  resultLabel: {
    fontSize: '12px',
    fontWeight: '800',
    color: '#bae6fd',
    letterSpacing: '0.5px'
  },
  primaryValue: {
    fontSize: '36px',
    fontWeight: '900',
    color: '#ffffff',
    margin: '8px 0 4px 0',
    fontFamily: 'monospace'
  },
  primaryUnit: {
    fontSize: '20px',
    fontWeight: '600'
  },
  locationTag: {
    fontSize: '12px',
    color: '#e0f2fe',
    opacity: '0.9'
  },
  secondaryGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
  },
  secondaryCard: {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '10px',
    padding: '14px'
  },
  secLabel: {
    fontSize: '12px',
    color: '#94a3b8',
    display: 'block',
    marginBottom: '4px'
  },
  secValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#f8fafc',
    fontFamily: 'monospace'
  },
  secUnit: {
    fontSize: '13px',
    color: '#94a3b8',
    fontWeight: '400'
  },
  secDesc: {
    fontSize: '11px',
    color: '#64748b',
    marginTop: '2px',
    display: 'block'
  },
  formulaCard: {
    backgroundColor: '#0f172a',
    border: '1px stroke #1e293b',
    borderRadius: '10px',
    padding: '14px',
    fontFamily: 'monospace'
  },
  formulaTitle: {
    fontSize: '11px',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: '6px'
  },
  formulaText: {
    fontSize: '14px',
    color: '#38bdf8',
    fontWeight: '700'
  },
  formulaSub: {
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '4px'
  }
};
