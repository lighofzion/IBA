document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggler = document.querySelector(".chatbot-toggler");
    const closeBtn = document.querySelector(".close-btn");
    const chatbox = document.querySelector(".chatbox");
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector(".chat-input span");
    const welcomeMessage = document.querySelector(".welcome-message");

    // Gemini API Configuration
    const API_KEY = "AIzaSyBPKzziA3CWl3Pj8TlPvDoI6OwDi3jtrSs"; // Replace with your actual API key
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    let userMessage = null;

    const documentContent = `
    
        Programs Offered:
        IBA provides structured programs aimed at deepening understanding of the Bible and its application:

        Spiritual Direction: Focuses on teaching the fundamentals of the Bible to cultivate spiritual growth.
        Christian Studies: Aims to help individuals develop intimacy with God, deepen their prayer life, and open their hearts through biblical teachings.
        Christian Ministries Studies: Prepares individuals for ministry roles, including counseling, missions, and preaching, grounded in biblical principles.

        Key Features:
        • Zero Tuition Fee: IBA offers its courses free of charge, ensuring financial constraints do not hinder access to biblical education.
        • 8-Month Course Duration: The programs are designed to be completed in eight months, providing a comprehensive yet time-efficient study experience.
        • Stage: 
        1. Elementary
                Understanding of the parables regarding the secrets of the Kingdom of heaven spoken by Jesus. - 3 months
        2. Intermediate
                An overview of the whole Bible including the Pentateuch, the prophets and the four gospels. - 1 month
        3. Advanced
                A detailed look at each chapter of Revelation and the meaning of the figurative language within. - 4 months

        Global Impact:
        IBA has a significant global presence, reaching numerous countries and churches, and has educated over 1,000 students worldwide.

        Testimonials:
        Alex: "Studying God's Word at IBA was my first online learning experience, and it was truly transformative. Each lesson revealed new aspects of God's mystery. God is truly alive!"
        Christina: "I am truly blessed to learn God's Word at IBA. Through this study, I've gained a deeper understanding of God's will and His kingdom."
        Joseph: "I was initially skeptical about IBA's free program, but one class taught me more than my 35 years of faith journey had."

        Contact:
        91-638-25-91988

        Address:
        We have a church at chennai refer this location: Light Of Zion Church, 31, Sembakkam Main Road, Thillai Ganga Nagar, Chennai, Tamil Nadu 600073

        Sunday Service:
        Usually we have bible classes every weekdays and we also happen to have our regular services starting from 9:00 AM - 12:00 PM


        Faith statement:
        1. IBA members are brothers and sisters in Christ, united as one family in God. Our vision is to educate and train disciples of Jesus to preach the gospel and become part of Christ's church.

        2. Following the Great Commission, IBA provides free Biblical education to those who are poor in spirit and who hunger and thirst for righteousness. We strictly adhere to Biblical teachings, ensuring all our educational materials are based solely on Scripture.

        3. IBA affirms faith in the Holy Trinity and the forgiveness of sins through Jesus's blood. We faithfully await Jesus's return as promised.

        4. According to Hebrews 8:7-10, we believe in upholding the new covenant by inscribing Jesus's words in our hearts and minds, especially as His promises are fulfilled.

        5. IBA upholds the integrity of the Book of Revelation, believing that nothing should be added or removed from its words. We emphasize the importance of understanding and observing its teachings to be prepared for Jesus's return.

        6. In response to Jesus's command to feed His sheep, IBA is committed to teaching His truth, helping God's children mature spiritually, develop discernment between good and evil, and faithfully follow His commands.
    `;

    const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", `${className}`);
        let chatContent = className === "outgoing" ?
            `<p>${message}</p>` :
            `<img src="assets/img/assistant.png" alt="Assistant" class="chat-bot-icon"><p>${message}</p>`;
        chatLi.innerHTML = chatContent;
        return chatLi;
    }

    const showTypingIndicator = () => {
        const typing = document.createElement("div");
        typing.className = "typing-indicator";
        typing.innerHTML = "<span></span><span></span><span></span>";
        chatbox.appendChild(typing);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        return typing;
    };

    const generateResponse = async (incomingChatLi) => {
        const messageElement = incomingChatLi.querySelector("p");
        const typingIndicator = showTypingIndicator();

        try {
            // Enrollment-related keywords
            const enrollmentKeywords = [
                'apply', 'enrollment', 'registration', 'sign up', 'how to join', 'procedure'
            ];

            // Check if the message is about enrollment
            const isEnrollmentQuery = enrollmentKeywords.some(keyword =>
                userMessage.toLowerCase().includes(keyword)
            );

            // Prepare the request to Gemini API
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are an AI assistant for International Bible Academy (IBA). 
                            Respond to the following enrollment query in a friendly, concise tone:
                            
                            ${isEnrollmentQuery ?
                                    'Provide a brief, encouraging response about the enrollment process, highlighting its simplicity and accessibility.'
                                    :
                                    `Respond to the query: "${userMessage}" about IBA programs. 
                                Be conversational and helpful.`
                                }
                            
                            Context for reference: ${documentContent}`
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error('Gemini API request failed');
            }

            const data = await response.json();
            const responseText = data.candidates[0]?.content?.parts[0]?.text ||
                "Sorry, I couldn't generate a response.";

            typingIndicator.remove();

            // Clean up the response
            const cleanedResponseText = responseText
                .replace(/\*\*/g, '')  // Remove bold markdown
                .replace(/\n+/g, ' ')  // Replace multiple newlines with a single space
                .trim();

            // Create response container
            const responseContainer = document.createElement('div');

            // Create text response
            const textResponse = document.createElement('p');
            textResponse.textContent = cleanedResponseText;
            responseContainer.appendChild(textResponse);

            // Add apply button for enrollment queries
            if (isEnrollmentQuery) {
                const applyButton = document.createElement('a');
                applyButton.href = '/program.html#registration';
                applyButton.textContent = 'Apply Now';
                applyButton.classList.add('apply-btn');
                applyButton.style.cssText = `
                    display: inline-block;
                    margin-top: 10px;
                    padding: 10px 15px;
                    background-color: #724ae8;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                `;
                responseContainer.appendChild(applyButton);
            }

            // Replace message content with new container
            messageElement.innerHTML = '';
            messageElement.appendChild(responseContainer);

            // Add timestamp
            const timestamp = document.createElement("div");
            timestamp.className = "chat-status";
            timestamp.textContent = new Date().toLocaleTimeString();
            incomingChatLi.appendChild(timestamp);
        } catch (error) {
            typingIndicator.remove();
            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Something went wrong. Please try again.";
            console.error('Error:', error);
        }

        chatbox.scrollTo(0, chatbox.scrollHeight);
    }

    const handleChat = () => {
        userMessage = chatInput.value.trim();
        if (!userMessage) return;

        chatInput.value = "";
        chatInput.style.height = `${chatInput.scrollHeight}px`;

        chatbox.appendChild(createChatLi(userMessage, "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);

        setTimeout(() => {
            const incomingChatLi = createChatLi("Thinking...", "incoming");
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
            generateResponse(incomingChatLi);
        }, 600);
    }

    // Initialize chatbot with a welcome message
    setTimeout(() => {
        welcomeMessage.classList.add("show");
    }, 2000);

    // Event Listeners
    chatbotToggler.addEventListener("click", (e) => {
        e.preventDefault();
        document.body.classList.toggle("show-chatbot");
        welcomeMessage.classList.remove("show");
    });

    closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.body.classList.remove("show-chatbot");
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".chatbot") &&
            !e.target.closest(".chatbot-toggler") &&
            document.body.classList.contains("show-chatbot")) {
            document.body.classList.remove("show-chatbot");
        }
    });

    chatbox.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    // Chat input handlers
    chatInput.addEventListener("input", () => {
        chatInput.style.height = "auto";
        chatInput.style.height = `${chatInput.scrollHeight}px`;
    });

    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
            e.preventDefault();
            handleChat();
        }
    });

    sendChatBtn.addEventListener("click", handleChat);

    // Add chat actions functionality
    const restartBtn = document.querySelector(".restart-chat");
    const clearBtn = document.querySelector(".clear-chat");

    restartBtn.addEventListener("click", () => {
        chatbox.innerHTML = '';
        const welcomeMessage = createChatLi("Hi there! 👋\nI'm your IBA assistant. How can I help you today?", "incoming");
        chatbox.appendChild(welcomeMessage);
    });

    clearBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear the chat?")) {
            chatbox.innerHTML = '';
        }
    });
});

// Welcome popup functionality
document.addEventListener('DOMContentLoaded', () => {
    const welcomePopup = document.querySelector('.welcome-popup');

    // Show popup after 1.5 seconds
    setTimeout(() => {
        welcomePopup.classList.add('show');
    }, 1500);

    // Hide popup after 5 seconds
    setTimeout(() => {
        welcomePopup.classList.remove('show');
    }, 6500);
});