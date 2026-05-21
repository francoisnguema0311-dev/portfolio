export class UI {
  constructor(onPlanetSelect, onSpeedChange) {
    this.container = document.getElementById('ui-layer');
    this.onPlanetSelect = onPlanetSelect;
    this.onSpeedChange = onSpeedChange;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="absolute top-6 left-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 pointer-events-auto text-white">
        <h1 class="text-2xl font-bold mb-2">Cosmic Portfolio</h1>
        <p class="text-sm opacity-70 mb-4">Explore the solar system to learn about me</p>
        <div class="flex flex-col gap-2">
          <label class="text-xs uppercase tracking-widest opacity-50">Simulation Speed</label>
          <input type="range" id="speed-slider" min="0" max="5" step="0.1" value="1" class="w-full accent-white cursor-pointer">
        </div>
      </div>

      <div id="planet-info" class="hidden absolute right-6 top-6 bottom-6 w-96 p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 pointer-events-auto transition-all duration-500 translate-x-full">
        <button id="close-info" class="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div id="info-content"></div>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const speedSlider = this.container.querySelector('#speed-slider');
    speedSlider.addEventListener('input', (e) => {
      this.onSpeedChange(parseFloat(e.target.value));
    });

    const closeBtn = this.container.querySelector('#close-info');
    closeBtn.addEventListener('click', () => this.hideInfo());
  }

  showInfo(planetData) {
    const infoPanel = this.container.querySelector('#planet-info');
    const content = this.container.querySelector('#info-content');

    const sections = {
      about: { title: 'About Me', body: 'I am a creative developer specializing in 3D web experiences.' },
      skills: { title: 'Technical Skills', body: 'Three.js, React, Node.js, TypeScript, GSAP, Tailwind CSS.' },
      projects: { title: 'Featured Projects', body: 'A collection of my most ambitious web projects.' },
      experience: { title: 'Professional Journey', body: 'Working with cutting-edge technologies to solve complex problems.' },
      contact: { title: 'Get In Touch', body: 'Let\'s build something incredible together.' },
      testimonials: { title: 'What People Say', body: 'Client testimonials and project reviews.' },
      interests: { title: 'Interests', body: 'Astronomy, Generative Art, and Game Design.' },
      socials: { title: 'Social Presence', body: 'Follow my journey on GitHub, LinkedIn, and X.' },
    };

    const section = sections[planetData.section] || { title: 'Planet', body: 'Information about this celestial body.' };

    content.innerHTML = `
      <h2 class="text-4xl font-bold mb-2">${planetData.name}</h2>
      <p class="text-blue-400 mb-8 font-medium uppercase tracking-widest text-sm">${section.title}</p>
      <div class="text-lg leading-relaxed opacity-80">
        ${section.body}
      </div>
      <div class="mt-12">
        <a href="#" class="px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors inline-block">
          View More
        </a>
      </div>
    `;

    infoPanel.classList.remove('hidden');
    setTimeout(() => {
      infoPanel.classList.remove('translate-x-full');
    }, 10);
  }

  hideInfo() {
    const infoPanel = this.container.querySelector('#planet-info');
    infoPanel.classList.add('translate-x-full');
    setTimeout(() => {
      infoPanel.classList.add('hidden');
    }, 500);
  }
}
