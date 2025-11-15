import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await fetch("http://localhost:8080/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.text();
      setStatus(data);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong. Please try again later.");
    }
  };

  return (
    <section className="min-h-screen bg-gray-900 text-white px-6 py-20 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold">Get in Touch</h1>
          <p className="text-gray-400">
            Have questions, feedback, or collaboration ideas? We’d love to hear from you.
          </p>
        </div>

        <form
          className="space-y-6 bg-gray-800 p-8 rounded-2xl shadow-lg"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-100 focus:ring-2 focus:ring-white/30 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-100 focus:ring-2 focus:ring-white/30 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="5"
              placeholder="Write your message..."
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-100 focus:ring-2 focus:ring-white/30 focus:outline-none"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-white text-gray-900 font-semibold rounded-md hover:opacity-90 transition"
          >
            Send Message
          </button>
          {status && <p className="text-sm text-center text-gray-400 mt-3">{status}</p>}
        </form>

        <div className="text-center text-gray-400 text-sm pt-6">
          <p>
            Or email us directly at{" "}
            <span className="text-white">support@spacethreads.io</span>
          </p>
        </div>
      </div>
    </section>
  );
}

