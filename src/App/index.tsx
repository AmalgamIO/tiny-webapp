import React, { useState } from 'react';
import categories from './modules/report-it/categories.json';
import PhotoCapture from './modules/report-it/Capture';

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {!showCamera ? (
        <div className="flex flex-col items-center w-full">
          <h1 className="text-3xl font-bold text-center mb-8">Report an Issue</h1>
          <ul>
            {categories.map((category) => (
            <li key={'li_' + category.id}>
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.name);
                  setShowCamera(true);
                }}
                className="w-full py-3 px-4 bg-blue-500 text-red rounded hover:bg-blue-600 transition"
              >
                {category.name}
              </button>
            </li>
            ))}
          </ul>
        </div>
      ) : (
        <PhotoCapture
          category={selectedCategory}
          onBack={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

export default App;