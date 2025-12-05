import { Languages } from "lucide-react";

const TranslationButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-16 z-10 btn btn-circle btn-sm btn-ghost bg-base-100 shadow-md hover:bg-primary hover:text-white transition-all"
      title="Translation Helper"
    >
      <Languages className="size-4" />
    </button>
  );
};

export default TranslationButton;
