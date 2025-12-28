document.addEventListener('DOMContentLoaded', () => {
    console.log('AI Travel Buddy App Initialized');

    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    const htmlElement = document.documentElement;

    // Check for saved user preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    // Modal Logic
    const authModal = document.getElementById('auth-modal');
    const authBtn = document.getElementById('auth-btn');
    const closeBtn = document.querySelector('.close-btn');
    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToLogin = document.getElementById('switch-to-login');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    function openModal() {
        authModal.style.display = 'flex';
        setTimeout(() => {
            authModal.classList.add('show');
        }, 10);
    }

    function closeModal() {
        authModal.classList.remove('show');
        setTimeout(() => {
            authModal.style.display = 'none';
        }, 300);
    }

    authBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            closeModal();
        }
    });

    switchToSignup.addEventListener('click', () => {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    });

    switchToLogin.addEventListener('click', () => {
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

    // Mock Form Submission
    const handleAuth = (e) => {
        e.preventDefault();
        const type = e.target.id === 'login-form' ? 'Login' : 'Signup';
        alert(`${type} Successful! (This is a mock application)`);
        closeModal();
    };

    loginForm.addEventListener('submit', handleAuth);
    signupForm.addEventListener('submit', handleAuth);

    // Transport Tab Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Show corresponding content
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Payment & Booking Logic
    const bookBtns = document.querySelectorAll('.book-btn');
    const paymentModal = document.getElementById('payment-modal');
    const closePaymentBtn = document.getElementById('close-payment');
    const paymentForm = document.getElementById('payment-form');
    const bookingDetails = document.getElementById('booking-details');
    const totalPriceEl = document.getElementById('total-price');

    function openPaymentModal(price, itemName) {
        bookingDetails.innerHTML = `<p>Booking for: <strong>${itemName}</strong></p>`;
        totalPriceEl.textContent = price;
        paymentModal.style.display = 'flex';
        setTimeout(() => {
            paymentModal.classList.add('show');
        }, 10);
    }

    function closePaymentModal() {
        paymentModal.classList.remove('show');
        setTimeout(() => {
            paymentModal.style.display = 'none';
        }, 300);
    }

    bookBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Traverse up to find card details
            const card = e.target.closest('.card');
            const title = card.querySelector('h3').textContent;
            const price = card.querySelector('.price').textContent.split(' ')[0]; // Extract just the price

            openPaymentModal(price, title);
        });
    });

    closePaymentBtn.addEventListener('click', closePaymentModal);

    paymentModal.addEventListener('click', (e) => {
        if (e.target === paymentModal) {
            closePaymentModal();
        }
    });

    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = paymentForm.querySelector('button');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
        btn.disabled = true;

        // Mock API Delay
        setTimeout(() => {
            alert('Payment Successful! Your booking is confirmed.');
            btn.innerHTML = originalText;
            btn.disabled = false;
            closePaymentModal();
            paymentForm.reset();
        }, 2000);
    });

    // AI Assistant Logic
    const aiFab = document.getElementById('ai-fab');
    const aiModal = document.getElementById('ai-modal');
    const closeAiBtn = document.getElementById('close-ai');
    const aiInput = document.getElementById('ai-destination-input');
    const aiSearchBtn = document.getElementById('ai-search-btn');
    const aiResult = document.getElementById('ai-result');
    const aiLoading = document.getElementById('ai-loading');

    function openAiModal() {
        aiModal.style.display = 'flex';
        setTimeout(() => {
            aiModal.classList.add('show');
        }, 10);
    }

    function closeAiModal() {
        aiModal.classList.remove('show');
        setTimeout(() => {
            aiModal.style.display = 'none';
        }, 300);
    }

    aiFab.addEventListener('click', openAiModal);
    closeAiBtn.addEventListener('click', closeAiModal);

    aiModal.addEventListener('click', (e) => {
        if (e.target === aiModal) closeAiModal();
    });

    async function fetchGeminiData(destination) {
        const apiKey = config.GEMINI_API_KEY; // Accessing from config.js
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        // Structured prompt to get JSON-like response
        const prompt = `Tell me about ${destination} as a travel destination.
        Provide a JSON response with these fields:
        - "description": A short engaging description (max 2 sentences).
        - "spots": An array of 3-5 famous tourist spots.
        - "image_keyword": A single best search keyword for an image (e.g. "Eiffel Tower").
        Do not use markdown formatting like \`\`\`json. Just raw text.`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text;

            // Cleanup cleanup JSON string if needed
            const cleanText = text.replace(/```json|```/g, '').trim();
            return JSON.parse(cleanText);

        } catch (error) {
            console.error('Error fetching AI data:', error);
            return null;
        }
    }

    aiSearchBtn.addEventListener('click', async () => {
        const destination = aiInput.value.trim();
        if (!destination) return;

        // UI State
        aiResult.classList.add('hidden');
        aiLoading.classList.remove('hidden');
        aiSearchBtn.disabled = true;

        const data = await fetchGeminiData(destination);

        aiLoading.classList.add('hidden');
        aiSearchBtn.disabled = false;

        if (data) {
            // Unsplash Source for dynamic image
            const imageUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(data.image_keyword)}`;

            // Build Result HTML
            let spotsHtml = data.spots.map(spot => `<span class="spot-tag">${spot}</span>`).join('');

            aiResult.innerHTML = `
                <h3>${destination}</h3>
                <img src="${imageUrl}" class="ai-image" alt="${destination}">
                <p style="margin-top: 1rem;">${data.description}</p>
                <div style="margin-top: 1rem;">
                    <strong>Must Visit:</strong><br>
                    ${spotsHtml}
                </div>
            `;
            aiResult.classList.remove('hidden');
        } else {
            aiResult.innerHTML = `<p class="error-text">Sorry, I couldn't find information on that. Try another place!</p>`;
            aiResult.classList.remove('hidden');
        }
    });

    // Allow Enter key
    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') aiSearchBtn.click();
    });
});
