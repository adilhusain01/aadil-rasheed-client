"use client";

import { useState, FormEvent, useRef } from "react";
import { submitSubscription } from "@/lib/api";
import ReCaptcha, { ReCaptchaHandle } from "./ReCaptcha";

export default function SubscriptionForm() {
  const recaptchaRef = useRef<ReCaptchaHandle>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    isSubscribed: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setSubmitStatus({
        success: false,
        message: "Please fill in all fields"
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Execute reCAPTCHA verification
      const recaptchaToken = await recaptchaRef.current?.executeReCaptcha() || '';
      
      if (!recaptchaToken) {
        throw new Error("Bot verification failed. Please try again.");
      }
      
      await submitSubscription(formData, recaptchaToken);
      setSubmitStatus({
        success: true,
        message: "Thank you for subscribing!"
      });
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        isSubscribed: true
      });
      
      // Reset reCAPTCHA
      recaptchaRef.current?.resetReCaptcha();
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: error instanceof Error 
          ? error.message 
          : "Something went wrong. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="border-b border-gray-300 py-2 px-2 w-full focus:outline-none focus:border-primary"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="border-b border-gray-300 py-2 px-2 w-full focus:outline-none focus:border-primary"
        />
      </div>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="border-b border-gray-300 py-2 px-2 w-full focus:outline-none focus:border-primary"
      />
      <div className="flex items-center space-x-2">
        <input 
          type="checkbox" 
          id="subscribe" 
          name="isSubscribed"
          checked={formData.isSubscribed}
          onChange={handleChange}
          className="h-4 w-4" 
        />
        <label htmlFor="subscribe" className="text-sm">
          I agree to receive marketing emails
        </label>
      </div>
      
      {submitStatus && (
        <div className={`text-sm ${submitStatus.success ? 'text-green-600' : 'text-red-600'}`}>
          {submitStatus.message}
        </div>
      )}
      
      {/* reCAPTCHA component (invisible) */}
      <ReCaptcha ref={recaptchaRef} />
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary text-white px-8 py-2 rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Subscribing..." : "Subscribe"}
      </button>
    </form>
  );
}
