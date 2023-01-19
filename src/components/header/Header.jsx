import React from "react";
import "./header.css";
import CTA from "./CTA";
import MEB from "../../assets/me-black-remove3.png";
import MEW from "../../assets/me_white.png";
import HeaderSocials from "./HeaderSocials";
import { BsArrowRightShort } from "react-icons/bs";

const Header = () => {
  return (
    <header>
      <div className="container header_container">
        <h5>Hello I'm</h5>
        <h1>Suze Kang</h1>
        <h5 className="text-light">Fullstack Developer</h5>
        <CTA />
        <HeaderSocials />

        <div className="me">
          <img src={MEB} alt="me" />
        </div>

        <a href="#contact" className="scroll_down">
          <span>Scroll Down</span>
          <BsArrowRightShort size="2.2rem" />
        </a>
      </div>
    </header>
  );
};

export default Header;
