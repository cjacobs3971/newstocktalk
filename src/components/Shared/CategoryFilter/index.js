// src\components\Shared\CategoryFilter\index.js
import React from 'react';

export const CATEGORIES = [  
'Core Stock Info',
'Forex',
'Crypto',
'Commodities',
'Economic Indicators',
'Technical Indicators'];

function CategoryFilter({ selectedCategory, setSelectedCategory }) {
    return (
      <div className="category-filter-container">
        {CATEGORIES.map(category => (
          <button 
            key={category} 
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
          >
            {category}
          </button>
        ))}
      </div>
    );
  }

export default CategoryFilter;
