// DOM Elements
const form = document.getElementById('musicForm');
const generateBtn = document.getElementById('generateBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const btnText = generateBtn.querySelector('.btn-text');
const outputSection = document.getElementById('outputSection');
const songTitle = document.getElementById('songTitle');
const songGenre = document.getElementById('songGenre');
const lyricsContent = document.getElementById('lyricsContent');
const playBtn = document.getElementById('playBtn');
const progress = document.getElementById('progress');
const historyBtn = document.getElementById('historyBtn');
const historyContent = document.getElementById('historyContent');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// State
let isPlaying = false;
let progressInterval;

// Sample lyrics templates for different genres
const lyricsTemplates = {
    pop: [
        "Dancing in the moonlight\nFeeling so alive tonight\nNothing's gonna stop us now\nWe're gonna make it somehow",
        "Bright lights and city dreams\nNothing's quite the way it seems\nBut I've got you by my side\nTogether we will rise",
        "Summer days and endless nights\nEverything just feels so right\nWith you here I'm not afraid\nMemories that'll never fade"
    ],
    rock: [
        "Thunder in the distance\nLightning in my soul\nBreaking all resistance\nI'm gonna take control",
        "Fire burning bright tonight\nScreaming through the endless fight\nNever gonna back down\nWe're the kings of this town",
        "Rebel hearts and wild dreams\nNothing's quite the way it seems\nRock and roll forever\nWe'll be legends together"
    ],
    'lo-fi': [
        "Quiet moments in the rain\nWashing away the pain\nSoft melodies in my head\nPeaceful thoughts instead",
        "Coffee shops and rainy days\nLost in thought in gentle ways\nMelancholy but serene\nLiving in this peaceful scene",
        "Midnight thoughts and city lights\nReflecting on these quiet nights\nSlow and steady, calm and true\nFinding peace in all I do"
    ],
    jazz: [
        "Smooth saxophone in the night\nEverything's gonna be alright\nSwinging to that sultry beat\nDancing in the summer heat",
        "Blue notes floating through the air\nMusic magic everywhere\nImprovisation is the key\nJazz will set your spirit free",
        "Midnight at the jazz café\nLetting all our worries drift away\nSyncopated rhythms call\nMusic connects us all"
    ],
    electronic: [
        "Digital dreams and neon lights\nDancing through electric nights\nSynthetic beats inside my heart\nThis is where the future starts",
        "Bass drops and laser shows\nEverybody's on their toes\nElectronic symphony\nThis is our reality",
        "Pixels dancing on the screen\nLiving in a digital dream\nBeats and bytes and endless sound\nIn this cyber world we're found"
    ],
    folk: [
        "Stories told by firelight\nPassing wisdom through the night\nSimple truths and honest songs\nThis is where my heart belongs",
        "Mountain roads and country streams\nLiving simple, chasing dreams\nGuitar strings and gentle voice\nIn this life I made my choice",
        "Old traditions never die\nUnderneath the starlit sky\nFolk songs carry memories\nOf love and loss and victories"
    ]
};

// Song title generators
const titleTemplates = {
    pop: ["Neon Dreams", "Summer Nights", "Dancing Free", "Bright Lights", "City Love"],
    rock: ["Thunder Road", "Rebel Heart", "Fire Storm", "Wild Dreams", "Electric Soul"],
    'lo-fi': ["Quiet Rain", "Midnight Thoughts", "Soft Echoes", "Peaceful Mind", "Dreamy Days"],
    jazz: ["Blue Velvet", "Smooth Night", "Jazz Café", "Sultry Dreams", "Midnight Blues"],
    electronic: ["Digital Love", "Cyber Dreams", "Neon Future", "Electric Pulse", "Synth Wave"],
    folk: ["Country Road", "Mountain Song", "Simple Truth", "Old Stories", "Firelight Tales"]
};

// Utility functions
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateSongTitle(genre, prompt) {
    const templates = titleTemplates[genre] || titleTemplates.pop;
    const baseTitle = getRandomItem(templates);
    
    // Sometimes add a word from the prompt
    const words = prompt.split(' ').filter(word => word.length > 3);
    if (words.length > 0 && Math.random() > 0.5) {
        const promptWord = getRandomItem(words);
        return `${baseTitle} (${promptWord.charAt(0).toUpperCase() + promptWord.slice(1)})`;
    }
    
    return baseTitle;
}

function generateLyrics(genre) {
    const templates = lyricsTemplates[genre] || lyricsTemplates.pop;
    return getRandomItem(templates);
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// localStorage functions
function saveToHistory(data) {
    let history = JSON.parse(localStorage.getItem('musicHistory') || '[]');
    history.unshift({ ...data, timestamp: new Date().toISOString() });
    
    // Keep only last 10 items
    if (history.length > 10) {
        history = history.slice(0, 10);
    }
    
    localStorage.setItem('musicHistory', JSON.stringify(history));
}

function loadHistory() {
    return JSON.parse(localStorage.getItem('musicHistory') || '[]');
}

function clearHistory() {
    localStorage.removeItem('musicHistory');
    displayHistory();
}

// Display functions
function displaySong(data) {
    songTitle.textContent = data.title;
    songGenre.textContent = data.genre.toUpperCase();
    lyricsContent.textContent = data.lyrics;
    
    outputSection.style.display = 'block';
    outputSection.scrollIntoView({ behavior: 'smooth' });
}

function displayHistory() {
    const history = loadHistory();
    
    if (history.length === 0) {
        historyList.innerHTML = '<p style="color: #888; text-align: center;">No songs generated yet.</p>';
        return;
    }
    
    historyList.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-item-title">${item.title}</div>
            <div class="history-item-prompt">"${item.prompt}" - ${item.genre}</div>
            <div class="history-item-date">${formatDate(new Date(item.timestamp))}</div>
        </div>
    `).join('');
}

// Audio player simulation
function togglePlay() {
    if (isPlaying) {
        pauseAudio();
    } else {
        playAudio();
    }
}

function playAudio() {
    isPlaying = true;
    playBtn.textContent = '⏸';
    
    // Simulate audio progress
    let currentProgress = parseInt(progress.style.width) || 45;
    progressInterval = setInterval(() => {
        currentProgress += 1;
        if (currentProgress >= 100) {
            currentProgress = 0;
            pauseAudio();
        }
        progress.style.width = currentProgress + '%';
    }, 200);
}

function pauseAudio() {
    isPlaying = false;
    playBtn.textContent = '▶';
    if (progressInterval) {
        clearInterval(progressInterval);
    }
}

// Main generation function
async function generateMusic(prompt, genre) {
    try {
        // Show loading state
        generateBtn.disabled = true;
        btnText.style.display = 'none';
        loadingSpinner.style.display = 'block';
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
        
        // Generate song data
        const songData = {
            title: generateSongTitle(genre, prompt),
            genre: genre,
            lyrics: generateLyrics(genre),
            prompt: prompt
        };
        
        // Save to history and display
        saveToHistory(songData);
        displaySong(songData);
        
        // Reset audio player
        progress.style.width = '45%';
        playBtn.textContent = '▶';
        isPlaying = false;
        
    } catch (error) {
        console.error('Error generating music:', error);
        alert('Sorry, there was an error generating your song. Please try again.');
    } finally {
        // Reset button state
        generateBtn.disabled = false;
        btnText.style.display = 'inline';
        loadingSpinner.style.display = 'none';
    }
}

// Event listeners
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const prompt = formData.get('prompt').trim();
    const genre = formData.get('genre');
    
    if (!prompt || !genre) {
        alert('Please fill in all fields.');
        return;
    }
    
    await generateMusic(prompt, genre);
});

playBtn.addEventListener('click', togglePlay);

historyBtn.addEventListener('click', () => {
    if (historyContent.style.display === 'none') {
        displayHistory();
        historyContent.style.display = 'block';
        historyBtn.textContent = 'Hide History';
    } else {
        historyContent.style.display = 'none';
        historyBtn.textContent = 'View History';
    }
});

clearHistoryBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all history?')) {
        clearHistory();
    }
});

// Action button event listeners
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('download-btn')) {
        alert('Download feature would be implemented in a real app!');
    }
    
    if (e.target.classList.contains('share-btn')) {
        alert('Share feature would be implemented in a real app!');
    }
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('My Music Maker app initialized!');
    
    // Load history on page load
    displayHistory();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to generate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (!generateBtn.disabled) {
            form.dispatchEvent(new Event('submit'));
        }
    }
    
    // Space to play/pause (when not in input)
    if (e.code === 'Space' && !['TEXTAREA', 'INPUT', 'SELECT'].includes(e.target.tagName)) {
        e.preventDefault();
        if (outputSection.style.display !== 'none') {
            togglePlay();
        }
    }
});