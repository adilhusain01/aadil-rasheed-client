"use client";

import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export interface ReCaptchaHandle {
  executeReCaptcha: () => Promise<string | null>;
  resetReCaptcha: () => void;
}

interface ReCaptchaProps {
  onChange?: (token: string | null) => void;
  siteKey?: string;
}

const ReCaptcha = forwardRef<ReCaptchaHandle, ReCaptchaProps>(
  ({ onChange, siteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' }, ref) => {
    // Using Google's test key by default (always passes verification)
    // Replace with your actual key in production
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    useImperativeHandle(ref, () => ({
      executeReCaptcha: async () => {
        if (!recaptchaRef.current) return null;
        
        try {
          const token = await recaptchaRef.current.executeAsync();
          return token;
        } catch (error) {
          console.error('reCAPTCHA execution failed:', error);
          return null;
        }
      },
      resetReCaptcha: () => {
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
      }
    }));

    return (
      <div className="recaptcha-container hidden">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={siteKey}
          size="invisible"
          onChange={onChange}
        />
      </div>
    );
  }
);

ReCaptcha.displayName = 'ReCaptcha';

export default ReCaptcha;
