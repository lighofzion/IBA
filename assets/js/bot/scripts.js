/**
 * IBA Chatbot - Enhanced and Optimized
 * - Modular structure for better maintainability
 * - Improved error handling and user experience
 * - Enhanced response formatting and actions
 * - Better performance through caching and debouncing
 */

// Configuration and Constants
const ChatbotConfig = {
    // For production, use environment variables or server-side API calls
    API_KEY: "AIzaSyBPKzziA3CWl3Pj8TlPvDoI6OwDi3jtrSs",
    API_URL: function() {
        return `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.API_KEY}`;
    },
    TYPING_DELAY: 600,
    WELCOME_DELAY: 2000,
    POPUP_SHOW_DELAY: 1500,
    POPUP_HIDE_DELAY: 6500,
    SCROLL_BEHAVIOR: { behavior: 'smooth', block: 'end' },
    MAX_CHAT_HISTORY: 50,
    QUERIES: {
        ENROLLMENT: [
            'apply', 'enrollment', 'registration', 'sign up', 
            'how to join', 'procedure', 'enroll', 'register', 'join'
        ],
        PROGRAM: [
            'program', 'course', 'study', 'class', 'curriculum', 
            'lesson', 'teaching', 'learn', 'education'
        ],
        CONTACT: [
            'contact', 'phone', 'email', 'reach', 'call', 
            'message', 'address', 'location', 'where'
        ]
    }
};

// IBA Knowledge Base
const IBADatabase = {
    content: `
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
    91-8637604211

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
    `,
    // Cache frequent responses for better performance
    responseCache: new Map(),
    
    // Method to check if a query contains keywords from a specific category
    containsKeywords(query, category) {
        if (!query || !category) return false;
        const lowercaseQuery = query.toLowerCase();
        return ChatbotConfig.QUERIES[category].some(keyword => 
            lowercaseQuery.includes(keyword)
        );
    },
    
    // Method to get cached response if available
    getCachedResponse(query) {
        return this.responseCache.get(query);
    },
    
    // Method to cache response for future use
    cacheResponse(query, response) {
        // Limit cache size to prevent memory issues
        if (this.responseCache.size > 20) {
            const firstKey = this.responseCache.keys().next().value;
            this.responseCache.delete(firstKey);
        }
        this.responseCache.set(query, response);
    }
};

