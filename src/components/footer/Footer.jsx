import React from "react";
import "./footer.css";
import { FaFacebookF } from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";
import { BsLinkedin, BsGithub } from "react-icons/bs";

const Footer = () => {
  return (
    <footer>
      <a href="#top" className="footer_logo">
        SUZE
      </a>

      <ul className="permalinks">
        <li>
          <a href="#top">Home</a>
        </li>
        <li>
          <a href="#about">About</a>
        </li>
        <li>
          <a href="#experience">Experience</a>
        </li>
        <li>
          <a href="#services">Services</a>
        </li>
        <li>
          <a href="#portfolio">Portfolio</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
      </ul>

      <div className="footer_socials">
        <a href="https://www.facebook.com/bearksz/" >
          <FaFacebookF />
        </a>
        <a href="https://www.instagram.com/suze_kangkang/">
          <FiInstagram />
        </a>
        <a href="https://www.linkedin.com/in/suze-kang-101587260/">
          <BsLinkedin />
        </a>
        <a href="https://github.com/SuzeK-KLF">
          <BsGithub />
        </a>
      </div>

      <div className="footer_copyright">
        <small> &copy; SUZE Kang. All rights reserved </small>
      </div>
    </footer>
  );
};

export default Footer;
