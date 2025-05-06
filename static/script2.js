document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const inputField = document.getElementById("chat-input");
    const sendButton = document.getElementById("send-button");
    const chatContainer = document.getElementById("chat-container");

    // Create typing indicator element
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "typing-indicator";
    typingIndicator.innerHTML = `
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    typingIndicator.style.display = "none";

    // Handle first message from session storage
    const firstMessage = sessionStorage.getItem("firstMessage");
    if (firstMessage) {
        inputField.value = firstMessage;
        sendMessage();
        sessionStorage.removeItem("firstMessage");
    }

    // Function to add a message to the chat
    function addMessage(message, sender) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("chat-bubble");

        if (sender === "user") {
            messageElement.classList.add("user-bubble");
            messageElement.textContent = message;
        } else {
            messageElement.classList.add("bot-bubble");

            // Create message text wrapper
            const messageText = document.createElement("p");
            messageText.innerHTML = message; // Use innerHTML to render formatted HTML
            messageElement.appendChild(messageText);

            // Create icon container
            const iconContainer = document.createElement("div");
            iconContainer.classList.add("icon-container");

            const icons = [
                { src: "./asset/copy.png", alt: "Copy", handler: () => navigator.clipboard.writeText(message) },
                { src: "./asset/like.png", alt: "Like", handler: () => console.log("Liked") },
                { src: "./asset/dislike.png", alt: "Dislike", handler: () => console.log("Disliked") }
            ];

            icons.forEach(icon => {
                const button = document.createElement("button");
                button.classList.add("icon-button");

                const img = document.createElement("img");
                img.src = icon.src;
                img.alt = icon.alt;
                img.classList.add("icon-img");

                button.appendChild(img);
                button.onclick = () => {
                    icon.handler();
                    const allButtons = iconContainer.querySelectorAll(".icon-button");
                    allButtons.forEach(btn => btn.classList.remove("clicked-icon"));
                    button.classList.add("clicked-icon");
                };

                iconContainer.appendChild(button);
            });

            messageElement.appendChild(iconContainer);
        }

        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Function to send a message
    async function sendMessage() {
        const userInput = inputField.value.trim();
        if (!userInput) return;

        // Add user message
        addMessage(userInput, "user");
        inputField.value = "";

        // Show typing indicator
        chatContainer.appendChild(typingIndicator);
        typingIndicator.style.display = "block";
        chatContainer.scrollTop = chatContainer.scrollHeight;

        try {
            const response = await fetch("/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userInput }),
            });

            // Hide typing indicator
            typingIndicator.style.display = "none";
            chatContainer.removeChild(typingIndicator);

            const data = await response.json();

            if (data.error) {
                addMessage(`Error: ${data.error}`, "bot");
            } else {
                addMessage(data.response || "Maaf, tidak ada balasan dari server.", "bot");
            }
        } catch (error) {
            // Hide typing indicator
            typingIndicator.style.display = "none";
            chatContainer.removeChild(typingIndicator);

            addMessage("Terjadi kesalahan saat mengirim pesan.", "bot");
            console.error("Error:", error);
        }
    }

    // Event listeners
    sendButton.addEventListener("click", sendMessage);
    inputField.addEventListener("keypress", function (event) {
        if (event.key === "Enter") sendMessage();
    });

    // Focus input field on load
    inputField.focus();
});