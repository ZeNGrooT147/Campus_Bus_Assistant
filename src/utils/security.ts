// Security utility to prevent developer tools access and protect sensitive data
class SecurityManager {
  private isDevMode = import.meta.env.DEV;
  private disableDevtools = import.meta.env.VITE_DISABLE_DEVTOOLS === "true";
  private isProd = import.meta.env.PROD;

  constructor() {
    // Only enable security in production when explicitly requested
    if (this.isProd && this.disableDevtools) {
      this.initSecurity();
    }
  }

  private initSecurity() {
    try {
      // Clear console and disable console methods
      this.disableConsole();

      // Disable right-click context menu
      this.disableRightClick();

      // Disable F12 and other dev tool shortcuts
      this.disableDevToolShortcuts();

      // Monitor for developer tools (non-blocking)
      this.detectDevTools();

      // Prevent text selection and copying
      this.preventSelection();

      // Obfuscate sensitive data
      this.obfuscateData();
    } catch (error) {
      // Silently fail in production to avoid breaking the app
      console.warn("Security initialization failed:", error);
    }
  }

  private disableConsole() {
    const noop = () => {};
    const consoleKeys = [
      "log",
      "debug",
      "info",
      "warn",
      "error",
      "assert",
      "dir",
      "dirxml",
      "group",
      "groupEnd",
      "time",
      "timeEnd",
      "count",
      "trace",
      "profile",
      "profileEnd",
    ];

    consoleKeys.forEach((key) => {
      if (window.console && (window.console as any)[key]) {
        (window.console as any)[key] = noop;
      }
    });

    // Clear existing console
    if (window.console && window.console.clear) {
      window.console.clear();
    }
  }

  private disableRightClick() {
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      return false;
    });
  }

  private disableDevToolShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Disable F12 (DevTools)
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+Shift+C (Element inspector)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+U (View source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+S (Save page)
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+A (Select all)
      if (e.ctrlKey && e.keyCode === 65) {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+P (Print)
      if (e.ctrlKey && e.keyCode === 80) {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+H (History)
      if (e.ctrlKey && e.keyCode === 72) {
        e.preventDefault();
        return false;
      }
    });
  }

  private detectDevTools() {
    let devtools = { open: false, orientation: null };
    const threshold = 160;

    setInterval(() => {
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        if (!devtools.open) {
          devtools.open = true;
          // Redirect to blank page or show warning
          this.handleDevToolsDetected();
        }
      } else {
        devtools.open = false;
      }
    }, 500);
  }

  private handleDevToolsDetected() {
    // Clear the page content
    document.body.innerHTML =
      '<div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:Arial,sans-serif;font-size:24px;color:#666;">Access Denied</div>';

    // Optionally redirect
    // window.location.href = 'about:blank';
  }

  private preventSelection() {
    document.addEventListener("selectstart", (e) => {
      e.preventDefault();
      return false;
    });

    document.addEventListener("dragstart", (e) => {
      e.preventDefault();
      return false;
    });

    // Apply CSS to prevent selection
    const style = document.createElement("style");
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);
  }

  private obfuscateData() {
    // Remove any exposed API keys from window object
    if (typeof window !== "undefined") {
      // Override potential global variables
      (window as any).SUPABASE_URL = undefined;
      (window as any).SUPABASE_KEY = undefined;
      (window as any).GOOGLE_MAPS_KEY = undefined;

      // Clear any meta tags with sensitive data
      const metaTags = document.querySelectorAll("meta");
      metaTags.forEach((tag) => {
        if (
          tag.content &&
          (tag.content.includes("supabase") || tag.content.includes("google"))
        ) {
          tag.remove();
        }
      });
    }
  }

  // Method to check if security is enabled
  public isSecurityEnabled(): boolean {
    return !this.isDevMode && this.disableDevtools;
  }
}

// Initialize security manager
const securityManager = new SecurityManager();

export default securityManager;
