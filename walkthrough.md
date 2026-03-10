# PollCraft – Poll Creator App

A fully functional, beautifully designed poll creator app built with vanilla HTML, CSS, and JavaScript.

## Files

| File | Purpose |
|---|---|
| [index.html](file:///d:/New%20folder/index.html) | Page structure — Create, Vote, Results, My Polls views + share modal |
| [style.css](file:///d:/New%20folder/style.css) | Premium dark glassmorphism design, animations, responsive layout |
| [app.js](file:///d:/New%20folder/app.js) | Poll creation, voting, results, LocalStorage persistence, share links |

## Features

- **Poll Creator** — question input, dynamic options (2–8), poll type (single/multi), expiry, 6 color themes
- **Vote View** — live badge, single or multi-choice voting with animated selection states
- **Results View** — animated bar chart with winner trophy 🏆, vote counts & percentages
- **My Polls Dashboard** — card grid with voting, results, and delete actions
- **Share Modal** — copyable link generated on publish
- **LocalStorage** — polls persist across page reloads
- **Hash routing** — `#poll/<id>` opens vote view directly from a shared link

## Screenshots

<img width="1905" height="1078" alt="image" src="https://github.com/user-attachments/assets/1f425e46-374d-4836-b802-3ad8e627bcca" />

````

## Session Recording

![Full flow recording](file:///C:/Users/Asus/.gemini/antigravity/brain/7aa31629-780d-4e8a-92ab-178bb3db2d05/pollcraft_full_flow_1773067915604.webp)

## How to Run

Open [index.html](file:///d:/New%20folder/index.html) directly in the browser, **or** run a local server:
```
python -m http.server 3737 --directory "d:\New folder"
```
Then visit `http://localhost:3737`
