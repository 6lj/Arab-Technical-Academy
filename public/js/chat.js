function setupLiveChat() {
    const chatForm = document.getElementById('chatForm');
    const chatMessages = document.getElementById('chatMessages');
    const chatMessageInput = document.getElementById('chatMessage');
    const chatButton = document.getElementById('chatButton');
    const chatWindow = document.getElementById('chatWindow');
    const closeChat = document.getElementById('closeChat');
    const chatError = document.getElementById('chatError');
    const submitBtn = chatForm.querySelector('.submit-btn');
    const btnText = chatForm.querySelector('.btn-text');
    const loading = chatForm.querySelector('.loading');
    const successMessage = chatForm.querySelector('.success-message');
    const devUserCode = 'admin@academy.com';
    const currentViewerCode = localStorage.getItem('userEmail') || 'Anonymous';
    const currentUserName = localStorage.getItem('userName') || 'مجهول';
    const isDev = currentViewerCode === devUserCode;

    // Get user info from session if available
    if (typeof window.userEmail !== 'undefined') {
        localStorage.setItem('userEmail', window.userEmail);
        localStorage.setItem('userName', window.userName);
    }

    // Show error message
    function showChatError(message) {
        chatError.textContent = message;
        chatError.classList.remove('hidden');
        setTimeout(() => {
            chatError.classList.add('hidden');
        }, 5000);
    }

    // Hide error message
    function hideChatError() {
        chatError.classList.add('hidden');
    }

    function formatSaudiTime(timestamp) {
        const date = new Date(timestamp);
        date.setHours(date.getHours() + 3); 
        
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function updateChatMessages() {
        fetch('/api/chat-messages')
            .then(response => response.json())
            .then(data => {
                chatMessages.innerHTML = '';
                let filteredMessages = data.messages;

                // Filter messages for current user
                filteredMessages = data.messages.filter(
                    msg => (msg.sender === currentViewerCode && msg.recipient === 'admin@academy.com') || 
                           (msg.sender === 'admin@academy.com' && msg.recipient === currentViewerCode)
                );

                filteredMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

                filteredMessages.forEach(msg => {
                    const messageElement = document.createElement('div');
                    messageElement.className = `chat-message ${msg.sender === currentViewerCode ? 'sent' : 'received'}`;
                    const displaySender = msg.sender === 'admin@academy.com' ? 'الدعم' : (msg.sender === currentViewerCode ? currentUserName : msg.sender);
                    
                    const saudiTime = formatSaudiTime(msg.timestamp);
                    
                    messageElement.innerHTML = `
                        <span class="chat-sender">${displaySender}</span>
                        <span class="chat-text">${msg.text}</span>
                        <span class="chat-timestamp">${saudiTime}</span>
                    `;
                    chatMessages.appendChild(messageElement);
                });

                // Auto scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
            })
            .catch(err => {
                console.error('خطأ في جلب الرسائل:', err);
            });
    }

    // Chat form submission
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const text = chatMessageInput.value.trim();

        if (!text) {
            showChatError('يرجى كتابة رسالة قبل الإرسال');
            return;
        }

        hideChatError();
        btnText.style.opacity = '0';
        loading.style.display = 'block';
        submitBtn.disabled = true;

        try {
            const response = await fetch('/api/chat-messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    sender: currentViewerCode, 
                    text, 
                    recipient: 'admin@academy.com' 
                })
            });

            if (!response.ok) {
                throw new Error('فشل إرسال الرسالة');
            }

            loading.style.display = 'none';
            successMessage.style.display = 'block';
            chatForm.reset();

            updateChatMessages();

            setTimeout(() => {
                btnText.style.opacity = '1';
                submitBtn.disabled = false;
                successMessage.style.display = 'none';
            }, 2000);

        } catch (err) {
            console.error('خطأ في إرسال الرسالة:', err);
            showChatError('حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى');
            btnText.style.opacity = '1';
            submitBtn.disabled = false;
            loading.style.display = 'none';
        }
    });

    // Toggle chat window
    chatButton.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden')) {
            updateChatMessages();
        }
    });

    closeChat.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    // Close chat when clicking outside
    document.addEventListener('click', (e) => {
        if (!chatWindow.contains(e.target) && !chatButton.contains(e.target)) {
            chatWindow.classList.add('hidden');
        }
    });

    // Clear error when user starts typing
    chatMessageInput.addEventListener('input', () => {
        hideChatError();
    });

    // Initialize
    updateChatMessages();
    setInterval(updateChatMessages, 3000); // Update every 3 seconds
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('chatButton')) {
        setupLiveChat();
    }
});
