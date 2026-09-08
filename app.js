"use strict";

/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-navigation");

if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navigation.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
        });
    });
}

/* =========================================================
   LIVE INDIA DATE / TIME
   ========================================================= */

const dateElement =
    document.querySelector("#ist-date") ||
    document.querySelector("#date-display");

const timeElement =
    document.querySelector("#ist-time") ||
    document.querySelector("#time-display");

const indiaDateFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric"
});

const indiaTimeFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
});

function updateIndiaClock() {
    const now = new Date();
    if (dateElement) dateElement.textContent = indiaDateFormatter.format(now);
    if (timeElement) timeElement.textContent = indiaTimeFormatter.format(now);
}

updateIndiaClock();
window.setInterval(updateIndiaClock, 1000);

/* =========================================================
   LAUNCH NOTIFICATION FORM
   ========================================================= */

const notifyForm = document.querySelector("#notify-form");

if (notifyForm) {
    notifyForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const emailInput = notifyForm.querySelector('input[type="email"]');
        const message = document.querySelector("#form-message");

        if (!emailInput || !emailInput.checkValidity()) {
            emailInput?.reportValidity();
            return;
        }

        if (message) {
            message.textContent =
                "Thank you. The notification service is not connected yet.";
        }

        notifyForm.reset();
    });
}

/* =========================================================
   PASSWORD TOGGLES
   Supports Login, Sign Up, and Password Reset.
   ========================================================= */

function initializePasswordToggle(toggle) {
    const targetId = toggle.dataset.passwordToggle || (toggle.id === "password-toggle" ? "password" : null);
    const target = document.getElementById(targetId);

    if (!target) return;

    toggle.addEventListener("click", () => {
        const showing = target.type === "password";
        target.type = showing ? "text" : "password";
        toggle.textContent = showing ? "Hide" : "Show";
        toggle.setAttribute(
            "aria-label",
            showing ? `Hide ${target.labels?.[0]?.textContent?.toLowerCase() || "password"}` :
                `Show ${target.labels?.[0]?.textContent?.toLowerCase() || "password"}`
        );
        toggle.setAttribute("aria-pressed", String(showing));
    });
}

document.querySelectorAll("[data-password-toggle]").forEach(initializePasswordToggle);

const passwordInput = document.querySelector("#password");
const passwordToggle = document.querySelector("#password-toggle");

if (passwordInput && passwordToggle) {
    initializePasswordToggle(passwordToggle);
}

/* =========================================================
   LOGIN PAGE
   Frontend validation only. Real authentication will later
   be connected to a secure backend/API.
   ========================================================= */

const loginForm = document.querySelector("#login-form");

if (loginForm) {
    const emailInput = document.querySelector("#email");
    const password = document.querySelector("#password");
    const remember = document.querySelector("#remember-me");
    const message =
        document.querySelector("#form-message") ||
        document.querySelector("#login-message");

    const savedEmail = localStorage.getItem("apply4company_login_email");

    if (savedEmail && emailInput) {
        emailInput.value = savedEmail;
        if (remember) remember.checked = true;
    }

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        clearFieldErrors(loginForm);
        if (message) {
            message.textContent = "";
            message.classList.remove("error");
        }

        const email = emailInput?.value.trim() || "";
        const passwordValue = password?.value || "";

        if (!email) {
            setFieldError("email-error", "Please enter your email address.", emailInput);
            return;
        }

        if (!isValidEmail(email)) {
            setFieldError("email-error", "Please enter a valid email address.", emailInput);
            return;
        }

        if (!passwordValue) {
            setFieldError("password-error", "Please enter your password.", password);
            return;
        }

        if (remember?.checked) {
            localStorage.setItem("apply4company_login_email", email);
        } else {
            localStorage.removeItem("apply4company_login_email");
        }

        if (message) {
            message.textContent = "Login service is not connected yet.";
        }
    });
}

