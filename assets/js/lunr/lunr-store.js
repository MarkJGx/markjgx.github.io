var store = [{
        "title": "Speeding up Unreal Engine (Engine) development by caching your binary dependencies",
        "excerpt":"You can significantly speed up your Unreal Engine, engine not project, workflow by opting to locally cache Unreal’s binary dependencies in a local directory. This is especially useful if you are constantly switching between engine versions, or want to have several local repos checked out. Add a new global environment...","categories": ["Blog"],
        "tags": ["unreal","tips"],
        "url": "/pages/MarkJGx/blog/speeding-unreal/",
        "teaser": null
      },{
        "title": "Debugging the Unreal Header Tool (UHT)",
        "excerpt":"Here’s a quick excerpt from a forum post on how to debug Unreal Header Tool (UHT) in Unreal. “Build UnrealHeaderTool in debug configuration (it needs to be just ‘Debug’, not ‘Debug Editor’ or anything else). You can just switch you active configuration to debug to do this and build UnrealHeaderTool....","categories": ["Blog"],
        "tags": ["unreal","tricks"],
        "url": "/pages/MarkJGx/blog/debugging-uht/",
        "teaser": null
      },{
        "title": "Looking up values in a TMap/TSet with just the hash key.",
        "excerpt":"How do you look up a value in a TMap/TSet without the underlying key type? Let’s say you just have the hash key (uint32 that you can get from GetTypeHash) and nothing else. Do not fret! The Resolution (Code) I’ve crafted some helpers util’s to help you find a value...","categories": ["Blog"],
        "tags": ["unreal","tricks"],
        "url": "/pages/MarkJGx/blog/hacking-tmap-and-tset/",
        "teaser": null
      },{
        "title": "Porting custom UE4 shading models to UE5 (or how to tackle the new GBuffer codegen)",
        "excerpt":"The Preface This is NOT a tutorial on how to add custom shading models in general, only a quick UE4 to UE5 transition helper. The Why? Unreal Engine 5 creates GBuffer encoding/decoding functions through code generation (ShaderCompiler.h/ShaderGenerationUtil.cpp) instead of hard coding (UE4) said functions. If you managed to port your...","categories": ["Blog"],
        "tags": ["unreal","tricks","ue5"],
        "url": "/pages/MarkJGx/blog/porting-custom-shading-models-to-ue5/",
        "teaser": null
      },{
        "title": "PhysX/APEX in Unreal Engine 5",
        "excerpt":"Patch for 5.0.1 (branch #5.0): https://github.com/MarkJGx/UnrealEngine/pull/1 The Preface: I wanted to see if Unreal 5.0 could use PhysX without too much blood sweat and tears, and it could. This is more of a hacky proof of concept than an actually solid PhysX integration, but it works. The How? This isn’t...","categories": ["Blog"],
        "tags": ["unreal","pull-request","physx","apex","ue5"],
        "url": "/pages/MarkJGx/blog/physx-in-ue5/",
        "teaser": null
      },{
        "title": "The quest for double precision time in Unreal Engine 5",
        "excerpt":"The Preface A long while ago I submitted a pull request to EpicGames/UnrealEngine’s main branch implementing a new reflected type called FTime. The Why Okay, cool… Why wouldn’t I just use a float instead? What is FTime? FTime is essentially your normal floating point number, but with a catch! It’s...","categories": ["Blog"],
        "tags": ["ue5","unreal","pull-request"],
        "url": "/pages/MarkJGx/blog/the-quest-for-double-precision-time-in-unreal-engine-5/",
        "teaser": null
      },{
        "title": "WebAssembly in Unreal, not the other way around!",
        "excerpt":"The Postface:  A long while ago I posted a video demonstrating how useful something like WebAssembly can be for Unreal Engine scripting. If you’re interested: look forward to a future blog post that I will [[link]] back to here when I write a piece exploring said demo.  ","categories": ["Blog"],
        "tags": ["unreal","webassembly"],
        "url": "/pages/MarkJGx/blog/web-assembly-in-unreal-not-the-way-around/",
        "teaser": null
      }]
