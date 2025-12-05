import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LANGUAGES, LANGUAGE_TO_FLAG } from "../constants";

const LanguageSelector = ({ label, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (lang) => {
    onChange(lang.toLowerCase());
    setIsOpen(false);
  };

  const selectedLanguage = LANGUAGES.find(
    (lang) => lang.toLowerCase() === value
  );

  return (
    <div className="form-control space-y-2" ref={dropdownRef}>
      <label className="label">
        <span className="label-text text-white">{label}</span>
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-outline w-full justify-between border-base-content/20 bg-base-100/50 text-left font-normal hover:bg-base-100/70 hover:border-base-content/40 text-white"
        >
          {selectedLanguage ? (
            <div className="flex items-center gap-2">
              <img
                src={`https://flagcdn.com/w40/${LANGUAGE_TO_FLAG[value]}.png`}
                alt={selectedLanguage}
                className="h-4 w-6 object-cover rounded-sm"
              />
              <span>{selectedLanguage}</span>
            </div>
          ) : (
            <span className="text-base-content/60">{placeholder}</span>
          )}
          <ChevronDown
            className={`size-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full mt-1 z-50 w-full rounded-lg border border-base-content/10 bg-base-200 p-1 shadow-xl max-h-60 overflow-y-auto">
            {LANGUAGES.map((lang) => {
                const langKey = lang.toLowerCase();
                const flagCode = LANGUAGE_TO_FLAG[langKey];
                return (
              <button
                key={lang}
                type="button"
                onClick={() => handleSelect(lang)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-base-300 ${
                  value === langKey ? "bg-primary/10 text-primary" : "text-base-content"
                }`}
              >
                {flagCode && (
                    <img
                    src={`https://flagcdn.com/w40/${flagCode}.png`}
                    alt={lang}
                    className="h-4 w-6 object-cover rounded-sm"
                    />
                )}
                {lang}
              </button>
            )})}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;
