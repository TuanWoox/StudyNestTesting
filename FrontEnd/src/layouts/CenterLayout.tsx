import React from "react";
import { Outlet } from "react-router-dom";

const CenterLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br ">
      <Outlet />
    </div>
  );
};

export default CenterLayout;
