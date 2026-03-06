let button = document.querySelector(".generate-button");
/* let apiUrl = "https://api.groq.com/openai/v1/chat/completions"; */

async function generateCSS() {
    try {
        let description = document.querySelector(".textbox").value;
        let codeElement = document.querySelector(".code");
        let codeAnswer = document.querySelector(".codeAnswer");

        let answer = await fetch('https://css-generator-server-viniturisco.onrender.com/generate-css', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                description: description 
            })
        });

        let data = await answer.json();
        let result = data.resultCss;

        codeElement.textContent = result
        codeAnswer.srcdoc = result
    } catch (error) {
        console.error("Error generating CSS:", error);
    }

}


button.addEventListener("click", generateCSS);
