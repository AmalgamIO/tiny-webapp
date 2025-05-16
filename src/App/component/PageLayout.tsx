import React from "react";
import {Outlet} from "react-router-dom";

export type IPageLayout = {
  title?: string;
  bodyClass?: string;
}
export const PageLayout: React.FC<IPageLayout> = ({ title, bodyClass="tab-content"}) => {

  return (
    <div className={`p-0 m-0 w-100 ${bodyClass}`}>
        <Outlet />
    </div>
  )
}

