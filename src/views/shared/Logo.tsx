import React from "react";
import "./Logo.css";

const Logo: React.FC = () => (
  <h1 className="Logo">
    <img className="Logo-marca" src="/icons/logo.svg" alt="" />
    <span className="Logo-nome">
      Productivity <span>Tab</span>
    </span>
  </h1>
);

export default Logo;
