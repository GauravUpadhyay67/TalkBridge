import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    if (theme === "business") {
      setTheme("light");
    } else {
      setTheme("business");
    }
  };

  return (
    <button className="btn btn-ghost btn-circle" onClick={toggleTheme}>
      {theme === "business" ? (
        <Moon className="size-5" />
      ) : (
        <Sun className="size-5" />
      )}
    </button>
  );
};

export default ThemeSelector;
