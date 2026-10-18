---
title: "Wave 0.1.0: a player for your own music"
slug: lanzamiento-wave
date: "2026-10-18"
lang: en
excerpt: "I’ve released the first version of Wave: a local music player with a library, playlists, daily mixes and lyrics, without an account or subscription."
---

I’ve released **Wave 0.1.0**, the first version of my local music player. The release is dated **17 October 2026**, and the web client is available to download from [the GitHub release](https://github.com/jaime-gaming/Wave/releases/tag/v0.1.0).

Wave starts with a simple idea: add your own audio files, organize your collection and listen from a single interface. You don’t need to create an account, pay a subscription or upload your music to a server. It isn’t a streaming catalogue: the library starts empty, and you build it with the files you import.

![Wave’s desktop library, with albums and daily mixes](/assets/img/wave-home.png)

*Screenshot of the 0.1.0 web client. The artwork and library shown are demonstration content from the project.*

## What this first version includes

The library lets you browse **songs, albums, artists and favourites**, as well as search your collection. You can create playlists, arrange their songs and choose a cover. During playback, there is an editable queue, a compact player and an expanded view with the current song’s artwork and lyrics.

**Daily mixes** are built from the genre and artist tags in your files, not a remote recommendation service. You can open a mix and review every song before playing it, listen in order or shuffle, and save it as an independent playlist. That copy won’t change when the following day’s mix is refreshed. The number of mixes depends on what your library can support; a small collection may show fewer options.

There are also light and dark themes, artwork-based colours, larger text options and reduced motion. The web client adapts its navigation and controls for use on a phone.

## Lyrics: imported or explicitly searched

You can add text or **LRC** files with synchronized lyrics. You can also search for matches, preview them and decide whether to save them, without starting playback. Saved lyrics remain available for later listening without a connection.

It’s worth distinguishing the local library from lyric searches. Optional lookups use **LRCLIB** and send song metadata to the provider, which also receives connection information. Automatic lookup is initially disabled and can be enabled in Settings. Neither service availability nor coverage for every song is guaranteed.

## Where the files are stored

The web client keeps the library in browser storage, associated with its profile and the address where Wave is opened. It doesn’t change or delete your original files. Removing a song from Wave deletes its stored copy and its playlist references, not the original file on your device.

**Wave is not a backup.** Clearing site data, using private browsing or reaching storage limits can remove the saved library. Always keep your original files. Opening the app at a different address may also give you access to a different library.

Once the app has loaded, local playback and saved lyrics don’t require a network connection. That doesn’t mean this version guarantees an offline start: an installable PWA and full offline startup are still pending.

## How to try Wave

The [Wave 0.1.0 release](https://github.com/jaime-gaming/Wave/releases/tag/v0.1.0) includes **Wave-0.1.0-web.zip**, the presentation video and a SHA-256 checksum file. Extract the web ZIP and serve its contents over HTTP or HTTPS; it isn’t intended to run by opening its `index.html` directly as a local file.

If you prefer to run the source, you’ll need **Node.js 22.12 or later, or Node 24**:

```sh
git clone https://github.com/jaime-gaming/Wave.git
cd Wave
npm ci
npm run dev
```

Open the address printed in the terminal and select **Add music** to import your files. Wave supports MP3, FLAC, WAV, OGG, M4A and AAC, among other formats, with a maximum of 200 MB per file. Playback for each format depends on the browser’s or operating system’s codecs.

## Windows and Android status

The **web client is the most complete** version in this release. The project also includes independent native applications: Windows uses C# and WPF, while Android uses Compose. They aren’t simply wrappers around the website.

It’s important not to confuse those applications with the published assets for this release: native CI packages remain **unsigned test or debug builds**, with feature differences compared with the web client. Android has a smaller scope, and Windows audio and device integration is still under review. They are not presented as official signed installers.

## Code and future changes

Wave is published under the **MIT licence**. The code, documentation and issue tracker are in [the repository](https://github.com/jaime-gaming/Wave). For limitations and platform differences, see [the 0.1.0 release notes](https://github.com/jaime-gaming/Wave/blob/v0.1.0/docs/RELEASE_NOTES_0.1.0.md) and [the platform guide](https://github.com/jaime-gaming/Wave/blob/v0.1.0/docs/PLATFORMS.md).

If you try this version and find a problem, you can open an issue with your platform, browser and the steps to reproduce it. You can also write to me through [Contact](/contact/). Fixes and future versions can be followed on GitHub.
