import React from "react";
import "./services.css";
import { BiCheck } from "react-icons/bi";

const Services = () => {
  return (
    <section id="services">
      <h5>What I Offer</h5>
      <h2>Services</h2>

      <div className="container services_container">
        <article className="service">
          <div className="service_head">
            <h3>UI/UX Design</h3>
          </div>
          <ul className="service_list">
            <li>
              <BiCheck className="service_list-icon" />
              <p>
                Conduct user research and usability testing to understand user
                needs and improve user experience.
              </p>
            </li>
            <li>
              <BiCheck className="service_list-icon" />
              <p>
                Create wireframes, prototypes, and high-fidelity mockups to
                visually communicate design concepts.
              </p>
            </li>
            <li>
              <BiCheck className="service_list-icon" />
              <p>
                Design responsive and adaptive interfaces for seamless user
                experiences across devices.
              </p>
            </li>
            <li>
              <BiCheck className="service_list-icon" />
              <p>
                Develop interactive and user-friendly UI components using modern
                design tools and techniques.
              </p>
            </li>
            <li>
              <BiCheck className="service_list-icon" />
              <p>
                Collaborate with developers to ensure design feasibility and
                implementation accuracy.
              </p>
            </li>
            <li>
              <BiCheck className="service_list-icon" />
              <p>
                Maintain consistency in design through the creation of style
                guides and design systems.
              </p>
            </li>
          </ul>
        </article>

        {/*--------------------------- Web Development------------------------- */}
        <article className="service">
          <div className="service_head">
            <h3>Web Development</h3>
          </div>
          <ul className="service_list">
            <li>
              <BiCheck className="service_list-icon" />
              <p>
                Develop dynamic, responsive, and user-friendly websites using
                the latest web technologies.
              </p>
            </li>
            <li>
              <BiCheck className="service_list-icon" />
              <p>
                Integrate APIs and third-party services to extend the
                functionality of web applications.
              </p>
            </li>
            <li>
              <BiCheck className="service_list-icon" />
              <p>
                Optimize website performance and speed for a seamless user
                experience.
              </p>
            </li>
            <li>
              <BiCheck className="service_list-icon" />
              <p>
                Implement robust backend solutions using Python, MySQL, and
                other server-side technologies.
              </p>
            </li>
            <li>
              <BiCheck className="service_list-icon" />
              <p>
                Ensure cross-browser compatibility and mobile responsiveness of
                web applications.
              </p>
            </li>
            <li>
              <BiCheck className="service_list-icon" />
              <p>
                Maintain and update websites regularly to keep them secure and
                up-to-date.
              </p>
            </li>
          </ul>
        </article>
        {/*---------------------------Content creation------------------------- */}
        <article className="service">
          <div className="service_head">
            <h3>Content Creation</h3>
          </div>
          <ul className="service_list">
            <li>
              <BiCheck className="service_list-icon" />
              <p>
                Develop engaging and high-quality written content for blogs,
                articles, and social media.
              </p>
            </li>
            <li>
              <BiCheck className="service_list-icon" />
              <p>
                Create visually appealing graphics and multimedia content to
                enhance digital presence.
              </p>
            </li>
            <li>
              <BiCheck className="service_list-icon" />
              <p>
                Produce video content, including scripting, filming, and
                editing, for various platforms.
              </p>
            </li>
            <li>
              <BiCheck className="service_list-icon" />
              <p>
                Optimize content for SEO to improve search engine rankings and
                drive organic traffic.
              </p>
            </li>
            <li>
              <BiCheck className="service_list-icon" />
              <p>
                Manage and curate content across multiple channels to ensure
                brand consistency.
              </p>
            </li>
            <li>
              <BiCheck className="service_list-icon" />
              <p>
                Collaborate with clients to understand their needs and deliver
                tailored content solutions.
              </p>
            </li>
          </ul>
        </article>
      </div>
    </section>
  );
};

export default Services;
