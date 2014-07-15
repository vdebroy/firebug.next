
/**
 * Temporary mapping between the module ids and the DBG_ option.
 *
 * Should be removed as soon as the Option tab of the trace console
 * has been improved
 */
exports.TraceModuleOptionMapping = {
  "lib/console/*": "DBG_CONSOLE",
  "lib/debugger/debuggerOverlay.js": "DBG_DEBUGGER",
  /* ... */
};
