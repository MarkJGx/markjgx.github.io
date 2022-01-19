---
title: "Speeding up Unreal Engine (Engine) development by caching your binary dependencies"
categories:
  - Blog
tags:
  - unreal
  - tips
---

You can significantly speed up your Unreal Engine, **engine** not project, workflow by opting to locally cache Unreal's binary dependencies in a local directory. This is especially useful if you are constantly switching between engine versions, or want to have several local repos checked out. 

Add a new global environment variable with the following name and value:

```powershell
UE4_GITDEPS_ARGS=--cache=C:\Users\markjg\clones\GitDepsCache --cache-days=180 --cache-size-multiplier=5
```

The important line here is the `--cache=YourLocalCacheDirectoryPathHere`, that's where your local cache will live. This directory can rapidly grow in size, at the time of writing my cache directory takes up around 26GB's. You're done!

How does this work? Every time you run the engine's `./Setup` executable, that'll will invoke the `GitDependency` tool. Which checks for any invalid (outdated, non-existent) resources and opts to download them. Dependency fetches also happen after certain git operations, specifically on post checkout and post merge (Invoked by git hooks `.git\hooks`, as `post-checkout`, `post-merge`).

This is really painful and tedious on slow connections, you can opt to reduce the redundant downloads by caching the binaries by setting up the `UE4_GITDEPS_ARGS` environment variable, which as you can guess, passes additional arguments the GitDependency tool. All we care about now is caching, but there's a few other arguments you can play around with.  

```powershell
PS C:\Users\markjg\clones\UnrealEngineFive> .\Engine\Binaries\DotNET\GitDependencies.exe ?
Invalid command line parameter: ?

Usage:
   GitDependencies [options]

Options:
   --all                         Sync all folders
   --include=<X>                 Include binaries in folders called <X>
   --exclude=<X>                 Exclude binaries in folders called <X>
   --prompt                      Prompt before overwriting modified files
   --force                       Always overwrite modified files
   --root=<PATH>                 Set the repository directory to be sync
   --threads=<N>                 Use N threads when downloading new files
   --dry-run                     Print a list of outdated files and exit
   --max-retries                 Override maximum number of retries per file
   --proxy=<user:password@url>   Sets the HTTP proxy address and credentials
   --cache=<PATH>                Specifies a custom path for the download cache
   --cache-size-multiplier=<N>   Cache size as multiplier of current download
   --cache-days=<N>              Number of days to keep entries in the cache
   --no-cache                    Disable caching of downloaded files

Detected settings:
   Excluded folders: none
   Proxy server: none
   Download cache: C:\Users\markjg\clones\GitDepsCache

Default arguments can be set through the UE4_GITDEPS_ARGS environment variable.
```

That's it.
