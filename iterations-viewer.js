// Effects data with all iterations, commands, and feedback
const effectsData = {
  cross_hatching: {
    name: "Cross-Hatching Engraving",
    description: "Traditional pen & ink illustration with directional line patterns at varying densities",
    color: "#e74c3c",
    iterations: [
      {
        num: 1,
        command: `convert images/photo2.avif -colorspace Gray -edge 1 -negate iteration_1.avif`,
        feedback: "Basic edge detection creates outlines but lacks directional hatching patterns. Too simple - missing the cross-hatching entirely.",
        improvements: "Need to add directional motion blur to create hatch lines in multiple directions."
      },
      {
        num: 2,
        command: `convert images/photo2.avif -colorspace Gray \\
  \\( +clone -edge 1 -motion-blur 0x3+0 \\) \\
  \\( +clone -edge 1 -motion-blur 0x3+90 \\) \\
  -compose darken -composite -negate iteration_2.avif`,
        feedback: "Now has perpendicular hatching lines (0° and 90°). Creates actual cross-hatching pattern but missing diagonal directions.",
        improvements: "Add 45° and 135° angles for full cross-hatching coverage."
      },
      {
        num: 3,
        command: `convert images/photo2.avif -colorspace Gray \\
  \\( +clone -edge 1 -motion-blur 0x2+0 \\) \\
  \\( +clone -edge 1 -motion-blur 0x2+45 \\) \\
  \\( +clone -edge 1 -motion-blur 0x2+90 \\) \\
  \\( +clone -edge 1 -motion-blur 0x2+135 \\) \\
  -compose darken -flatten -negate -level 20%,80% iteration_3.avif`,
        feedback: "Complete cross-hatching in all 4 primary directions. Better tonal range but lines have uniform weight - not varying by tone.",
        improvements: "Vary line density/weight based on image tones using different edge thresholds."
      },
      {
        num: 4,
        command: `convert images/photo2.avif \\
  \\( +clone -colorspace Gray -write mpr:gray +delete \\) \\
  mpr:gray \\( +clone -edge 2 -motion-blur 0x2.5+0 \\) \\
  \\( mpr:gray -edge 2 -motion-blur 0x2.5+90 \\) -compose darken -composite \\
  \\( mpr:gray -edge 1.5 -motion-blur 0x2+45 \\) -compose darken -composite \\
  \\( mpr:gray -edge 1.5 -motion-blur 0x2+135 \\) -compose darken -composite \\
  -negate -brightness-contrast 10x20 iteration_4.avif`,
        feedback: "More natural with varied line weights. Horizontal/vertical lines more prominent (traditional). Better overall contrast.",
        improvements: "Use threshold to control line density by tonal area - darker areas should have denser hatching."
      },
      {
        num: 5,
        command: `convert images/photo2.avif \\
  \\( +clone -colorspace Gray -write mpr:gray +delete \\) \\
  mpr:gray \\( +clone -edge 2 -threshold 30% -motion-blur 0x3+0 \\) \\
  \\( mpr:gray -edge 2 -threshold 40% -motion-blur 0x3+90 \\) -compose darken -composite \\
  \\( mpr:gray -edge 1.2 -threshold 50% -motion-blur 0x2+45 \\) -compose darken -composite \\
  \\( mpr:gray -edge 1.2 -threshold 50% -motion-blur 0x2+135 \\) -compose darken -composite \\
  -negate -unsharp 0x1 -level 15%,85% iteration_5.avif`,
        feedback: "Much better tonal variation - darker areas have more lines. Hatching density responds to image content. Lines are crisper.",
        improvements: "Try Canny edge detection for more refined edges and sigmoidal contrast for better midtones."
      },
      {
        num: 6,
        command: `convert images/photo2.avif \\
  \\( +clone -colorspace Gray -write mpr:gray +delete \\) \\
  mpr:gray \\( +clone -canny 0x1+10%+30% -motion-blur 0x3.5+0 \\) \\
  \\( mpr:gray -canny 0x1+10%+30% -motion-blur 0x3.5+90 \\) -compose darken -composite \\
  \\( mpr:gray -level 0%,60% -edge 1 -motion-blur 0x2.2+45 \\) -compose darken -composite \\
  \\( mpr:gray -level 0%,60% -edge 1 -motion-blur 0x2.2+135 \\) -compose darken -composite \\
  -negate -sigmoidal-contrast 3x50% iteration_6.avif`,
        feedback: "Cleaner, more precise lines with Canny. Better edge localization. Improved tonal gradation with sigmoidal contrast.",
        improvements: "Try posterization to create distinct tonal zones and use multiply compose mode."
      },
      {
        num: 7,
        command: `convert images/photo2.avif \\
  \\( +clone -colorspace Gray -posterize 8 -write mpr:tones +delete \\) \\
  mpr:tones \\( +clone -edge 1.8 -motion-blur 0x3+0 -level 30%,100% \\) \\
  \\( mpr:tones -edge 1.8 -motion-blur 0x3+90 -level 30%,100% \\) -compose multiply -composite \\
  \\( mpr:tones -edge 1.2 -motion-blur 0x2.5+45 -level 40%,100% \\) -compose multiply -composite \\
  \\( mpr:tones -edge 1.2 -motion-blur 0x2.5+135 -level 40%,100% \\) -compose multiply -composite \\
  -negate -contrast-stretch 2%x2% iteration_7.avif`,
        feedback: "Clear tonal zones like traditional pen & ink. Multiply gives more authentic ink density. Better simulates actual drawing technique.",
        improvements: "Add subtle shading overlay for dimensional depth using evaluate-sequence min."
      },
      {
        num: 8,
        command: `convert images/photo2.avif \\
  \\( +clone -colorspace Gray -write mpr:gray +delete \\) \\
  mpr:gray \\( +clone -edge 1.5 -motion-blur 0x4+0 \\) \\
  \\( mpr:gray -edge 1.5 -motion-blur 0x4+90 \\) \\
  \\( mpr:gray -edge 1 -motion-blur 0x2.8+45 \\) \\
  \\( mpr:gray -edge 1 -motion-blur 0x2.8+135 \\) \\
  -evaluate-sequence min -negate \\
  \\( mpr:gray -blur 0x5 -shade 135x30 -auto-level \\) \\
  -compose overlay -define compose:args=30 -composite \\
  -contrast-stretch 1%x1% iteration_8.avif`,
        feedback: "Added dimensional quality with shading. More sophisticated than flat hatching. Min evaluation creates cleaner line intersections.",
        improvements: "Try sketch filter for more organic line quality and add paper texture overlay."
      },
      {
        num: 9,
        command: `convert images/photo2.avif \\
  \\( +clone -colorspace Gray -write mpr:base +delete \\) \\
  mpr:base \\( +clone -sketch 0x20+120 -motion-blur 0x2+0 \\) \\
  \\( mpr:base -sketch 0x20+120 -motion-blur 0x2+90 \\) -compose darken -composite \\
  \\( mpr:base -edge 1 -motion-blur 0x1.8+45 \\) -compose darken -composite \\
  \\( mpr:base -edge 1 -motion-blur 0x1.8+135 \\) -compose darken -composite \\
  -negate \\( +clone +noise Gaussian -blur 0x0.5 \\) \\
  -compose overlay -define compose:args=15 -composite \\
  -unsharp 0x0.8 iteration_9.avif`,
        feedback: "More organic, hand-drawn quality with sketch filter. Paper texture adds realism. Lines have natural variation.",
        improvements: "Use morphology Sobel operators for directional edges with full paper grain composite."
      },
      {
        num: 10,
        command: `convert images/photo2.avif \\
  \\( +clone -colorspace Gray -write mpr:src +delete \\) \\
  mpr:src \\( +clone -morphology Convolve Sobel:0 -auto-level -motion-blur 0x3.5+0 \\) \\
  \\( mpr:src -morphology Convolve Sobel:90 -auto-level -motion-blur 0x3.5+90 \\) \\
  \\( mpr:src -morphology Convolve Sobel:45 -auto-level -motion-blur 0x2.5+45 \\) \\
  \\( mpr:src -morphology Convolve Sobel:135 -auto-level -motion-blur 0x2.5+135 \\) \\
  -evaluate-sequence min -negate \\
  \\( xc:white -size 2500x2500 +noise Random -blur 0x0.3 -colorspace Gray \\) \\
  -compose multiply -composite \\
  -level 10%,90% -unsharp 0x1 iteration_10.avif`,
        feedback: "FINAL - Most authentic pen & ink cross-hatching. Directional Sobel creates precise, angle-aware edges. Paper texture fully integrated. Professional illustration quality.",
        improvements: "Complete - ready for gallery!"
      }
    ]
  },

  bas_relief: {
    name: "Bas-Relief Sculpture",
    description: "3D carved stone/wood effect with depth perception through multi-angle shading",
    color: "#95a5a6",
    iterations: [
      { num: 1, command: "convert images/photo2.avif -colorspace Gray -emboss 2 iteration_1.avif", feedback: "Basic emboss creates slight 3D effect but too flat and uniform.", improvements: "Use shade operator with specific lighting angles." },
      { num: 2, command: "convert images/photo2.avif -colorspace Gray -shade 120x45 -normalize iteration_2.avif", feedback: "Better directional lighting. Normalize stretches contrast but loses some detail.", improvements: "Combine multiple shade operations with compositing." },
      { num: 3, command: "convert images/photo2.avif -colorspace Gray \\( +clone -blur 0x3 -shade 135x30 -auto-level \\) -compose hardlight -composite -modulate 100,0,100 iteration_3.avif", feedback: "Hardlight composite adds depth. Desaturated for stone appearance.", improvements: "Use multiple shading layers at different angles." },
      { num: 4, command: "convert images/photo2.avif \\( +clone -colorspace Gray -write mpr:base +delete \\) mpr:base \\( +clone -blur 0x5 -shade 120x40 -auto-level -sigmoidal-contrast 4x50% \\) -compose overlay -composite \\( +clone -blur 0x2 -emboss 3 \\) -compose hardlight -define compose:args=50 -composite -level 20%,80% iteration_4.avif", feedback: "Multi-layer approach with both shade and emboss. Sigmoidal contrast enhances midtones.", improvements: "Try dual-angle shading with screen composite." },
      { num: 5, command: "convert images/photo2.avif -colorspace Gray \\( +clone -blur 0x4 -shade 130x35 -auto-level \\) \\( +clone -blur 0x2 -shade 110x50 -auto-level \\) -compose screen -composite -sigmoidal-contrast 5x50% \\( +clone -edge 1 -negate -blur 0x0.5 \\) -compose multiply -composite iteration_5.avif", feedback: "Dual-angle lighting creates more complex surface. Edge definition adds carved detail.", improvements: "Add Sobel morphology for precise edge definition." },
      { num: 6, command: "convert images/photo2.avif \\( +clone -colorspace Gray -write mpr:src +delete \\) mpr:src -blur 0x6 \\( +clone -shade 125x38 -auto-level -write mpr:shade1 +delete \\) \\( mpr:src -blur 0x3 -shade 140x45 -auto-level -write mpr:shade2 +delete \\) mpr:shade1 mpr:shade2 -compose lighten -composite -sigmoidal-contrast 6x50% \\( mpr:src -morphology Convolve Sobel -auto-level \\) -compose multiply -define compose:args=80 -composite -modulate 100,0,100 iteration_6.avif", feedback: "Sobel edges define carved areas precisely. Lighten composite merges lighting angles naturally.", improvements: "Add stone texture with noise and polynomial function." },
      { num: 7, command: "convert images/photo2.avif -colorspace Gray -write mpr:orig \\( +clone -blur 0x8 -shade 128x40 -auto-level -function polynomial 2,-1.5,0.5 -write mpr:relief \\) \\( mpr:orig -blur 0x2 +noise Uniform -blur 0x0.3 -write mpr:stone \\) mpr:relief mpr:stone -compose overlay -composite -sigmoidal-contrast 5x50% -level 15%,85% iteration_7.avif", feedback: "Polynomial shaping creates authentic tonal response. Stone texture adds material quality.", improvements: "Use spread and multiplicative noise for carved surface texture." },
      { num: 8, command: "convert images/photo2.avif -colorspace Gray -write mpr:base \\( +clone -blur 0x10 -shade 132x42 -auto-level -sigmoidal-contrast 7x50% \\) \\( mpr:base -blur 0x4 -shade 115x35 -auto-level \\) -compose softlight -composite \\( mpr:base -spread 1.2 +noise Multiplicative -blur 0x0.4 \\) -compose overlay -define compose:args=40 -composite \\( mpr:base -morphology Convolve Sobel -negate -blur 0x0.3 \\) -compose multiply -composite -level 18%,82% -unsharp 0x1.5 iteration_8.avif", feedback: "Spread adds irregularity to carved surface. Multiplicative noise creates authentic texture.", improvements: "Triple-angle lighting with charcoal for tool marks." },
      { num: 9, command: "convert images/photo2.avif -colorspace Gray -write mpr:src \\( +clone -blur 0x12 -shade 135x40 -auto-level -gamma 1.2 \\) \\( mpr:src -blur 0x6 -shade 120x50 -auto-level -gamma 0.9 \\) -compose lighten -composite \\( mpr:src -blur 0x3 -shade 110x30 -auto-level \\) -compose darken -composite -sigmoidal-contrast 6x50% \\( mpr:src -charcoal 0.5 -blur 0x0.3 -level 40%,100% \\) -compose multiply -define compose:args=70 -composite -level 12%,88% iteration_9.avif", feedback: "Triple-angle lighting from different elevations. Charcoal adds tool mark detail.", improvements: "Evaluate-sequence mean for smooth angle blending with enhanced texture." },
      { num: 10, command: "convert images/photo2.avif -colorspace Gray -write mpr:orig \\( +clone -blur 0x15 -shade 130x42 -auto-level -sigmoidal-contrast 8x50% -write mpr:primary \\) \\( mpr:orig -blur 0x8 -shade 145x38 -auto-level -gamma 1.1 \\) \\( mpr:orig -blur 0x4 -shade 115x48 -auto-level -gamma 0.95 \\) -evaluate-sequence mean mpr:primary -compose softlight -composite \\( mpr:orig +noise Multiplicative -blur 0x0.4 -spread 1 -level 30%,70% \\) -compose overlay -define compose:args=35 -composite \\( mpr:orig -morphology Convolve Sobel -auto-level -gamma 0.8 \\) -compose multiply -define compose:args=75 -composite -level 10%,90% -unsharp 0x2+0.8+0.02 iteration_10.avif", feedback: "FINAL - Authentic carved relief with multi-angle averaged lighting. Perfect dimensional depth and surface texture.", improvements: "Complete - gallery ready!" }
    ]
  },

  halftone: {
    name: "Vintage Newspaper Halftone",
    description: "CMYK dot screen printing effect with visible dot patterns and aged paper texture",
    color: "#3498db",
    iterations: [
      { num: 1, command: "convert images/photo2.avif -colorspace Gray -ordered-dither o8x8 iteration_1.avif", feedback: "Basic dithering creates pattern but too uniform and digital-looking.", improvements: "Use halftone-specific patterns (h8x8a)." },
      { num: 2, command: "convert images/photo2.avif -colorspace Gray -ordered-dither h8x8a iteration_2.avif", feedback: "Halftone pattern visible but dots too small. More authentic print appearance.", improvements: "Scale image to enlarge dots." },
      { num: 3, command: "convert images/photo2.avif -colorspace Gray -resize 120% -ordered-dither h8x8a -resize 83.333% iteration_3.avif", feedback: "Larger dots more visible. Better simulates coarse newsprint.", improvements: "Add color back with posterization for vintage effect." },
      { num: 4, command: "convert images/photo2.avif -posterize 3 -threshold 50% iteration_4.avif", feedback: "Simplified due to channel issues. Basic posterized halftone.", improvements: "Add color halftone with posterization." },
      { num: 5, command: "convert images/photo2.avif -posterize 6 -ordered-dither h8x8a -blur 0x0.3 -modulate 100,120,100 iteration_5.avif", feedback: "Posterized color creates vintage palette. Slight blur softens digital edges. Saturation boost adds vibrancy.", improvements: "Add paper texture and reduce colors further." },
      { num: 6, command: "convert images/photo2.avif -brightness-contrast 5x15 -colors 32 +dither -ordered-dither h6x6o -blur 0x0.25 -modulate 100,125,100 iteration_6.avif", feedback: "Color reduction creates authentic vintage palette. Contrast boost compensates for halftone.", improvements: "Add aged paper texture with multiply composite." },
      { num: 7, command: "convert images/photo2.avif -resize 115% -brightness-contrast 8x18 -colors 36 -ordered-dither h8x8o -resize 87% -blur 0x0.3 \\( xc:white -size 2000x2000 +noise Random -blur 0x0.2 \\) -compose multiply -composite -modulate 100,130,100 iteration_7.avif", feedback: "Paper texture overlay adds authenticity. Noise creates paper grain. Better vintage newspaper appearance.", improvements: "Add spread for registration misalignment." },
      { num: 8, command: "convert -size 2200x2200 xc:'rgb(250,245,235)' +noise Random -blur 0x0.25 /tmp/paper8.avif && convert images/photo2.avif -resize 118% -sigmoidal-contrast 4x50% -colors 40 +dither -ordered-dither h8x8o -spread 0.4 -resize 84.75% -blur 0x0.35 /tmp/paper8.avif -compose multiply -composite -modulate 100,135,100 -unsharp 0x0.5 iteration_8.avif", feedback: "Spread adds registration imperfection. Cream paper tone more authentic. Sigmoidal contrast enhances ink density.", improvements: "Increase aging effects with more pronounced texture." },
      { num: 9, command: "convert -size 2400x2400 xc:'rgb(245,238,225)' +noise Random -blur 0x0.3 -level 10%,90% /tmp/paper9.avif && convert images/photo2.avif -resize 120% -brightness-contrast 10x20 -sigmoidal-contrast 5x50% -colors 42 -ordered-dither h8x8o -blur 0x0.4 -spread 0.6 -resize 83.33% /tmp/paper9.avif -compose multiply -composite -modulate 100,140,100 iteration_9.avif", feedback: "More aged paper tone. Stronger spread creates vintage misalignment. Level adjustment on paper adds variation.", improvements: "Add ink spots and final aging effects." },
      { num: 10, command: "convert -size 2500x2500 xc:'rgb(242,235,220)' +noise Random -blur 0x0.35 -level 8%,92% /tmp/paper10.avif && convert images/photo2.avif -resize 122% -brightness-contrast 12x22 -sigmoidal-contrast 6x50% -colors 45 +dither -ordered-dither h8x8o -blur 0x0.45 -spread 0.8 -resize 81.97% /tmp/paper10.avif -compose multiply -composite -modulate 100,145,100 -unsharp 0x0.7+0.6+0.02 -level 5%,95% iteration_10.avif", feedback: "FINAL - Authentic vintage newspaper appearance with aged paper, ink variations, and proper halftone dots.", improvements: "Complete - ready for gallery!" }
    ]
  },

  // Continue with other effects...
  fresco: {
    name: "Fresco with Craquelure",
    description: "Aged wall painting with authentic crack patterns and weathered appearance",
    color: "#e67e22",
    iterations: [
      { num: 1, command: "convert images/photo2.avif -colors 24 +dither -modulate 100,80,100 iteration_1.avif", feedback: "Reduced palette creates flat, poster-like appearance. Desaturated for aged pigment.", improvements: "Add plaster texture with noise." },
      { num: 2, command: "convert images/photo2.avif -colors 28 +dither +noise Uniform -blur 0x0.3 -modulate 100,75,100 -gamma 1.1 iteration_2.avif", feedback: "Uniform noise adds surface grain. Gamma adjustment lightens for weathered look.", improvements: "Add edge-based crack patterns." },
      { num: 3, command: "convert images/photo2.avif -colors 30 +dither -write mpr:base +noise Multiplicative -blur 0x0.4 mpr:base -compose overlay -composite -modulate 100,70,100 -gamma 1.15 iteration_3.avif", feedback: "Multiplicative noise creates plaster-like texture. Overlay composite maintains base image.", improvements: "Add visible crack overlay with edge detection." },
      { num: 4, command: "convert images/photo2.avif -colors 32 +dither -write mpr:base +noise Multiplicative -blur 0x0.5 -spread 0.8 mpr:base -compose overlay -composite -modulate 100,65,100 -gamma 1.2 iteration_4.avif", feedback: "Spread adds irregularity to texture. More desaturated for aged appearance.", improvements: "Generate crack network with segmentation." },
      { num: 5, command: "convert images/photo2.avif -colors 34 +dither -write mpr:orig +noise Multiplicative -blur 0x0.6 -spread 1 mpr:orig -compose overlay -composite -modulate 100,60,100 -gamma 1.25 -vignette 0x20 iteration_5.avif", feedback: "Vignette adds edge darkening for age. Increased spread creates more plaster variation.", improvements: "Add edge-based crack lines." },
      { num: 6, command: "convert images/photo2.avif -colors 36 +dither -write mpr:base +noise Gaussian -blur 0x0.7 -spread 1.2 mpr:base -compose overlay -composite -edge 0.8 -negate -blur 0x0.3 mpr:base -compose multiply -composite -modulate 100,58,100 -gamma 1.3 iteration_6.avif", feedback: "Edge detection creates crack lines. Negate and blur softens for organic cracks.", improvements: "Integrate crack overlay more subtly." },
      { num: 7, command: "convert images/photo2.avif -colors 38 +dither +noise Multiplicative -blur 0x0.8 -spread 1.5 -write mpr:tex -edge 1 -negate -blur 0x0.4 -level 20%,100% mpr:tex -compose multiply -composite -modulate 100,55,100 -gamma 1.35 -vignette 0x25 iteration_7.avif", feedback: "Level adjustment on cracks controls visibility. Better integration with texture layer.", improvements: "Add median smoothing for fresco surface quality." },
      { num: 8, command: "convert images/photo2.avif -colors 40 +dither -statistic Median 3x3 +noise Multiplicative -blur 0x1 -spread 2 -write mpr:plaster -edge 1.2 -negate -blur 0x0.5 -level 15%,100% mpr:plaster -compose darken -composite -modulate 100,52,100 -gamma 1.4 -brightness-contrast -8x8 -vignette 0x30 iteration_8.avif", feedback: "Median filter creates smoother dye areas. Darker cracks stand out better. Increased weathering.", improvements: "Add shading for plaster depth perception." },
      { num: 9, command: "convert images/photo2.avif -colors 42 +dither -statistic Median 5x5 +noise Gaussian -blur 0x1.2 -spread 2.5 -write mpr:surface -shade 135x30 -auto-level mpr:surface -compose overlay -composite -edge 1.5 -negate -blur 0x0.6 -level 12%,100% mpr:surface -compose multiply -composite -modulate 100,50,100 -gamma 1.45 -brightness-contrast -10x10 -vignette 0x35 iteration_9.avif", feedback: "Shade operation adds 3D plaster surface lighting. More pronounced aging effects.", improvements: "Final refinement with enhanced crack detail." },
      { num: 10, command: "convert images/photo2.avif -colors 44 +dither -statistic Median 7x7 +noise Multiplicative -blur 0x1.5 -spread 3 -write mpr:base -shade 130x35 -auto-level mpr:base -compose softlight -composite -edge 2 -negate -blur 0x0.7 -level 10%,100% mpr:base -compose multiply -composite -modulate 100,48,100 -gamma 1.5 -brightness-contrast -12x12 -vignette 0x40 -unsharp 0x0.8+0.5+0.02 -contrast-stretch 2%x2% iteration_10.avif", feedback: "FINAL - Authentic aged fresco with plaster texture, organic cracks, and weathered appearance.", improvements: "Complete - ready for gallery!" }
    ]
  },

  paper_cut: {
    name: "Paper Cut Shadow Box",
    description: "Layered paper craft with multiple depth levels casting shadows",
    color: "#9b59b6",
    iterations: [
      { num: 1, command: "convert images/photo2.avif -posterize 5 iteration_1.avif", feedback: "Basic posterization creates distinct color zones but flat appearance.", improvements: "Add morphology smoothing for paper-cut edges." },
      { num: 2, command: "convert images/photo2.avif -posterize 4 -morphology Smooth Octagon:2 iteration_2.avif", feedback: "Smooth morphology softens edges slightly. More paper-like.", improvements: "Increase smoothing and add sharpening." },
      { num: 3, command: "convert images/photo2.avif -posterize 4 -morphology Smooth Octagon:3 -blur 0x0.5 -sharpen 0x1 iteration_3.avif", feedback: "Blur then sharpen creates clean paper-cut edges. Better layer definition.", improvements: "Add shadow simulation with shading." },
      { num: 4, command: "convert images/photo2.avif -posterize 5 -write mpr:base -morphology Smooth Disk:2 -blur 0x0.6 -shade 135x10 -auto-level mpr:base -compose hardlight -define compose:args=30 -composite iteration_4.avif", feedback: "Shade creates subtle shadow/lighting on layers. Hardlight adds depth perception.", improvements: "Generate explicit edge shadows." },
      { num: 5, command: "convert images/photo2.avif -posterize 5 -write mpr:layers -morphology Smooth Disk:3 -blur 0x0.7 -morphology Edge Disk:1 -negate -blur 0x2 -level 70%,100% mpr:layers -compose multiply -composite -unsharp 0x1 iteration_5.avif", feedback: "Edge morphology creates shadow lines between layers. Multiply darkens appropriately.", improvements: "Increase layering with more smoothing." },
      { num: 6, command: "convert images/photo2.avif -posterize 6 -write mpr:orig -morphology Smooth Disk:4 -blur 0x0.8 -shade 130x8 -auto-level -gamma 0.9 mpr:orig -compose softlight -define compose:args=40 -composite -morphology Edge Disk:1.5 -negate -blur 0x3 -level 65%,100% mpr:orig -compose multiply -composite iteration_6.avif", feedback: "Softlight composite more subtle. Stronger edge shadows. Better dimensional effect.", improvements: "Add paper texture grain." },
      { num: 7, command: "convert images/photo2.avif -posterize 6 +dither -morphology Smooth Disk:5 -blur 0x1 +noise Uniform -blur 0x0.2 -unsharp 0x1.2 iteration_7.avif", feedback: "Uniform noise adds paper grain texture. Simplified for stability.", improvements: "Add shading back with texture." },
      { num: 8, command: "convert images/photo2.avif -posterize 7 +dither -morphology Smooth Disk:6 -blur 0x1.2 +noise Gaussian -blur 0x0.3 -spread 0.5 -shade 125x5 -auto-level -brightness-contrast 5x10 iteration_8.avif", feedback: "Gaussian noise with spread creates handmade irregularity. Shade adds raking light.", improvements: "Enhance with more pronounced shadows." },
      { num: 9, command: "convert images/photo2.avif -posterize 7 +dither -morphology Smooth Disk:7 -blur 0x1.5 +noise Multiplicative -blur 0x0.4 -spread 0.8 -shade 122x4 -auto-level -gamma 0.8 -brightness-contrast 8x15 -unsharp 0x1.5 iteration_9.avif", feedback: "Low-angle shade (4° elevation) creates dramatic layer shadows. Multiplicative noise adds paper texture.", improvements: "Final dramatic shadow box effect." },
      { num: 10, command: "convert images/photo2.avif -posterize 8 +dither -morphology Smooth Disk:8 -blur 0x2 +noise Multiplicative -blur 0x0.5 -spread 1 -shade 120x3 -auto-level -gamma 0.75 -sigmoidal-contrast 4x50% -brightness-contrast 10x18 -morphology Edge Disk:3 -negate -blur 0x6 -level 50%,100% +level-colors black,gray80 -unsharp 0x2+0.8+0.02 -vignette 0x15 iteration_10.avif", feedback: "FINAL - Authentic layered paper shadow box with dimensional depth and soft shadows.", improvements: "Complete - ready for gallery!" }
    ]
  }
};

