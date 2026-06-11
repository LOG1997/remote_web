const selectVideoCard = async () => {
    const videoCards = document.querySelectorAll('.mnav');
    videoCards[0].classList.add('tv_web_active_video_card');
    console.log(videoCards);
};

export const handleRight = async () => {
    selectVideoCard()
}

export const switchActiveCard = async (direction: 'right' | 'left' | 'up' | 'down') => {
    const videoCards = Array.from(document.querySelectorAll('.mnav'));
    let nextIndex = 0
    const currentActiveCard = videoCards.find(card => card.classList.contains('tv_web_active_video_card'));
    if (currentActiveCard) {
        const currentIndex = videoCards.indexOf(currentActiveCard);
        nextIndex = currentIndex || 0;
        if (direction === 'right') {
            nextIndex = currentIndex + 1;
        } else if (direction === 'left') {
            nextIndex = currentIndex - 1;
        }
    }
    videoCards.forEach((card, index) => {
        if (index !== nextIndex) {
            card.classList.remove('tv_web_active_video_card');
        }
    });
    videoCards[nextIndex].classList.add('tv_web_active_video_card');

}