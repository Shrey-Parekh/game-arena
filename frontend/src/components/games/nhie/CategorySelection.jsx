import { useState } from 'react'
import { motion } from 'framer-motion'

const categories = [
  {
    id: 'pg',
    name: 'PG',
    icon: '😊',
    description: 'Family-friendly and light-hearted',
    color: 'bg-green-500'
  },
  {
    id: 'funny',
    name: 'Funny',
    icon: '😂',
    description: 'Hilarious and embarrassing moments',
    color: 'bg-yellow-500'
  },
  {
    id: 'deep',
    name: 'Deep',
    icon: '🤔',
    description: 'Thought-provoking and personal',
    color: 'bg-purple-500'
  },
  {
    id: 'adult',
    name: 'Adult',
    icon: '🔞',
    description: 'Mature and spicy content',
    color: 'bg-red-500'
  }
]

function CategorySelection({ onStart }) {
  const [selectedCategories, setSelectedCategories] = useState(['pg', 'funny', 'deep', 'adult'])

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        // Don't allow deselecting if it's the last one
        if (prev.length === 1) return prev
        return prev.filter(id => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const toggleAll = () => {
    if (selectedCategories.length === categories.length) {
      // Keep at least one selected
      setSelectedCategories(['pg'])
    } else {
      setSelectedCategories(categories.map(c => c.id))
    }
  }

  const [isStarting, setIsStarting] = useState(false)

  const handleStart = () => {
    if (selectedCategories.length > 0) {
      console.log('🎯 CategorySelection: Starting game with categories:', selectedCategories)
      setIsStarting(true)
      onStart(selectedCategories)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🤫</div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Never Have I Ever
          </h1>
          <p className="text-lg text-slate-600">
            Select the categories you want to play with
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Categories
            </h2>
            <button
              onClick={toggleAll}
              className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
            >
              {selectedCategories.length === categories.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category.id)
              
              return (
                <motion.button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative p-6 rounded-xl border-2 transition-all text-left
                    ${isSelected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className={`
                      w-12 h-12 rounded-lg flex items-center justify-center text-2xl
                      ${isSelected ? category.color : 'bg-slate-100'}
                    `}>
                      {category.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-slate-800">
                          {category.name}
                        </h3>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 text-center">
              <span className="font-semibold">{selectedCategories.length}</span> {selectedCategories.length === 1 ? 'category' : 'categories'} selected
            </p>
          </div>
        </div>

        <motion.button
          onClick={handleStart}
          disabled={selectedCategories.length === 0 || isStarting}
          whileHover={{ scale: isStarting ? 1 : 1.02 }}
          whileTap={{ scale: isStarting ? 1 : 0.98 }}
          className={`
            w-full py-4 rounded-xl font-semibold text-lg transition-all
            ${selectedCategories.length > 0 && !isStarting
              ? 'bg-primary text-white hover:bg-primary-dark shadow-lg'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }
          `}
        >
          {isStarting ? 'Starting Game...' : 'Start Game'}
        </motion.button>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            🎮 Best of 3 rounds • 5 lives each • 20 seconds per question
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default CategorySelection
