 'use client';

import { useEffect } from 'react';

export default function GoogleTranslate() {
  useEffect(() => {
    const addScript = () => {
      if (window.google?.translate) return; // prevent multiple loads

      const script = document.createElement('script');
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,kn,ta,te,ml',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          'google_translate_element'
        );
      };
    };

    addScript();
  }, []);

  return (
    <div
      id="google_translate_element"
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 9999,
      }}
    />
  );
}
