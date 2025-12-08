document.addEventListener('DOMContentLoaded', () => {
    const quotes = [
    "Push yourself because no one else is going to do it for you.",
    "Strive for progress, not perfection.",
    "Sweat now, shine later.",
    "Your only limit is you.",
    "Strong today, stronger tomorrow.",
    "Fitness is not a destination, it’s a lifestyle.",
    "Train insane or remain the same.",
    "The body achieves what the mind believes.",
    "Don’t limit your challenges, challenge your limits.",
    "Every workout counts, no matter how small.",
    "Pain is temporary, pride is forever.",
    "Discipline is the bridge between goals and accomplishment.",
    "Be stronger than your excuses.",
    "Success starts with self-discipline.",
    "Fitness is like a relationship. You can’t cheat and expect it to work."
    ];

    const quoteElement = document.getElementById('motivational-quote');

    // Function to get a random quote
    const getRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    };

    // Set the quote on page load/refresh
    quoteElement.textContent = getRandomQuote();
});