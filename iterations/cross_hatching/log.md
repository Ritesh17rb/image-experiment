# Cross-Hatching Engraving - Development Log

## Effect Description
Traditional pen & ink illustration technique with multiple directional line patterns at varying densities based on tonal values.

## Source Image
`images/photo2.avif` - Portrait photograph

---

## Iteration 1: Basic Edge Detection
**Command:**
```bash
convert images/photo2.avif -colorspace Gray -edge 1 -negate iterations/cross_hatching/iteration_1.avif
```

**Approach:**
- Simple edge detection with negation
- Converts to grayscale first
- Creates basic line art

**Observations:**
- Clean edge lines but no directional hatching
- Missing the cross-hatching pattern entirely
- Too simple - just an outline drawing

**Feedback for Next Iteration:**
- Need to add directional motion blur to create hatch lines
- Should layer multiple directions (0°, 90°)

---

## Iteration 2: Directional Hatching
**Command:**
```bash
convert images/photo2.avif -colorspace Gray \
  \( +clone -edge 1 -motion-blur 0x3+0 \) \
  \( +clone -edge 1 -motion-blur 0x3+90 \) \
  -compose darken -composite -negate \
  iterations/cross_hatching/iteration_2.avif
```

**Changes from Previous:**
- Added two directional passes: horizontal (0°) and vertical (90°)
- Used motion blur after edge detection
- Darkening compose mode to combine layers

**Observations:**
- Now has perpendicular hatching lines
- Creates actual cross-hatching pattern
- Still missing diagonal directions

**Feedback for Next Iteration:**
- Add 45° and 135° angles for full cross-hatching
- Needs better contrast control

---

## Iteration 3: Full Cross-Hatching (4 Directions)
**Command:**
```bash
convert images/photo2.avif -colorspace Gray \
  \( +clone -edge 1 -motion-blur 0x2+0 \) \
  \( +clone -edge 1 -motion-blur 0x2+45 \) \
  \( +clone -edge 1 -motion-blur 0x2+90 \) \
  \( +clone -edge 1 -motion-blur 0x2+135 \) \
  -compose darken -flatten -negate -level 20%,80% \
  iterations/cross_hatching/iteration_3.avif
```

**Changes from Previous:**
- Added diagonal directions (45° and 135°)
- Reduced blur radius to 2 for finer lines
- Added level adjustment for contrast

**Observations:**
- Complete cross-hatching in all 4 primary directions
- Better tonal range with level adjustment
- Lines are uniform weight - not varying by tone

**Feedback for Next Iteration:**
- Need to vary line density/weight based on image tones
- Should use different edge thresholds for each direction

---

## Iteration 4: Varied Line Weights
**Command:**
```bash
convert images/photo2.avif \
  \( +clone -colorspace Gray -write mpr:gray +delete \) \
  mpr:gray \( +clone -edge 2 -motion-blur 0x2.5+0 \) \
  \( mpr:gray -edge 2 -motion-blur 0x2.5+90 \) -compose darken -composite \
  \( mpr:gray -edge 1.5 -motion-blur 0x2+45 \) -compose darken -composite \
  \( mpr:gray -edge 1.5 -motion-blur 0x2+135 \) -compose darken -composite \
  -negate -brightness-contrast 10x20 \
  iterations/cross_hatching/iteration_4.avif
```

**Changes from Previous:**
- Stored grayscale in mpr register for reuse
- Different edge radii: 2 for horizontal/vertical, 1.5 for diagonals
- Different blur amounts for each direction
- Added brightness-contrast adjustment

**Observations:**
- More natural-looking with varied line weights
- Horizontal/vertical lines are more prominent (traditional technique)
- Better overall contrast

**Feedback for Next Iteration:**
- Use threshold to control line density by tonal area
- Dark areas should have denser hatching

---

