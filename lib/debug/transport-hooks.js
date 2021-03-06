/* See license.txt for terms of usage */

"use strict";

module.metadata = {
  "stability": "experimental"
};

var self = require("sdk/self");

const { Trace, TraceError } = require("../core/trace.js").get(module.id);

/**
 * This object is responsible for listening and tracing RDP packets.
 * It's intended for debugging purposes only.
 *
 * TODO:
 * 1. User interface for filtering displayed packets.
 *    See also onPacket method.
 */
function Hooks(client) {
  this.client = client;
}

Hooks.prototype =
/** @lends Hooks */
{
  onPacket: function onPacket(packet) {
    // Ignore newGlobal packets for now.
    // See https://bugzilla.mozilla.org/show_bug.cgi?id=801084
    if (packet.type != "newGlobal" && packet.type != "newSource") {
      // xxxHonza: should be associated with DBG_CONNECTION option
      Trace.sysout("PACKET RECEIVED; " + JSON.stringify(packet), packet);
    }

    this.client.onPacket.apply(this.client, arguments);
  },

  onClosed: function(status) {
    this.client.onClosed(status);
  }
};

// Hook transport of given client object.
function TransportHooks(client) {
  this.client = client
}

TransportHooks.prototype =
{
  hook: function() {
    let transport = this.client._transport;

    this.originalHooks = transport.hooks;
    transport.hooks = new Hooks(this.client);

    this.originalSend = transport.send;
    transport.send = function(packet) {
      Trace.sysout("PACKET SEND " + JSON.stringify(packet), packet);
      this.originalSend.apply(transport, arguments);
    }.bind(this);
  },

  unhook: function() {
    let transport = this.client._transport;
    if (transport) {
      transport.hooks = this.originalHooks;
      transport.send = this.originalSend;
    }
  }
}

// Exports from this module
exports.TransportHooks = TransportHooks;
