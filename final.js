document.addEventListener("DOMContentLoaded", function() {
    const saveButton = document.getElementById("saveApiKey");
    const apiKeyInput = document.getElementById("apikey");
  
    saveButton.addEventListener("click", function () {
      const apiKeyValue = apiKeyInput.value;
      if (apiKeyValue) {
        localStorage.setItem("API_KEY", apiKeyValue);
        displayMessage("API Key saved successfully!");
        const modal = bootstrap.Modal.getInstance(document.getElementById("KeyModal"));
        modal.hide();
      } else {
        displayMessage("Please enter a valid API key.");
      }
    });
  
    const generateForm = document.getElementById("generate-form");
    const spinner = document.getElementById("spinner");
    const message = document.getElementById("message");
    const imageGallery = document.getElementById("gallery");
  
    generateForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const prompt = document.getElementById("prompt").value;
      const key = localStorage.getItem("API_KEY");
  
      if (!prompt) {
        displayMessage("Please enter a prompt");
        return;
      }
  
      if (!key) {
        displayMessage("Please add your API KEY. The key will be stored locally in your browser.");
        return;
      }
  
      fetchImage(prompt, key);
    });
  
    function displayMessage(msg) {
      message.textContent = msg;
      message.style.display = "block";
      setTimeout(function () {
        message.style.display = "none";
      }, 3000);
    }
  
    const fetchImage = async (prompt, API_KEY) => {
      const url = "https://api.openai.com/v1/images/generations";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt,
          n: 1,
          size: "1024x1024",
        }),
      };
  
      try {
        spinner.style.display = "block";
        const response = await fetch(url, options);
  
        if (!response.ok) {
          const error = await response.json();
          const message = error.error.message ? error.error.message : "Failed to fetch image";
          displayMessage(message);
          return;
        }
  
        const result = await response.json();
        const imageUrl = result.data[0].url;
        displayImage(imageUrl);
      } catch (error) {
        displayMessage("There was an error, please try again");
      } finally {
        spinner.style.display = "none";
      }
    };
  
    function displayImage(image) {
      const imageMarkup = `
        <div class="row justify-content-center">
            <div class="col d-flex justify-content-center">
                <img src="${image}" class="img-fluid" alt="Generated Image">
            </div>
        </div>`;
      imageGallery.innerHTML = imageMarkup;
    }
  });
  