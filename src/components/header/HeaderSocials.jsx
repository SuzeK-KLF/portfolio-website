import React from "react";
import { BsLinkedin, BsGithub,BsDribbble, BsInstagram } from "react-icons/bs";

const HeaderSocials = () => {
  return (
    <div className="header_socials">
      <a href="https://www.linkedin.com/in/suze-kang-101587260/">
        <BsLinkedin />
      </a>
      <a href="https://github.com/SuzeK-KLF">
        <BsGithub />
      </a>
      <a href="https://www.instagram.com/suze_kangkang/">
        <BsInstagram/>
      </a>
    </div>
  );
};

export default HeaderSocials;
