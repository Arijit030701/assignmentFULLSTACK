import React from 'react';

// Vite dynamically scans and eager-loads every .jsx file inside the /generated folder
const modules = import.meta.glob('./generated/*.jsx', { eager: true });

export function DynamicRenderer() {
    const components = Object.entries(modules).map(([path, module]) => {
        // Grab the exported React component (default or named export)
        const Component = module.default || Object.values(module)[0];
        return { path, Component };
    });

    if (components.length === 0) {
        return <p style={{ color: '#888' }}>No AI features generated yet.</p>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
            {components.map(({ path, Component }) => (
                <div key={path} style={{ border: '1px dashed #555', padding: '15px', borderRadius: '8px' }}>
                    <Component />
                </div>
            ))}
        </div>
    );
}

//it automatically finds and renders every AI-generated component, without you ever having to write an import statement by hand for each new file.