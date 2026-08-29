/* Games Selection Page */
import API from '../api.js';
import { GameCard } from '../components/cards.js';

export default function renderGamesPage() {
  return `
    <div class="welcome-section">
      <h1>Rehabilitation Games</h1>
      <p class="welcome-date">Select an exercise to continue your recovery</p>
    </div>
    <div id="games-grid-container" class="game-select-grid">
      <!-- Loading games -->
    </div>
  `;
}

export async function initGamesPage() {
  const container = document.getElementById('games-grid-container');
  try {
    const perfData = await API.getGamePerformance();
    const perf = perfData.performance || {};
    
    container.innerHTML = `
      ${GameCard({
        type: 'target_touch',
        name: 'Target Touch',
        description: 'Improve your hand precision by touching targets that appear on screen.',
        icon: '🎯',
        lastScore: perf.target_touch?.best_score ? 'Best: ' + perf.target_touch.best_score : null,
        onClickPath: '#/games/target_touch'
      })}
      ${GameCard({
        type: 'bubble_pop',
        name: 'Bubble Pop',
        description: 'Open and close your hand to pop bubbles! Helps with hand gripping.',
        icon: '🫧',
        lastScore: perf.bubble_pop?.best_score ? 'Best: ' + perf.bubble_pop.best_score : null,
        onClickPath: '#/games/bubble_pop'
      })}
      ${GameCard({
        type: 'number_show',
        name: 'Number Showing',
        description: 'Show the number of fingers requested on screen to improve dexterity.',
        icon: '🔢',
        lastScore: perf.number_show?.best_score ? 'Best: ' + perf.number_show.best_score : null,
        onClickPath: '#/games/number_show'
      })}
      ${GameCard({
        type: 'thumb_touch',
        name: 'Thumb Touch',
        description: 'Touch your thumb to every other finger sequentially to build coordination.',
        icon: '🖐️',
        lastScore: perf.thumb_touch?.best_score ? 'Best: ' + perf.thumb_touch.best_score : null,
        onClickPath: '#/games/thumb_touch'
      })}
      ${GameCard({
        type: 'object_catch',
        name: 'Object Catch',
        description: 'Enhance your reaction time and hand coordination by catching falling objects.',
        icon: '🧺',
        lastScore: perf.object_catch?.best_score ? 'Best: ' + perf.object_catch.best_score : null,
        onClickPath: '#/games/object_catch'
      })}
      ${GameCard({
        type: 'path_following',
        name: 'Path Following',
        description: 'Build fine motor control by following guided paths with your fingertip.',
        icon: '✏️',
        lastScore: perf.path_following?.best_score ? 'Best: ' + perf.path_following.best_score : null,
        onClickPath: '#/games/path_following'
      })}
    `;
  } catch (err) {
    console.error(err);
    container.innerHTML = '<div class="form-error">Failed to load game data.</div>';
  }
}
