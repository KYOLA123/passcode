// DOM Hook Selectors
const passInput = document.getElementById('new_password');
const confirmInput = document.getElementById('confirm_password');
const togglePasswordBtn = document.getElementById('toggle-password');
const togglePasswordIcon = document.getElementById('toggle-password-icon');
const matchError = document.getElementById('match-error');
const submitBtn = document.getElementById('submit-btn');
const suggestionsContainer = document.getElementById('suggestions-container');
const refreshSuggestionsBtn = document.getElementById('refresh-suggestions');

const seg1 = document.getElementById('segment-1');
const seg2 = document.getElementById('segment-2');
const seg3 = document.getElementById('segment-3');
const label = document.getElementById('strength-label');

// Password Criteria Requirements Mapping
const reqs = {
    length: { el: document.getElementById('req-length'), icon: document.getElementById('icon-length'), test: (val) => val.length >= 8 },
    upper: { el: document.getElementById('req-upper'), icon: document.getElementById('icon-upper'), test: (val) => /[A-Z]/.test(val) },
    number: { el: document.getElementById('req-number'), icon: document.getElementById('icon-number'), test: (val) => /[0-9]/.test(val) },
    special: { el: document.getElementById('req-special'), icon: document.getElementById('icon-special'), test: (val) => /[!@#$%^&*.]/.test(val) }
};

// Toggle Obfuscated Password Masking View
togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passInput.type === 'password';
    passInput.type = isPassword ? 'text' : 'password';
    confirmInput.type = isPassword ? 'text' : 'password';
    togglePasswordIcon.innerText = isPassword ? 'visibility_off' : 'visibility';
});

// Main Interactive Complexity Parsing Validator
function validatePassword() {
    const val = passInput.value;
    let metCount = 0;

    // Evaluate standard compliance requirements ruleset
    Object.keys(reqs).forEach(key => {
        const isValid = reqs[key].test(val);
        if (isValid && val.length > 0) {
            reqs[key].el.className = "flex items-center gap-md requirement-met";
            reqs[key].icon.innerText = "check_circle";
            metCount++;
        } else {
            reqs[key].el.className = "flex items-center gap-md requirement-unmet";
            reqs[key].icon.innerText = "radio_button_unchecked";
        }
    });

    // Render Strength meter and label classifications
    if (val.length === 0) {
        updateBar('empty', ['bg-surface-container-high', 'bg-surface-container-high', 'bg-surface-container-high'], 'Empty');
    } else if (metCount <= 2) {
        updateBar('error', ['bg-error', 'bg-surface-container-high', 'bg-surface-container-high'], 'Weak');
    } else if (metCount === 3) {
        updateBar('warning', ['bg-[#fbbf24]', 'bg-[#fbbf24]', 'bg-surface-container-high'], 'Medium');
    } else if (metCount === 4) {
        updateBar('secondary', ['bg-secondary', 'bg-secondary', 'bg-secondary'], 'Strong');
    }

    verifyMatch();
}

function updateBar(status, colors, text) {
    seg1.className = `h-full w-1/3 transition-colors duration-500 ${colors[0]}`;
    seg2.className = `h-full w-1/3 transition-colors duration-500 ${colors[1]}`;
    seg3.className = `h-full w-1/3 transition-colors duration-500 ${colors[2]}`;
    label.innerText = text;
    
    if (status === 'empty') {
        label.className = 'text-label-lg font-label-lg text-on-surface-variant/40';
    } else {
        label.className = `text-label-lg font-label-lg ${status === 'secondary' ? 'text-secondary' : status === 'warning' ? 'text-yellow-400' : 'text-error'}`;
    }
}

// Check alignment matching equivalence
function verifyMatch() {
    const p1 = passInput.value;
    const p2 = confirmInput.value;
    const allRequirementsMet = Object.keys(reqs).every(key => reqs[key].test(p1));

    if (p2.length > 0 && p1 !== p2) {
        matchError.classList.remove('hidden');
        disableSubmit();
    } else {
        matchError.classList.add('hidden');
        if (allRequirementsMet && p1 === p2 && p1.length > 0) {
            enableSubmit();
        } else {
            disableSubmit();
        }
    }
}

function enableSubmit() {
    submitBtn.removeAttribute('disabled');
    submitBtn.className = "w-full bg-primary text-on-primary py-sm rounded-lg font-label-lg hover:opacity-90 active:scale-95 transition-all mt-lg h-14 cursor-pointer";
}

function disableSubmit() {
    submitBtn.setAttribute('disabled', 'true');
    submitBtn.className = "w-full bg-primary/40 text-on-primary/50 cursor-not-allowed py-sm rounded-lg font-label-lg transition-all mt-lg h-14";
}

// Generate secure pseudorandom entropy strings
function generatePassString() {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const caps = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    const specs = "!@#$%^&*.";
    
    let pass = "";
    pass += caps[Math.floor(Math.random() * caps.length)];
    pass += nums[Math.floor(Math.random() * nums.length)];
    pass += specs[Math.floor(Math.random() * specs.length)];
    
    const pool = chars + caps + nums + specs;
    for(let i = 0; i < 11; i++) {
        pass += pool[Math.floor(Math.random() * pool.length)];
    }
    return pass.split('').sort(() => 0.5 - Math.random()).join('');
}

// Populate suggested panel variations
function populateSuggestions() {
    suggestionsContainer.innerHTML = '';
    for (let i = 0; i < 2; i++) {
        const password = generatePassString();
        const complexNode = document.createElement('div');
        complexNode.className = "flex items-center justify-between bg-surface-container-lowest border border-outline-variant rounded-lg p-sm group hover:border-primary transition-colors";
        complexNode.innerHTML = `
            <span class="font-mono-sample text-mono-sample text-on-surface selection-target">${password}</span>
            <div class="flex gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" class="copy-trigger p-1 text-on-surface-variant hover:text-primary" title="Copy to clipboard">
                    <span class="material-symbols-outlined text-sm">content_copy</span>
                </button>
                <button type="button" class="apply-trigger bg-primary text-on-primary px-2 py-0.5 rounded text-xs hover:opacity-90 active:scale-95 transition-all">Apply</button>
            </div>
        `;

        // Action Trigger bindings
        complexNode.querySelector('.apply-trigger').addEventListener('click', () => {
            passInput.value = password;
            confirmInput.value = password;
            validatePassword();
        });

        complexNode.querySelector('.copy-trigger').addEventListener('click', async (e) => {
            await navigator.clipboard.writeText(password);
            const icon = e.currentTarget.querySelector('.material-symbols-outlined');
            icon.innerText = "done";
            setTimeout(() => icon.innerText = "content_copy", 1500);
        });

        suggestionsContainer.appendChild(complexNode);
    }
}

// Wiring Runtime Core Event Handlers
passInput.addEventListener('input', validatePassword);
confirmInput.addEventListener('input', verifyMatch);
refreshSuggestionsBtn.addEventListener('click', populateSuggestions);

// Execute setup defaults on script parse evaluation
populateSuggestions();