## Iteration 5: Threshold-Based Density
**Command:**
```bash
convert images/photo2.avif \
  \( +clone -colorspace Gray -write mpr:gray +delete \) \
  mpr:gray \( +clone -edge 2 -threshold 30% -motion-blur 0x3+0 \) \
  \( mpr:gray -edge 2 -threshold 40% -motion-blur 0x3+90 \) -compose darken -composite \
  \( mpr:gray -edge 1.2 -threshold 50% -motion-blur 0x2+45 \) -compose darken -composite \
  \( mpr:gray -edge 1.2 -threshold 50% -motion-blur 0x2+135 \) -compose darken -composite \
  -negate -unsharp 0x1 -level 15%,85% \
  iterations/cross_hatching/iteration_5.avif
```

**Changes from Previous:**
- Added threshold after edge detection (30%, 40%, 50%)
- Different thresholds create density variation
- Added unsharp mask for line crispness
- Level adjustment for better tonal range

**Observations:**
- Much better tonal variation - darker areas have more lines
- Hatching density now responds to image content
- Lines are crisper with unsharp

**Feedback for Next Iteration:**
- Try Canny edge detection for more refined edges
- Could use sigmoidal contrast for better midtones

---

## Iteration 6: Canny Edge Detection
**Command:**
```bash
convert images/photo2.avif \
  \( +clone -colorspace Gray -write mpr:gray +delete \) \
  mpr:gray \( +clone -canny 0x1+10%+30% -motion-blur 0x3.5+0 \) \
  \( mpr:gray -canny 0x1+10%+30% -motion-blur 0x3.5+90 \) -compose darken -composite \
  \( mpr:gray -level 0%,60% -edge 1 -motion-blur 0x2.2+45 \) -compose darken -composite \
  \( mpr:gray -level 0%,60% -edge 1 -motion-blur 0x2.2+135 \) -compose darken -composite \
  -negate -sigmoidal-contrast 3x50% \
  iterations/cross_hatching/iteration_6.avif
```

**Changes from Previous:**
- Used Canny edge detector for primary directions (more accurate edges)
- Level adjustment before edge detection for diagonals
- Sigmoidal contrast for better midtone separation

**Observations:**
- Cleaner, more precise lines with Canny
- Better edge localization
- Improved tonal gradation with sigmoidal contrast

**Feedback for Next Iteration:**
- Try posterization to create distinct tonal zones
- Use multiply compose mode instead of darken

---

## Iteration 7: Posterized Tonal Levels
**Command:**
```bash
convert images/photo2.avif \
  \( +clone -colorspace Gray -posterize 8 -write mpr:tones +delete \) \
  mpr:tones \( +clone -edge 1.8 -motion-blur 0x3+0 -level 30%,100% \) \
  \( mpr:tones -edge 1.8 -motion-blur 0x3+90 -level 30%,100% \) -compose multiply -composite \
  \( mpr:tones -edge 1.2 -motion-blur 0x2.5+45 -level 40%,100% \) -compose multiply -composite \
  \( mpr:tones -edge 1.2 -motion-blur 0x2.5+135 -level 40%,100% \) -compose multiply -composite \
  -negate -contrast-stretch 2%x2% \
  iterations/cross_hatching/iteration_7.avif
```

**Changes from Previous:**
- Posterize to 8 levels creates distinct tone zones
- Multiply compose mode for more realistic ink layering
- Level adjustments on individual hatch directions
- Contrast stretch for final tonal range

**Observations:**
- Clear tonal zones like traditional pen & ink
- Multiply gives more authentic ink density
- Better simulates actual drawing technique

**Feedback for Next Iteration:**
- Add subtle shading overlay for dimensional depth
- Could use evaluate-sequence min for better line combination

---

## Iteration 8: Shading Overlay
**Command:**
```bash
convert images/photo2.avif \
  \( +clone -colorspace Gray -write mpr:gray +delete \) \
  mpr:gray \( +clone -edge 1.5 -motion-blur 0x4+0 \) \
  \( mpr:gray -edge 1.5 -motion-blur 0x4+90 \) \
  \( mpr:gray -edge 1 -motion-blur 0x2.8+45 \) \
  \( mpr:gray -edge 1 -motion-blur 0x2.8+135 \) \
  -evaluate-sequence min -negate \
  \( mpr:gray -blur 0x5 -shade 135x30 -auto-level \) \
  -compose overlay -define compose:args=30 -composite \
  -contrast-stretch 1%x1% \
  iterations/cross_hatching/iteration_8.avif
```

