---
title: "Debugging the Unreal Header Tool (UHT)"
categories:
  - Blog
tags:
  - unreal
  - tricks
---

Here's a quick excerpt from a forum post on how to debug Unreal Header Tool (UHT) in Unreal.

> Build UnrealHeaderTool in debug configuration (it needs to be just ‘debug’, not ‘debug editor’ or anything else). You can just switch you active configuration to debug to do this and build UnrealHeaderTool. Do this after you build your target project and then go to Engine\Programs\UnrealHeaderTool\Saved\Logs\UnrealHeaderTool.log and copy the command line that’s in the log (note you only need the .uproject path and .manifest path) to UnrealHeaderTool’s command line in Visual Studio project properties (Configuration Properties -> Debugging -> Command Arguments). The set UnrealHeaderTool as your startup project and launch it in Visual Studio. You will now be able to debug UHT as well as the plugin (if it’s loaded). - robert.manuszewski

Source:
https://forums.unrealengine.com/t/scripting-language-extensions-via-plugins/3542/181?u=markjg