# Deprecation Warnings - Action Required

## expo-av Deprecation (SDK 54)

**Warning:** `expo-av` will be removed in Expo SDK 54 (future release).

### Current Status
The app currently uses `expo-av` for audio functionality, but this is only used as a **placeholder/stub**. The actual implementation uses:
- **Web:** Browser MediaRecorder API (no expo-av dependency)
- **Mobile:** Stub implementation (needs to be replaced)

### Migration Path

When you implement full mobile audio support, use the new packages instead:

#### For Audio Recording & Playback:
```bash
npx expo install expo-audio
```

Replace in `audioService.ts`:
```typescript
// OLD (expo-av)
import { Audio } from 'expo-av';

// NEW (expo-audio)
import { Audio } from 'expo-audio';
```

#### For Video (if needed in future):
```bash
npx expo install expo-video
```

### Timeline
- **Current SDK:** 54.0.25 (expo-av still works but shows warning)
- **Deprecation:** SDK 54 (future release)
- **Action:** Migrate when implementing native mobile audio

### What to Do Now
1. ✅ **Web is ready** - Uses browser APIs (no expo-av)
2. ⚠️ **Mobile needs implementation** - When you implement native recording:
   - Use `expo-audio` instead of `expo-av`
   - Update `audioService.ts` stubs
   - Test on physical devices

### References
- [expo-audio docs](https://docs.expo.dev/versions/latest/sdk/audio/)
- [Migration guide](https://docs.expo.dev/versions/latest/sdk/av/#migration-from-expo-av)

---

## Shadow Props Deprecation (react-native-web)

**Status:** ✅ **FIXED**

**What was wrong:**
```typescript
// OLD - Deprecated for web
shadowColor: '#000',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.3,
shadowRadius: 8,
```

**What we did:**
Created `src/utils/shadow.ts` utility that:
- Uses `boxShadow` on web (CSS standard)
- Uses native shadow props on iOS/Android
- Automatically handles platform differences

**Usage:**
```typescript
import { createShadow } from '../utils/shadow';

// In StyleSheet
buttonStyle: {
  ...createShadow('#000', { width: 0, height: 4 }, 0.3, 8),
}
```

**Files updated:**
- ✅ `src/screens/RecordingScreen.tsx`
- ✅ `src/screens/HomeScreen.tsx`
- ✅ `src/components/AudioRecorder.tsx`

**Result:** No more shadow deprecation warnings on web!
