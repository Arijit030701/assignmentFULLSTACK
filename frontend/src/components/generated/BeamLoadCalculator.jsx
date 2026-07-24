import React, { useState } from 'react';

export default function BeamLoadCalculator() {
  const [length, setLength] = useState(6);
  const [udl, setUdl] = useState(12);
  const [results, setResults] = useState({
    moment: (12 * Math.pow(6, 2)) / 8,
    shear: (12 * 6) / 2,
    length: 6,
    udl: 12
  });

  const handleCalculate = (e) => {
    if (e) e.preventDefault();
    const L = Math.max(0, parseFloat(length) || 0);
    const W = Math.max(0, parseFloat(udl) || 0);
    const moment = (W * Math.pow(L, 2)) / 8;
    const shear = (W * L) / 2;
    setResults({
      moment,
      shear,
      length: L,
      udl: W
    });
  };

  const setPreset = (presetLength, presetUdl) => {
    setLength(presetLength);
    setUdl(presetUdl);
    const L = presetLength;
    const W = presetUdl;
    setResults({
      moment: (W * Math.pow(L, 2)) / 8,
      shear: (W * L) / 2,
      length: L,
      udl: W
    });
  };

  return (
    <div style={styles.container}>
      {/* Main Card */}
      <div style={styles.card}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerBadge}>STRUCTURAL ANALYSIS</div>
          <h1 style={styles.title}>Beam Bending Moment Calculator</h1>
          <p style={styles.subtitle}>
            Simply Supported Beam • Uniformly Distributed Load (UDL)
          </p>
        </header>

        {/* Interactive Diagram Section */}
        <div style={styles.diagramContainer}>
          <div style={styles.diagramHeader}>
            <span style={styles.diagramTitle}>Visual Model</span>
            <span style={styles.diagramDetails}>L = {results.length}m | w = {results.udl} kN/m</span>
          </div>
          
          <svg viewBox="0 0 500 160" style={styles.svg}>
            <defs>
              <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#38bdf8" />
              </marker>
              <linearGradient id="momentGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Load Arrows Grid */}
            {[...Array(9)].map((_, i) => {
              const x = 70 + i * 45;
              return (
                <g key={i}>
                  <line x1={x} y1="25" x2={x} y2="52" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrowhead)" />
                </g>
              );
            })}
            {/* Top Load Line */}
            <line x1="70" y1="25" x2="430" y2="25" stroke="#38bdf8" strokeWidth="2" />
            <text x="250" y="18" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="600">
              w = {results.udl} kN/m
            </text>

            {/* Beam Body */}
            <rect x="60" y="55" width="380" height="12" rx="2" fill="#64748b" stroke="#94a3b8" strokeWidth="1" />

            {/* Left Support (Pin) */}
            <polygon points="60,67 50,87 70,87" fill="#f59e0b" />
            <line x1="42" y1="87" x2="78" y2="87" stroke="#f59e0b" strokeWidth="2" />
            
            {/* Right Support (Roller) */}
            <polygon points="440,67 430,82 450,82" fill="#f59e0b" />
            <circle cx="435" cy="85" r="2.5" fill="#f59e0b" />
            <circle cx="445" cy="85" r="2.5" fill="#f59e0b" />
            <line x1="422" y1="88" x2="458" y2="88" stroke="#f59e0b" strokeWidth="2" />

            {/* Dimension Line */}
            <line x1="60" y1="105" x2="440" y2="105" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="60" y1="98" x2="60" y2="112" stroke="#64748b" strokeWidth="1" />
            <line x1="440" y1="98" x2="440" y2="112" stroke="#64748b" strokeWidth="1" />
            <text x="250" y="120" textAnchor="middle" fill="#94a3b8" fontSize="11">
              L = {results.length} meters
            </text>

            {/* Parabolic Moment Diagram Overlay */}
            {results.moment > 0 && (
              <g>
                <path d="M 60 67 Q 250 145 440 67 Z" fill="url(#momentGrad)" />
                <path d="M 60 67 Q 250 145 440 67" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="250" y="105" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">
                  Mmax
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Main Content Area */}
        <div style={styles.grid}>
          {/* Form / Inputs Column */}
          <div style={styles.formColumn}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Input Parameters</h2>
              <span style={styles.sectionSub}>Set beam characteristics</span>
            </div>

            <form onSubmit={handleCalculate} style={styles.form}>
              {/* Beam Length Input */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Beam Length (L)
                  <span style={styles.unitBadge}>meters</span>
                </label>
                <div style={styles.inputWrapper}>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    style={styles.input}
                    placeholder="e.g. 6"
                  />
                  <span style={styles.inputAffix}>m</span>
                </div>
              </div>

              {/* UDL Input */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Distributed Load (w)
                  <span style={styles.unitBadge}>kN/m</span>
                </label>
                <div style={styles.inputWrapper}>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={udl}
                    onChange={(e) => setUdl(e.target.value)}
                    style={styles.input}
                    placeholder="e.g. 12"
                  />
                  <span style={styles.inputAffix}>kN/m</span>
                </div>
              </div>

              {/* Action Button */}
              <button type="submit" style={styles.calculateBtn}>
                Calculate Loading
              </button>
            </form>

            {/* Quick Presets */}
            <div style={styles.presetsContainer}>
              <span style={styles.presetsLabel}>Presets:</span>
              <button style={styles.presetBtn} onClick={() => setPreset(4, 8)}>
                4m / 8 kN/m
              </button>
              <button style={styles.presetBtn} onClick={() => setPreset(6, 15)}>
                6m / 15 kN/m
              </button>
              <button style={styles.presetBtn} onClick={() => setPreset(10, 25)}>
                10m / 25 kN/m
              </button>
            </div>
          </div>

          {/* Results Column */}
          <div style={styles.resultsColumn}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Calculation Results</h2>
              <span style={styles.sectionSub}>Derived structural values</span>
            </div>

            {/* Highlight Max Moment Result */}
            <div style={styles.primaryResultCard}>
              <span style={styles.primaryResultLabel}>MAXIMUM BENDING MOMENT (M<sub>max</sub>)</span>
              <div style={styles.primaryResultValueRow}>
                <span style={styles.primaryResultValue}>
                  {results.moment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span style={styles.primaryResultUnit}>kN·m</span>
              </div>
              <div style={styles.formulaBox}>
                <span style={styles.formulaText}>Formula: M<sub>max</sub> = (w · L²) / 8</span>
              </div>
            </div>

            {/* Secondary Results Grid */}
            <div style={styles.secondaryResultsGrid}>
              {/* Shear Force */}
              <div style={styles.secondaryCard}>
                <span style={styles.secondaryLabel}>Max Shear Force (V<sub>max</sub>)</span>
                <div style={styles.secondaryValueRow}>
                  <span style={styles.secondaryValue}>
                    {results.shear.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span style={styles.secondaryUnit}>kN</span>
                </div>
                <span style={styles.secondaryFormula}>V<sub>max</sub> = (w · L) / 2</span>
              </div>

              {/* Total Applied Load */}
              <div style={styles.secondaryCard}>
                <span style={styles.secondaryLabel}>Total Applied Load (W)</span>
                <div style={styles.secondaryValueRow}>
                  <span style={styles.secondaryValue}>
                    {(results.udl * results.length).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span style={styles.secondaryUnit}>kN</span>
                </div>
                <span style={styles.secondaryFormula}>W = w · L</span>
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
    color: '#f8fafc',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  card: {
    backgroundColor: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '16px',
    padding: '32px',
    width: '100%',
    maxWidth: '900px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
  header: {
    marginBottom: '24px',
  },
  headerBadge: {
    display: 'inline-block',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '1.2px',
    color: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    padding: '4px 8px',
    borderRadius: '4px',
    marginBottom: '8px',
    border: '1px solid rgba(56, 189, 248, 0.2)',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#f8fafc',
    margin: '0 0 4px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#94a3b8',
    margin: 0,
  },
  diagramContainer: {
    backgroundColor: '#0b1120',
    border: '1px solid #1e293b',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '28px',
  },
  diagramHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  diagramTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  diagramDetails: {
    fontSize: '12px',
    color: '#38bdf8',
    fontFamily: 'monospace',
  },
  svg: {
    width: '100%',
    height: 'auto',
    maxHeight: '160px',
    display: 'block',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '28px',
  },
  formColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  resultsColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionHeader: {
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#f1f5f9',
    margin: '0 0 2px 0',
  },
  sectionSub: {
    fontSize: '12px',
    color: '#64748b',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#cbd5e1',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unitBadge: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: 'normal',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#0b1120',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '10px 40px 10px 12px',
    color: '#f8fafc',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  inputAffix: {
    position: 'absolute',
    right: '12px',
    color: '#64748b',
    fontSize: '13px',
    pointerEvents: 'none',
  },
  calculateBtn: {
    marginTop: '8px',
    backgroundColor: '#0284c7',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  presetsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '16px',
    flexWrap: 'wrap',
  },
  presetsLabel: {
    fontSize: '12px',
    color: '#64748b',
  },
  presetBtn: {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    color: '#94a3b8',
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: '11px',
    cursor: 'pointer',
  },
  primaryResultCard: {
    backgroundColor: 'rgba(56, 189, 248, 0.05)',
    border: '1px solid rgba(56, 189, 248, 0.3)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    position: 'relative',
    overflow: 'hidden',
  },
  primaryResultLabel: {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.8px',
    color: '#38bdf8',
    display: 'block',
    marginBottom: '8px',
  },
  primaryResultValueRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    marginBottom: '12px',
  },
  primaryResultValue: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '-0.5px',
  },
  primaryResultUnit: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#38bdf8',
  },
  formulaBox: {
    backgroundColor: '#0b1120',
    padding: '6px 10px',
    borderRadius: '6px',
    display: 'inline-block',
  },
  formulaText: {
    fontSize: '12px',
    color: '#94a3b8',
    fontFamily: 'monospace',
  },
  secondaryResultsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  secondaryCard: {
    backgroundColor: '#0b1120',
    border: '1px solid #1e293b',
    borderRadius: '8px',
    padding: '12px',
  },
  secondaryLabel: {
    fontSize: '11px',
    color: '#94a3b8',
    display: 'block',
    marginBottom: '4px',
  },
  secondaryValueRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
    marginBottom: '4px',
  },
  secondaryValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#f1f5f9',
  },
  secondaryUnit: {
    fontSize: '12px',
    color: '#64748b',
  },
  secondaryFormula: {
    fontSize: '10px',
    color: '#475569',
    fontFamily: 'monospace',
  },
};
