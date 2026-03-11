import React, { useState } from 'react';
import '../styles/ClassroomSidebar.css';

export default function ClassroomSidebar({ hierarchy, progress, currentItem, onSelect }) {
    const [expandedModules, setExpandedModules] = useState(new Set([0]));

    const toggleModule = (index) => {
        const newExpanded = new Set(expandedModules);
        if (newExpanded.has(index)) newExpanded.delete(index);
        else newExpanded.add(index);
        setExpandedModules(newExpanded);
    };

    const getItemStatus = (itemId) => {
        return progress?.contentProgress?.[itemId]?.status || 'NOT_STARTED';
    };

    return (
        <div className="classroom-sidebar-content">
            <h2 className="sidebar-title">Course Content</h2>
            <div className="modules-list">
                {hierarchy?.map((module, mIdx) => (
                    <div key={module._id} className="sidebar-module">
                        <div className="module-header" onClick={() => toggleModule(mIdx)}>
                            <span className="module-toggle-icon">
                                {expandedModules.has(mIdx) ? '▼' : '▶'}
                            </span>
                            <span className="module-title">{module.title}</span>
                        </div>
                        
                        {expandedModules.has(mIdx) && (
                            <div className="module-sections">
                                {module.sections?.map((section) => (
                                    <div key={section._id} className="sidebar-section">
                                        <h4 className="section-title">{section.title}</h4>
                                        <ul className="content-items">
                                            {section.contentItems?.map((item) => {
                                                const status = getItemStatus(item._id);
                                                const isActive = currentItem?._id === item._id;
                                                return (
                                                    <li 
                                                        key={item._id} 
                                                        className={`content-item ${isActive ? 'active' : ''} ${status.toLowerCase()}`}
                                                        onClick={() => onSelect(item)}
                                                    >
                                                        <span className="item-icon">
                                                            {item.type === 'video' ? '▶' : item.type === 'pdf' ? '📖' : '📄'}
                                                        </span>
                                                        <span className="item-title">{item.title}</span>
                                                        {status === 'COMPLETED' && <span className="check-icon">✓</span>}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
