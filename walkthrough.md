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

````carousel
![Create Poll view](file:///C:/Users/Asus/.gemini/antigravity/brain/7aa31629-780d-4e8a-92ab-178bb3db2d05/create_poll_initial_state_1773067946117.png)
<!-- slide -->
![Share modal after publishing](file:///C:/Users/Asus/.gemini/antigravity/brain/7aa31629-780d-4e8a-92ab-178bb3db2d05/poll_published_modal_1773068045614.png)
<!-- slide -->
![Voting page](file:///C:/Users/Asus/.gemini/antigravity/brain/7aa31629-780d-4e8a-92ab-178bb3db2d05/voting_page_1773068069431.png)
<!-- slide -->
![Results with animated bars](file:///C:/Users/Asus/.gemini/antigravity/brain/7aa31629-780d-4e8a-92ab-178bb3db2d05/voting_results_page_1773068101075.png)
<!-- slide -->
![My Polls dashboard](file:///C:/Users/Asus/.gemini/antigravity/brain/7aa31629-780d-4e8a-92ab-178bb3db2d05/my_polls_grid_1773068125143.png)
````

## Session Recording

![Full flow recording](file:///C:/Users/Asus/.gemini/antigravity/brain/7aa31629-780d-4e8a-92ab-178bb3db2d05/pollcraft_full_flow_1773067915604.webp)

## How to Run

Open [index.html](file:///d:/New%20folder/index.html) directly in the browser, **or** run a local server:
```
python -m http.server 3737 --directory "d:\New folder"
```
Then visit `http://localhost:3737`
