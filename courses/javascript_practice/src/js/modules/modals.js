const modals = () => {
    let popups = [
        {
            'btn'   : '.popup_engineer_btn',
            'popup' : '.popup_engineer',
            'close' : '.popup_close',
        },
        {
            'btn'       : '.phone_link',
            'popup'     : '.popup',
            'close'     : '.popup_close',
            'showTimer' : 60000,
        }
    ]

    popups.forEach(popupData => {
        const body = document.querySelector('body');
        const btns = document.querySelectorAll(popupData.btn);
        const popup = document.querySelector(popupData.popup);
        const close = popup.querySelector(popupData.close);

        if (popupData.showTimer) {
            setTimeout(() => showPopup(), popupData.showTimer);
        }

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                showPopup();
            });
        })

        close.addEventListener('click', () => {
            hidePopup();
        });

        popup.addEventListener('click', (e) => {
            if(e.target === popup) {
                hidePopup();
            }
        });

        function showPopup() {
            popup.style.display = 'block';
            body.classList.add('modal-open');
        }

        function hidePopup() {
            popup.style.display = 'none';
            body.classList.remove('modal-open');
        }

    });


};

export default modals;