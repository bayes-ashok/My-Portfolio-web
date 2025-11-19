const excuses = {
    name: {
        ashok: ["Ashok never baths. It's against the ancient scriptures.", "Ashok is building immunity for the apocalypse.", "Even the soap fears Ashok."],
        default: ["Your name alone is enough reason to skip the bath.", "Real legends don't need names on towels.", "Your parents knew you'd be like this when they named you."]
    },
    weather: {
        Sunny: ["Sun is already drying you, why waste water?", "Too hot outside — bath would just make you sweat again.", "The sun is your natural deodorant today."],
        Rainy: ["Nature is giving you a free bath. Stay inside.", "Rain water is purer than your bucket.", "Why compete with the sky?"],
        Cold: ["Cold water? Are you trying to become a penguin?", "Your body is preserving heat. Don't disturb it.", "Even polar bears skip baths in winter."],
        "Earthquake?": ["Priorities: survive first, hygiene later.", "The earth is shaking — not the time to be slippery.", "Bathroom tiles are dangerous during earthquakes."]
    },
    mood: {
        Happy: ["You're already glowing — no need for soap.", "Happiness is the best perfume.", "Why ruin a perfect mood with water?"],
        Sad: ["Bath won't fix sadness, but skipping it might feel rebellious.", "Let the tears handle the cleaning.", "Depression shower? Nah, depression blanket."],
        Lazy: ["Laziness level approved for no-bath status.", "You're not lazy, you're energy-efficient.", "Moving to the bathroom requires calories you don't have."],
        "I’ll bath tomorrow": ["Classic. Tomorrow never comes.", "Future you will handle it (he won't).", "Procrastination level: God tier."]
    },
    crush: {
        No: ["No crush, no problem. Stay natural.", "Your crush isn't watching — free pass!", "Romance is dead anyway."],
        Yes: ["They already saw you. Damage done. Skip today.", "True love accepts your natural aroma.", "If they like you now, they'll like you forever."]
    },
    lastBath: (days) => {
        if (days < 2) return ["You bathed recently? Calm down, overachiever.", "You're still clean from last time. Relax."];
        if (days < 7) return ["Still within acceptable human range. Chill.", "You're building character."];
        if (days < 14) return ["Legend status achieved.", "You're not dirty, you're seasoned.", "You're aging like fine cheese."];
        return ["You're officially a national heritage site.", "Bacteria have formed a civilization. Let them thrive.", "NASA is studying your microbiome."];
    },
    smell: (val) => {
        if (val < 30) return ["You smell better than 90% of people. Keep it up.", "Fresh enough to fool dogs."];
        if (val < 70) return ["Smell is just personality leaking out.", "It's not bad, it's bold."];
        return ["Even you can't smell yourself anymore — adaptation complete.", "Your smell has evolved into a new life form.", "Flies are circling in respect."];
    },
    laziness: (val) => val > 80 ? ["Laziness this high grants legal exemption from bathing.", "You're basically a statue. Statues don't bath."] 
                            : ["Laziness acceptable. No bath required."],
    water: {
        Yes: ["Save water for the planet. Be a hero.", "Water is precious. Drink it instead."],
        No: ["No water = automatic no-bath. Science.", "Perfect excuse delivered by universe."],
        "Tyo pani Haina": ["Master strategist. No bath today.", "This is peak excuse engineering."]
    },
    people: (n) => n === 0 ? ["Zero people = zero judgment. Live free.", "You're basically invisible today."]
                        : ["They've survived worse. They'll manage.", "Social distancing includes smell distancing."],
    momShout: (n) => n === 0 ? ["Mom is calm. No pressure. Stay strong."] 
                           : ["Mom shouted only " + n + " times? She doesn't even care anymore.", "She'll forget by tomorrow."],
    event: {
        No: ["No event = no rules. Be free.", "Today doesn't matter anyway."],
        "Online only": ["Camera off = smell off. Perfect.", "Zoom doesn't have smell-o-vision yet."],
        Yes: ["They invited you knowing the risk.", "Real friends don't judge.", "It's a smell-positive event."]
    },
    towel: {
        Yes: ["Having a clean towel is overrated.", "Why ruin a perfectly good towel?"],
        No: ["No towel = nature's way of saying no.", "Towel strike in progress."],
        "Lost since 2021": ["Towel has achieved freedom. Respect it.", "You're living the minimalist dream."]
    },
    complain: {
        No: ["Zero complaints = social approval achieved.", "You're winning at life."],
        Yes: ["They were probably joking.", "One complaint doesn't count. Need minimum 3.", "They're just jealous of your natural musk."]
    }
};

document.getElementById('predict-btn').addEventListener('click', () => {
    const name = document.getElementById('name').value.trim().toLowerCase();
    const weather = document.getElementById('weather').value;
    const mood = document.getElementById('mood').value;
    const crush = document.getElementById('crush').value;
    const lastBath = document.getElementById('last-bath').value;
    const smell = parseInt(document.getElementById('smell').value);
    const laziness = parseInt(document.getElementById('laziness').value);
    const water = document.getElementById('water').value;
    const people = parseInt(document.getElementById('people').value) || 0;
    const momShout = parseInt(document.getElementById('mom-shout').value) || 0;
    const event = document.getElementById('event').value;
    const towel = document.getElementById('towel').value;
    const complain = document.getElementById('complain').value;

    const days = lastBath ? Math.max(0, Math.floor((new Date() - new Date(lastBath)) / 86400000)) : 7;

    // Collect one random excuse from each category
    const parts = [];

    // Name easter egg
    if (name === 'ashok') {
        parts.push(randomChoice(excuses.name.ashok));
    } else if (name) {
        parts.push(randomChoice(excuses.name.default));
    }

    parts.push(randomChoice(excuses.weather[weather]));
    parts.push(randomChoice(excuses.mood[mood]));
    parts.push(randomChoice(excuses.crush[crush]));
    parts.push(randomChoice(excuses.lastBath(days)));
    parts.push(randomChoice(typeof excuses.smell === 'function' ? excuses.smell(smell) : excuses.smell));
    parts.push(randomChoice(excuses.laziness(laziness)));
    parts.push(randomChoice(excuses.water[water]));
    parts.push(randomChoice(excuses.people(people)));
    parts.push(randomChoice(excuses.momShout(momShout)));
    parts.push(randomChoice(excuses.event[event]));
    parts.push(randomChoice(excuses.towel[towel]));
    parts.push(randomChoice(excuses.complain[complain]));

    // Combine into one beautiful paragraph
    let paragraph = parts.join(" ") + " Therefore, under no circumstances should you bath today. Stay strong, warrior.";

    document.getElementById('excuse-paragraph').textContent = paragraph;
    document.getElementById('result').classList.remove('hidden');
});

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Live sliders
document.getElementById('smell').addEventListener('input', e => {
    document.getElementById('smell-value').textContent = e.target.value >= 90 ? 'Bhai please' : e.target.value;
});
document.getElementById('laziness').addEventListener('input', e => {
    document.getinventor
    document.getElementById('laziness-value').textContent = e.target.value >= 95 ? 'Statue mode' : e.target.value;
});