effectsData.glitch_art = {
  name: "Glitch Art / Chromatic Aberration",
  description: "Digital corruption with RGB channel displacement and artifacts",
  color: "#1abc9c",
  iterations: [
    { num: 1, command: "convert images/photo2.avif -separate -define quantum:format=floating-point -channel R -evaluate multiply 1.0 +channel -channel G -roll +5+0 +channel -channel B -roll -5+0 +channel -combine iteration_1.avif", feedback: "Basic RGB channel shift. Red stays, green shifts right, blue shifts left. Creates chromatic aberration.", improvements: "Increase shift amount and add noise." },
    { num: 2, command: "convert images/photo2.avif -separate -channel R -roll +8+0 +channel -channel G -roll +0+0 +channel -channel B -roll -8+0 +channel -combine +noise Impulse -level 1%,99% iteration_2.avif", feedback: "Larger horizontal shift. Impulse noise adds digital corruption. Level prevents extreme values.", improvements: "Add vertical displacement for 2D glitch." },
    { num: 3, command: "convert images/photo2.avif -separate -channel R -roll +12+2 +channel -channel G -roll +0-1 +channel -channel B -roll -12+1 +channel -combine +noise Random -level 2%,98% -motion-blur 0x1+0 iteration_3.avif", feedback: "2D displacement with vertical component. Random noise and horizontal motion blur create scanlines.", improvements: "Add spread for pixel chaos." },
    { num: 4, command: "convert images/photo2.avif -separate -channel R -roll +15+3 -spread 1 +channel -channel G -roll +0+0 +channel -channel B -roll -15-3 -spread 1 +channel -combine +noise Poisson -level 3%,97% -quality 20 iteration_4.avif", feedback: "Spread adds chaotic pixel displacement. Low quality creates compression artifacts.", improvements: "Increase distortion with heavier spread." },
    { num: 5, command: "convert images/photo2.avif -write mpr:orig -separate -channel R -roll +18+5 -spread 1.5 +noise Impulse -level 2%,98% +channel -channel G -roll +2-2 +channel -channel B -roll -18-5 -spread 1.5 +noise Impulse -level 2%,98% +channel -combine -motion-blur 0x1.5+0 -quality 25 iteration_5.avif", feedback: "Heavy spread on R and B channels. Green slightly offset vertically. Motion blur enhances scanlines.", improvements: "Add wave distortion for analog corruption." },
    { num: 6, command: "convert images/photo2.avif -separate -channel R -roll +22+8 -spread 2 +noise Random -level 3%,97% -blur 0x0.3 +channel -channel G -roll +3-3 -spread 0.5 +channel -channel B -roll -22-8 -spread 2 +noise Random -level 3%,97% -blur 0x0.3 +channel -combine -brightness-contrast 5x10 iteration_6.avif", feedback: "Chaotic displacement. Blur on R/B channels softens corruption. Contrast boost compensates.", improvements: "Add wave operator for signal distortion." },
    { num: 7, command: "convert images/photo2.avif -separate -channel R -roll +25+10 -spread 2.5 -wave 2x400 +noise Impulse -level 4%,96% +channel -channel G -roll +5-5 -spread 1 +channel -channel B -roll -25-10 -spread 2.5 -wave 2x400 +noise Impulse -level 4%,96% +channel -combine -motion-blur 0x2+0 -brightness-contrast 8x12 iteration_7.avif", feedback: "Wave distortion adds analog signal corruption. Amplitude 2, wavelength 400.", improvements: "Add swirl for warping effect." },
    { num: 8, command: "convert images/photo2.avif -separate -channel R -roll +28+12 -spread 3 -wave 3x350 -swirl 5 +noise Random -level 5%,95% +channel -channel G -roll +7-7 -spread 1.2 -swirl -3 +channel -channel B -roll -28-12 -spread 3 -wave 3x350 -swirl 5 +noise Random -level 5%,95% +channel -combine -motion-blur 0x2.5+0 -blur 0x0.2 -brightness-contrast 10x15 -quality 30 iteration_8.avif", feedback: "Swirl adds rotational warping. Opposite swirl on green creates complex distortion. Wave amplified.", improvements: "Increase all parameters for extreme glitch." },
    { num: 9, command: "convert images/photo2.avif -separate -channel R -roll +32+15 -spread 3.5 -wave 4x300 -swirl 8 +noise Poisson -level 6%,94% -blur 0x0.3 +channel -channel G -roll +10-10 -spread 1.5 -swirl -5 +noise Impulse -level 3%,97% +channel -channel B -roll -32-15 -spread 3.5 -wave 4x300 -swirl 8 +noise Poisson -level 6%,94% -blur 0x0.3 +channel -combine -motion-blur 0x3+0 -brightness-contrast 12x18 -sigmoidal-contrast 3x50% -quality 35 iteration_9.avif", feedback: "Extreme chromatic aberration. Multiple distortion types combined. Sigmoidal contrast for surreal appearance.", improvements: "Add liquid rescale for final databending." },
    { num: 10, command: "convert images/photo2.avif -separate -channel R -roll +35+18 -spread 4 -wave 5x280 -swirl 10 -liquid-rescale 98x100%! +noise Random -level 7%,93% -blur 0x0.4 +channel -channel G -roll +12-12 -spread 2 -swirl -7 +noise Poisson -level 4%,96% -blur 0x0.2 +channel -channel B -roll -35-18 -spread 4 -wave 5x280 -swirl 10 -liquid-rescale 98x100%! +noise Random -level 7%,93% -blur 0x0.4 +channel -combine -motion-blur 0x3.5+0 -brightness-contrast 15x20 -sigmoidal-contrast 4x50% -quality 40 -unsharp 0x1 iteration_10.avif", feedback: "FINAL - Authentic databending with liquid rescale content-aware distortion. Maximum channel displacement and corruption.", improvements: "Complete - extreme glitch art ready!" }
  ]
};

