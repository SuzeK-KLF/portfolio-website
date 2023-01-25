import React, { useRef, useMemo } from "react";
import "./contact.css";
import emailjs from "@emailjs/browser";
import { MdOutlineEmail } from "react-icons/md";
import { RiMessengerLine } from "react-icons/ri";
import { BsWhatsapp } from "react-icons/bs";
import { Button, Divider, notification, Space } from "antd";

const Context = React.createContext({
  name: "Default",
});

const Contact = () => {
  const form = useRef();
  const nameInput = useRef();
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (placement) => {
    api.info({
      message: `${placement}`,
      description: (
        <Context.Consumer>{({ name }) => `Hello, ${name}!`}</Context.Consumer>
      ),
      placement,
    });
  };
  const contextValue = useMemo(
    () => ({
      name: "there",
    }),
    []
  );

  const note = (status) => openNotification(status);
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_q2gozl2",
        "template_g2zvsdl",
        form.current,
        "b6ekIfHP5Dw_0EMlH"
      )
      .then(
        (result) => {
          console.log(result.text);
          console.log(nameInput.current);
          note("Sent message Successfully!");
        },
        (error) => {
          console.log(error.text);
          note("Failed to send message!");
        }
      );

      e.target.reset();
  };

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
      <section id="contact">
        <h5>Get In Touch</h5>
        <h2>Contact me</h2>
        <div className="container contact_container">
          <div className="contact_options">
            <article className="contact_option">
              <MdOutlineEmail className="contact_option-icon" />
              <h4>Email</h4>
              <h5>kangsuze@gmail.com</h5>
              <a href="">Send a Message</a>
            </article>
            <article className="contact_option">
              <RiMessengerLine className="contact_option-icon" />
              <h4>Messenger</h4>
              <h5>Suze Kang</h5>
              <a href="https://m.me/bearksz">Send a Message</a>
            </article>
            <article className="contact_option">
              <BsWhatsapp className="contact_option-icon" />
              <h4>WhatsApp</h4>
              <h5>+1(519)721-1943</h5>
              <a href="https://wa.me/15197211943?text=I'm%20from%20your%20react%20portfolio%20!">
                Send a Message
              </a>
            </article>
          </div>
          {/* END OF CONTACT OPTIONS */}
          <form ref={form} onSubmit={sendEmail}>
            <input
              type="text"
              name="name"
              placeholder="Your Full Name"
              ref={nameInput}
              id="name_input"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email Address"
              required
            />
            <textarea
              name="message"
              id="text_area"
              rows="7"
              placeholder="Your Message"
              required
            />
            <button type="submit" className="btn btn-primary">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </Context.Provider>
  );
};

export default Contact;
