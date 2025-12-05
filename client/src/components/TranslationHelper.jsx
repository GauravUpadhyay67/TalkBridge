import { useMutation } from "@tanstack/react-query";
import { ArrowLeftRight, Copy, Loader, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";
import { translateText } from "../lib/api";

const TranslationHelper = ({ onInsert, onClose }) => {
  const { authUser } = useAuthUser();
  const [text, setText] = useState("");
  const [sourceLang, setSourceLang] = useState(authUser?.nativeLanguage || "english");
  const [targetLang, setTargetLang] = useState(authUser?.learningLanguage || "spanish");
  const [translatedText, setTranslatedText] = useState("");

  const { mutate: translate, isPending } = useMutation({
    mutationFn: () => translateText(text, sourceLang, targetLang),
    onSuccess: (data) => {
      setTranslatedText(data.translated);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Translation failed");
    },
  });

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    if (translatedText) {
      setText(translatedText);
      setTranslatedText(text);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    toast.success("Copied to clipboard!");
  };

  const handleTranslate = () => {
    if (!text.trim()) {
      toast.error("Please enter text to translate");
      return;
    }
    translate();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card bg-base-200 w-full max-w-2xl shadow-2xl">
        <div className="card-body">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">🌐 Translation Helper</h3>
            <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
              <X className="size-4" />
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2 mb-4">
            <select
              className="select select-bordered flex-1 capitalize"
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
              <option value="italian">Italian</option>
              <option value="portuguese">Portuguese</option>
              <option value="chinese">Chinese</option>
              <option value="japanese">Japanese</option>
              <option value="korean">Korean</option>
            </select>

            <button
              onClick={handleSwapLanguages}
              className="btn btn-square btn-ghost"
              title="Swap languages"
            >
              <ArrowLeftRight className="size-5" />
            </button>

            <select
              className="select select-bordered flex-1 capitalize"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
              <option value="italian">Italian</option>
              <option value="portuguese">Portuguese</option>
              <option value="chinese">Chinese</option>
              <option value="japanese">Japanese</option>
              <option value="korean">Korean</option>
            </select>
          </div>

          {/* Input Text */}
          <textarea
            className="textarea textarea-bordered w-full h-32 resize-none mb-4"
            placeholder="Enter text to translate..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* Translate Button */}
          <button
            onClick={handleTranslate}
            disabled={isPending || !text.trim()}
            className="btn btn-primary w-full mb-4"
          >
            {isPending ? (
              <>
                <Loader className="size-5 animate-spin" />
                Translating...
              </>
            ) : (
              "Translate"
            )}
          </button>

          {/* Translation Result */}
          {translatedText && (
            <div className="bg-base-300 p-4 rounded-lg">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="font-semibold">Translation:</p>
                <button
                  onClick={handleCopy}
                  className="btn btn-xs btn-ghost"
                  title="Copy"
                >
                  <Copy className="size-4" />
                </button>
              </div>
              <p className="text-lg mb-4">{translatedText}</p>
              
              {onInsert && (
                <button
                  onClick={() => {
                    onInsert(translatedText);
                    onClose();
                  }}
                  className="btn btn-sm btn-outline w-full"
                >
                  Insert into chat
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranslationHelper;
