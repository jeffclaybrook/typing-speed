const paragraph = document.querySelector('#paragraph');
const input = document.querySelector('#input');
const timeTag = document.querySelector('#timer');
const errorTag = document.querySelector('#errors');
const wpmTag = document.querySelector('#wpm');
const cpmTag = document.querySelector('#cpm');
const button = document.querySelector('#button');

let timer;
let maxTime = 60;
let timeLeft = maxTime;
let charIndex = errors = isTyping = 0;

async function getText() {
    const res = await fetch('data.json');
    const data = await res.json();
    return data;
}

async function loadText() {
    const text = await getText();
    let index = Math.floor(Math.random() * text.length);
    paragraph.innerHTML = '';
    text[index].quote.split('').forEach(char => {
        let span = `<span>${char}</span>`;
        paragraph.innerHTML += span;
    });
    paragraph.querySelectorAll('span')[0].classList.add('active');
    document.addEventListener('keydown', () => input.focus());
    paragraph.addEventListener('click', () => input.focus());
}

function initTyping() {
    let chars = paragraph.querySelectorAll('span');
    let typed = input.value.split('')[charIndex];
    if (charIndex < chars.length - 1 && timeLeft > 0) {
        if (!isTyping) {
            timer = setInterval(setTimer, 1000);
            isTyping = true;
        }
        if (typed == null) {
            if (charIndex > 0) {
                charIndex--;
                if (chars[charIndex].classList.contains('incorrect')) {
                    errors--;
                }
                chars[charIndex].classList.remove('correct', 'incorrect');
            }
        } else {
            if (chars[charIndex].innerText == typed) {
                chars[charIndex].classList.add('correct');
            } else {
                errors++;
                chars[charIndex].classList.add('incorrect');
            }
            charIndex++;
        }
        chars.forEach(char => char.classList.remove('active'));
        chars[charIndex].classList.add('active');
        let wpm = Math.round(((charIndex - errors) / 5) / (maxTime - timeLeft) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        wpmTag.innerText = wpm;
        errorTag.innerText = errors;
        cpmTag.innerText = charIndex - errors;
    } else {
        clearInterval(timer);
        input.value = '';
    }
}

function setTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = `${timeLeft}s`;
        let wpm = Math.round(((charIndex - errors) / 5) / (maxTime - timeLeft) * 60);
        wpmTag.innerText = wpm;
    } else {
        clearInterval(timer);
    }
}

function resetGame() {
    loadText();
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = errors = isTyping = 0;
    input.value = '';
    timeTag.innerText = `${timeLeft}s`;
    wpmTag.innerText = 0;
    errorTag.innerText = 0;
    cpmTag.innerText = 0;
}

loadText();
input.addEventListener('input', initTyping);
button.addEventListener('click', resetGame);