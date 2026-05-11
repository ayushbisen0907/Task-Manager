import { createTheme, alpha } from "@mui/material/styles";

const brand = {
  50: "#eef2ff",
  100: "#e0e7ff",
  200: "#c7d2fe",
  300: "#a5b4fc",
  400: "#818cf8",
  500: "#6366f1",
  600: "#4f46e5",
  700: "#4338ca",
  800: "#3730a3",
  900: "#312e81",
};

const neutral = {
  50: "#f8fafc",
  100: "#f1f5f9",
  200: "#e2e8f0",
  300: "#cbd5e1",
  400: "#94a3b8",
  500: "#64748b",
  600: "#475569",
  700: "#334155",
  800: "#1e293b",
  900: "#0f172a",
};

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: brand[600], light: brand[400], dark: brand[700], contrastText: "#fff" },
    secondary: { main: "#ec4899", light: "#f472b6", dark: "#db2777" },
    success: { main: "#10b981", light: "#34d399", dark: "#059669" },
    warning: { main: "#f59e0b", light: "#fbbf24", dark: "#d97706" },
    error: { main: "#ef4444", light: "#f87171", dark: "#dc2626" },
    info: { main: "#0ea5e9", light: "#38bdf8", dark: "#0284c7" },
    background: {
      default: neutral[50],
      paper: "#ffffff",
    },
    text: {
      primary: neutral[900],
      secondary: neutral[500],
    },
    divider: neutral[200],
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700, letterSpacing: "-0.02em" },
    h4: { fontWeight: 700, letterSpacing: "-0.01em" },
    h5: { fontWeight: 600, letterSpacing: "-0.01em" },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: "none", letterSpacing: 0 },
    body1: { fontSize: "0.95rem" },
    body2: { fontSize: "0.875rem" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: "inherit" },
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(8px)",
          color: neutral[900],
          borderBottom: `1px solid ${neutral[200]}`,
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: `1px solid ${neutral[200]}`,
        },
        outlined: { borderColor: neutral[200] },
        elevation1: {
          boxShadow: "0 1px 2px 0 rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.06)",
        },
        elevation2: {
          boxShadow: "0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -1px rgba(15, 23, 42, 0.04)",
        },
        elevation3: {
          boxShadow: "0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.04)",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 10, paddingLeft: 16, paddingRight: 16 },
        sizeLarge: { paddingTop: 10, paddingBottom: 10 },
        containedPrimary: {
          boxShadow: `0 1px 2px 0 ${alpha(brand[600], 0.2)}`,
          "&:hover": {
            boxShadow: `0 4px 12px 0 ${alpha(brand[600], 0.25)}`,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: "background-color 120ms ease",
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined", size: "medium" },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: neutral[200] },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: neutral[300] },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: brand[500],
            borderWidth: 1.5,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 8 },
        sizeSmall: { height: 22, fontSize: "0.72rem" },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: { "& th": { backgroundColor: neutral[50] } },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: neutral[200] },
        head: { color: neutral[600], fontWeight: 600, fontSize: "0.78rem", letterSpacing: "0.04em", textTransform: "uppercase" },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        hover: { "&:hover": { backgroundColor: `${neutral[50]} !important` } },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: neutral[800],
          fontSize: "0.75rem",
          borderRadius: 6,
          paddingTop: 4,
          paddingBottom: 4,
        },
        arrow: { color: neutral[800] },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 16 },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiLink: {
      defaultProps: { underline: "hover" },
      styleOverrides: { root: { fontWeight: 600 } },
    },
  },
});