/* =========================================================
   SIGN UP PAGE
   Frontend validation only. Never store passwords locally.
   ========================================================= */

const signupForm = document.querySelector("#signup-form");

if (signupForm) {
    const nameInput = document.querySelector("#full-name");
    const emailInput = document.querySelector("#email");
    const password = document.querySelector("#password");
    const confirmPassword = document.querySelector("#confirm-password");
    const terms = document.querySelector("#terms");
    const message = document.querySelector("#form-message");

    signupForm.addEventListener("submit", (event) => {
        event.preventDefault();

        clearFieldErrors(signupForm);
        if (message) {
            message.textContent = "";
            message.classList.remove("error");
        }

        const fullName = nameInput?.value.trim() || "";
        const email = emailInput?.value.trim() || "";
        const passwordValue = password?.value || "";
        const confirmValue = confirmPassword?.value || "";

        if (!fullName) {
            setFieldError("name-error", "Please enter your full name.", nameInput);
            return;
        }

        if (fullName.length < 2) {
            setFieldError("name-error", "Please enter a valid name.", nameInput);
            return;
        }

        if (!email) {
            setFieldError("email-error", "Please enter your email address.", emailInput);
            return;
        }

        if (!isValidEmail(email)) {
            setFieldError("email-error", "Please enter a valid email address.", emailInput);
            return;
        }

        if (!passwordValue) {
            setFieldError("password-error", "Please create a password.", password);
            return;
        }

        if (passwordValue.length < 8) {
            setFieldError(
                "password-error",
                "Password must be at least 8 characters.",
                password
            );
            return;
        }

        if (!confirmValue) {
            setFieldError(
                "confirm-password-error",
                "Please confirm your password.",
                confirmPassword
            );
            return;
        }

        if (passwordValue !== confirmValue) {
            setFieldError(
                "confirm-password-error",
                "Passwords do not match.",
                confirmPassword
            );
            return;
        }

        if (terms && !terms.checked) {
            const termsError = document.querySelector("#terms-error");
            if (termsError) {
                termsError.textContent =
                    "Please accept the Terms of Use and acknowledge the Privacy Policy.";
            }
            terms.setAttribute("aria-invalid", "true");
            if (message) {
                message.textContent =
                    "Please accept the Terms of Use and acknowledge the Privacy Policy.";
                message.classList.add("error");
            }
            terms.focus();
            return;
        }

        if (terms) {
            terms.removeAttribute("aria-invalid");
            const termsError = document.querySelector("#terms-error");
            if (termsError) termsError.textContent = "";
        }

        if (message) {
            message.textContent = "Sign-up service is not connected yet.";
        }
    });
}

/* =========================================================
   PASSWORD RESET FLOW

   Production API contract expected by this UI:
   POST /auth/password-reset/request-otp
     body: { email }
     response: generic success message; never reveal account existence.

   POST /auth/password-reset/verify-otp
     body: { email, otp }
     response: { resetToken }

   POST /auth/password-reset/complete
     body: { resetToken, newPassword }
     response: success or a password-history conflict.

   The backend must enforce OTP expiry, single use, rate limits,
   password hashing, previous-3-password history, CSRF/session
   protections as applicable, audit logging, and session revocation.
   This frontend never stores passwords, OTPs, or reset tokens in
   localStorage/sessionStorage.
   ========================================================= */

const resetCard = document.querySelector("[data-reset-flow]");

