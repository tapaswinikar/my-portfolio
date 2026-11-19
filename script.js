
const roles = [
    "Web Developer",
    "Frontend Developer",
    "Java Programmer"
];

let roleIndex = 0;
let letterIndex = 0;

function typeRole() {
    const typingElement = document.getElementById("typing");

    if (!typingElement) return;

    if (letterIndex < roles[roleIndex].length) {
        typingElement.textContent += roles[roleIndex].charAt(letterIndex);
        letterIndex++;
        setTimeout(typeRole, 100);
    } else {
        setTimeout(() => {
            typingElement.textContent = "";
            letterIndex = 0;
            roleIndex = (roleIndex + 1) % roles.length;
            typeRole();
        }, 1500);
    }
}

typeRole();


const contactForm = document.getElementById("contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        try {
            const response = await fetch("http://localhost:5000/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, message })
            });

            const result = await response.json();

            document.getElementById("form-status").textContent = result.message;

            if (response.ok) {
                contactForm.reset();
            }

        } catch (error) {
            document.getElementById("form-status").textContent =
                "Unable to send message. Please try again.";
        }
    });
}
