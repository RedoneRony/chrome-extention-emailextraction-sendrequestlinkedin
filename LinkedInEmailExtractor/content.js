(() => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const profileText = document.body.innerText;
    const foundEmail = profileText.match(emailRegex);
    return foundEmail ? foundEmail[0] : null;
})();