**Changes from Previous:**
- evaluate-sequence min finds darkest values across layers
- Added shade operation for 3D lighting effect
- Overlay compose at 30% opacity for subtle depth
- Increased blur radii for smoother hatch lines

**Observations:**
- Added dimensional quality with shading
- More sophisticated than flat hatching
- Min evaluation creates cleaner line intersections

**Feedback for Next Iteration:**
- Try sketch filter for more organic line quality
- Add paper texture overlay

---

## Iteration 9: Sketch Filter with Paper Texture
**Command:**
```bash
convert images/photo2.avif \
  \( +clone -colorspace Gray -write mpr:base +delete \) \
  mpr:base \( +clone -sketch 0x20+120 -motion-blur 0x2+0 \) \
  \( mpr:base -sketch 0x20+120 -motion-blur 0x2+90 \) -compose darken -composite \
  \( mpr:base -edge 1 -motion-blur 0x1.8+45 \) -compose darken -composite \
  \( mpr:base -edge 1 -motion-blur 0x1.8+135 \) -compose darken -composite \
  -negate \( +clone +noise Gaussian -blur 0x0.5 \) \
  -compose overlay -define compose:args=15 -composite \
  -unsharp 0x0.8 \
  iterations/cross_hatching/iteration_9.avif
```

**Changes from Previous:**
- Sketch filter (radius 0, sigma 20, angle 120) for primary directions
- Gaussian noise + blur creates paper grain texture
- Overlay paper texture at 15% opacity
- Light unsharp for final line definition

**Observations:**
- More organic, hand-drawn quality with sketch filter
- Paper texture adds realism
- Lines have natural variation

**Feedback for Next Iteration:**
- Use morphology Sobel operators for directional edges
- Full paper grain composite for authentic drawing surface

---

## Iteration 10: Morphology Sobel with Full Paper Texture (FINAL)
**Command:**
```bash
convert images/photo2.avif \
  \( +clone -colorspace Gray -write mpr:src +delete \) \
  mpr:src \( +clone -morphology Convolve Sobel:0 -auto-level -motion-blur 0x3.5+0 \) \
  \( mpr:src -morphology Convolve Sobel:90 -auto-level -motion-blur 0x3.5+90 \) \
  \( mpr:src -morphology Convolve Sobel:45 -auto-level -motion-blur 0x2.5+45 \) \
  \( mpr:src -morphology Convolve Sobel:135 -auto-level -motion-blur 0x2.5+135 \) \
  -evaluate-sequence min -negate \
  \( xc:white -size 2500x2500 +noise Random -blur 0x0.3 -colorspace Gray \) \
  -compose multiply -composite \
  -level 10%,90% -unsharp 0x1 \
  iterations/cross_hatching/iteration_10.avif
```

**Changes from Previous:**
- Morphology Sobel convolution for each direction (0°, 90°, 45°, 135°)
- Auto-level after each Sobel operation
- evaluate-sequence min for optimal line combination
- Full paper texture (random noise + blur) multiplied
- Final level adjustment and unsharp

**Final Observations:**
- Most authentic pen & ink cross-hatching effect
- Directional Sobel operators create precise, angle-aware edges
- Paper texture fully integrated via multiply
- Natural line weight variation
- Professional illustration quality

**Best Result:** Iteration 10 - Morphology-based approach with full paper integration

---

## Summary
The iterative process progressed from simple edge detection to sophisticated multi-directional hatching with:
- Directional edge detection (Sobel morphology)
- Varied line densities based on tonal values
- Paper texture integration
- Natural line weight variation
- Professional pen & ink appearance

**Key Techniques Used:**
- Morphology Convolve Sobel (directional edge detection)
- Motion blur at 0°, 45°, 90°, 135°
- evaluate-sequence min (line combination)
- Paper texture via noise + multiply composite
- Level and unsharp for final refinement