if (resetCard) {
    const emailForm = document.querySelector("#password-reset-email-form");
    const otpForm = document.querySelector("#password-reset-otp-form");
    const newPasswordForm = document.querySelector("#password-reset-new-form");
    const description = document.querySelector("#reset-description");
    const stepLabel = document.querySelector("#reset-step-label");
    const indicators = [...document.querySelectorAll("[data-reset-indicator]")];

    const emailInput = document.querySelector("#reset-email");
    const otpInput = document.querySelector("#reset-otp");
    const newPassword = document.querySelector("#new-password");
    const confirmNewPassword = document.querySelector("#confirm-new-password");

    const emailMessage = document.querySelector("#reset-email-message");
    const otpMessage = document.querySelector("#reset-otp-message");
    const passwordMessage = document.querySelector("#reset-password-message");

    const sendButton = document.querySelector("#send-reset-otp-button");
    const verifyButton = document.querySelector("#verify-reset-otp-button");
    const resetButton = document.querySelector("#reset-password-button");
    const changeEmailButton = document.querySelector("#change-reset-email");
    const resendButton = document.querySelector("#resend-reset-otp");
    const resendCountdown = document.querySelector("#resend-countdown");

    let resetToken = null;
    let resendTimer = null;
    let currentStep = 1;

    const RESET_API_BASE =
        window.APPLY4COMPANY_API_BASE_URL || "/api";

    function setResetMessage(element, text, isError = false) {
        if (!element) return;
        element.textContent = text;
        element.classList.toggle("error", isError);
    }

    function setLoading(button, loading, loadingText) {
        if (!button) return;
        if (loading) {
            button.dataset.originalText = button.textContent;
            button.disabled = true;
            button.setAttribute("aria-busy", "true");
            button.textContent = loadingText;
        } else {
            button.disabled = false;
            button.removeAttribute("aria-busy");
            if (button.dataset.originalText) {
                button.textContent = button.dataset.originalText;
            }
        }
    }

    function updateResetProgress(step) {
        currentStep = step;
        const labels = {
            1: "Step 1 of 3 · Verify your email",
            2: "Step 2 of 3 · Verify your OTP",
            3: "Step 3 of 3 · Create a new password"
        };
        const descriptions = {
            1: "Enter your account email. We will send a one-time verification code to the email address if an account is eligible for recovery.",
            2: "Enter the one-time verification code sent to your email. The code should be short-lived and single-use.",
            3: "Create a new password. The production account service will reject a password that matches any of your previous 3 passwords."
        };

        if (stepLabel) stepLabel.textContent = labels[step];
        if (description) description.textContent = descriptions[step];

        indicators.forEach((indicator) => {
            const indicatorStep = Number(indicator.dataset.resetIndicator);
            indicator.classList.toggle("is-current", indicatorStep === step);
            indicator.classList.toggle("is-complete", indicatorStep < step);
            indicator.setAttribute("aria-current", indicatorStep === step ? "step" : "false");
        });

        [emailForm, otpForm, newPasswordForm].forEach((panel) => {
            if (!panel) return;
            const panelStep = Number(panel.dataset.resetStep);
            panel.hidden = panelStep !== step;
        });

    }

    function resetResetFlow() {
        resetToken = null;
        clearFieldErrors(emailForm);
        clearFieldErrors(otpForm);
        clearFieldErrors(newPasswordForm);
        if (otpInput) otpInput.value = "";
        if (newPassword) newPassword.value = "";
        if (confirmNewPassword) confirmNewPassword.value = "";
        setResetMessage(emailMessage, "");
        setResetMessage(otpMessage, "");
        setResetMessage(passwordMessage, "");
        stopResendCountdown();
        if (resendButton) resendButton.disabled = true;
        updateResetProgress(1);
        emailInput?.focus();
    }

    function startResendCountdown(seconds = 60) {
        stopResendCountdown();
        if (!resendButton) return;
        resendButton.disabled = true;
        let remaining = seconds;

        const update = () => {
            if (!resendCountdown) return;
            resendCountdown.textContent = remaining > 0 ? `(${remaining}s)` : "";
        };
        update();

        resendTimer = window.setInterval(() => {
            remaining -= 1;
            update();
            if (remaining <= 0) {
                stopResendCountdown();
                resendButton.disabled = false;
            }
        }, 1000);
    }

    function stopResendCountdown() {
        if (resendTimer) {
            window.clearInterval(resendTimer);
            resendTimer = null;
        }
        if (resendCountdown) resendCountdown.textContent = "";
    }

    async function callResetApi(path, body) {
        const response = await fetch(`${RESET_API_BASE}${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(body)
        });

        let payload = {};
        try {
            payload = await response.json();
        } catch {
            payload = {};
        }

        if (!response.ok) {
            const error = new Error(payload.message || "The password recovery service could not complete the request.");
            error.code = payload.code || response.status;
            throw error;
        }

        return payload;
    }

    emailForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearFieldErrors(emailForm);
        setResetMessage(emailMessage, "");

        const email = emailInput?.value.trim() || "";
        if (!email) {
            setFieldError("reset-email-error", "Please enter your email address.", emailInput);
            return;
        }
        if (!isValidEmail(email)) {
            setFieldError("reset-email-error", "Please enter a valid email address.", emailInput);
            return;
        }

        setLoading(sendButton, true, "Sending OTP…");

        try {
            await callResetApi("/auth/password-reset/request-otp", { email });

            /*
             * The UI intentionally uses a generic message. A production API
             * should return the same outward response whether the account
             * exists, to reduce account-enumeration risk.
             */
            setResetMessage(
                emailMessage,
                "If an eligible Apply4Company account uses this email, a verification code has been sent. Check your inbox and spam folder."
            );
            updateResetProgress(2);
            otpInput?.focus();
            startResendCountdown(60);
        } catch (error) {
            if (error instanceof TypeError) {
                setResetMessage(
                    emailMessage,
                    "Password recovery service is not connected to this site yet. The production backend must send the OTP securely.",
                    true
                );
            } else if (error.code === 429) {
                setResetMessage(
                    emailMessage,
                    "Too many recovery requests. Please wait before trying again.",
                    true
                );
            } else {
                setResetMessage(
                    emailMessage,
                    error.message || "We could not start password recovery. Please try again.",
                    true
                );
            }
        } finally {
            setLoading(sendButton, false);
        }
    });

    otpForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearFieldErrors(otpForm);
        setResetMessage(otpMessage, "");

        const email = emailInput?.value.trim() || "";
        const otp = otpInput?.value.trim() || "";

        if (!/^[0-9]{6}$/.test(otp)) {
            setFieldError("reset-otp-error", "Enter the 6-digit verification code from your email.", otpInput);
            return;
        }

        setLoading(verifyButton, true, "Verifying…");

        try {
            const payload = await callResetApi("/auth/password-reset/verify-otp", {
                email,
                otp
            });

            if (!payload.resetToken) {
                throw new Error("The recovery service did not return a valid reset session.");
            }

            resetToken = payload.resetToken;
            setResetMessage(otpMessage, "Code verified. Create your new password.");
            updateResetProgress(3);
            newPassword?.focus();
        } catch (error) {
            if (error instanceof TypeError) {
                setResetMessage(
                    otpMessage,
                    "Password recovery service is not connected to this site yet.",
                    true
                );
            } else {
                setFieldError(
                    "reset-otp-error",
                    "The code is invalid or expired. Request a new code and try again.",
                    otpInput
                );
            }
        } finally {
            setLoading(verifyButton, false);
        }
    });

    newPasswordForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearFieldErrors(newPasswordForm);
        setResetMessage(passwordMessage, "");

        if (!resetToken) {
            setResetMessage(
                passwordMessage,
                "Your password-reset session is no longer valid. Please request a new OTP.",
                true
            );
            updateResetProgress(1);
            emailInput?.focus();
            return;
        }

        const passwordValue = newPassword?.value || "";
        const confirmValue = confirmNewPassword?.value || "";

        if (!passwordValue) {
            setFieldError("new-password-error", "Please enter a new password.", newPassword);
            return;
        }

        if (passwordValue.length < 8) {
            setFieldError("new-password-error", "Password must be at least 8 characters.", newPassword);
            return;
        }

        if (!confirmValue) {
            setFieldError("confirm-new-password-error", "Please confirm your new password.", confirmNewPassword);
            return;
        }

        if (passwordValue !== confirmValue) {
            setFieldError("confirm-new-password-error", "Passwords do not match.", confirmNewPassword);
            return;
        }

        setLoading(resetButton, true, "Updating password…");

        try {
            await callResetApi("/auth/password-reset/complete", {
                resetToken,
                newPassword: passwordValue
            });

            resetToken = null;
            stopResendCountdown();
            window.location.assign("password-reset-success.html");
        } catch (error) {
            if (error instanceof TypeError) {
                setResetMessage(
                    passwordMessage,
                    "Password recovery service is not connected to this site yet. The production backend must validate password history securely.",
                    true
                );
            } else if (error.code === "PASSWORD_REUSED") {
                setFieldError(
                    "new-password-error",
                    "Choose a password that is different from your previous 3 passwords.",
                    newPassword
                );
            } else if (error.code === 401 || error.code === 403) {
                setResetMessage(
                    passwordMessage,
                    "Your password-reset session has expired. Please start again.",
                    true
                );
                updateResetProgress(1);
                emailInput?.focus();
            } else {
                setResetMessage(
                    passwordMessage,
                    error.message || "We could not update your password. Please try again.",
                    true
                );
            }
        } finally {
            setLoading(resetButton, false);
        }
    });

    changeEmailButton?.addEventListener("click", () => {
        resetResetFlow();
    });

    resendButton?.addEventListener("click", async () => {
        if (resendButton.disabled) return;

        const email = emailInput?.value.trim() || "";
        if (!isValidEmail(email)) {
            updateResetProgress(1);
            setFieldError("reset-email-error", "Please enter a valid email address.", emailInput);
            return;
        }

        setResetMessage(otpMessage, "");
        setLoading(resendButton, true, "Sending…");

        try {
            await callResetApi("/auth/password-reset/request-otp", { email });
            setResetMessage(
                otpMessage,
                "If an eligible account uses this email, a new verification code has been sent."
            );
            if (otpInput) otpInput.value = "";
            otpInput?.focus();
            startResendCountdown(60);
        } catch (error) {
            if (error instanceof TypeError) {
                setResetMessage(
                    otpMessage,
                    "Password recovery service is not connected to this site yet.",
                    true
                );
            } else if (error.code === 429) {
                setResetMessage(
                    otpMessage,
                    "Too many recovery requests. Please wait before trying again.",
                    true
                );
            } else {
                setResetMessage(
                    otpMessage,
                    "We could not send a new code. Please try again later.",
                    true
                );
            }
        } finally {
            setLoading(resendButton, false);
        }
    });

    updateResetProgress(1);
}

/* =========================================================
   PASSWORD RESET SUCCESS PAGE
   ========================================================= */

const passwordResetSuccessPage = document.querySelector("#password-reset-success-page");
if (passwordResetSuccessPage) {
    const heading = document.querySelector("#password-reset-success-title");
    heading?.focus();
}

/* =========================================================
   CONTACT PAGE
   Frontend-only form behavior until a secure backend/service
   is connected.
   ========================================================= */

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const message = document.querySelector("#contact-message");

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        if (message) {
            message.classList.remove("error");
            message.textContent =
                "Thank you. The contact service is not connected yet.";
        }

        contactForm.reset();
    });
}

/* =========================================================
   HELPERS
   ========================================================= */

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setFieldError(id, text, input) {
    const error = document.getElementById(id);
    if (error) error.textContent = text;

    if (input) {
        input.setAttribute("aria-invalid", "true");
        input.focus();
    }
}

function clearFieldErrors(form) {
    if (!form) return;

    form.querySelectorAll(".field-error").forEach((element) => {
        element.textContent = "";
    });

    form.querySelectorAll("[aria-invalid='true']").forEach((input) => {
        input.removeAttribute("aria-invalid");
    });
}
