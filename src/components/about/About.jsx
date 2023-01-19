import React from "react";
import "./about.css";
import ME from "../../assets/me_white.png";
import { FaAward } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { VscFolderLibrary } from "react-icons/vsc";

const About = () => {
  return (
    <section id="about">
      <h5>Get To Know</h5>
      <h2>About Me</h2>
      <div className="container about_container">
        <div className="about_me">
          <div className="about_me-image">
            <img src={ME} alt="about me" />
          </div>
        </div>

        <div className="about_content">
          <div className="about_card">
            <article>
              <FaAward className="about_icon" />
              <h5>Experience</h5>
              <small>5+ Years Working</small>
            </article>

            <article>
              <FiUsers className="about_icon" />
              <h5>Clients</h5>
              <small>200+ Worldwide</small>
            </article>

            <article>
              <VscFolderLibrary className="about_icon" />
              <h5>Projects</h5>
              <small>20+ Completed</small>
            </article>
          </div>
          <p>
            Building state-of-the-art, easy-to-use, user-friendly websites and
            applications is truly a passion of mine
          </p>

          <a href="#contact" className="btn btn-primary">
            Let's Talk
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
