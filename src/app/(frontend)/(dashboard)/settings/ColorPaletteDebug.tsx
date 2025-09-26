import React, { useState } from "react";
import { Sun, Moon, Check, X, Copy, Eye } from "lucide-react";

const ColorPaletteDebug = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [copiedColor, setCopiedColor] = useState("");

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Copy color to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(text);
    setTimeout(() => setCopiedColor(""), 2000);
  };

  // Calculate contrast ratio
  const getContrastRatio = (rgb1: number[], rgb2: number[]) => {
    const getLuminance = (rgb: number[]) => {
      const [r, g, b] = rgb.map((val: number) => {
        val = val / 255;
        return val <= 0.03928
          ? val / 12.92
          : Math.pow((val + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const l1 = getLuminance(rgb1);
    const l2 = getLuminance(rgb2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  };

  // Get contrast rating
  const getContrastRating = (ratio: number) => {
    if (ratio >= 7)
      return {
        label: "AAA",
        status: "excellent",
        icon: <Check className="w-4 h-4" />,
      };
    if (ratio >= 4.5)
      return {
        label: "AA",
        status: "good",
        icon: <Check className="w-4 h-4" />,
      };
    if (ratio >= 3)
      return {
        label: "AA Large",
        status: "acceptable",
        icon: <Eye className="w-4 h-4" />,
      };
    return { label: "Fail", status: "poor", icon: <X className="w-4 h-4" /> };
  };

  // Color definitions with RGB values
  type ColorType = {
    name: string;
    class: string;
    text: string;
    rgb?: number[];
    cssVar?: string;
  };

  const colorGroups: {
    [group: string]: {
      colors: ColorType[];
      combinations: { bg: string; text: string; label: string }[];
    };
  } = {
    "Primary Colors": {
      colors: [
        {
          name: "Primary 50",
          class: "bg-primary-50",
          rgb: [248, 250, 252],
          text: "text-primary-900",
        },
        {
          name: "Primary 100",
          class: "bg-primary-100",
          rgb: [241, 244, 248],
          text: "text-primary-900",
        },
        {
          name: "Primary 200",
          class: "bg-primary-200",
          rgb: [227, 232, 240],
          text: "text-primary-900",
        },
        {
          name: "Primary 300",
          class: "bg-primary-300",
          rgb: [184, 197, 217],
          text: "text-primary-900",
        },
        {
          name: "Primary 400",
          class: "bg-primary-400",
          rgb: [159, 176, 204],
          text: "text-white",
        },
        {
          name: "Primary 500",
          class: "bg-primary-500",
          rgb: [120, 157, 188],
          text: "text-white",
        },
        {
          name: "Primary 600",
          class: "bg-primary-600",
          rgb: [107, 138, 172],
          text: "text-white",
        },
        {
          name: "Primary 700",
          class: "bg-primary-700",
          rgb: [90, 114, 147],
          text: "text-white",
        },
        {
          name: "Primary 800",
          class: "bg-primary-800",
          rgb: [71, 85, 105],
          text: "text-white",
        },
        {
          name: "Primary 900",
          class: "bg-primary-900",
          rgb: [51, 65, 85],
          text: "text-white",
        },
        {
          name: "Primary 950",
          class: "bg-primary-950",
          rgb: [30, 41, 59],
          text: "text-white",
        },
      ],
      combinations: [
        { bg: "bg-primary-500", text: "text-white", label: "Primary + White" },
        {
          bg: "bg-primary-700",
          text: "text-white",
          label: "Primary 700 + White",
        },
        {
          bg: "bg-primary-100",
          text: "text-primary-900",
          label: "Primary 100 + Primary 900",
        },
      ],
    },
    "Secondary Colors": {
      colors: [
        {
          name: "Secondary 50",
          class: "bg-secondary-50",
          rgb: [254, 247, 247],
          text: "text-secondary-900",
        },
        {
          name: "Secondary 100",
          class: "bg-secondary-100",
          rgb: [253, 232, 232],
          text: "text-secondary-900",
        },
        {
          name: "Secondary 200",
          class: "bg-secondary-200",
          rgb: [251, 213, 213],
          text: "text-secondary-900",
        },
        {
          name: "Secondary 300",
          class: "bg-secondary-300",
          rgb: [248, 180, 180],
          text: "text-secondary-900",
        },
        {
          name: "Secondary 400",
          class: "bg-secondary-400",
          rgb: [244, 136, 136],
          text: "text-white",
        },
        {
          name: "Secondary 500",
          class: "bg-secondary-500",
          rgb: [239, 90, 90],
          text: "text-white",
        },
        {
          name: "Secondary 600",
          class: "bg-secondary-600",
          rgb: [220, 47, 47],
          text: "text-white",
        },
        {
          name: "Secondary 700",
          class: "bg-secondary-700",
          rgb: [185, 28, 28],
          text: "text-white",
        },
        {
          name: "Secondary 800",
          class: "bg-secondary-800",
          rgb: [153, 27, 27],
          text: "text-white",
        },
        {
          name: "Secondary 900",
          class: "bg-secondary-900",
          rgb: [127, 29, 29],
          text: "text-white",
        },
        {
          name: "Secondary 950",
          class: "bg-secondary-950",
          rgb: [69, 10, 10],
          text: "text-white",
        },
      ],
      combinations: [
        {
          bg: "bg-secondary-100",
          text: "text-secondary-900",
          label: "Secondary 100 + Secondary 900",
        },
        {
          bg: "bg-secondary-600",
          text: "text-white",
          label: "Secondary 600 + White",
        },
      ],
    },
    "Accent Colors": {
      colors: [
        {
          name: "Accent 50",
          class: "bg-accent-50",
          rgb: [254, 251, 247],
          text: "text-accent-900",
        },
        {
          name: "Accent 100",
          class: "bg-accent-100",
          rgb: [253, 244, 231],
          text: "text-accent-900",
        },
        {
          name: "Accent 200",
          class: "bg-accent-200",
          rgb: [251, 232, 208],
          text: "text-accent-900",
        },
        {
          name: "Accent 300",
          class: "bg-accent-300",
          rgb: [247, 215, 184],
          text: "text-accent-900",
        },
        {
          name: "Accent 400",
          class: "bg-accent-400",
          rgb: [242, 194, 155],
          text: "text-accent-900",
        },
        {
          name: "Accent 500",
          class: "bg-accent-500",
          rgb: [230, 168, 124],
          text: "text-white",
        },
        {
          name: "Accent 600",
          class: "bg-accent-600",
          rgb: [212, 145, 90],
          text: "text-white",
        },
        {
          name: "Accent 700",
          class: "bg-accent-700",
          rgb: [181, 117, 63],
          text: "text-white",
        },
        {
          name: "Accent 800",
          class: "bg-accent-800",
          rgb: [146, 64, 14],
          text: "text-white",
        },
        {
          name: "Accent 900",
          class: "bg-accent-900",
          rgb: [120, 53, 15],
          text: "text-white",
        },
        {
          name: "Accent 950",
          class: "bg-accent-950",
          rgb: [69, 26, 3],
          text: "text-white",
        },
      ],
      combinations: [
        {
          bg: "bg-accent-100",
          text: "text-accent-900",
          label: "Accent 100 + Accent 900",
        },
        {
          bg: "bg-accent-600",
          text: "text-white",
          label: "Accent 600 + White",
        },
      ],
    },
    "Success Colors": {
      colors: [
        {
          name: "Success 50",
          class: "bg-success-50",
          rgb: [240, 253, 244],
          text: "text-success-900",
        },
        {
          name: "Success 100",
          class: "bg-success-100",
          rgb: [220, 252, 231],
          text: "text-success-900",
        },
        {
          name: "Success 200",
          class: "bg-success-200",
          rgb: [187, 247, 208],
          text: "text-success-900",
        },
        {
          name: "Success 300",
          class: "bg-success-300",
          rgb: [167, 243, 208],
          text: "text-success-900",
        },
        {
          name: "Success 400",
          class: "bg-success-400",
          rgb: [110, 231, 183],
          text: "text-success-900",
        },
        {
          name: "Success 500",
          class: "bg-success-500",
          rgb: [52, 211, 153],
          text: "text-white",
        },
        {
          name: "Success 600",
          class: "bg-success-600",
          rgb: [16, 185, 129],
          text: "text-white",
        },
        {
          name: "Success 700",
          class: "bg-success-700",
          rgb: [5, 150, 105],
          text: "text-white",
        },
        {
          name: "Success 800",
          class: "bg-success-800",
          rgb: [6, 95, 70],
          text: "text-white",
        },
        {
          name: "Success 900",
          class: "bg-success-900",
          rgb: [6, 78, 59],
          text: "text-white",
        },
        {
          name: "Success 950",
          class: "bg-success-950",
          rgb: [2, 44, 34],
          text: "text-white",
        },
      ],
      combinations: [
        {
          bg: "bg-success-100",
          text: "text-success-900",
          label: "Success 100 + Success 900",
        },
        {
          bg: "bg-success-600",
          text: "text-white",
          label: "Success 600 + White",
        },
      ],
    },
    "CSS Variable Colors (globals.css)": {
      colors: [
        {
          name: "Background",
          class: "bg-[rgb(var(--background))]",
          cssVar: "--background",
          text: "text-[rgb(var(--foreground))]",
        },
        {
          name: "Background Subtle",
          class: "bg-[rgb(var(--background-subtle))]",
          cssVar: "--background-subtle",
          text: "text-[rgb(var(--foreground))]",
        },
        {
          name: "Background Muted",
          class: "bg-[rgb(var(--background-muted))]",
          cssVar: "--background-muted",
          text: "text-[rgb(var(--foreground))]",
        },
        {
          name: "Foreground",
          class: "bg-[rgb(var(--foreground))]",
          cssVar: "--foreground",
          text: "text-[rgb(var(--background))]",
        },
        {
          name: "Foreground Muted",
          class: "bg-[rgb(var(--foreground-muted))]",
          cssVar: "--foreground-muted",
          text: "text-[rgb(var(--background))]",
        },
        {
          name: "Foreground Subtle",
          class: "bg-[rgb(var(--foreground-subtle))]",
          cssVar: "--foreground-subtle",
          text: "text-[rgb(var(--background))]",
        },
        {
          name: "Primary (CSS)",
          class: "bg-[rgb(var(--primary))]",
          cssVar: "--primary",
          text: "text-[rgb(var(--primary-foreground))]",
        },
        {
          name: "Secondary (CSS)",
          class: "bg-[rgb(var(--secondary))]",
          cssVar: "--secondary",
          text: "text-[rgb(var(--secondary-foreground))]",
        },
        {
          name: "Accent (CSS)",
          class: "bg-[rgb(var(--accent))]",
          cssVar: "--accent",
          text: "text-[rgb(var(--accent-foreground))]",
        },
        {
          name: "Success (CSS)",
          class: "bg-[rgb(var(--success))]",
          cssVar: "--success",
          text: "text-[rgb(var(--success-foreground))]",
        },
        {
          name: "Destructive",
          class: "bg-[rgb(var(--destructive))]",
          cssVar: "--destructive",
          text: "text-[rgb(var(--destructive-foreground))]",
        },
        {
          name: "Card",
          class: "bg-[rgb(var(--card))]",
          cssVar: "--card",
          text: "text-[rgb(var(--card-foreground))]",
        },
        {
          name: "Muted",
          class: "bg-[rgb(var(--muted))]",
          cssVar: "--muted",
          text: "text-[rgb(var(--muted-foreground))]",
        },
        {
          name: "Border",
          class: "bg-[rgb(var(--border))]",
          cssVar: "--border",
          text: "text-[rgb(var(--foreground))]",
        },
        {
          name: "Border Muted",
          class: "bg-[rgb(var(--border-muted))]",
          cssVar: "--border-muted",
          text: "text-[rgb(var(--foreground))]",
        },
      ],
      combinations: [
        {
          bg: "bg-[rgb(var(--primary))]",
          text: "text-[rgb(var(--primary-foreground))]",
          label: "Primary + Primary Foreground",
        },
        {
          bg: "bg-[rgb(var(--secondary))]",
          text: "text-[rgb(var(--secondary-foreground))]",
          label: "Secondary + Secondary Foreground",
        },
        {
          bg: "bg-[rgb(var(--accent))]",
          text: "text-[rgb(var(--accent-foreground))]",
          label: "Accent + Accent Foreground",
        },
        {
          bg: "bg-[rgb(var(--card))]",
          text: "text-[rgb(var(--card-foreground))]",
          label: "Card + Card Foreground",
        },
        {
          bg: "bg-[rgb(var(--muted))]",
          text: "text-[rgb(var(--muted-foreground))]",
          label: "Muted + Muted Foreground",
        },
      ],
    },
  };

  type ColorSwatchProps = {
    name: string;
    className: string;
    cssVar?: string;
    textClass?: string;
  };

  const ColorSwatch = ({
    name,
    className,
    cssVar,
    textClass,
  }: ColorSwatchProps) => (
    <div className="flex flex-col gap-2">
      <div
        className={`${className} h-20 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:scale-105 cursor-pointer`}
        onClick={() => copyToClipboard(cssVar || className)}
        title="Click to copy"
      >
        <div className="h-full flex items-center justify-center">
          {copiedColor === (cssVar || className) && (
            <div className="bg-black/70 text-white px-3 py-1 rounded text-xs">
              Copied!
            </div>
          )}
        </div>
      </div>
      <div className="text-xs font-medium text-center">
        <div className="text-gray-700 dark:text-gray-300">{name}</div>
        <div className="text-gray-500 dark:text-gray-500 font-mono text-[10px] mt-1">
          {cssVar ? `var(${cssVar})` : className.replace("bg-", "")}
        </div>
      </div>
    </div>
  );

  type CombinationCardProps = {
    bg: string;
    text: string;
    label: string;
  };

  const CombinationCard = ({ bg, text, label }: CombinationCardProps) => {
    // Get RGB values from computed style
    const getComputedRGB = (className: string) => {
      const temp = document.createElement("div");
      temp.className = className;
      document.body.appendChild(temp);
      const color = window.getComputedStyle(temp).backgroundColor;
      document.body.removeChild(temp);
      const match = color.match(/\d+/g);
      return match ? match.map(Number) : [0, 0, 0];
    };

    const bgRGB = getComputedRGB(bg);
    const textRGB = getComputedRGB(text);
    const ratio = getContrastRatio(bgRGB, textRGB);
    const rating = getContrastRating(ratio);

    return (
      <div
        className={`${bg} ${text} rounded-lg p-6 border-2 border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all`}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-lg">{label}</h4>
            <Copy
              className="w-4 h-4 opacity-50 hover:opacity-100 cursor-pointer"
              onClick={() => copyToClipboard(`${bg} ${text}`)}
            />
          </div>

          <p className="text-sm opacity-90">
            The quick brown fox jumps over the lazy dog. 1234567890
          </p>

          <div className="flex items-center gap-2 pt-2 border-t border-current opacity-30">
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold
              ${
                rating.status === "excellent"
                  ? "bg-green-500 text-white"
                  : rating.status === "good"
                  ? "bg-blue-500 text-white"
                  : rating.status === "acceptable"
                  ? "bg-yellow-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {rating.icon}
              <span>{rating.label}</span>
            </div>
            <span className="text-xs font-mono">
              Ratio: {ratio.toFixed(2)}:1
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--foreground))] transition-colors duration-300`}
    >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[rgb(var(--card))] border-b border-[rgb(var(--border))] shadow-sm backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[rgb(var(--foreground))]">
                Color Palette Debug & Documentation
              </h1>
              <p className="text-sm text-[rgb(var(--muted-foreground))] mt-1">
                Visual testing tool for color combinations and contrast ratios
              </p>
            </div>
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgb(var(--primary))] text-white hover:opacity-90 transition-all shadow-md hover:shadow-lg"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
              <span className="font-medium">
                {darkMode ? "Light Mode" : "Dark Mode"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {Object.entries(colorGroups).map(([groupName, group]) => (
          <div key={groupName} className="mb-12">
            {/* Section Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-2">
                {groupName}
              </h2>
              <div className="h-1 w-20 bg-[rgb(var(--primary))] rounded"></div>
            </div>

            {/* Color Swatches */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--foreground-muted))] mb-4">
                Color Palette
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {group.colors.map((color, idx) => (
                  <ColorSwatch
                    key={idx}
                    name={color.name}
                    className={color.class}
                    cssVar={color.cssVar}
                    textClass={color.text}
                  />
                ))}
              </div>
            </div>

            {/* Color Combinations */}
            <div>
              <h3 className="text-lg font-semibold text-[rgb(var(--foreground-muted))] mb-4">
                Recommended Combinations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.combinations.map((combo, idx) => (
                  <CombinationCard
                    key={idx}
                    bg={combo.bg}
                    text={combo.text}
                    label={combo.label}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Footer Info */}
        <div className="mt-12 p-6 bg-[rgb(var(--muted))] rounded-lg border border-[rgb(var(--border))]">
          <h3 className="text-lg font-bold text-[rgb(var(--foreground))] mb-3">
            WCAG Contrast Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[rgb(var(--muted-foreground))]">
            <div>
              <p>
                <strong className="text-green-600">AAA (7:1):</strong> Enhanced
                contrast for maximum readability
              </p>
              <p>
                <strong className="text-blue-600">AA (4.5:1):</strong> Minimum
                contrast for normal text
              </p>
            </div>
            <div>
              <p>
                <strong className="text-yellow-600">AA Large (3:1):</strong>{" "}
                Minimum for large text (18pt+)
              </p>
              <p>
                <strong className="text-red-600">Fail (&lt;3:1):</strong> Does
                not meet accessibility standards
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPaletteDebug;