effectsData.linocut = {
  name: "Linocut / Block Print",
  description: "Bold relief printing with visible carving marks and ink texture",
  color: "#f39c12",
  iterations: [
    { num: 1, command: "convert images/photo2.avif -posterize 3 -threshold 50% iteration_1.avif", feedback: "Basic threshold creates stark black/white. Posterize reduces tones first.", improvements: "Add edge detection for carved marks." },
    { num: 2, command: "convert images/photo2.avif -posterize 3 -edge 1 -negate -threshold 40% +noise Uniform -blur 0x0.2 iteration_2.avif", feedback: "Edge creates outlines. Negate for ink-on-paper. Uniform noise adds ink texture.", improvements: "Use morphology for carved edge quality." },
    { num: 3, command: "convert images/photo2.avif -colors 4 +dither -edge 1.2 -negate -threshold 35% -morphology Erode Disk:1 +noise Multiplicative -blur 0x0.3 -spread 0.5 iteration_3.avif", feedback: "Morphology erode thins edges like carved lines. Multiplicative noise and spread add hand-carved irregularity.", improvements: "Composite with base for ink density." },
    { num: 4, command: "convert images/photo2.avif -colors 4 +dither -write mpr:base -edge 1.5 -negate -threshold 30% -morphology Erode Disk:1.5 +noise Gaussian -blur 0x0.4 -spread 0.8 mpr:base -compose multiply -composite iteration_4.avif", feedback: "Multiply composite creates ink density variation. Base image shows through carved areas.", improvements: "Use charcoal for tool mark texture." },
    { num: 5, command: "convert images/photo2.avif -colors 5 +dither -charcoal 1 -threshold 28% -morphology Erode Disk:2 +noise Multiplicative -blur 0x0.5 -spread 1 -roll +2+1 iteration_5.avif", feedback: "Charcoal adds carving tool texture. Roll creates registration misalignment (authentic print defect).", improvements: "Add dilate to control line weight." },
    { num: 6, command: "convert images/photo2.avif -colors 5 +dither -charcoal 1.2 -threshold 25% -morphology Erode Disk:2.5 -morphology Dilate Disk:1 +noise Poisson -blur 0x0.6 -spread 1.2 -roll +3+2 +level-colors black,'gray(95%)' iteration_6.avif", feedback: "Dilate after erode controls line width. Level-colors creates off-white paper instead of pure white.", improvements: "Use sketch filter for organic carved quality." },
    { num: 7, command: "convert images/photo2.avif -colors 6 +dither -sketch 0x15+120 -threshold 22% -morphology Erode Disk:3 -morphology Dilate Disk:1.5 +noise Multiplicative -blur 0x0.7 -spread 1.5 -roll +4+3 +level-colors black,'gray(92%)' -unsharp 0x0.5 iteration_7.avif", feedback: "Sketch creates hand-drawn carved appearance. Unsharp adds edge definition. More pronounced misalignment.", improvements: "Add paper texture layer." },
    { num: 8, command: "convert -size 2000x2000 xc:white +noise Random -blur 0x0.3 -colorspace Gray /tmp/paper_lino.avif && convert images/photo2.avif -colors 6 +dither -sketch 0x18+125 -threshold 20% -morphology Erode Disk:3.5 -morphology Dilate Disk:2 +noise Gaussian -blur 0x0.8 -spread 2 -roll +5+4 +level-colors black,'gray(90%)' /tmp/paper_lino.avif -compose multiply -composite -brightness-contrast 5x10 iteration_8.avif", feedback: "Paper texture multiplied creates authentic printed-on-paper look. Brightness boost compensates for darkening.", improvements: "Enhance with more texture variation." },
    { num: 9, command: "convert images/photo2.avif -colors 7 +dither -sketch 0x20+130 -threshold 18% -morphology Erode Disk:4 -morphology Dilate Disk:2.5 +noise Multiplicative -blur 0x1 -spread 2.5 -roll +6+5 +level-colors black,'gray(88%)' /tmp/paper_lino.avif -compose multiply -composite -brightness-contrast 8x15 -unsharp 0x0.8 -vignette 0x10 iteration_9.avif", feedback: "More colors allow detail in carved areas. Vignette adds ink pooling at edges. Stronger contrast.", improvements: "Add charcoal back for final tool marks." },
    { num: 10, command: "convert images/photo2.avif -colors 7 +dither -sketch 0x22+135 -threshold 16% -morphology Erode Disk:4.5 -morphology Dilate Disk:3 +noise Poisson -blur 0x1.2 -spread 3 -charcoal 0.3 -roll +7+6 +level-colors black,'gray(85%)' /tmp/paper_lino.avif -compose multiply -composite -brightness-contrast 10x18 -unsharp 0x1+0.6+0.02 -vignette 0x15 -contrast-stretch 1%x1% iteration_10.avif", feedback: "FINAL - Authentic linocut with carved texture, ink variation, paper grain, and registration misalignment.", improvements: "Complete - gallery ready!" }
  ]
};

