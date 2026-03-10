# PollCraft – Poll Creator App 📊

PollCraft is a beautiful, interactive poll creator web application built with vanilla HTML, CSS, and JavaScript. It features an intuitive glassmorphism-inspired design with multiple color themes and smooth animations.

> **Note:** This initial version stores all poll data locally in your browser using `localStorage`.

## ✨ Features

- **Create Custom Polls**: Quickly create polls with up to 8 custom options.
- **Single & Multiple Choice**: Allow users to select one or multiple answers.
- **Premium UI & Animations**: A sleek dark-mode glassmorphism design with subtle background orb animations.
- **Live Voting Interface**: An interactive voting interface with visual feedback upon selection.
- **Animated Results Dashboard**: Real-time results page featuring animated horizontal bar charts that highlight the winning option(s).
- **Multiple Color Themes**: Choose from 6 vibrant color accents (Violet, Sky, Rose, Emerald, Amber, Pink) per poll.
- **Direct Link Sharing**: Generates unique `#poll/<id>` links that load the poll directly.
- **My Polls Dashboard**: A central management dashboard to view, vote, check results, or delete any of your created polls.
- **Local Persistence**: All created polls and votes are persistently saved in your browser's `localStorage`.

## 🛠️ Technologies Used

- **HTML5**: Semantic page structure.
- **CSS3**: Custom properties (variables), Flexbox/Grid layouts, backdrop filters (glassmorphism), and keyframe animations.
- **Vanilla JavaScript (ES6+)**: DOM manipulation, event handling, routing (via URL Hash), and `localStorage` API. No external frameworks or libraries are required!
- 
## Files

| File | Purpose |
|---|---|
| [index.html]| Page structure — Create, Vote, Results, My Polls views + share modal |
| [style.css] | Premium dark glassmorphism design, animations, responsive layout |
| [app.js]| Poll creation, voting, results, LocalStorage persistence, share links |

## Features

- **Poll Creator** — question input, dynamic options (2–8), poll type (single/multi), expiry, 6 color themes
- **Vote View** — live badge, single or multi-choice voting with animated selection states
- **Results View** — animated bar chart with winner trophy 🏆, vote counts & percentages
- **My Polls Dashboard** — card grid with voting, results, and delete actions
- **Share Modal** — copyable link generated on publish
- **LocalStorage** — polls persist across page reloads
- **Hash routing** — `#poll/<id>` opens vote view directly from a shared link

## Screenshots

**Home Page**

<img width="1905" height="1078" alt="image" src="https://github.com/user-attachments/assets/1f425e46-374d-4836-b802-3ad8e627bcca" />

**Result Page**

<img width="1900" height="1077" alt="image" src="https://github.com/user-attachments/assets/f077ccb7-b5c2-444b-a549-bf6395e8be2a" />

## Session Recording


## 🚀 Getting Started

Since PollCraft is a purely frontend application, setting it up is incredibly simple.

### Prerequisites

All you need is a modern web browser (Chrome, Firefox, Safari, Edge).

### Installation & Usage

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/pollcraft.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd pollcraft
   ```
3. **Run the app:**
   You can either open the `index.html` file directly in your web browser, or for the best experience, run it on a local server. For example, if you have Python installed:
   ```bash
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check out the [issues page](../../issues) if you have any questions or want to help.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔮 Future Roadmap

- **Backend Integration**: Planning migration to Firebase Firestore to allow true cloud syncing, real-time vote updates, and sharing with anyone across devices.
- **Authentication**: Implementing user accounts to track created polls securely.
- **Export Results**: Download poll results via CSV or Image.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.


