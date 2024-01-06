async function __nip07_polyfill_getPublicKey() {
  const privkey = await __nip07_polyfill_getPrivateKey(true);
  if (privkey) return Promise.resolve(window.NostrTools.getPublicKey(privkey));

  pubkey = localStorage.getItem("__nip07_polyfill_pubkey") || prompt("This website asks for your public key.\n\nInsert your nostr public key:");
  if (!pubkey) return Promise.reject("No pubkey was submitted.");
  localStorage.setItem("__nip07_polyfill_pubkey", pubkey);
  return Promise.resolve(pubkey.startsWith("npub") ? window.NostrTools.nip19.decode(pubkey).data : pubkey);
}

async function __nip07_polyfill_signEvent(event) {
  if (!confirm(`This site wants to sign this event:\n${JSON.stringify(event)}\n\nSign the event?`)) return Promise.reject("User rejected this event to be signed.");
  const privkey = await __nip07_polyfill_getPrivateKey();
  event.created_at = Math.floor(Date.now() / 1000);
  event.pubkey = window.NostrTools.getPublicKey(privkey);
  event.id = window.NostrTools.getEventHash(event);
  event.sig = window.NostrTools.getSignature(event, privkey);

  if (!window.NostrTools.validateEvent(event)) return Promise.reject("Something went wrong.");

  return event;
}

async function __nip07_polyfill_getPrivateKey(optional) {
  const privkey = localStorage.getItem("__nip07_polyfill_privkey") || (optional ? null : prompt("Insert your nostr private key:"));
  if (!privkey) return Promise.reject("No private key was being submitted.")
  localStorage.setItem("__nip07_polyfill_privkey", privkey);

  return Promise.resolve(privkey.startsWith("nsec") ? window.NostrTools.nip19.decode(privkey).data : privkey);
}

window.addEventListener("load", function() {
  // For some reasons, window.nostr is not detected after "load".
  setTimeout(_ => {
    if (!window.NostrTools) throw Error("nip07-polyfill require nostr-tools to be loaded!");
    if (typeof(window.nostr) !== "object") {
      window.nip07_polyfill.load();
      console.warn("[nip07_polyfill] nip07 addon not detected. loaded polyfill");
    }
  }, 35);
});

window.nip07_polyfill = {
  clearData: _ => {
    localStorage.removeItem("__nip07_polyfill_pubkey");
    localStorage.removeItem("__nip07_polyfill_privkey");
  },
  load: _ => {
    window.nostr = {
      getPublicKey: __nip07_polyfill_getPublicKey,
      signEvent: __nip07_polyfill_signEvent,
      getRelays: _ => []
    }
  }
}
