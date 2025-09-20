// Security utility - COMPLETELY DISABLED for deployment stability
class SecurityManager {
  constructor() {
    // All security features disabled for stable deployment
    console.log("Security features disabled for stable deployment");
  }

  public isSecurityEnabled(): boolean {
    return false;
  }
}

// Create and export a disabled security manager
const securityManager = new SecurityManager();

export default securityManager;
export { SecurityManager };
