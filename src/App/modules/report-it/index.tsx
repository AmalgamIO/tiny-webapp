import React, {useContext, useEffect, useState} from 'react';
import { Routes, Route, Outlet, Link, useLocation} from 'react-router-dom';
import {GlobalContext} from "~/context/GlobalContext";
import {IMap} from "~/util/PromiseTool";
import {FileMeta, ICoords, IMetaData} from "~/component/FileMeta";
import SignedFile from "~/component/SignedFile";

import sample_image from '~/assets/GPS_Yes_IMG_0526.jpg';


import {PageLayout} from "~/component/PageLayout";
import {isLocationPath} from "~/util/PromiseTool";
import CheckboxCategory, {Category} from "~/component/CheckboxCategory";
import {Capture} from "~/modules/report-it/Capture";

// const cats = require("./categories.json")
import cats from "./categories.json"

const ReportIt: React.FC = () => {

  const [categories, setCategories] = useState<Category[]>(cats);

  const isHere = isLocationPath(useLocation())()
  const [metaData, setMetaData] = useState<IMetaData & IMap>();
  const [coordinates, setCoordinates] = useState<ICoords | null>(null);

  const context = useContext(GlobalContext);
  const [fileElem, setFileElem] = useState<React.JSX.Element>();


  if (!context) {
    throw new Error('MyComponent must be used within a MyProvider');
  }

  const filterer = (list: Category[] | undefined | null): Category[] => list
    ? list.filter(c => c.checked || filterer(c.subCategories).length > 0)
    : []


  const handleCategoryChange = (id: string, checked: boolean) => {
    const updateCategories = (categories: Category[]): Category[] => {
      return categories.map((category) => {
        if (category.id === id) {
          // If a parent is checked/unchecked, also check/uncheck its sub-categories
          if (category.subCategories) {
            return {
              ...category,
              checked,
              subCategories: category.subCategories.map((sub) => ({
                ...sub,
                checked,
              })),
            };
          }

          return {...category, checked};
        }
        if (category.subCategories) {
          return {
            ...category,
            subCategories: updateCategories(category.subCategories),
          };
        }
        return category;
      });
    };

    setCategories(updateCategories(categories));
  };


  return (<>
    <div>
      {categories.map((category) => (
        <CheckboxCategory
          key={category.id}
          category={category}
          onCategoryChange={handleCategoryChange}
        />
      ))}
    </div>
    <div className={`h-100 w-100`}>
      <div>{ filterer(categories)?.length ? <Capture /> : <></>}</div>
    </div>
  </>);

}


export default ReportIt;