effectsData.batik = {
  name: "Batik Textile",
  description: "Wax-resist dye with organic crackle patterns and color bleeding",
  color: "#d35400",
  iterations: [
    { num: 1, command: "convert images/photo2.avif -colors 12 +dither -blur 0x1 iteration_1.avif", feedback: "Color reduction creates dye-like palette. Blur simulates color bleeding between wax areas.", improvements: "Add crackle vein patterns." },
    { num: 2, command: "convert images/photo2.avif -colors 14 +dither -blur 0x1.5 -write mpr:base -edge 0.5 -negate -blur 0x0.2 mpr:base -compose overlay -composite -modulate 100,120,100 iteration_2.avif", feedback: "Edge detection creates subtle crack lines. Overlay composite integrates cracks. Saturation boost for vibrant dyes.", improvements: "Make cracks more prominent." },
    { num: 3, command: "convert images/photo2.avif -colors 16 +dither -blur 0x2 -write mpr:base -edge 0.8 -negate -blur 0x0.3 mpr:base -compose darken -composite -modulate 100,125,100 iteration_3.avif", feedback: "Stronger edge detection. Darken composite makes cracks more visible as dye seepage.", improvements: "Use multiply for darker veins." },
    { num: 4, command: "convert images/photo2.avif -colors 18 +dither -blur 0x2.5 -write mpr:dye -edge 1 -negate -blur 0x0.4 mpr:dye -compose multiply -composite -modulate 100,130,100 iteration_4.avif", feedback: "Multiply creates authentic dark crack veins. Increased blur enhances color bleeding effect.", improvements: "Add fabric texture noise." },
    { num: 5, command: "convert images/photo2.avif -colors 20 +dither -blur 0x3 -write mpr:fabric -edge 1.2 -negate -blur 0x0.5 +noise Uniform -blur 0x0.2 mpr:fabric -compose multiply -composite -modulate 100,135,100 -brightness-contrast -5x5 iteration_5.avif", feedback: "Uniform noise adds fabric grain texture. Negative brightness for aged appearance. Stronger cracks.", improvements: "Use Gaussian noise for softer texture." },
    { num: 6, command: "convert images/photo2.avif -colors 22 +dither -blur 0x3.5 -write mpr:base +noise Multiplicative -blur 0x1 mpr:base -compose overlay -composite -edge 1.5 -negate -blur 0x0.6 mpr:base -compose multiply -composite -modulate 100,140,100 -gamma 1.1 iteration_6.avif", feedback: "Multiplicative noise creates authentic fabric texture. Gamma lightens for cotton/silk appearance. More pronounced veining.", improvements: "Add median smoothing for dye diffusion." },
    { num: 7, command: "convert images/photo2.avif -colors 24 +dither -blur 0x4 +noise Gaussian -blur 0x1.2 -spread 0.5 -write mpr:base -edge 2 -negate -blur 0x0.7 mpr:base -compose multiply -composite -modulate 100,145,100 -gamma 1.15 -brightness-contrast -8x8 iteration_7.avif", feedback: "Spread adds handmade irregularity. Stronger edge detection for prominent cracks. More aged/darker.", improvements: "Add motion blur for fabric weave." },
    { num: 8, command: "convert images/photo2.avif -colors 26 +dither -blur 0x4.5 -statistic Median 3x3 +noise Multiplicative -blur 0x1.5 -spread 1 -write mpr:dye -edge 2.5 -negate -blur 0x0.8 mpr:dye -compose darken -composite -modulate 100,150,100 -gamma 1.2 -brightness-contrast -10x10 -vignette 0x15 iteration_8.avif", feedback: "Median filter creates smooth dye diffusion areas. Vignette adds edge aging. Very saturated dyes.", improvements: "Enhance with shade for fabric depth." },
    { num: 9, command: "convert images/photo2.avif -colors 28 +dither -blur 0x5 -statistic Median 5x5 +noise Gaussian -blur 0x2 -spread 1.5 -write mpr:fabric -edge 3 -negate -blur 0x1 -shade 130x20 -auto-level mpr:fabric -compose multiply -composite -modulate 100,155,100 -gamma 1.25 -brightness-contrast -12x12 -sigmoidal-contrast 3x50% -vignette 0x20 iteration_9.avif", feedback: "Shade on cracks adds 3D depth. Sigmoidal contrast enhances fabric appearance. Heavy aging.", improvements: "Add fabric weave with motion blur." },
    { num: 10, command: "convert images/photo2.avif -colors 30 +dither -blur 0x5.5 -statistic Median 7x7 +noise Multiplicative -blur 0x2.5 -spread 2 -motion-blur 0x1+90 -motion-blur 0x1+0 -write mpr:base -edge 3.5 -negate -blur 0x1.2 -shade 125x25 -auto-level mpr:base -compose multiply -composite -modulate 100,160,100 -gamma 1.3 -brightness-contrast -15x15 -sigmoidal-contrast 4x50% -vignette 0x25 -unsharp 0x1+0.5+0.02 iteration_10.avif", feedback: "FINAL - Authentic batik with fabric weave (motion blur), organic crackle veins, color bleeding, and aged appearance.", improvements: "Complete - gallery ready!" }
  ]
};

