// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("chat-input");
  const sendButton = document.getElementById("send-button"); // Make sure your button has this ID
  const chatContainer = document.getElementById("chat-container"); // A div to hold messages
  const firstMessage = sessionStorage.getItem("firstMessage");
    if (firstMessage) {
        inputField.value = firstMessage;
        sendMessage(); // send it automatically
        sessionStorage.removeItem("firstMessage"); // only run once
    }


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
            messageText.textContent = message;
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
    


  async function sendMessage() {
      const userInput = inputField.value.trim();
      if (!userInput) return;

      addMessage(userInput, "user");
      inputField.value = "";

      try {
          const response = await fetch("/ask", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message: userInput }),
          });

          const data = await response.json();
          addMessage(data.response || "Maaf, tidak ada balasan dari 360.", "bot");
      } catch (error) {
          addMessage("Terjadi kesalahan saat mengirim pesan.", "bot");
          console.error("Error:", error);
      }
  }

  sendButton.addEventListener("click", sendMessage);
  inputField.addEventListener("keypress", function (event) {
      if (event.key === "Enter") sendMessage();
  });
});
