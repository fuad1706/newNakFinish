import { useState, useRef, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    emailjs.init("your_actual_public_key"); // Replace with your EmailJS public key
  }, []);

  const handleChange = (e: ChangeEvent<HTMLElement>) => {
    const { id, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);
    setError(false);

    if (formRef.current) {
      emailjs
        .sendForm(
          "service_7tuuh7k", // Replace with your EmailJS service ID
          "template_ymrs2pm", // Replace with your EmailJS template ID
          formRef.current,
          "pFCXwURecGLAXBz7J" // Replace with your Emtemplate_ymrs2pmailJS public key
        )
        .then((result) => {
          console.log("Email sent successfully:", result);
          setIsLoading(false);
          setSuccess(true);
          setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
          });
        })
        .catch((error: unknown) => {
          console.error("Email sending failed:", error);
          setIsLoading(false);
          setError(true);
        });
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 px-4 md:px-10 lg:px-48 py-12">
      {/* Left Section: Form */}
      <div className="w-full md:w-1/2">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 leading-snug">
          We are Open
          <br />
          to Work with You.
        </h2>

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            Message sent successfully! We'll get back to you soon.
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            There was an error sending your message. Please try again.
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-base md:text-lg text-gray-700 mb-1"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-base md:text-lg text-gray-700 mb-1"
            >
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="subject"
              className="block text-base md:text-lg text-gray-700 mb-1"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Enter the subject"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="message"
              className="block text-base md:text-lg text-gray-700 mb-1"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Type your message"
              rows={4}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${
              isLoading ? "bg-gray-500" : "bg-black hover:bg-gray-800"
            } text-white py-2 rounded-md transition`}
          >
            {isLoading ? "Sending..." : "Send Message"}
          </button>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          <p className="text-gray-700">enquiry.nakestudios@gmail.com</p>
          <p className="text-gray-700">info@nakestudios.org</p>
        </div>
      </div>

      {/* Right Section: Image */}
      <div className="w-full md:w-1/2 mt-8 md:mt-0">
        <img
          src="/images/contacts_img_camera.png"
          alt="Camera"
          className="w-full h-auto object-contain rounded-md"
        />
      </div>
    </div>
  );
};

export default Contact;