effectsData.scraperboard = {
  name: "Scraperboard / Scratchboard",
  description: "White scratches through black ink revealing white clay",
  color: "#34495e",
  iterations: [
    { num: 1, command: "convert images/photo2.avif -colorspace Gray -negate -edge 1 -negate iteration_1.avif", feedback: "Basic inversion creates black background. Edge detection creates white scratch lines. Double negate for correct polarity.", improvements: "Add threshold for stark contrast." },
    { num: 2, command: "convert images/photo2.avif -colorspace Gray -negate -edge 1.5 -negate -threshold 60% iteration_2.avif", feedback: "Threshold creates stark black/white separation. White scratches on black. More scratchboard-like.", improvements: "Use sketch filter for organic scratches." },
    { num: 3, command: "convert images/photo2.avif -colorspace Gray -negate -sketch 0x15+100 -negate -level 10%,90% iteration_3.avif", feedback: "Sketch creates varied line weights like actual scratchboard tools. Level adjustment controls scratch density.", improvements: "Add morphology erode for finer scratches." },
    { num: 4, command: "convert images/photo2.avif -colorspace Gray -negate -sketch 0x18+110 -negate -brightness-contrast 10x20 -morphology Erode Disk:1 iteration_4.avif", feedback: "Morphology erode thins scratch lines. Brightness/contrast increase enhances stark appearance.", improvements: "Add posterization for tonal zones." },
    { num: 5, command: "convert images/photo2.avif -colorspace Gray -posterize 6 -negate -sketch 0x20+120 -negate -brightness-contrast 15x25 -morphology Erode Disk:1.5 +noise Impulse -level 2%,98% iteration_5.avif", feedback: "Posterize creates distinct scratch density zones. Impulse noise adds tool mark variation.", improvements: "Use Canny for precise scratch lines." },
    { num: 6, command: "convert images/photo2.avif -colorspace Gray -posterize 7 -negate -canny 0x1+10%+30% -negate -morphology Dilate Disk:1 -blur 0x0.3 -brightness-contrast 18x28 +noise Random -level 3%,97% iteration_6.avif", feedback: "Canny edge detection creates precise, clean scratches. Dilate controls line width. Random noise adds texture.", improvements: "Use Sobel morphology for directional scratches." },
    { num: 7, command: "convert images/photo2.avif -colorspace Gray -posterize 8 -negate -morphology Convolve Sobel -auto-level -negate -morphology Dilate Disk:1.5 -blur 0x0.4 -brightness-contrast 20x30 -charcoal 0.3 +noise Poisson -level 4%,96% iteration_7.avif", feedback: "Sobel convolution creates directional scratch marks. Charcoal adds tool texture. Poisson noise for irregularity.", improvements: "Layer multiple scratch directions." },
    { num: 8, command: "convert images/photo2.avif -colorspace Gray -posterize 9 -negate -morphology Convolve Sobel -auto-level -negate -morphology Dilate Disk:2 -blur 0x0.5 -sketch 0x10+100 -brightness-contrast 22x32 -charcoal 0.5 +noise Multiplicative -blur 0x0.2 -level 5%,95% -unsharp 0x0.8 iteration_8.avif", feedback: "Combining Sobel with sketch creates layered scratch texture. Multiplicative noise adds depth. Unsharp defines scratches.", improvements: "Add directional motion blur for scratch direction." },
    { num: 9, command: "convert images/photo2.avif -colorspace Gray -posterize 10 -negate -morphology Convolve Sobel -auto-level -negate -morphology Dilate Disk:2.5 -blur 0x0.6 -sketch 0x12+105 -charcoal 0.8 -brightness-contrast 25x35 +noise Gaussian -blur 0x0.3 -spread 0.5 -level 6%,94% -unsharp 0x1 -vignette 0x10 iteration_9.avif", feedback: "Spread adds organic hand-scratched variation. Gaussian noise creates clay texture. Vignette darkens edges.", improvements: "Add diagonal motion blur for tool direction." },
    { num: 10, command: "convert images/photo2.avif -colorspace Gray -posterize 11 -negate -morphology Convolve Sobel -auto-level -negate -morphology Dilate Disk:3 -blur 0x0.7 -sketch 0x15+110 -charcoal 1 -brightness-contrast 28x38 +noise Multiplicative -blur 0x0.4 -spread 1 -motion-blur 0x0.5+45 -motion-blur 0x0.5+135 -level 7%,93% -unsharp 0x1.2+0.6+0.02 -vignette 0x15 -contrast-stretch 1%x1% iteration_10.avif", feedback: "FINAL - Authentic scratchboard with directional tool marks (45° and 135° motion blur), varied line weights, and organic texture.", improvements: "Complete - gallery ready!" }
  ]
};

