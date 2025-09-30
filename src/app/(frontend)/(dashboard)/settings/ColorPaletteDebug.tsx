import React, { useState } from "react";
import { Sun, Moon, Copy, Check } from "lucide-react";

// Type Definitions
interface ColorPalette {
  core: {
    primary: string;
    onPrimary: string;
    primaryContainer: string;
    onPrimaryContainer: string;
    secondary: string;
    onSecondary: string;
    secondaryContainer: string;
    onSecondaryContainer: string;
    tertiary: string;
    onTertiary: string;
    tertiaryContainer: string;
    onTertiaryContainer: string;
    background: string;
    onBackground: string;
    surface: string;
    onSurface: string;
    surfaceVariant: string;
    onSurfaceVariant: string;
    error: string;
    onError: string;
    errorContainer: string;
    onErrorContainer: string;
  };
  neutral_outline: {
    outline: string;
    outlineVariant: string;
    inverseSurface: string;
    inverseOnSurface: string;
    inversePrimary: string;
  };
  states: {
    success: string;
    onSuccess: string;
    successContainer: string;
    onSuccessContainer: string;
    warning: string;
    onWarning: string;
    warningContainer: string;
    onWarningContainer: string;
    info: string;
    onInfo: string;
    infoContainer: string;
    onInfoContainer: string;
    disabled: string;
    onDisabled: string;
  };
  elevation: {
    surface1: string;
    surface2: string;
    surface3: string;
    surface4: string;
    surface5: string;
  };
}

interface ColorCardProps {
  color: string;
  bgColor: string;
  label: string;
  showAccent?: boolean;
}

interface ColorPairCardProps {
  bg: string;
  fg: string;
  bgName: string;
  fgName: string;
}

interface SectionTitleProps {
  children: React.ReactNode;
}

