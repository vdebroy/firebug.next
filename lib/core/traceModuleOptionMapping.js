
/**
 * Temporary mapping between the module ids and the DBG_ option.
 *
 * Should be removed as soon as the Option tab of the trace console
 * has been improved
 */
exports.TraceModuleOptionMapping = {
  "firebug-next/console/*": "DBG_CONSOLE",
  "firebug-next/debugger/debuggerOverlay": "DBG_DEBUGGER",
  "firebug-next/chrome/context": "DBG_CONTEXT",
  "firebug-next/core/domplate": "DBG_DOMPLATE",
  "firebug-next/dom/domPanel": "DBG_DOM",
  "firebug-next/helloWorld/*": "DBG_HELLOWORLD",
  "firebug-next/options/optionsOverlay": "DBG_OPTIONS",
  "firebug-next/main": "DBG_INITIALIZE",
  /* ... */
};