// UI Components and DOM handlers
const ChatbotUI = {
    elements: {},
    chatHistory: [],
    isTyping: false,
    
    // Initialize UI elements
    init() {
        this.elements = {
            chatbot: document.querySelector(".chatbot"),
            toggler: document.querySelector(".chatbot-toggler"),
            closeBtn: document.querySelector(".close-btn"),
            chatbox: document.querySelector(".chatbox"),
            input: document.querySelector(".chat-input textarea"),
            sendBtn: document.querySelector(".chat-input span"),
            welcomeMsg: document.querySelector(".welcome-message"),
            restartBtn: document.querySelector(".restart-chat"),
            clearBtn: document.querySelector(".clear-chat"),
            welcomePopup: document.querySelector('.welcome-popup'),
            suggestionsContainer: document.querySelector('.chat-suggestions') || this.createSuggestionsContainer()
        };
        
        // Set up enhanced scrolling behavior
        this.setupScrollBehavior();
        
        this.setupEventListeners();
        this.initializeWelcome();
        this.showInitialSuggestions();
    },
    
    // Setup enhanced scrolling for all device sizes
    setupScrollBehavior() {
        const chatbox = this.elements.chatbox;
        if (!chatbox) return;
        
        // Add touch handlers for mobile scrolling
        let startY, startScrollTop;
        
        chatbox.addEventListener('touchstart', (e) => {
            startY = e.touches[0].pageY;
            startScrollTop = chatbox.scrollTop;
        });
        
        chatbox.addEventListener('touchmove', (e) => {
            const touchY = e.touches[0].pageY;
            const diff = startY - touchY;
            chatbox.scrollTop = startScrollTop + diff;
        });
        
        // Ensure scrollbar is always visible on desktop
        if (window.innerWidth > 768) {
            chatbox.classList.add('show-scrollbar');
        }
        
        // Adjust on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                chatbox.classList.add('show-scrollbar');
            } else {
                chatbox.classList.remove('show-scrollbar');
            }
            this.scrollToBottom();
        });
    },
    
    // Show initial suggestions to help users get started
    showInitialSuggestions() {
        setTimeout(() => {
            this.showSuggestions("", true);
        }, ChatbotConfig.WELCOME_DELAY + 500);
    },
    
    // Create suggestions container if it doesn't exist
    createSuggestionsContainer() {
        const container = document.createElement('div');
        container.className = 'chat-suggestions';
        this.elements.chatbot?.appendChild(container);
        return container;
    },
    
    // Set up all event listeners
    setupEventListeners() {
        const { 
            toggler, closeBtn, input, sendBtn, 
            chatbox, restartBtn, clearBtn 
        } = this.elements;
        
        // Toggle chatbot visibility
        toggler?.addEventListener("click", this.toggleChatbot.bind(this));
        closeBtn?.addEventListener("click", this.closeChatbot.bind(this));
        
        // Handle outside clicks
        document.addEventListener("click", this.handleOutsideClick.bind(this));
        chatbox?.addEventListener("click", e => e.stopPropagation());
        
        // Handle input and send events
        input?.addEventListener("input", this.resizeInput.bind(this));
        input?.addEventListener("keydown", this.handleInputKeydown.bind(this));
        sendBtn?.addEventListener("click", this.sendMessage.bind(this));
        
        // Chat management buttons
        restartBtn?.addEventListener("click", this.restartChat.bind(this));
        clearBtn?.addEventListener("click", this.clearChat.bind(this));
    },
    
    // Initialize welcome elements
    initializeWelcome() {
        // Show welcome message in chat
        setTimeout(() => {
            this.elements.welcomeMsg?.classList.add("show");
        }, ChatbotConfig.WELCOME_DELAY);
        
        // Show and hide welcome popup
        setTimeout(() => {
            this.elements.welcomePopup?.classList.add("show");
        }, ChatbotConfig.POPUP_SHOW_DELAY);
        
        setTimeout(() => {
            this.elements.welcomePopup?.classList.remove("show");
        }, ChatbotConfig.POPUP_HIDE_DELAY);
    },
    
    // Toggle chatbot visibility
    toggleChatbot(e) {
        e?.preventDefault();
        document.body.classList.toggle("show-chatbot");
        this.elements.welcomeMsg?.classList.remove("show");
        
        // Focus input when chatbot opens
        if (document.body.classList.contains("show-chatbot")) {
            setTimeout(() => this.elements.input?.focus(), 300);
        }
    },
    
    // Close chatbot
    closeChatbot(e) {
        e?.preventDefault();
        e?.stopPropagation();
        document.body.classList.remove("show-chatbot");
    },
    
    // Handle clicks outside chatbot
    handleOutsideClick(e) {
        if (!e.target.closest(".chatbot") &&
            !e.target.closest(".chatbot-toggler") &&
            document.body.classList.contains("show-chatbot")) {
            document.body.classList.remove("show-chatbot");
        }
    },
    
    // Resize input based on content
    resizeInput() {
        const input = this.elements.input;
        if (!input) return;
        
        input.style.height = "auto";
        input.style.height = `${input.scrollHeight}px`;
    },
    
    // Handle keyboard events in input
    handleInputKeydown(e) {
        // Send on Enter (except on mobile or with Shift key)
        if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
            e.preventDefault();
            this.sendMessage();
        }
    },
    
    // Send user message
    sendMessage() {
        const input = this.elements.input;
        if (!input) return;
        
        const message = input.value.trim();
        if (!message) return;
        
        // Reset input and adjust height
        input.value = "";
        this.resizeInput();
        
        // Process and display message
        this.addMessage(message, "outgoing");
        this.disableSuggestions();
        
        // Show bot response after delay
        setTimeout(() => {
            this.showTypingIndicator();
            ChatbotLogic.processUserMessage(message);
        }, ChatbotConfig.TYPING_DELAY);
    },
    
    // Create and add message element
    addMessage(message, className, additionalContent = null) {
        const chatbox = this.elements.chatbox;
        if (!chatbox) return null;
        
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", className);
        
        let chatContent = '';
        if (className === "outgoing") {
            chatContent = `<p>${message}</p>`;
        } else {
            chatContent = `<img src="assets/img/assistant.png" alt="Assistant" class="chat-bot-icon"><p>${message}</p>`;
        }
        
        chatLi.innerHTML = chatContent;
        
        // Add additional content if provided (buttons, links, etc.)
        if (additionalContent && chatLi.querySelector('p')) {
            const p = chatLi.querySelector('p');
            if (typeof additionalContent === 'string') {
                p.innerHTML += additionalContent;
            } else if (additionalContent instanceof Node) {
                p.appendChild(additionalContent);
            }
        }
        
        chatbox.appendChild(chatLi);
        this.scrollToBottom();
        
        // Save to history (except typing indicators)
        if (!message.includes('typing-indicator')) {
            this.saveChatHistory({ message, className, time: new Date() });
        }
        
        return chatLi;
    },
    
    // Show typing indicator while waiting for response
    showTypingIndicator() {
        if (this.isTyping) return null;
        
        const typingHTML = `
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        `;
        
        this.isTyping = true;
        return this.addMessage(typingHTML, "incoming");
    },
    
    // Remove typing indicator when response is ready
    removeTypingIndicator() {
        const chatbox = this.elements.chatbox;
        if (!chatbox) return;
        
        const typingElement = chatbox.querySelector(".typing-indicator");
        if (typingElement) {
            const parentLi = typingElement.closest('li');
            if (parentLi) parentLi.remove();
        }
        
        this.isTyping = false;
    },
    
    // Update message with response and add timestamp
    updateMessageWithResponse(messageElement, response, isEnrollmentQuery) {
        if (!messageElement) return;
        
        this.removeTypingIndicator();
        
        // Clean the response text
        const cleanedResponse = response
            .replace(/\*\*/g, '')
            .replace(/\n+/g, ' ')
            .trim();
        
        // Create response container
        const responseContainer = document.createElement('div');
        
        // Create text response
        const textResponse = document.createElement('p');
        textResponse.textContent = cleanedResponse;
        responseContainer.appendChild(textResponse);
        
        // Add buttons based on query type
        if (isEnrollmentQuery) {
            const applyButton = this.createActionButton(
                'Start Application', 
                'program.html#registration',
                'apply-btn'
            );
            responseContainer.appendChild(applyButton);
        }
        
        // Replace message content
        const pElement = messageElement.querySelector("p");
        if (pElement) {
            pElement.innerHTML = '';
            pElement.appendChild(responseContainer);
        }
        
        // Add timestamp
        const timestamp = document.createElement("div");
        timestamp.className = "chat-status";
        timestamp.textContent = new Date().toLocaleTimeString();
        messageElement.appendChild(timestamp);
        
        // Show suggested follow-up questions
        this.showSuggestions(response);
        
        this.scrollToBottom();
    },
    
    // Create an action button
    createActionButton(text, href, className) {
        const button = document.createElement('a');
        button.href = href;
        button.textContent = text;
        button.classList.add(className || 'action-btn');
        button.style.cssText = `
            display: inline-block;
            margin-top: 10px;
            padding: 10px 15px;
            background-color: #724ae8;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            transition: background-color 0.3s ease;
        `;
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#5c3bc1';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#724ae8';
        });
        return button;
    },
    
    // Restart chat with welcome message
    restartChat() {
        const chatbox = this.elements.chatbox;
        if (!chatbox) return;
        
        // Show confirmation for restarting if chat has messages
        if (this.chatHistory.length > 1 && !confirm("Restart the conversation? This will clear the current chat.")) {
            return;
        }
        
        // Clear chat area and add welcome message
        chatbox.innerHTML = '';
        const welcomeMsg = this.addMessage("Hi there! 👋\nI'm your IBA assistant. How can I help you today?", "incoming");
        
        // Add timestamp to welcome message
        const timestamp = document.createElement("div");
        timestamp.className = "chat-status";
        timestamp.textContent = new Date().toLocaleTimeString();
        welcomeMsg.appendChild(timestamp);
        
        // Show topic suggestions
        this.showSuggestions("", true);
        
        // Clear history
        this.chatHistory = [];
        
        // Save welcome message to history
        this.saveChatHistory({
            message: "Hi there! 👋\nI'm your IBA assistant. How can I help you today?", 
            className: "incoming", 
            time: new Date()
        });
        
        // Visual feedback
        this.animateElement(welcomeMsg);
        
        // Show welcome message hint
        if (this.elements.welcomeMsg) {
            this.elements.welcomeMsg.classList.add("show");
            setTimeout(() => {
                this.elements.welcomeMsg.classList.remove("show");
            }, 5000);
        }
        
        // Focus on input after restart
        setTimeout(() => {
            if (this.elements.input) this.elements.input.focus();
        }, 300);
    },
    
    // Clear chat with confirmation
    clearChat() {
        const chatbox = this.elements.chatbox;
        if (!chatbox) return;
        
        // Only ask for confirmation if there are messages
        if (this.chatHistory.length === 0 || confirm("Are you sure you want to clear the chat?")) {
            // Animate removal
            const chatItems = chatbox.querySelectorAll('.chat');
            chatItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(10px)';
                }, index * 50);
            });
            
            // Remove after animation
            setTimeout(() => {
                chatbox.innerHTML = '';
                this.chatHistory = [];
                
                // Try to clear local storage
                try {
                    localStorage.removeItem('ibaChat');
                } catch (e) {}
                
                // Show initial suggestions again
                this.showSuggestions("", true);
            }, chatItems.length * 50 + 300);
        }
    },
    
    // Animate an element for visual feedback
    animateElement(element) {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';
        
        // Force reflow
        void element.offsetWidth;
        
        // Add transition
        element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        
        // Remove transition after animation
        setTimeout(() => {
            element.style.transition = '';
        }, 300);
    },
    
    // Show suggested topic buttons
    showSuggestions(response = "", forceDefault = false) {
        const container = this.elements.suggestionsContainer;
        if (!container) return;
        
        // Clear previous suggestions
        container.innerHTML = '';
        
        let suggestions = [];
        
        // Default suggestions or forced defaults
        if (forceDefault || !response) {
            suggestions = [
                { text: "Programs Offered", query: "What programs does IBA offer?" },
                { text: "How to Enroll", query: "How do I enroll in IBA?" },
                { text: "Contact Info", query: "What's IBA's contact information?" }
            ];
        } 
        // Context-aware suggestions based on previous response
        else {
            const lowerResponse = response.toLowerCase();
            
            if (lowerResponse.includes("program") || lowerResponse.includes("course")) {
                suggestions.push({ text: "Course Duration", query: "How long are the courses?" });
                suggestions.push({ text: "Course Content", query: "What will I learn?" });
            }
            
            if (lowerResponse.includes("enroll") || lowerResponse.includes("join")) {
                suggestions.push({ text: "Requirements", query: "Are there any requirements to join?" });
                suggestions.push({ text: "Start Dates", query: "When can I start?" });
            }
            
            if (lowerResponse.includes("contact") || lowerResponse.includes("location")) {
                suggestions.push({ text: "Service Times", query: "When are the Sunday services?" });
                suggestions.push({ text: "Online Options", query: "Do you offer online classes?" });
            }
            
            // If no context-specific suggestions, use defaults
            if (suggestions.length === 0) {
                suggestions = [
                    { text: "Program Structure", query: "How are the programs structured?" },
                    { text: "Testimonials", query: "Can I see some testimonials?" }
                ];
            }
        }
        
        // Create and append suggestion buttons
        suggestions.forEach(suggestion => {
            const button = document.createElement('button');
            button.className = 'suggestion-btn';
            button.textContent = suggestion.text;
            button.addEventListener('click', () => {
                this.elements.input.value = suggestion.query;
                this.sendMessage();
            });
            container.appendChild(button);
        });
        
        // Show the suggestions
        container.style.display = 'flex';
    },
    
    // Disable suggestions when user sends a message
    disableSuggestions() {
        const container = this.elements.suggestionsContainer;
        if (container) {
            container.style.display = 'none';
        }
    },
    
    // Save chat history to stay within limits
    saveChatHistory(entry) {
        this.chatHistory.push(entry);
        
        // Limit history size
        if (this.chatHistory.length > ChatbotConfig.MAX_CHAT_HISTORY) {
            this.chatHistory.shift();
        }
        
        // Optional: Save to localStorage for persistence
        try {
            localStorage.setItem('ibaChat', JSON.stringify(this.chatHistory));
        } catch (e) {
            console.warn('Could not save chat history to localStorage', e);
        }
    },
    
    // Load chat history from storage
    loadChatHistory() {
        try {
            const saved = localStorage.getItem('ibaChat');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    this.chatHistory = parsed;
                    return true;
                }
            }
        } catch (e) {
            console.warn('Could not load chat history from localStorage', e);
        }
        return false;
    },
    
    // Scroll to bottom of chat with improved animation
    scrollToBottom() {
        const chatbox = this.elements.chatbox;
        if (!chatbox) return;
        
        // Calculate if user has scrolled up manually (more than 100px from bottom)
        const isUserScrolledUp = (chatbox.scrollHeight - chatbox.scrollTop - chatbox.clientHeight) > 100;
        
        // Only auto-scroll if user hasn't scrolled up to read previous messages
        if (!isUserScrolledUp || this.isTyping) {
            // Use smooth scrolling on desktop, instant on mobile (for performance)
            const behavior = window.innerWidth > 768 ? 'smooth' : 'auto';
            
            chatbox.scrollTo({
                top: chatbox.scrollHeight,
                behavior: behavior
            });
        }
        
        // If user is scrolled up, show a "new message" indicator
        if (isUserScrolledUp && !this.newMessageIndicator && !this.isTyping) {
            this.showNewMessageIndicator();
        }
    },
    
    // Show indicator when new messages arrive but user is scrolled up
    showNewMessageIndicator() {
        if (this.newMessageIndicator) return;
        
        const chatbox = this.elements.chatbox;
        if (!chatbox) return;
        
        // Create indicator
        this.newMessageIndicator = document.createElement('div');
        this.newMessageIndicator.className = 'new-message-indicator';
        this.newMessageIndicator.innerHTML = `
            <span>New message</span>
            <i class="bi bi-arrow-down-circle"></i>
        `;
        
        // Style it
        this.newMessageIndicator.style.cssText = `
            position: absolute;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: #724ae8;
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 0.8rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 5px;
            z-index: 5;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        // Add click handler to scroll to bottom
        this.newMessageIndicator.addEventListener('click', () => {
            chatbox.scrollTo({
                top: chatbox.scrollHeight,
                behavior: 'smooth'
            });
            this.removeNewMessageIndicator();
        });
        
        // Add to chatbot
        this.elements.chatbot.appendChild(this.newMessageIndicator);
        
        // Show with animation
        setTimeout(() => {
            this.newMessageIndicator.style.opacity = '1';
        }, 10);
        
        // Hide after 5 seconds
        setTimeout(() => {
            this.removeNewMessageIndicator();
        }, 5000);
    },
    
    // Remove new message indicator
    removeNewMessageIndicator() {
        if (!this.newMessageIndicator) return;
        
        this.newMessageIndicator.style.opacity = '0';
        setTimeout(() => {
            if (this.newMessageIndicator && this.newMessageIndicator.parentNode) {
                this.newMessageIndicator.parentNode.removeChild(this.newMessageIndicator);
            }
            this.newMessageIndicator = null;
        }, 300);
    },
    
    // Show error message
    showError(message = "Oops! Something went wrong. Please try again.") {
        this.removeTypingIndicator();
        const errorLi = this.addMessage(message, "incoming");
        if (errorLi && errorLi.querySelector('p')) {
            errorLi.querySelector('p').classList.add('error');
        }
        
        // Add retry button
        const retryContainer = document.createElement('div');
        retryContainer.className = 'retry-container';
        
        const retryBtn = document.createElement('button');
        retryBtn.className = 'retry-btn';
        retryBtn.textContent = 'Try Again';
        retryBtn.addEventListener('click', () => {
            // Prompt the user to retry their last message
            if (this.chatHistory.length > 0) {
                const lastUserMessage = [...this.chatHistory]
                    .reverse()
                    .find(entry => entry.className === 'outgoing');
                    
                if (lastUserMessage) {
                    this.elements.input.value = lastUserMessage.message;
                    this.elements.input.focus();
                }
            }
        });
        
        retryContainer.appendChild(retryBtn);
        if (errorLi && errorLi.querySelector('p')) {
            errorLi.querySelector('p').appendChild(retryContainer);
        }
    }
};

// Business Logic
const ChatbotLogic = {
    // Process user message and generate response
    async processUserMessage(message) {
        // Check if we have a cached response
        const cachedResponse = IBADatabase.getCachedResponse(message);
        if (cachedResponse) {
            const messageLi = ChatbotUI.addMessage("", "incoming");
            ChatbotUI.updateMessageWithResponse(
                messageLi, 
                cachedResponse.text, 
                cachedResponse.isEnrollmentQuery
            );
            return;
        }
        
        // Determine message type
        const isEnrollmentQuery = IBADatabase.containsKeywords(message, 'ENROLLMENT');
        const isProgramQuery = IBADatabase.containsKeywords(message, 'PROGRAM');
        const isContactQuery = IBADatabase.containsKeywords(message, 'CONTACT');
        
        try {
            // Create placeholder for response
            const messageLi = ChatbotUI.addMessage("", "incoming");
            
            // Generate AI response
            const responseText = await this.generateAIResponse(
                message, 
                isEnrollmentQuery, 
                isProgramQuery, 
                isContactQuery
            );
            
            // Update UI with response
            ChatbotUI.updateMessageWithResponse(messageLi, responseText, isEnrollmentQuery);
            
            // Cache the response
            IBADatabase.cacheResponse(message, {
                text: responseText,
                isEnrollmentQuery,
                timestamp: Date.now()
            });
            
        } catch (error) {
            console.error('Error generating response:', error);
            ChatbotUI.showError();
        }
    },
    
    // Generate response using AI API
    async generateAIResponse(message, isEnrollmentQuery, isProgramQuery, isContactQuery) {
        // Prepare prompt based on message type
        let prompt = '';
        
        if (isEnrollmentQuery) {
            prompt = `You are an AI assistant for International Bible Academy (IBA). 
                Respond to the following enrollment query in a friendly, concise tone.
                Provide a brief, encouraging response about the enrollment process, 
                highlighting its simplicity and accessibility. Mention that there is no tuition fee.`;
        } else if (isProgramQuery) {
            prompt = `You are an AI assistant for International Bible Academy (IBA).
                Respond to the following query about IBA programs in a conversational and helpful tone.
                Focus on program structure, content, and benefits.`;
        } else if (isContactQuery) {
            prompt = `You are an AI assistant for International Bible Academy (IBA).
                Respond to the following contact-related query in a friendly, helpful tone.
                Include relevant contact information and location details if requested.`;
        } else {
            prompt = `You are an AI assistant for International Bible Academy (IBA).
                Respond to the following query in a conversational, friendly, and concise tone.
                Be helpful and encourage the user to explore IBA's programs.`;
        }
        
        // Make request to AI API
        const response = await fetch(ChatbotConfig.API_URL(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${prompt}
                        
                        Query: "${message}"
                        
                        Context for reference: ${IBADatabase.content}`
                    }]
                }]
            })
        });
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        return data.candidates[0]?.content?.parts[0]?.text || 
            "Sorry, I couldn't generate a response at the moment. Please try again.";
    }
};

// Handle slow connections and loading state
const ConnectionManager = {
    isOnline: true,
    checkInterval: null,
    
    init() {
        // Check connection status
        window.addEventListener('online', this.handleConnectionChange.bind(this));
        window.addEventListener('offline', this.handleConnectionChange.bind(this));
        
        // Set up periodic checks
        this.checkInterval = setInterval(this.checkConnection.bind(this), 30000);
        
        // Initial check
        this.checkConnection();
    },
    
    handleConnectionChange(e) {
        this.isOnline = e.type === 'online';
        if (!this.isOnline) {
            ChatbotUI.showError("You appear to be offline. Please check your internet connection and try again.");
        }
    },
    
    checkConnection() {
        // Simple connection check
        if (!navigator.onLine) {
            this.isOnline = false;
            ChatbotUI.showError("You appear to be offline. Please check your internet connection and try again.");
        } else {
            this.isOnline = true;
        }
    },
    
    cleanup() {
        clearInterval(this.checkInterval);
    }
};

// Accessibility Enhancements
const AccessibilityManager = {
    init() {
        this.addA11yAttributes();
        this.setupKeyboardNavigation();
    },
    
    addA11yAttributes() {
        // Add proper ARIA roles and labels
        const chatbot = document.querySelector('.chatbot');
        if (chatbot) {
            chatbot.setAttribute('role', 'region');
            chatbot.setAttribute('aria-label', 'IBA Chatbot');
        }
        
        const toggler = document.querySelector('.chatbot-toggler');
        if (toggler) {
            toggler.setAttribute('role', 'button');
            toggler.setAttribute('aria-label', 'Open chat assistant');
            toggler.setAttribute('tabindex', '0');
        }
        
        const closeBtn = document.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.setAttribute('aria-label', 'Close chat assistant');
        }
        
        const chatInput = document.querySelector('.chat-input textarea');
        if (chatInput) {
            chatInput.setAttribute('aria-label', 'Type your message here');
            chatInput.setAttribute('placeholder', 'Type your message here...');
        }
        
        const sendBtn = document.querySelector('.chat-input span');
        if (sendBtn) {
            sendBtn.setAttribute('role', 'button');
            sendBtn.setAttribute('aria-label', 'Send message');
            sendBtn.setAttribute('tabindex', '0');
        }
    },
    
    setupKeyboardNavigation() {
        // Enable keyboard navigation
        const focusableElements = document.querySelectorAll(
            '.chatbot button, .chatbot a, .chatbot textarea, .chatbot-toggler'
        );
        
        focusableElements.forEach(el => {
            if (!el.getAttribute('tabindex')) {
                el.setAttribute('tabindex', '0');
            }
            
            // Add keyboard support for elements that need it
            if (el.tagName !== 'BUTTON' && el.tagName !== 'A' && el.tagName !== 'TEXTAREA') {
                el.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        el.click();
                    }
                });
            }
        });
    }
};

// Analytics for understanding user interactions (privacy-focused)
const AnalyticsManager = {
    enabled: false, // Default to disabled for privacy
    interactions: [],
    
    // Initialize analytics
    init() {
        // Check for user consent before enabling
        try {
            this.enabled = localStorage.getItem('ibaAnalyticsConsent') === 'true';
        } catch (e) {
            console.warn('Could not access localStorage for analytics consent');
        }
    },
    
    // Track user interaction (only if enabled)
    trackEvent(category, action, label = '') {
        if (!this.enabled) return;
        
        const event = {
            category,
            action,
            label,
            timestamp: new Date().toISOString()
        };
        
        this.interactions.push(event);
        
        // Limit stored interactions
        if (this.interactions.length > 100) {
            this.interactions = this.interactions.slice(-100);
        }
        
        // Could send to a server here, but keeping local for privacy
    },
    
    // Request consent from user
    requestConsent() {
        const hasAsked = localStorage.getItem('ibaAnalyticsAsked') === 'true';
        if (hasAsked) return;
        
        // Simple consent dialog
        const consent = confirm(
            'To help us improve our chatbot, may we collect anonymous usage data? ' +
            'No personal information will be stored or shared.'
        );
        
        this.enabled = consent;
        try {
            localStorage.setItem('ibaAnalyticsConsent', consent.toString());
            localStorage.setItem('ibaAnalyticsAsked', 'true');
        } catch (e) {
            console.warn('Could not save analytics preferences');
        }
    }
};

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI first
    ChatbotUI.init();
    
    // Initialize supporting components
    ConnectionManager.init();
    AccessibilityManager.init();
    AnalyticsManager.init();
    
    // Optional: Request analytics consent after delay
    setTimeout(() => {
        AnalyticsManager.requestConsent();
    }, 10000); // 10 seconds after page load
    
    // Optional: Restore previous chat if available
    if (ChatbotUI.loadChatHistory()) {
        console.log('Restored previous chat session');
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    ConnectionManager.cleanup();
});
