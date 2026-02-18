'use client';

import { useState, useEffect } from 'react';
import mealsData from '@/data/meals.json';
import { MealPlan } from '@/lib/types';

export default function MealsTab() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [favorites, setFavorites] = useState<number[]>([]);

  const meals = mealsData as MealPlan[];
  const currentMeal = meals.find((m) => m.day === selectedDay);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('favoriteMealDays');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse favorites', e);
      }
    }
  }, []);

  const toggleFavorite = (day: number) => {
    const newFavorites = favorites.includes(day)
      ? favorites.filter((d) => d !== day)
      : [...favorites, day];
    setFavorites(newFavorites);
    localStorage.setItem('favoriteMealDays', JSON.stringify(newFavorites));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🍽️ 7-Day Meal Plans
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Nutritious and delicious Suhoor and Iftar ideas for Ramadan
        </p>
      </div>

      {/* Day Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {meals.map((meal) => (
            <button
              key={meal.day}
              onClick={() => setSelectedDay(meal.day)}
              className={`relative flex-shrink-0 px-6 py-3 rounded-lg font-semibold transition ${
                selectedDay === meal.day
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Day {meal.day}
              {favorites.includes(meal.day) && (
                <span className="absolute -top-1 -right-1 text-xl">⭐</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {currentMeal && (
        <>
          {/* Favorite Button */}
          <div className="flex justify-end">
            <button
              onClick={() => toggleFavorite(currentMeal.day)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                favorites.includes(currentMeal.day)
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span className="text-xl">{favorites.includes(currentMeal.day) ? '⭐' : '☆'}</span>
              {favorites.includes(currentMeal.day) ? 'Favorited' : 'Add to Favorites'}
            </button>
          </div>

          {/* Suhoor */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                🌅 Suhoor
              </h2>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Prep: {currentMeal.suhoor.prepTime}
              </span>
            </div>

            <h3 className="text-xl font-semibold text-primary-600 dark:text-primary-400 mb-3">
              {currentMeal.suhoor.title}
            </h3>

            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                💡 Focus: {currentMeal.suhoor.focus}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">Menu Items:</h4>
              <ul className="space-y-2">
                {currentMeal.suhoor.items.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                  >
                    <span className="text-primary-500 mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Iftar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                🌙 Iftar
              </h2>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Prep: {currentMeal.iftar.prepTime}
              </span>
            </div>

            <h3 className="text-xl font-semibold text-primary-600 dark:text-primary-400 mb-3">
              {currentMeal.iftar.title}
            </h3>

            <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-green-900 dark:text-green-200">
                💡 Focus: {currentMeal.iftar.focus}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">Menu Items:</h4>
              <ul className="space-y-2">
                {currentMeal.iftar.items.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                  >
                    <span className="text-primary-500 mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Nutrition Tips */}
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              💪 Ramadan Nutrition Tips
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span>💧</span>
                <span>Drink plenty of water between Iftar and Suhoor (aim for 8-10 glasses)</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🥗</span>
                <span>Include fiber-rich foods to maintain energy throughout the day</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🍖</span>
                <span>Eat protein-rich foods at Suhoor to stay full longer</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🍬</span>
                <span>Limit sugary foods to avoid energy crashes</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🕐</span>
                <span>Don&apos;t skip Suhoor - it&apos;s essential for sustained energy</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
