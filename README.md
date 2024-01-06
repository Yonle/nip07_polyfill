## nip07_polyfill
An drop in replacement when NIP-07 addon is not detected.

## Loading the script
You will also need to load [nostr-tools](https://npmjs.com/nostr-tools) script in order to use this polyfill

```html
<script src="https://raw.githubusercontent.com/Yonle/nip07_polyfill/master/nip07_polyfill.js
```

## Function Compatibility
### Supported
- `getPublicKey()`
- `signEvent()`

### Unsupported
- `getRelays()` - will only return empty array.

### Coming soon
- `nip04.encrypt()`
- `nip04.decrypt()`

