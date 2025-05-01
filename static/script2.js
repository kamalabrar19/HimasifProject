// static/script3.js

document.addEventListener("DOMContentLoaded", function() {
    const chatInput = document.getElementById("chat-input");
    const sendButton = document.getElementById("send-button");
    const messagesContainer = document.getElementById("messages-container");
  
    sendButton.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  
    function sendMessage() {
      const userInput = chatInput.value.trim();
      if (userInput === "") return;
  
      addMessage(userInput, "user");
      chatInput.value = "";
  
      fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput })
      })
      .then(response => response.json())
      .then(data => {
        addMessage(data.response, "bot");
      })
      .catch(error => {
        console.error("Error:", error);
        addMessage("Maaf, terjadi kesalahan pada server.", "bot");
      });
    }
  
    function addMessage(text, sender) {
      const message = document.createElement("div");
      message.classList.add("message", sender);
      message.textContent = text;
      messagesContainer.appendChild(message);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  });
  