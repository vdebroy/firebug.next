/* See license.txt for terms of usage */
/* jshint esnext: true */
/* global require: true, exports: true, Services: true */


"use strict";

var { Cu } = require("chrome");
var TraceAPI = ["dump", "sysout", "setScope", "matchesNode", "time", "timeEnd"];

// TODO Externalise this constant.
const PREF_DOMAIN = "extensions.firebug.";

var FBTrace = {
  sysout: function() {}
};

try {
  FBTrace = require("core/trace-service").FBTrace || FBTrace;
}
catch(err) {
}
  Cu["import"]("resource://gre/modules/Services.jsm");

/**
 * Support for scoped logging.
 *
 * // The log will be displayed only if DBG_MYMODULE option is on. 'DBG_MYMODULE' preference
 * // will be automatically created and appear in the FBTrace console (after restart).
 * FBTrace = FBTrace.to("DBG_MYMODULE");
 * FBTrace.sysout("mymodule.initialiaze");
 */
FBTrace.to = function(option) {
  // Automatically create corresponding DBG_ + <option> preference so, it appears
  // in the FBTrace Console window and can be checked on/off
  // Note that FBTrace Console is already initialized and do not refresh if a new
  // pref is created. So, the option appears after restart.
  // xxxHonza: FIX ME
  var prefName = PREF_DOMAIN + option;
  dump(prefName + "\n");

  try {
    var value = Services.prefs.getBoolPref(prefName);
  }
  catch(ex) {}

  if (typeof(value) != "boolean") {
      Services.prefs.setBoolPref(prefName, false);
      value = false;
  }

  return new TraceWrapper(this, option);
};

// xxxHonza: hack for now, should be properly implemented together with:
// https://github.com/firebug/firebug.next/issues/1
var TraceError = {
  sysout: FBTrace.to("DBG_ERRORS")
};

// ********************************************************************************************* //
// Wrapper

/**
 * Wraps tracer for given option. Logs made through the wrapper will automatically
 * be checked against the option and only displayed if the option is true.
 * If FBTrace console isn't installed all options are false and there is no
 * additional performance penalty.
 */
function TraceWrapper(tracer, option)
{
    function createMethodWrapper(method)
    {
        return function()
        {
            // Check the option before the log is passed to the tracing console.
            if (tracer[option])
                tracer[method].apply(tracer, arguments);
        };
    }

    for (var i=0; i<TraceAPI.length; i++)
    {
        var method = TraceAPI[i];
        this[method] = createMethodWrapper(method);
    }

    /**
     * Use to check whether scoped tracer is on/off.
     */
    this.__defineGetter__("active", function()
    {
        return tracer[option];
    });
}


// ********************************************************************************************* //
// Exports

exports.FBTrace = FBTrace;
exports.Trace = FBTrace;
exports.TraceError = TraceError;