const ColorPaletteDebug: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [copiedColor, setCopiedColor] = useState<string>("");

  // Light Mode Color Palette
  const lightPalette: ColorPalette = {
    core: {
      // Primary - Blue from tailwind config
      primary: "#789DBC",
      onPrimary: "#FFFFFF",
      primaryContainer: "#E3E8F0",
      onPrimaryContainer: "#334155",

      // Secondary - Pink from tailwind config
      secondary: "#EF5A5A",
      onSecondary: "#FFFFFF",
      secondaryContainer: "#FDE8E8",
      onSecondaryContainer: "#7F1D1D",

      // Tertiary - Warm Cream/Brown from tailwind config
      tertiary: "#E6A87C",
      onTertiary: "#FFFFFF",
      tertiaryContainer: "#FDF4E7",
      onTertiaryContainer: "#78350F",

      // Background - Lebih gelap lagi untuk kenyamanan
      background: "#F1F3F5",
      onBackground: "#1A202C",

      // Surface - Lebih gelap untuk kontras yang lebih baik
      surface: "#E5E7EB",
      onSurface: "#1A202C",
      surfaceVariant: "#D1D5DB",
      onSurfaceVariant: "#4A5568",

      // Error
      error: "#EF4444",
      onError: "#FFFFFF",
      errorContainer: "#FEE2E2",
      onErrorContainer: "#991B1B",
    },
    neutral_outline: {
      outline: "#E2E8F0",
      outlineVariant: "#F1F5F9",
      inverseSurface: "#334155",
      inverseOnSurface: "#F8FAFC",
      inversePrimary: "#9FB0CC",
    },
    states: {
      // Success - Green from tailwind config
      success: "#10B981",
      onSuccess: "#FFFFFF",
      successContainer: "#DCFCE7",
      onSuccessContainer: "#064E3B",

      warning: "#F97316",
      onWarning: "#FFFFFF",
      warningContainer: "#FFEDD5",
      onWarningContainer: "#9A3412",

      info: "#0EA5E9",
      onInfo: "#FFFFFF",
      infoContainer: "#E0F2FE",
      onInfoContainer: "#075985",

      disabled: "#E5E7EB",
      onDisabled: "#9CA3AF",
    },
    elevation: {
      surface1: "#F8F9FA",
      surface2: "#F1F3F5",
      surface3: "#E5E7EB",
      surface4: "#D1D5DB",
      surface5: "#9CA3AF",
    },
  };

  // Dark Mode Color Palette
  const darkPalette: ColorPalette = {
    core: {
      // Primary - Lighter blue untuk dark mode (lebih soft)
      primary: "#9FB0CC",
      onPrimary: "#18181B", // Darker untuk lebih soft di mata
      primaryContainer: "#475569",
      onPrimaryContainer: "#E3E8F0", // Lebih dark untuk kontras lebih baik

      // Secondary - Lighter pink untuk dark mode (lebih soft)
      secondary: "#F48888",
      onSecondary: "#18181B", // Darker untuk lebih soft di mata
      secondaryContainer: "#7F1D1D",
      onSecondaryContainer: "#FBD5D5", // Lebih dark untuk kontras lebih baik

      // Tertiary - Lighter warm untuk dark mode (lebih soft)
      tertiary: "#F2C29B",
      onTertiary: "#18181B", // Darker untuk lebih soft di mata
      tertiaryContainer: "#92400E",
      onTertiaryContainer: "#FBE8D0", // Lebih dark untuk kontras lebih baik

      // Background - Lebih terang agar tidak terlalu gelap
      background: "#18181B",
      onBackground: "#F7FAFC",

      // Surface
      surface: "#27272A",
      onSurface: "#F7FAFC",
      surfaceVariant: "#3F3F46",
      onSurfaceVariant: "#D4D4D8",

      // Error - Lebih soft untuk dark mode
      error: "#F48888",
      onError: "#18181B", // Darker untuk lebih soft di mata
      errorContainer: "#7F1D1D",
      onErrorContainer: "#FBD5D5", // Lebih dark untuk kontras lebih baik
    },
    neutral_outline: {
      outline: "#52525B",
      outlineVariant: "#3F3F46",
      inverseSurface: "#E5E7EB",
      inverseOnSurface: "#27272A",
      inversePrimary: "#5A7293",
    },
    states: {
      // Success - Lebih soft untuk dark mode
      success: "#6EE7B7",
      onSuccess: "#18181B", // Darker untuk lebih soft di mata
      successContainer: "#065F46",
      onSuccessContainer: "#BBF7D0", // Lebih dark untuk kontras lebih baik

      warning: "#FB923C",
      onWarning: "#18181B",
      warningContainer: "#9A3412",
      onWarningContainer: "#FFEDD5",

      // Info - Lebih soft untuk dark mode
      info: "#7DD3FC",
      onInfo: "#18181B", // Darker untuk lebih soft di mata
      infoContainer: "#075985",
      onInfoContainer: "#BAE6FD", // Lebih dark untuk kontras lebih baik

      disabled: "#3F3F46",
      onDisabled: "#A1A1AA",
    },
    elevation: {
      surface1: "#27272A",
      surface2: "#3F3F46",
      surface3: "#52525B",
      surface4: "#71717A",
      surface5: "#A1A1AA",
    },
  };

  const currentPalette: ColorPalette = isDark ? darkPalette : lightPalette;

  const copyToClipboard = (color: string, name: string): void => {
    navigator.clipboard.writeText(color);
    setCopiedColor(name);
    setTimeout(() => setCopiedColor(""), 2000);
  };

  const ColorCard: React.FC<ColorCardProps> = ({
    color,
    bgColor,
    label,
    showAccent = false,
  }) => {
    const isCopied = copiedColor === label;

    return (
      <div
        className="relative rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 group"
        style={{ backgroundColor: bgColor }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-sm tracking-wide" style={{ color }}>
              {label}
            </p>
            <button
              onClick={() => copyToClipboard(bgColor, label)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded hover:bg-black/10"
              style={{ color }}
            >
              {isCopied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          <p className="text-xs font-mono mb-4" style={{ color }}>
            {bgColor}
          </p>

          {showAccent && (
            <div className="flex gap-2 mt-4">
              <div
                className="w-8 h-8 rounded-full border-2"
                style={{
                  backgroundColor: currentPalette.core.primary,
                  borderColor: color,
                }}
              />
              <div
                className="w-8 h-8 rounded-full border-2"
                style={{
                  backgroundColor: currentPalette.core.secondary,
                  borderColor: color,
                }}
              />
              <div
                className="w-8 h-8 rounded-full border-2"
                style={{
                  backgroundColor: currentPalette.core.tertiary,
                  borderColor: color,
                }}
              />
            </div>
          )}

          <div
            className="mt-4 p-3 rounded"
            style={{ backgroundColor: `${bgColor}20` }}
          >
            <p className="text-xs font-medium" style={{ color }}>
              Sample Text Content
            </p>
            <p className="text-xs mt-1 opacity-75" style={{ color }}>
              This shows how text appears on this background
            </p>
          </div>
        </div>
      </div>
    );
  };

  const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => (
    <h2
      className="text-2xl font-bold mb-6 pb-2 border-b-2"
      style={{
        color: isDark
          ? darkPalette.core.onBackground
          : lightPalette.core.onBackground,
        borderColor: isDark
          ? darkPalette.neutral_outline.outline
          : lightPalette.neutral_outline.outline,
      }}
    >
      {children}
    </h2>
  );

  const ColorPairCard: React.FC<ColorPairCardProps> = ({
    bg,
    fg,
    bgName,
    fgName,
  }) => (
    <div
      className="rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
      style={{ backgroundColor: bg }}
    >
      <div className="mb-4">
        <p
          className="text-xs font-semibold opacity-75 mb-1"
          style={{ color: fg }}
        >
          Background: {bgName}
        </p>
        <p className="text-xs font-mono opacity-60" style={{ color: fg }}>
          {bg}
        </p>
      </div>
      <div className="mb-4">
        <p
          className="text-xs font-semibold opacity-75 mb-1"
          style={{ color: fg }}
        >
          Foreground: {fgName}
        </p>
        <p className="text-xs font-mono opacity-60" style={{ color: fg }}>
          {fg}
        </p>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold" style={{ color: fg }}>
          Heading Text
        </h3>
        <p className="text-sm" style={{ color: fg }}>
          This is body text showing the contrast ratio between background and
          foreground colors.
        </p>
        <button
          className="px-4 py-2 rounded font-semibold mt-2 transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: fg,
            color: bg,
          }}
        >
          Button Example
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen p-8 transition-colors duration-300"
      style={{ backgroundColor: currentPalette.core.background }}
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-4xl font-bold mb-2"
              style={{ color: currentPalette.core.onBackground }}
            >
              Color Palette Debug
            </h1>
            <p
              className="text-lg"
              style={{ color: currentPalette.core.onSurfaceVariant }}
            >
              Professional UI/UX Color System -{" "}
              {isDark ? "Dark Mode" : "Light Mode"}
            </p>
          </div>

          <button
            onClick={() => setIsDark(!isDark)}
            className="p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: currentPalette.core.primaryContainer,
              color: currentPalette.core.onPrimaryContainer,
            }}
          >
            {isDark ? (
              <Sun className="w-6 h-6" />
            ) : (
              <Moon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Core Colors */}
        <section>
          <SectionTitle>Core Colors</SectionTitle>

          {/* Primary Colors */}
          <h3
            className="text-xl font-semibold mb-4"
            style={{ color: currentPalette.core.onBackground }}
          >
            Primary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <ColorCard
              color={currentPalette.core.onPrimary}
              bgColor={currentPalette.core.primary}
              label="primary"
              showAccent={true}
            />
            <ColorCard
              color={currentPalette.core.primary}
              bgColor={currentPalette.core.onPrimary}
              label="onPrimary"
            />
            <ColorCard
              color={currentPalette.core.onPrimaryContainer}
              bgColor={currentPalette.core.primaryContainer}
              label="primaryContainer"
              showAccent={true}
            />
            <ColorCard
              color={currentPalette.core.primaryContainer}
              bgColor={currentPalette.core.onPrimaryContainer}
              label="onPrimaryContainer"
            />
          </div>

          {/* Primary Pair Example */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <ColorPairCard
              bg={currentPalette.core.primary}
              fg={currentPalette.core.onPrimary}
              bgName="primary"
              fgName="onPrimary"
            />
            <ColorPairCard
              bg={currentPalette.core.primaryContainer}
              fg={currentPalette.core.onPrimaryContainer}
              bgName="primaryContainer"
              fgName="onPrimaryContainer"
            />
          </div>

          {/* Secondary Colors */}
          <h3
            className="text-xl font-semibold mb-4"
            style={{ color: currentPalette.core.onBackground }}
          >
            Secondary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <ColorCard
              color={currentPalette.core.onSecondary}
              bgColor={currentPalette.core.secondary}
              label="secondary"
              showAccent={true}
            />
            <ColorCard
              color={currentPalette.core.secondary}
              bgColor={currentPalette.core.onSecondary}
              label="onSecondary"
            />
            <ColorCard
              color={currentPalette.core.onSecondaryContainer}
              bgColor={currentPalette.core.secondaryContainer}
              label="secondaryContainer"
              showAccent={true}
            />
            <ColorCard
              color={currentPalette.core.secondaryContainer}
              bgColor={currentPalette.core.onSecondaryContainer}
              label="onSecondaryContainer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <ColorPairCard
              bg={currentPalette.core.secondary}
              fg={currentPalette.core.onSecondary}
              bgName="secondary"
              fgName="onSecondary"
            />
            <ColorPairCard
              bg={currentPalette.core.secondaryContainer}
              fg={currentPalette.core.onSecondaryContainer}
              bgName="secondaryContainer"
              fgName="onSecondaryContainer"
            />
          </div>

          {/* Tertiary Colors */}
          <h3
            className="text-xl font-semibold mb-4"
            style={{ color: currentPalette.core.onBackground }}
          >
            Tertiary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <ColorCard
              color={currentPalette.core.onTertiary}
              bgColor={currentPalette.core.tertiary}
              label="tertiary"
              showAccent={true}
            />
            <ColorCard
              color={currentPalette.core.tertiary}
              bgColor={currentPalette.core.onTertiary}
              label="onTertiary"
            />
            <ColorCard
              color={currentPalette.core.onTertiaryContainer}
              bgColor={currentPalette.core.tertiaryContainer}
              label="tertiaryContainer"
              showAccent={true}
            />
            <ColorCard
              color={currentPalette.core.tertiaryContainer}
              bgColor={currentPalette.core.onTertiaryContainer}
              label="onTertiaryContainer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <ColorPairCard
              bg={currentPalette.core.tertiary}
              fg={currentPalette.core.onTertiary}
              bgName="tertiary"
              fgName="onTertiary"
            />
            <ColorPairCard
              bg={currentPalette.core.tertiaryContainer}
              fg={currentPalette.core.onTertiaryContainer}
              bgName="tertiaryContainer"
              fgName="onTertiaryContainer"
            />
          </div>

          {/* Surface & Background */}
          <h3
            className="text-xl font-semibold mb-4"
            style={{ color: currentPalette.core.onBackground }}
          >
            Surface & Background
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <ColorCard
              color={currentPalette.core.onBackground}
              bgColor={currentPalette.core.background}
              label="background"
              showAccent={true}
            />
            <ColorCard
              color={currentPalette.core.onSurface}
              bgColor={currentPalette.core.surface}
              label="surface"
              showAccent={true}
            />
            <ColorCard
              color={currentPalette.core.onSurfaceVariant}
              bgColor={currentPalette.core.surfaceVariant}
              label="surfaceVariant"
              showAccent={true}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <ColorPairCard
              bg={currentPalette.core.surface}
              fg={currentPalette.core.onSurface}
              bgName="surface"
              fgName="onSurface"
            />
            <ColorPairCard
              bg={currentPalette.core.surfaceVariant}
              fg={currentPalette.core.onSurfaceVariant}
              bgName="surfaceVariant"
              fgName="onSurfaceVariant"
            />
          </div>

          {/* Error */}
          <h3
            className="text-xl font-semibold mb-4"
            style={{ color: currentPalette.core.onBackground }}
          >
            Error
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <ColorCard
              color={currentPalette.core.onError}
              bgColor={currentPalette.core.error}
              label="error"
            />
            <ColorCard
              color={currentPalette.core.error}
              bgColor={currentPalette.core.onError}
              label="onError"
            />
            <ColorCard
              color={currentPalette.core.onErrorContainer}
              bgColor={currentPalette.core.errorContainer}
              label="errorContainer"
            />
            <ColorCard
              color={currentPalette.core.errorContainer}
              bgColor={currentPalette.core.onErrorContainer}
              label="onErrorContainer"
            />
          </div>
        </section>

        {/* Neutral & Outline */}
        <section>
          <SectionTitle>Neutral & Outline</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <ColorCard
              color={currentPalette.core.onSurface}
              bgColor={currentPalette.neutral_outline.outline}
              label="outline"
            />
            <ColorCard
              color={currentPalette.core.onSurface}
              bgColor={currentPalette.neutral_outline.outlineVariant}
              label="outlineVariant"
            />
            <ColorCard
              color={currentPalette.neutral_outline.inverseOnSurface}
              bgColor={currentPalette.neutral_outline.inverseSurface}
              label="inverseSurface"
            />
            <ColorCard
              color={currentPalette.neutral_outline.inverseSurface}
              bgColor={currentPalette.neutral_outline.inverseOnSurface}
              label="inverseOnSurface"
            />
            <ColorCard
              color={currentPalette.core.onPrimary}
              bgColor={currentPalette.neutral_outline.inversePrimary}
              label="inversePrimary"
            />
          </div>
        </section>

        {/* State Colors */}
        <section>
          <SectionTitle>State Colors</SectionTitle>

          {/* Success */}
          <h3
            className="text-xl font-semibold mb-4"
            style={{ color: currentPalette.core.onBackground }}
          >
            Success
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <ColorCard
              color={currentPalette.states.onSuccess}
              bgColor={currentPalette.states.success}
              label="success"
            />
            <ColorCard
              color={currentPalette.states.success}
              bgColor={currentPalette.states.onSuccess}
              label="onSuccess"
            />
            <ColorCard
              color={currentPalette.states.onSuccessContainer}
              bgColor={currentPalette.states.successContainer}
              label="successContainer"
            />
            <ColorCard
              color={currentPalette.states.successContainer}
              bgColor={currentPalette.states.onSuccessContainer}
              label="onSuccessContainer"
            />
          </div>

          {/* Warning */}
          <h3
            className="text-xl font-semibold mb-4"
            style={{ color: currentPalette.core.onBackground }}
          >
            Warning
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <ColorCard
              color={currentPalette.states.onWarning}
              bgColor={currentPalette.states.warning}
              label="warning"
            />
            <ColorCard
              color={currentPalette.states.warning}
              bgColor={currentPalette.states.onWarning}
              label="onWarning"
            />
            <ColorCard
              color={currentPalette.states.onWarningContainer}
              bgColor={currentPalette.states.warningContainer}
              label="warningContainer"
            />
            <ColorCard
              color={currentPalette.states.warningContainer}
              bgColor={currentPalette.states.onWarningContainer}
              label="onWarningContainer"
            />
          </div>

          {/* Info */}
          <h3
            className="text-xl font-semibold mb-4"
            style={{ color: currentPalette.core.onBackground }}
          >
            Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <ColorCard
              color={currentPalette.states.onInfo}
              bgColor={currentPalette.states.info}
              label="info"
            />
            <ColorCard
              color={currentPalette.states.info}
              bgColor={currentPalette.states.onInfo}
              label="onInfo"
            />
            <ColorCard
              color={currentPalette.states.onInfoContainer}
              bgColor={currentPalette.states.infoContainer}
              label="infoContainer"
            />
            <ColorCard
              color={currentPalette.states.infoContainer}
              bgColor={currentPalette.states.onInfoContainer}
              label="onInfoContainer"
            />
          </div>

          {/* Disabled */}
          <h3
            className="text-xl font-semibold mb-4"
            style={{ color: currentPalette.core.onBackground }}
          >
            Disabled
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <ColorCard
              color={currentPalette.states.onDisabled}
              bgColor={currentPalette.states.disabled}
              label="disabled"
            />
            <ColorCard
              color={currentPalette.states.disabled}
              bgColor={currentPalette.states.onDisabled}
              label="onDisabled"
            />
          </div>
        </section>

        {/* Elevation */}
        <section>
          <SectionTitle>Elevation Levels</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            {Object.entries(currentPalette.elevation).map(([key, value]) => (
              <ColorCard
                key={key}
                color={currentPalette.core.onSurface}
                bgColor={value}
                label={key}
                showAccent={true}
              />
            ))}
          </div>

          {/* Elevation Visual Demo */}
          <div
            className="relative h-96 rounded-xl overflow-hidden"
            style={{ backgroundColor: currentPalette.core.background }}
          >
            {Object.entries(currentPalette.elevation).map(
              ([key, value], index) => (
                <div
                  key={key}
                  className="absolute rounded-lg p-6 transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: value,
                    left: `${index * 15 + 20}px`,
                    top: `${index * 40 + 20}px`,
                    width: "200px",
                    boxShadow: `0 ${index * 2 + 2}px ${
                      index * 4 + 8
                    }px rgba(0,0,0,${isDark ? 0.5 : 0.15})`,
                  }}
                >
                  <p
                    className="font-bold text-sm mb-2"
                    style={{ color: currentPalette.core.onSurface }}
                  >
                    {key}
                  </p>
                  <p
                    className="text-xs font-mono opacity-75"
                    style={{ color: currentPalette.core.onSurface }}
                  >
                    {value}
                  </p>
                  <p
                    className="text-xs mt-2 opacity-60"
                    style={{ color: currentPalette.core.onSurface }}
                  >
                    Elevation Level {index + 1}
                  </p>
                </div>
              )
            )}
          </div>
        </section>

        {/* Usage Examples */}
        <section>
          <SectionTitle>Real-World Usage Examples</SectionTitle>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Card Example */}
            <div
              className="rounded-xl p-6 shadow-lg"
              style={{ backgroundColor: currentPalette.core.surface }}
            >
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: currentPalette.core.onSurface }}
              >
                Card Component
              </h3>
              <p
                className="mb-4"
                style={{ color: currentPalette.core.onSurfaceVariant }}
              >
                This demonstrates a typical card layout with proper contrast and
                hierarchy.
              </p>
              <div className="flex gap-3">
                <button
                  className="px-6 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                  style={{
                    backgroundColor: currentPalette.core.primary,
                    color: currentPalette.core.onPrimary,
                  }}
                >
                  Primary
                </button>
                <button
                  className="px-6 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                  style={{
                    backgroundColor: currentPalette.core.secondaryContainer,
                    color: currentPalette.core.onSecondaryContainer,
                  }}
                >
                  Secondary
                </button>
              </div>
            </div>

            {/* Alert Examples */}
            <div className="space-y-4">
              {/* Success Alert */}
              <div
                className="rounded-lg p-4 border-l-4"
                style={{
                  backgroundColor: currentPalette.states.successContainer,
                  borderColor: currentPalette.states.success,
                }}
              >
                <p
                  className="font-semibold"
                  style={{ color: currentPalette.states.onSuccessContainer }}
                >
                  Success Message
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: currentPalette.states.onSuccessContainer }}
                >
                  Operation completed successfully!
                </p>
              </div>

              {/* Warning Alert */}
              <div
                className="rounded-lg p-4 border-l-4"
                style={{
                  backgroundColor: currentPalette.states.warningContainer,
                  borderColor: currentPalette.states.warning,
                }}
              >
                <p
                  className="font-semibold"
                  style={{ color: currentPalette.states.onWarningContainer }}
                >
                  Warning Message
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: currentPalette.states.onWarningContainer }}
                >
                  Please review before proceeding.
                </p>
              </div>

              {/* Error Alert */}
              <div
                className="rounded-lg p-4 border-l-4"
                style={{
                  backgroundColor: currentPalette.core.errorContainer,
                  borderColor: currentPalette.core.error,
                }}
              >
                <p
                  className="font-semibold"
                  style={{ color: currentPalette.core.onErrorContainer }}
                >
                  Error Message
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: currentPalette.core.onErrorContainer }}
                >
                  Something went wrong. Please try again.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div
        className="max-w-7xl mx-auto mt-16 pt-8 border-t"
        style={{ borderColor: currentPalette.neutral_outline.outline }}
      >
        <p
          className="text-center text-sm"
          style={{ color: currentPalette.core.onSurfaceVariant }}
        >
          Color Palette Debug Tool - Hover over cards and click the copy icon to
          copy hex codes
        </p>
        <p
          className="text-center text-xs mt-2"
          style={{ color: currentPalette.core.onSurfaceVariant }}
        >
          Professional UI/UX Design System © 2025
        </p>
      </div>
    </div>
  );
};

export default ColorPaletteDebug;
