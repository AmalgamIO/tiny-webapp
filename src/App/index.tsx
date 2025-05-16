import React, {useContext, useEffect, useState} from 'react';
import { Routes, Route, Outlet, Link, useLocation} from 'react-router-dom';
import {Capture} from "~/modules/report-it/Capture";

import {IMap} from "~/util/PromiseTool";
import {FileMeta, ICoords, IMetaData} from "~/component/FileMeta";

import {isLocationPath} from "~/util/PromiseTool";
import CheckboxCategory, {Category} from "~/component/CheckboxCategory";

import cats from "./modules/report-it/categories.json"
import UploadComponent from "~/component/UploadComponent";
import {GlobalContext} from "~/context/GlobalContext";
import SignedFile from "~/component/SignedFile";

import sample_image from '~/assets/GPS_Yes_IMG_0526.jpg';

import {PageLayout} from "~/component/PageLayout";

  //
  // const [categories, setCategories] = useState<Category[]>(cats);
  //
  // const isHere = isLocationPath(useLocation())()
  // const [metaData, setMetaData] = useState<IMetaData & IMap>();
  // const [coordinates, setCoordinates] = useState<ICoords | null>(null);
  //
  // const context = useContext(GlobalContext);
  // const [fileElem, setFileElem] = useState<React.JSX.Element>();

  const App: React.FC = () => {

  const [categories, setCategories] = useState<Category[]>(cats);

  const isHere = isLocationPath(useLocation())()
  const [metaData, setMetaData] = useState<IMetaData & IMap>();
  const [coordinates, setCoordinates] = useState<ICoords | null>(null);

  // const context = useContext(GlobalContext);
  const [fileElem, setFileElem] = useState<React.JSX.Element>();


  // if (!context) {
  //   throw new Error('MyComponent must be used within a MyProvider');
  // }

  const filterer = (list: Category[] | undefined | null): Category[] => list
    ? list.filter(c => c.checked || filterer(c.subCategories).length > 0)
    : []


    // const handleCheckboxChange = (e: React. MouseEvent<HTMLButtonElement>) => {
    const handleCheckboxChange = (category: Category) => {
      // const { checked } = e.target;
      console.log({ category })
      handleCategoryChange(category.id, true);
    };


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


  return (<div id="layout_component"  className="w-full">
      {/* Header Section */}
      <header data-test="layout-header" id="mp-layout-header">
        {/* Placeholder */}
        <div className="container">
          <div className="flex items-center row">
            {/* Logo Section */}
            <div className="flex mx-auto text-center col-12">
              <a href="/">
                <img
                  height="36"
                  src="/static/versions/32581/logo.svg"
                />Report It</a>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content Section */}
      <main id="mainContent" className="container mx-auto">
        {
          categories.map((category, index) => {
            return <div id={"cat_button_" + index} className={"row items-center cat_button cat_button_" + index}>
              {/*<input*/}
              {/*  type="checkbox"*/}
              {/*  checked={category.checked}*/}
              {/*  onChange={handleCheckboxChange}*/}
              {/*  id={category.id}*/}
              {/*/>*/}
              <div className="flex col-12 center">

              <button id={"button_" + category.id} onClick={e => handleCheckboxChange(category)}>{category.name}</button>
              </div>
            </div>
          })
        }



        {/*<Routes>*/}
        {/*  /!*<Route element={<Layout />} >*!/*/}
        {/*  /!*<Route path="/recipe/*" element={<Recipe />} />*!/*/}
        {/*  /!*<Route path="/simple-up/*" element={<UploadComponent />} />*!/*/}
        {/*  /!*<Route path="/report-it/*" element={<Home />} />*!/*/}
        {/*  <Route path="/*" element={<ReportIt />} />*/}
        {/*  /!*</Route>*!/*/}
        {/*</Routes>*/}

      </main>

      {/* Footer Section */}
      <footer>
        <nav className="fixed bottom-0 w-full bg-gray-200">
          <div className="container mx-auto text-center py-2">
            <a className="text-gray-800 font-bold" href="#">Fixed bottom</a>
          </div>
        </nav>
      </footer>
    </div>)
}

const Home = () => (

  <div>
    <h2 className="text-2xl font-semibold mb-4">Home</h2>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
  </div>
);

export default App;

