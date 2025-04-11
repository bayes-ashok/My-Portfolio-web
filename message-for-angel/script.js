document.addEventListener('DOMContentLoaded', () => {
    // Floating Hearts on Click (all pages)
    document.addEventListener('click', (e) => {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'absolute';
        heart.style.left = `${e.pageX}px`;
        heart.style.top = `${e.pageY}px`;
        heart.style.fontSize = '20px';
        heart.style.animation = 'float 2s ease-out forwards';
        document.getElementById('hearts').appendChild(heart);
        setTimeout(() => heart.remove(), 2000);
    });

    // Memories Page (memories.html)
    if (document.querySelector('.gallery')) {
        let revealedCount = 0;
        const totalMemories = document.querySelectorAll('.memory').length;

        window.revealMemory = function(element) {
            if (!element.classList.contains('revealed')) {
                const content = element.querySelector('.memory-content');
                content.classList.remove('hidden');
                element.querySelector('.heart').classList.add('hidden');
                element.classList.add('revealed');
                revealedCount++;
                if (revealedCount === totalMemories) {
                    document.getElementById('next-btn').classList.remove('hidden');
                }
            }
        };
    }

    // Quiz Logic (journey.html)
    if (document.getElementById('quiz')) {
        let currentQuestion = 0;
        const questions = document.querySelectorAll('.quiz-question');
        questions[0].classList.remove('hidden');

        window.checkAnswer = function(correctAnswer, button, questionIndex) {
            if (button.textContent.includes(correctAnswer)) {
                currentQuestion++;
                if (currentQuestion < questions.length) {
                    questions[questionIndex].classList.add('hidden');
                    questions[currentQuestion].classList.remove('hidden');
                } else {
                    document.getElementById('quiz-result').classList.remove('hidden');
                }
            } else {
                alert('Oops! Try again, my love!');
            }
        };
    }

    // Book Page (letter.html)
    if (document.querySelector('.book')) {
        const pages = document.querySelectorAll('.page');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const leftPage = document.querySelector('.left-page');
        let currentPage = 0;

        function updatePages() {
            pages.forEach((page, index) => {
                if (index === currentPage) {
                    page.style.transform = 'rotateY(0deg)';
                    page.style.zIndex = pages.length - index;
                } else if (index < currentPage) {
                    page.style.transform = 'rotateY(-180deg)';
                    page.style.zIndex = pages.length - index - 1;
                } else {
                    page.style.transform = 'rotateY(180deg)';
                    page.style.zIndex = index;
                }
            });
            // Hide left page on cover (page 0), show on inner pages
            leftPage.classList.toggle('hidden', currentPage === 0);
        }

        function updateButtons() {
            prevBtn.classList.toggle('hidden', currentPage === 0);
            nextBtn.classList.toggle('hidden', currentPage === pages.length - 1);
        }

        nextBtn.addEventListener('click', () => {
            if (currentPage < pages.length - 1) {
                currentPage++;
                updatePages();
                updateButtons();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                updatePages();
                updateButtons();
            }
        });

        updatePages();
        updateButtons();
    }

    // Proposal Page (proposal.html)
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    if (yesBtn && noBtn) {
        yesBtn.addEventListener('click', () => {
            // Show alert immediately
            alert('My heart sings—yes! I love you endlessly! ❤️');

            // Start continuous heart spawning after alert
            const heartsContainer = document.getElementById('hearts');
            setInterval(() => {
                const heart = document.createElement('div');
                heart.className = 'heart-animation';
                heart.innerHTML = '❤️';
                heart.style.left = `${Math.random() * 100}vw`;
                heart.style.top = `${Math.random() * 100}vh`;
                // Vary size between 20px and 50px
                const size = 20 + Math.random() * 30;
                heart.style.fontSize = `${size}px`;
                heart.style.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Random color
                heartsContainer.appendChild(heart);
            }, 200); // Spawn a heart every 200ms, indefinitely
        });

        noBtn.addEventListener('mouseover', () => {
            const x = Math.random() * (window.innerWidth - 100);
            const y = Math.random() * (window.innerHeight - 100);
            noBtn.style.position = 'absolute';
            noBtn.style.left = `${x}px`;
            noBtn.style.top = `${y}px`;
        });
    }
});