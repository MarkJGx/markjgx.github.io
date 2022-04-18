---
title: "Porting custom UE4 shading models to UE5 (or how to tackle the new GBuffer codegen)"
categories:
  - Blog
tags:
  - unreal
  - tricks
  - ue5
image:
  feature: /assets/images/beforeport.png
  thumb: /assets/images/beforeport.png
---

![Oh no! My custom shading model isn't working anymore!](/assets/images/beforeport.png)
# Preface
This is NOT a tutorial on how to add custom shading models in general, just a quick UE4 to UE5 transition helper.

# The Why?

**Unreal Engine 5** creates GBuffer encoding/decoding functions through code generation (`ShaderCompiler.h`/`ShaderGenerationUtil.cpp`) instead of hard coding (UE4) said functions. If you managed to port your custom shading model so far and get what you see above, then this blog is for you. Your custom shading model has be introduced into the new GBuffer code generation path. 

# The Resolution (Code)

Start out by adding your custom shading model to the a struct called `FShaderMaterialPropertyDefines` in `ShaderMaterial.h` (in the RenderCore module)
```cpp
// struct FShaderMaterialPropertyDefines
  uint8 MATERIAL_SHADINGMODEL_SINGLELAYERWATER : 1;
  uint8 MATERIAL_SHADINGMODEL_THIN_TRANSLUCENT : 1;

  // Custom shading model
  uint8 MATERIAL_SHADINGMODEL_CUSTOM_SHADING_MODEL : 1;
````
What you're doing is adding a flag to the material property defines struct, indicating whether that shading model is currently active or not.



Next up, navigate to `FShaderCompileUtilities::ApplyFetchEnvironment` in `ShaderGenerationUtil.cpp` and the new custom shading model flag to the function.
```cpp
// FShaderCompileUtilities::ApplyFetchEnvironment(FShaderMaterialPropertyDefines& SrcDefines, FShaderCompilerEnvironment& OutEnvironment)
  FETCH_COMPILE_BOOL(MATERIAL_SHADINGMODEL_THIN_TRANSLUCENT);

    // Custom shading model
  FETCH_COMPILE_BOOL(MATERIAL_SHADINGMODEL_CUSTOM_SHADING_MODEL);

```

`FETCH_COMPILE_BOOL()` is a macro that checks if the shading model flag is present in the current compilation environment, if so the shading model flag will be set in the defines struct. 

Make sure to match the flag with the the underlying custom shading model pre-processor defines you added before, the macro will turn that flag into a string literal and check the compilation environment against said string.

> The underlying flag is added to the environment by `GetMaterialEnvironment` in `MaterialHLSLEmitter.cpp`. Fortunately, we don't have to worry about that, as that's already done by past you. 

Last but not least, we have to mark our custom shading model as relevant to the GBuffer (and in doing so the GBuffer encoding/decoding codegen).

`ShaderGenerationUtil.cpp` 
```cpp
  // DetermineUsedMaterialSlots (global scope function)

  if (Mat.MATERIAL_SHADINGMODEL_CUSTOM_SHADING_MODEL)
  {
    SetStandardGBufferSlots(Slots, bWriteEmissive, bHasTangent, bHasVelocity, bHasStaticLighting, bIsStrataMaterial);
    // Uncomment if your shading model has custom data.
    // Slots[GBS_CustomData] = bUseCustomData; 
  }
```

That's it, UE5 is aware of your custom shading model and will include it as a valid material slot in the GBuffer codegen. Thanks for reading.

# The Result

![There we go, custom shading models in UE5](/assets/images/workingshadingmodel.png)
