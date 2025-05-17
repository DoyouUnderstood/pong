export function setupAvatarSelector(container) {
    const avatarList = [
        'avataaars (1).png',
        'avataaars (2).png',
        'avataaars (3).png',
        'avataaars (4).png',
        'avataaars (5).png',
        'avataaars (6).png',
        'avataaars.png'
    ];
    let currentAvatarIndex = 0;
    let customAvatar = false;
    const avatarPreview = container.querySelector('#avatar-preview');
    const hiddenInput = container.querySelector('#selected-avatar');
    const fileInput = container.querySelector('#avatar-upload');
    const updateAvatar = () => {
        if (!customAvatar) {
            const avatar = avatarList[currentAvatarIndex];
            avatarPreview.src = `/images/avatar/${avatar}`;
            hiddenInput.value = avatar;
        }
    };
    // Navigation
    const prevButton = container.querySelector('#prev-avatar');
    const nextButton = container.querySelector('#next-avatar');
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            customAvatar = false;
            currentAvatarIndex = (currentAvatarIndex - 1 + avatarList.length) % avatarList.length;
            updateAvatar();
        });
        nextButton.addEventListener('click', () => {
            customAvatar = false;
            currentAvatarIndex = (currentAvatarIndex + 1) % avatarList.length;
            updateAvatar();
        });
    }
    // Upload
    fileInput?.addEventListener('change', () => {
        const file = fileInput.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = () => {
            customAvatar = true;
            avatarPreview.src = reader.result;
            hiddenInput.value = reader.result;
        };
        reader.readAsDataURL(file);
    });
    updateAvatar(); // Initial display
}
