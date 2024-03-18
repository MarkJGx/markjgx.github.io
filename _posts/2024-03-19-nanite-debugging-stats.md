---
title: "How to inspect Nanite rasterization stats"
categories:
  - Blog
tags:
  - unreal
  - ue5
---

# tldr;

To get this Nanite stat visualization on the screen, type `NaniteStats` into the nearest Unreal viewport console.
![https://www.youtube.com/watch?v=TMorJX3Nj6U&t=542s](/assets/images/nanitestatsdebugepicnanitelivestream.png)

This uses a cool piece of technology that Epic built, letting them raster imgui-esque graphics straight from a shader. The system is called `ShaderPrint`. This totally makes sense, ever since Epic shifted its internal renderer to a more modern GPU driven system, compute shaders and its brethren dominate rendering logic. Shaders aren't relegated to vertex transposition and pixel shading. Welcome to the future!.. Welcome to *cough* ~2015. Grumpy jokes aside, `NaniteStats` is a console command, and the last time I checked those types of viewport console inputs don't auto complete (last time I checked being 5.3).

This console command accepts a single argument, that lowercase argument can be one of four thing:
- `list`
- `primary` - (specifies that we only care about Nanite stats for the primary view)
- `*` - specify a custom Nanite stat filter. Like `VirtualShadowMaps`, there isn't a definite list here because they are defined on a case by case basis, and sometimes with dynamic filter names. You could definitely find more cases by text searching the symbol `Nanite::IsStatFilterActive` inside the engine source code
- `off`

![NaniteStats](/assets/videos/vlc-record-2024-03-19-01h09m36s-Coffee_t5XSUzZtqx.mp4)

Scene is ["Corridor" by Dylan Browne](https://x.com/DylserX/status/1685927605701406721?s=20). 

That's it. P.S: when I started writing this article I wanted to make it into a bigger thing exploring ShaderPrint and its implementation, however that would have taken orders of magnitude more time than just this initial piece. Hope this helps.