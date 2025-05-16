import React, { useState } from 'react';

export type Category = {
  id: string;
  name: string;
  checked: boolean;
  subCategories?: Category[];
};

export type CheckboxCategoryProps = {
  category: Category;
  onCategoryChange: (id: string, checked: boolean) => void;
};

const CheckboxCategory: React.FC<CheckboxCategoryProps> = ({ category, onCategoryChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    onCategoryChange(category.id, checked);
  };

  const toggleExpand = () => {
    if (category.subCategories && category.subCategories.length > 0) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <div onClick={toggleExpand} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        {category.subCategories && category.subCategories.length > 0 && (
          <span style={{ marginRight: '5px' }}>{isExpanded ? '-' : '+'}</span>
        )}
        <input
          type="checkbox"
          checked={category.checked}
          onChange={handleCheckboxChange}
          id={category.id}
        />
        <label htmlFor={category.id} style={{ marginLeft: '5px' }}>{category.name}</label>
      </div>
      {isExpanded && category.subCategories && (
        <div>
          {category.subCategories.map((subCategory) => (
            <CheckboxCategory
              key={subCategory.id}
              category={subCategory}
              onCategoryChange={onCategoryChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CheckboxCategory;
