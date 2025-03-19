document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const messagesContainer = document.getElementById('messages-container');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const errorMessage = document.getElementById('error-message');
    const connectionStatus = document.getElementById('connection-status');
    
    // Create typing indicator element
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = `
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    // Check server connection on load
    checkServerConnection();
    
    // Function to check server connection
    function checkServerConnection() {
        updateConnectionStatus('checking');
        
        fetch('/health')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Server unavailable');
                }
                return response.json();
            })
            .then(data => {
                if (data.service === 'healthy') {
                    if (data.ollama_status === 'connected') {
                        updateConnectionStatus('connected', data.ollama_version);
                    } else if (data.himasif_data === 'loaded') {
                        updateConnectionStatus('local');
                    } else {
                        updateConnectionStatus('unavailable');
                    }
                } else {
                    updateConnectionStatus('unavailable');
                }
            })
            .catch(error => {
                updateConnectionStatus('unavailable');
                console.error('Connection error:', error);
            });
    }
    
    // Function to update connection status UI
    function updateConnectionStatus(status, version = '') {
        switch (status) {
            case 'checking':
                connectionStatus.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> <span>Checking connection...</span>`;
                connectionStatus.style.backgroundColor = 'rgba(255, 165, 0, 0.2)';
                break;
            case 'connected':
                connectionStatus.innerHTML = `<i class="fas fa-plug" style="color: #10b981;"></i> <span>AI Connected${version ? ` (v${version})` : ''}</span>`;
                connectionStatus.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
                break;
            case 'local':
                connectionStatus.innerHTML = `<i class="fas fa-database" style="color: #f59e0b;"></i> <span>Using Local Data</span>`;
                connectionStatus.style.backgroundColor = 'rgba(245, 158, 11, 0.2)';
                break;
            case 'unavailable':
                connectionStatus.innerHTML = `<i class="fas fa-exclamation-triangle" style="color: #ef4444;"></i> <span>Offline Mode</span>`;
                connectionStatus.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                break;
        }
    }
    
    // Function to send a message
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessage(message, 'user');
        userInput.value = '';
        
        // Show typing indicator
        messagesContainer.appendChild(typingIndicator);
        typingIndicator.style.display = 'block';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Clear any previous errors
        errorMessage.textContent = '';
        
        // Send message to server
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Remove typing indicator after a slight delay for a more natural feel
            setTimeout(() => {
                // Hide typing indicator
                typingIndicator.style.display = 'none';
                if (typingIndicator.parentNode) {
                    messagesContainer.removeChild(typingIndicator);
                }
                
                if (data.error) {
                    // Show error message
                    errorMessage.textContent = data.error;
                } else {
                    // Add bot response to chat
                    addMessage(data.response, 'bot');
                }
            }, 700 + Math.random() * 800); // Random delay between 700ms and 1500ms
        })
        .catch(error => {
            // Hide typing indicator
            typingIndicator.style.display = 'none';
            if (typingIndicator.parentNode) {
                messagesContainer.removeChild(typingIndicator);
            }
            
            // Show error message
            errorMessage.textContent = 'Terjadi kesalahan saat menghubungi server. Coba lagi nanti.';
            console.error('Error:', error);
        });
    }
    
    // Function to add a message to the chat
    function addMessage(text, sender) {
        // Format the message text with proper line breaks
        const formattedText = formatMessageText(text);
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        
        // Create message content
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = formattedText;
        
        // Create message time
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = formatTime(new Date());
        
        // Add content and time to message
        messageElement.appendChild(messageContent);
        messageElement.appendChild(messageTime);
        
        // Add message to container
        messagesContainer.appendChild(messageElement);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Function to format message text with paragraphs and lists
    function formatMessageText(text) {
        // Handle line breaks
        let formatted = text.replace(/\n\n/g, '</p><p>');
        formatted = formatted.replace(/\n/g, '<br>');
        
        // Handle bullet points (• or - followed by space)
        formatted = formatted.replace(/^[•-]\s(.+)$/gm, '<li>$1</li>');
        formatted = formatted.replace(/<li>(.+)<\/li>/g, '<ul><li>$1</li></ul>');
        formatted = formatted.replace(/<\/ul>\s*<ul>/g, '');
        
        // Wrap in paragraph if not already
        if (!formatted.startsWith('<p>')) {
            formatted = '<p>' + formatted;
        }
        if (!formatted.endsWith('</p>')) {
            formatted = formatted + '</p>';
        }
        
        return formatted;
    }
    
    // Function to format time
    function formatTime(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    
    // Send message on button click
    sendButton.addEventListener('click', sendMessage);
    
    // Send message on Enter key
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Focus input field on load
    userInput.focus();
});