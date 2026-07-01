import React, { useState } from 'react';
import type { Drill } from '../types';

/**
 * DrillLibrary Component
 * Displays a library of reusable drill templates with drag-and-drop functionality
 * 
 * Requirements: 18.5, 18.6
 */

// Sample drill library - in a real app, this would come from a database
const DRILL_LIBRARY: Drill[] = [
  {
    id: 'drill-001',
    name: 'Grip Practice',
    description: 'Practice correct grip technique for forehand and backhand strokes',
    category: 'Fundamentals'
  },
  {
    id: 'drill-002',
    name: 'Court Movement Patterns',
    description: 'Basic footwork patterns covering all six court positions',
    category: 'Footwork'
  },
  {
    id: 'drill-003',
    name: 'Shadow Practice',
    description: 'Movement without shuttle focusing on footwork and body positioning',
    category: 'Footwork'
  },
  {
    id: 'drill-004',
    name: 'High Clear Practice',
    description: 'Repetitive forehand clear shots to baseline with focus on technique',
    category: 'Stroke Practice'
  },
  {
    id: 'drill-005',
    name: 'Drop Shot Accuracy',
    description: 'Forehand drop shots targeting net area with controlled power',
    category: 'Stroke Practice'
  },
  {
    id: 'drill-006',
    name: 'Clear to Drop Combination',
    description: 'Alternating between clear and drop shots to develop versatility',
    category: 'Combination Drills'
  },
  {
    id: 'drill-007',
    name: 'Backhand Clear Drills',
    description: 'Developing power and accuracy in backhand overhead clear',
    category: 'Stroke Practice'
  },
  {
    id: 'drill-008',
    name: 'Net Shot Practice',
    description: 'Forehand and backhand net shots with soft touch and precision',
    category: 'Net Play'
  },
  {
    id: 'drill-009',
    name: 'Net Rush Drills',
    description: 'Quick movement to net and recovery with proper technique',
    category: 'Footwork'
  },
  {
    id: 'drill-010',
    name: 'High Service Practice',
    description: 'Consistent high service to backcourt with proper form',
    category: 'Service'
  },
  {
    id: 'drill-011',
    name: 'Low Service Precision',
    description: 'Short service landing just over net with minimal height',
    category: 'Service'
  },
  {
    id: 'drill-012',
    name: 'Return Positioning',
    description: 'Proper stance and return technique for various service types',
    category: 'Return'
  },
  {
    id: 'drill-013',
    name: 'Smash Power Development',
    description: 'Building explosive power in smash with proper body rotation',
    category: 'Stroke Practice'
  },
  {
    id: 'drill-014',
    name: 'Defensive Lift Practice',
    description: 'Returning smashes with controlled lifts to backcourt',
    category: 'Defense'
  },
  {
    id: 'drill-015',
    name: 'Block and Counter',
    description: 'Blocking smashes and transitioning to counter-attack',
    category: 'Defense'
  },
  {
    id: 'drill-016',
    name: 'Sustained Rally Practice',
    description: 'Maintaining rallies with focus on consistency and placement',
    category: 'Rally'
  },
  {
    id: 'drill-017',
    name: 'Shot Variation Drills',
    description: 'Mixing clears, drops, and drives to develop unpredictability',
    category: 'Combination Drills'
  },
  {
    id: 'drill-018',
    name: 'Tempo Change Practice',
    description: 'Controlling rally speed from slow build-up to fast exchanges',
    category: 'Rally'
  },
  {
    id: 'drill-019',
    name: 'Controlled Match Play',
    description: 'Practice matches with specific tactical objectives',
    category: 'Match Practice'
  },
  {
    id: 'drill-020',
    name: 'Pressure Situations',
    description: 'Playing critical points with emphasis on mental composure',
    category: 'Match Practice'
  }
];

const CATEGORIES = Array.from(new Set(DRILL_LIBRARY.map((d) => d.category)));

const DrillLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleDragStart = (e: React.DragEvent, drill: Drill) => {
    e.dataTransfer.setData('drill', JSON.stringify(drill));
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Filter drills based on search and category
  const filteredDrills = DRILL_LIBRARY.filter((drill) => {
    const matchesSearch =
      drill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drill.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || drill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 h-fit sticky top-6">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
          Drill Library
        </h2>

        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search drills..."
          className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
        />

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full mt-2 px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Drill List */}
      <div className="p-4 max-h-[600px] overflow-y-auto">
        {filteredDrills.length === 0 ? (
          <div className="text-center text-slate-500 dark:text-slate-400 py-8">
            No drills found
          </div>
        ) : (
          <div className="space-y-2">
            {filteredDrills.map((drill) => (
              <div
                key={drill.id}
                draggable
                onDragStart={(e) => handleDragStart(e, drill)}
                className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 cursor-move hover:border-primary hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    {drill.name}
                  </h4>
                  <svg
                    className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  {drill.description}
                </p>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700">
                  {drill.category}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
          💡 Drag drills to weekly planners
        </p>
      </div>
    </div>
  );
};

export default DrillLibrary;
