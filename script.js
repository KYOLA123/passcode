document.addEventListener("DOMContentLoaded", () => {
    const passInput = document.getElementById('new_password');
    const togglePassword = document.getElementById('toggle-password');
    const seg1 = document.getElementById('segment-1');
    const seg2 = document.getElementById('segment-2');
    const seg3 = document.getElementById('segment-3');
    const label = document.getElementById('strength-label');

    // Requirements Checklist Icons
    const reqLength = document.getElementById('req-length');
    const reqUppercase = document.getElementById('req-uppercase');
    const reqNumber = document.getElementById('req-number');
    const reqSpecial = document.getElementById('req-special');

    // Generation State Parameters
    const lengthSelector = document.getElementById('length-selector');
    const refreshSuggestionsBtn = document.getElementById('refresh-suggestions');
    const suggestionsContainer = document.getElementById('suggestions-container');

    let currentLength = 8;

    // Visibility configuration
    togglePassword.addEventListener('click', () => {
        const isPassword = passInput.type === 'password';
        passInput.type = isPassword ? 'text' : 'password';
        togglePassword.querySelector('.material-symbols-outlined').textContent = isPassword ? 'visibility_off' : 'visibility';
    });

    // Real-time calculation and compliance parsing
    passInput.addEventListener('input', (e) => {
        const val = e.target.value;
        
        const hasLength = val.length >= 8;
        const hasUpper = /[A-Z]/.test(val);
        const hasNumber = /[0-9]/.test(val);
        const hasSpecial = /[!@#$%^&*.]/.test(val);

        toggleRequirement(reqLength, hasLength);
        toggleRequirement(reqUppercase, hasUpper);
        toggleRequirement(reqNumber, hasNumber);
        toggleRequirement(reqSpecial, hasSpecial);

        const passedCount = [hasLength, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

        if (val.length === 0) {
            updateBar('weak', ['bg-surface-container-high', 'bg-surface-container-high', 'bg-surface-container-high'], 'Empty');
        } else if (passedCount <= 1) {
            updateBar('error', ['bg-error', 'bg-surface-container-high', 'bg-surface-container-high'], 'Weak');
        } else if (passedCount <= 3) {
            updateBar('warning', ['bg-[#fbbf24]', 'bg-[#fbbf24]', 'bg-surface-container-high'], 'Medium');
        } else {
            updateBar('secondary', ['bg-secondary', 'bg-secondary', 'bg-secondary'], 'Strong');
        }
    });

    function toggleRequirement(element, isMet) {
        const icon = element.querySelector('.material-symbols-outlined');
        if (isMet) {
            element.className = "flex items-center gap-md requirement-met";
            icon.textContent = "check_circle";
        } else {
            element.className = "flex items-center gap-md requirement-unmet";
            icon.textContent = "radio_button_unchecked";
        }
    }

    function updateBar(status, colors, text) {
        seg1.className = `h-full w-1/3 transition-colors duration-500 ${colors[0]}`;
        seg2.className = `h-full w-1/3 transition-colors duration-500 ${colors[1]}`;
        seg3.className = `h-full w-1/3 transition-colors duration-500 ${colors[2]}`;
        label.innerText = text;
        label.className = `text-label-lg font-label-lg ${status === 'secondary' ? 'text-secondary' : status === 'warning' ? 'text-yellow-400' : 'text-error'}`;
    }

    // Interactive Selector Nodes
    lengthSelector.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            lengthSelector.querySelectorAll('button').forEach(b => b.className = "flex-1 py-1.5 text-label-lg rounded text-on-surface-variant hover:bg-surface-container-high transition-all");
            btn.className = "flex-1 py-1.5 text-label-lg rounded bg-primary text-on-primary transition-all";
            currentLength = parseInt(btn.getAttribute('data-len'));
            generateSuggestions();
        });
    });

    function generateRandomPassword(len, useSymbols) {
        const alphaNum = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const symbols = "!@#$%^&*.";
        const pool = useSymbols ? alphaNum + symbols : alphaNum;
        let result = "";
        for (let i = 0; i < len; i++) {
            result += pool.charAt(Math.floor(Math.random() * pool.length));
        }
        return result;
    }

    function generateSuggestions() {
        suggestionsContainer.innerHTML = "";
        const mode = document.querySelector('input[name="char_type"]:checked').value;
        const useSymbols = mode === "symbols";

        for (let i = 0; i < 2; i++) {
            const pass = generateRandomPassword(currentLength, useSymbols);
            const item = document.createElement('div');
            item.className = "flex items-center justify-between bg-surface-container-lowest border border-outline-variant rounded-lg p-sm group hover:border-primary transition-colors";
            item.innerHTML = `
                <span class="font-mono-sample text-mono-sample text-on-surface">${pass}</span>
                <div class="flex gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="p-1 text-on-surface-variant hover:text-primary copy-btn"><span class="material-symbols-outlined text-sm" data-icon="content_copy">content_copy</span></button>
                    <button class="bg-primary text-on-primary px-2 py-0.5 rounded text-xs apply-btn">Apply</button>
                </div>
            `;

            item.querySelector('.apply-btn').addEventListener('click', () => {
                passInput.value = pass;
                passInput.dispatchEvent(new Event('input'));
            });

            item.querySelector('.copy-btn').addEventListener('click', () => {
                navigator.clipboard.writeText(pass);
            });

            suggestionsContainer.appendChild(item);
        }
    }

    refreshSuggestionsBtn.addEventListener('click', generateSuggestions);
    document.querySelectorAll('input[name="char_type"]').forEach(r => r.addEventListener('change', generateSuggestions));
    
    generateSuggestions();
});