effectsData.solarization = {
  name: "Solarization (Sabattier Effect)",
  description: "Photographic tone reversal with metallic appearance and edge halos",
  color: "#16a085",
  iterations: [
    { num: 1, command: "convert images/photo2.avif -solarize 50% iteration_1.avif", feedback: "Basic solarization at 50% threshold. Creates partial tone reversal. Midtones most affected.", improvements: "Add sigmoidal contrast for metallic appearance." },
    { num: 2, command: "convert images/photo2.avif -solarize 40% -sigmoidal-contrast 3x50% iteration_2.avif", feedback: "Lower threshold increases reversal area. Sigmoidal contrast creates metallic sheen characteristic of Sabattier effect.", improvements: "Add Mackie lines (edge halos)." },
    { num: 3, command: "convert images/photo2.avif -write mpr:orig -solarize 35% -sigmoidal-contrast 4x50% -edge 0.5 -negate -blur 0x0.3 mpr:orig -compose screen -define compose:args=20 -composite iteration_3.avif", feedback: "Edge detection with screen composite creates bright halos at boundaries (Mackie lines). Authentic Sabattier effect.", improvements: "Strengthen edge halos." },
    { num: 4, command: "convert images/photo2.avif -write mpr:base -solarize 32% -sigmoidal-contrast 5x50% -write mpr:solar -edge 0.8 -negate -blur 0x0.4 -level 70%,100% mpr:solar -compose screen -composite -brightness-contrast 5x10 iteration_4.avif", feedback: "Level on edges controls halo intensity. Brightness boost compensates for darkening. More pronounced Mackie lines.", improvements: "Use Sobel for precise edge detection." },
    { num: 5, command: "convert images/photo2.avif -solarize 30% -sigmoidal-contrast 6x50% -write mpr:solar -morphology Convolve Sobel -auto-level -negate -blur 0x0.5 -level 65%,100% mpr:solar -compose screen -composite -modulate 100,110,100 -gamma 0.95 iteration_5.avif", feedback: "Sobel convolution creates precise directional edge detection. Saturation boost and gamma for surreal appearance.", improvements: "Blur base image before solarization." },
    { num: 6, command: "convert images/photo2.avif -solarize 28% -sigmoidal-contrast 7x50% -write mpr:solar -blur 0x1 -morphology Convolve Sobel -auto-level -negate -blur 0x0.6 -level 60%,100% mpr:solar -compose screen -define compose:args=30 -composite -modulate 100,115,100 -gamma 0.9 -brightness-contrast 8x12 iteration_6.avif", feedback: "Pre-blur creates smoother tonal transitions. Screen at 30% for stronger halos. More metallic with gamma 0.9.", improvements: "Add morphology dilate to widen halos." },
    { num: 7, command: "convert images/photo2.avif -blur 0x0.5 -solarize 26% -sigmoidal-contrast 8x50% -write mpr:solar -morphology Convolve Sobel -auto-level -negate -blur 0x0.8 -morphology Dilate Disk:1 -level 55%,100% mpr:solar -compose screen -define compose:args=35 -composite -modulate 100,120,100 -gamma 0.85 -brightness-contrast 10x15 iteration_7.avif", feedback: "Morphology dilate widens Mackie lines. More dramatic with lower gamma. Higher saturation for color version.", improvements: "Increase blur and dilate for prominent halos." },
    { num: 8, command: "convert images/photo2.avif -blur 0x0.8 -solarize 24% -sigmoidal-contrast 9x50% -write mpr:solar -morphology Convolve Sobel -auto-level -negate -blur 0x1 -morphology Dilate Disk:1.5 -level 50%,100% mpr:solar -compose screen -define compose:args=40 -composite -modulate 100,125,100 -gamma 0.8 -brightness-contrast 12x18 -unsharp 0x0.5 iteration_8.avif", feedback: "Strong blur creates smooth tone zones. Wide halos with Disk:1.5 dilate. Unsharp maintains detail. Very surreal metallic.", improvements: "Add shade for dimensional quality." },
    { num: 9, command: "convert images/photo2.avif -blur 0x1 -solarize 22% -sigmoidal-contrast 10x50% -write mpr:solar -morphology Convolve Sobel -auto-level -negate -blur 0x1.2 -morphology Dilate Disk:2 -level 45%,100% -shade 135x30 -auto-level mpr:solar -compose screen -define compose:args=45 -composite -modulate 100,130,100 -gamma 0.75 -brightness-contrast 15x20 -unsharp 0x0.8 iteration_9.avif", feedback: "Shade operation on halos adds depth perception. Very pronounced Mackie lines with 45% screen. Extreme metallic appearance.", improvements: "Final refinement with all parameters optimized." },
    { num: 10, command: "convert images/photo2.avif -blur 0x1.2 -solarize 20% -sigmoidal-contrast 11x50% -write mpr:solar -morphology Convolve Sobel -auto-level -negate -blur 0x1.5 -morphology Dilate Disk:2.5 -level 40%,100% -shade 130x35 -auto-level -gamma 1.1 mpr:solar -compose screen -define compose:args=50 -composite -modulate 100,135,100 -gamma 0.7 -brightness-contrast 18x22 -unsharp 0x1+0.6+0.02 -contrast-stretch 1%x1% -vignette 0x10 iteration_10.avif", feedback: "FINAL - Authentic Sabattier effect with prominent Mackie lines, metallic sheen, surreal tone reversal, and dimensional shaded halos.", improvements: "Complete - gallery ready!" }
  ]
};

