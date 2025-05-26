<html>
        <head><title>Downloaded HTML</title></head>
        <body>
            <pre style="white-space: pre-wrap; word-wrap: break-word;">document.addEventListener('DOMContentLoaded', function() {
    // Task links
    const taskLinks = [
        "https://otieu.com/4/9372115",
        "https://otieu.com/4/9373119",
        "https://otieu.com/4/9373116",
        "https://otieu.com/4/9373114",
        "https://otieu.com/4/9372103",
        "https://otieu.com/4/9371978",
        "https://otieu.com/4/6691785",
        "https://otieu.com/4/9372102",
        "https://otieu.com/4/5951040",
        "https://otieu.com/4/9373115",
        "https://otieu.com/4/9373122",
        "https://otieu.com/4/9373118",
        "https://otieu.com/4/9373120",
        "https://otieu.com/4/9372117",
        "https://otieu.com/4/9372114",
        "https://otieu.com/4/9373119",
        "https://otieu.com/4/9373114",
        "https://otieu.com/4/9371978",
        "https://otieu.com/4/6691785",
        "https://otieu.com/4/9373115"
    ];

    // DOM elements
    const taskButtonsContainer = document.getElementById('taskButtons');
    const submitBtn = document.getElementById('submitBtn');
    const countdownDisplay = document.getElementById('countdownValue');
    const cashappInput = document.getElementById('cashapp');
    const notificationText = document.getElementById('notification-text');
    const notificationBar = document.querySelector('.notification-bar');
    const warningMessage = document.getElementById('warningMessage');
    const countdownContainer = document.getElementById('countdown');
    
    // State variables
    let currentActiveTask = 0;
    let countdownInterval;
    let countdown = 10;
    let taskTab = null;
    let countdownPaused = false;
    let countdownStartTime = 0;
    let remainingTime = 10;

    // Generate realistic CashApp tags
    function generateRealisticCashTag() {
        const firstNames = ['Alex', 'Jamie', 'Taylor', 'Jordan', 'Casey', 'Morgan', 'Riley'];
        const lastInitials = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const numbers = ['23', '24', '99', '2023', '1', '7'];
        
        const pattern = Math.floor(Math.random() * 3);
        switch(pattern) {
            case 0:
                return `$${firstNames[Math.floor(Math.random() * firstNames.length)]}${
                    lastInitials[Math.floor(Math.random() * lastInitials.length)]}${
                    numbers[Math.floor(Math.random() * numbers.length)]}`;
            case 1:
                return `$${firstNames[Math.floor(Math.random() * firstNames.length)]}${
                    numbers[Math.floor(Math.random() * numbers.length)]}`;
            case 2:
                return `$${firstNames[Math.floor(Math.random() * firstNames.length)]}${
                    lastInitials[Math.floor(Math.random() * lastInitials.length)]}`;
        }
    }

    // Generate task buttons
    taskLinks.forEach((link, index) => {
        const button = document.createElement('button');
        button.className = 'task-btn';
        button.textContent = `Task ${index + 1}`;
        button.disabled = index !== 0;
        
        if (index === 0) {
            button.classList.add('active');
        }
        
        button.addEventListener('click', () => handleTaskClick(index, link));
        taskButtonsContainer.appendChild(button);
    });

    // Handle task button click
    function handleTaskClick(index, link) {
        const buttons = document.querySelectorAll('.task-btn');
        
        // Open link in new tab and store reference
        taskTab = window.open(link, '_blank');
        
        // Mark current task as in progress
        buttons[index].classList.remove('active');
        buttons[index].classList.add('in-progress');
        buttons[index].disabled = true;
        
        // Start countdown
        startCountdown(index);
    }

    // Start countdown timer
    function startCountdown(taskIndex) {
        clearInterval(countdownInterval);
        countdown = 10;
        remainingTime = 10;
        countdownStartTime = Date.now();
        countdownPaused = false;
        updateCountdownDisplay();
        
        countdownInterval = setInterval(() => {
            if (!countdownPaused) {
                countdown--;
                remainingTime = countdown;
                updateCountdownDisplay();
                
                if (countdown <= 0) {
                    completeTask(taskIndex);
                }
            }
        }, 1000);
        
        // Setup visibility change listeners
        document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    function handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden - user switched to task tab
            countdownPaused = false;
            warningMessage.style.display = 'none';
        } else {
            // Page is visible again - check if user came back too soon
            if (taskTab && !taskTab.closed && countdown > 0) {
                const timeElapsed = (Date.now() - countdownStartTime) / 1000;
                if (timeElapsed < (10 - remainingTime)) {
                    countdownPaused = true;
                    warningMessage.textContent = 'Please stay on the task page for the full 10 seconds!';
                    warningMessage.style.display = 'block';
                }
            }
        }
    }

    function completeTask(taskIndex) {
        clearInterval(countdownInterval);
        const buttons = document.querySelectorAll('.task-btn');
        
        // Mark task as completed
        buttons[taskIndex].classList.remove('in-progress');
        buttons[taskIndex].classList.add('completed');
        
        // Enable next task or submit button
        if (taskIndex < buttons.length - 1) {
            buttons[taskIndex + 1].disabled = false;
            buttons[taskIndex + 1].classList.add('active');
            currentActiveTask = taskIndex + 1;
        } else {
            // All tasks completed
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.classList.add('active');
            }, 1000);
        }
        
        // Remove visibility listener
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        warningMessage.style.display = 'none';
    }

    function updateCountdownDisplay() {
        countdownDisplay.textContent = countdown;
    }

    // Notification system (same as before)
    function generateRandomNotification() {
        const cashTag = generateRealisticCashTag();
        const now = new Date();
        const minutesAgo = Math.floor(Math.random() * 60) + 1;
        const notificationTime = new Date(now.getTime() - minutesAgo * 60000);
        
        const timeString = notificationTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateString = notificationTime.toLocaleDateString([], { month: 'short', day: 'numeric' });
        
        const messages = [
            `${cashTag} just claimed $20`,
            `Payment sent to ${cashTag}`,
            `${cashTag} received $20`
        ];
        notificationText.textContent = `${messages[Math.floor(Math.random() * messages.length)]} at ${timeString} on ${dateString}`;
        notificationBar.style.display = 'flex';
        
        setTimeout(generateRandomNotification, Math.random() * 30000 + 15000);
    }

    function closeNotification() {
        notificationBar.style.display = 'none';
    }

    // Form submission
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const cashappTag = cashappInput.value.trim();
        
        if (!cashappTag) {
            alert('Please enter your CashApp tag!');
            return;
        }
        
        // Show confirmation
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateString = now.toLocaleDateString([], { month: 'short', day: 'numeric' });
        
        notificationText.textContent = `Payment sent to ${cashappTag} at ${timeString} on ${dateString}`;
        notificationBar.style.display = 'flex';
        
        alert(`Thank you! Your CashApp tag ${cashappTag} has been submitted. You will receive your $20 shortly.`);
        
        // Reset form
        cashappInput.value = '';
        submitBtn.disabled = true;
        submitBtn.classList.remove('active');
    });

    // Start notifications
    setTimeout(generateRandomNotification, 3000);
});</pre>
        </body>
    </html>