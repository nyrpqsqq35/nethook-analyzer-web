# nethook-analyzer-web

## Usage
https://nyrpqsqq35.github.io/nethook-analyzer-web/

Requires Chromium 134+ or another browser with File System Access/FileSystemObserver APIs available.

## Features
```
+ Works on non-Windows platforms
+ Open nethook2 session folder
+ Open individual messages (.bin) file
+ Hide message types
+ View multiple messages at once
+ Game Coordinator (GC) message decoding for CS2
    - GC Shared Object (SO) decoding for CS2
+ Display as
    - Display as preferences saved in local storage 
    - Bytes
        + TODO: Binary KeyValues (VDF)/LZMA
        + Protobuf (select descriptor to decode with, TODO: decoding w/o descriptor) 
        + ASCII
        + UTF-8
        + Hex
    - Numeric
        + SteamID64 -> SteamID2/SteamID3
        + GlobalID
        + Chars/inversed chars
        + TODO: Date/Time
```

## Screenshot
![Screenshot](.github/Screenshot%202025-10-20%20at%201.38.47%E2%80%AFAM.png)