// Populate effects overview
function populateEffectsOverview() {
  const container = document.getElementById('effects-overview');

  Object.keys(effectsData).forEach(key => {
    const effect = effectsData[key];
    const card = document.createElement('div');
    card.className = 'col-md-6 col-lg-4';
    card.innerHTML = `
      <div class="card h-100 shadow-sm iteration-card" onclick="location.href='#${key}'">
        <div class="position-relative">
          <img src="iterations/${key}/iteration_10.avif" class="card-img-top smooth-rounded" alt="${effect.name}"
               style="height: 250px; object-fit: cover;">
          <span class="iteration-badge badge text-bg-success">Final Result</span>
        </div>
        <div class="card-body">
          <h5 class="card-title" style="color: ${effect.color}">${effect.name}</h5>
          <p class="card-text small text-body-secondary">${effect.description}</p>
          <div class="d-flex justify-content-between align-items-center mt-3">
            <span class="badge bg-secondary">${effect.iterations.length} iterations</span>
            <a href="#${key}" class="btn btn-sm btn-outline-primary">View Details</a>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Populate detailed sections
function populateDetailedSections() {
  const container = document.getElementById('detailed-sections');

  Object.keys(effectsData).forEach(key => {
    const effect = effectsData[key];
    const section = document.createElement('section');
    section.id = key;
    section.className = 'effect-section mb-5 pb-5 border-bottom';

    let iterationsHTML = '';
    effect.iterations.forEach((iter, idx) => {
      const isLast = idx === effect.iterations.length - 1;
      iterationsHTML += `
        <div class="timeline-item ${isLast ? 'final' : ''} mb-4">
          <div class="card shadow-sm">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-3">
                  <img src="iterations/${key}/iteration_${iter.num}.avif"
                       class="img-fluid smooth-rounded shadow"
                       style="cursor: zoom-in; max-height: 200px; width: 100%; object-fit: cover;"
                       data-bs-toggle="modal"
                       data-bs-target="#imageModal"
                       role="button"
                       alt="Iteration ${iter.num}">
                  <div class="text-center mt-2">
                    <span class="badge ${isLast ? 'bg-success' : 'bg-primary'}">
                      ${isLast ? 'FINAL' : `Iteration ${iter.num}`}
                    </span>
                  </div>
                </div>
                <div class="col-md-9">
                  <h6 class="mb-3">
                    <i class="bi bi-terminal me-2"></i>Command
                    <button class="btn btn-sm btn-outline-secondary float-end copy-command-btn"
                            data-command="${iter.command.replace(/"/g, '&quot;')}">
                      <i class="bi bi-clipboard"></i> Copy
                    </button>
                  </h6>
                  <div class="command-box mb-3">${iter.command}</div>
                  <div class="row mt-3">
                    <div class="col-md-6">
                      <h6><i class="bi bi-chat-dots me-2"></i>Feedback</h6>
                      <p class="small">${iter.feedback}</p>
                    </div>
                    <div class="col-md-6">
                      <h6><i class="bi bi-lightbulb me-2"></i>Next Steps</h6>
                      <p class="small text-success">${iter.improvements}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    section.innerHTML = `
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="display-6 mb-3" style="color: ${effect.color}">
            <i class="bi bi-brush me-2"></i>${effect.name}
          </h2>
          <p class="lead text-body-secondary">${effect.description}</p>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-12">
          <h5 class="mb-3"><i class="bi bi-images me-2"></i>Progression Overview</h5>
          <div class="comparison-slider">
            ${effect.iterations.slice(0, 10).map((iter, idx) => `
              <div class="text-center">
                <img src="iterations/${key}/iteration_${iter.num}.avif"
                     alt="Iteration ${iter.num}"
                     data-bs-toggle="modal"
                     data-bs-target="#imageModal"
                     role="button"
                     style="cursor: zoom-in;">
                <small class="d-block mt-1 text-body-secondary">Iter ${iter.num}</small>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <h5 class="mb-3"><i class="bi bi-clock-history me-2"></i>Iteration Timeline</h5>
          <div class="progress-timeline">
            ${iterationsHTML}
          </div>
        </div>
      </div>

      <div class="text-center mt-4">
        <a href="#overview" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-up me-2"></i>Back to Top
        </a>
      </div>
    `;

    container.appendChild(section);
  });
}

// Handle image modal
document.getElementById('imageModal').addEventListener('show.bs.modal', event => {
  const button = event.relatedTarget;
  const src = button.getAttribute('src');
  const alt = button.getAttribute('alt');

  const modalImage = document.getElementById('imageModalImg');
  const modalTitle = document.getElementById('imageModalLabel');

  modalImage.src = src;
  modalImage.alt = alt || '';
  modalTitle.textContent = alt || 'Image';
});

// Handle command copy
document.addEventListener('click', function(e) {
  if (e.target.closest('.copy-command-btn')) {
    const btn = e.target.closest('.copy-command-btn');
    const command = btn.getAttribute('data-command');

    navigator.clipboard.writeText(command).then(() => {
      const toast = bootstrap.Toast.getOrCreateInstance(document.getElementById('copyToast'));
      toast.show();
    });
  }
});

// Animate counter numbers
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16); // 60fps
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// Animate stats when they come into view
function animateStatsOnView() {
  const statsCards = document.querySelectorAll('.stats-card h2');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        entry.target.classList.add('animated');
        const target = parseInt(entry.target.getAttribute('data-target'));
        animateCounter(entry.target, target, 2000);
      }
    });
  }, { threshold: 0.5 });

  statsCards.forEach(card => observer.observe(card));
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  populateEffectsOverview();
  populateDetailedSections();

  // Animate stats after a short delay
  setTimeout(() => {
    animateStatsOnView();
  }, 300);
});
