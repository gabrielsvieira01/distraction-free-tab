import React from "react";
import "./Logo.css";

const Logo: React.FC = () => (
  <h1 className="Logo">
    <img className="Logo-marca" src="/icons/logo.svg" alt="" />
    <span className="Logo-nome">
      Distraction-Free <span>Tab</span>
    </span>
  </h1>
);

export default Logo;
