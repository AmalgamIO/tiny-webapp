import React from 'react';
import {Routes, Route, Link, useLocation} from 'react-router-dom';
import ScanRecipe from "./ScanRecipe";
import {PageLayout} from "~/component/PageLayout";
import {isLocationPath} from "~/util/PromiseTool";

const Recipe: React.FC = () => {

    const isHere = isLocationPath(useLocation())()

    return <>
    <h2>Recipe</h2>
    <ul className="list-inline nav nav nav-tabs">
      <li>
        <Link className={`nav-link ${isHere('import')}`} data-toggle="tab" to="./import">Import</Link>
      </li>
      <li>
        <Link className={`nav-link ${isHere('create')}`} data-toggle="tab" to="./create">Create</Link>
      </li>
      <li>
        <Link className={`nav-link ${isHere('view')}`} data-toggle="tab" to="./view">View</Link>
      </li>
    </ul>

    <Routes>
      <Route>
        <Route element={<PageLayout title={"Recipe"}/>}>
          <Route path="/create" element={<div className={`tab-pane in ${isHere('create')} h-100 w-100`}><h1>Create</h1></div>}/>
          <Route path="/import" element={<ScanRecipe/>} />
          <Route path="/view" element={<div className={`tab-pane in ${isHere('view')} h-100 w-100`}><h1>View</h1></div>}/>
        </Route>
      </Route>
    </Routes>
  </>
}

export default Recipe;