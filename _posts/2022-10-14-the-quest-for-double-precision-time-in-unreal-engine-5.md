---
title: "The quest for double precision time in Unreal Engine 5"
categories:
  - Blog
tags:
  - ue5
  - unreal
  - pull-request
---

# The Preface

A long while ago I submitted a pull request to EpicGames/UnrealEngine's main branch implementing a new reflected type called FTime. 

# The Why

Okay, cool... Why wouldn't I just use a float instead?

What is FTime? 
> FTime is essentially your normal floating point number, but with a catch! It's specifically intended to be used with timestamps and any game related time functionality. Because sometimes single precision floating point isn't enough for your grand massively multiplayer duck game, you need your server to up for a longer period of time without time related calculations going haywire because you've hit the limit of your precision. However, sometimes it IS enough and the cost double precision doesn't really make sense. FTime can switch between double floating point precision and single floating point precision with a simple compile time toggle, assuming you're using a source engine build. 

# The Pull Request

The following is the description of the pull request I submitted [here](https://github.com/EpicGames/UnrealEngine/pull/9125).

## Objective

This pull request introduces a new UHT compatible type called `FTime`, with the aim of solving the game time precision on a case by case basis in a similar fashion to LWC's `FReal`. 

## Motivation

### Underlying precision motivations
Single precision floating point does not offer enough precision for a long running dedicated server. The default server tick rate of 30 ticks per second (`NetServerMaxTickRate`'s default, precision: 1.0/30.0) would start experiencing time related issues after `6.1` days.
 
![PrecisionFormula](https://s0.wp.com/latex.php?latex=value+%3D+pow%282%2C+ceil%28log2%28mantissa+%2A+precision%29%29%29&bg=ffffff&fg=666666&s=0&c=20201002) [Source](https://web.archive.org/web/20210116060658/https://blog.demofox.org/2017/11/21/floating-point-precision/)
With double precision floating point, the issues would go from appearing after `6.1` days to `8,925,512` years. 


### Case by case motivations
Nevertheless, outright converting every single usage of game time to a double wouldn't be ideal. Not all games require double precision floating point time and the benefit from using single precision floating point could be more than marginal. Games that use short-lived worlds and replicate heavily could benefit from single precision. Or single-player mobile games,  why increase the underlying memory footprint just because dedicated servers can't run for more than 6 days? How is that relevant to the target platform?

## Design notes
`FTime` is a simple double/float alias that lives inside of `Math/Time.h`, it's included in `CoreMinimal.h` which covers both programs and games. A new UnrealHeaderTool property called `FTimeProperty` has been introduced for the corresponding `FTime` type alias ensuring blueprint/reflection compatibility.

### UHT/Code-gen
`FTimeProperty` traits are generated based on what the current `FTime` type is, the traits are chosen by a compile time inheritance conditional, picking either the double property trait or the float one. (Sidebar: I opted to the use UE type traits in this case instead of std's, not sure what official usage stance is anymore.) When it comes to actually generating the underlying property params, I opt to fake a double/float EPropertyGenFlags based on the PropertyDef's cpp type.

```cpp
      // Switch between EPropertyGenFlags Double and Float depending on FPropertyTypeTraitsTime parent, which in itself is driven by the udnerlying type of FTime.
      const TCHAR* PropertyGenFlag = PropertyDef.GetCPPType(nullptr, 0) == TEXT("double")
                                       ? TEXT("UECodeGen_Private::EPropertyGenFlags::Double")
                                       : TEXT("UECodeGen_Private::EPropertyGenFlags::Float");
```
From my testing, works well.

I originally wrote this on top `5.0.1` which doesn't have the C# UHT version so that has not been implemented at the time of writing. Only old UHT is aware of `FTimeProperty`.

## Engineering impact
Depending on what happens with this pull request, the ability to change the underlying FTime type would require a custom engine fork, which wouldn't be an issue for most developers interested in this type of change. 



Thanks for reading.

P.S: looks like the cherry picks I made from my engine branch have brought back some 5.0.1 code, will address in the morning.
EDIT: needs a bit of additional with regards to 0.0f and 0.0 consistency, backwards compat in the DemoNetDriver serializer, a few invalid uses of FTime, and C# UHT.



 
