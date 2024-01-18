const words = ["Mutual Funds.", "Equity.", "Cryptocurrency.", "Real Estate.", "Hedge Funds."];
let i = 0;
let timer;

// Set initial text before typing effect
document.getElementById('word').innerHTML = "Welcome to ";

// Start typing effect after a brief delay
setTimeout(() => {
    typingEffect();
}, 1500); // Adjust the delay duration as needed

function typingEffect() {
    let word = words[i].split("");
    var loopTyping = function() {
        if (word.length > 0) {
            document.getElementById('word').innerHTML = document.getElementById('word').innerHTML + word.shift();
        } else {
            deletingEffect();
            return false;
        }
        timer = setTimeout(loopTyping, 150);
    };
    loopTyping();
}

function deletingEffect() {
    let word = words[i].split("");
    var loopDeleting = function() {
        if (word.length > 0) {
            word.pop();
            document.getElementById('word').innerHTML = "Seek Into  " + word.join("");
        } else {
            if (words.length > (i + 1)) {
                i++;
            } else {
                i = 0;
            }
            typingEffect();
            return false;
        }
        timer = setTimeout(loopDeleting, 110);
    };
    loopDeleting();
}
