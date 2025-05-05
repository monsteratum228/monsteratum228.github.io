document.addEventListener('DOMContentLoaded', () => {

    // --- Элементы ---
    // Общие
    const navButtons = document.querySelectorAll('.nav-button');
    const pages = document.querySelectorAll('.page');
    const peopleGrid = document.querySelector('.people-grid');
    const modalOverlay = document.getElementById('modal-overlay');
    const profileModal = document.getElementById('profile-modal');
    const modalCloseButton = document.getElementById('modal-close-button');
    const modalAvatar = profileModal.querySelector('.modal-avatar');
    const modalName = profileModal.querySelector('.modal-name');
    const modalRating = profileModal.querySelector('.modal-rating');
    const modalReviewsContainer = profileModal.querySelector('.modal-reviews');
    const headerAvatar = document.getElementById('header-avatar'); // Аватар в хедере

    // Элементы страницы Профиль
    const userAvatarElement = document.getElementById('profile-user-avatar');
    const userNameElement = document.getElementById('profile-user-name');
    const userLevelElement = document.getElementById('profile-user-level');
    const levelTextContainer = document.getElementById('profile-level-text-container');
    const profileXpBarElement = document.getElementById('profile-xp-bar');
    const xpTextElement = document.getElementById('xp-status-text');
    const addXpButton = document.getElementById('add-xp-button');
    const xpValueSpan = document.getElementById('xp-value-to-add'); // Span с числом XP для кнопки
    const profileActionButtons = document.querySelectorAll('#page-profile .action-button');
    const profileContentSections = document.querySelectorAll('#page-profile .profile-content-section');

    // --- Инициализация Telegram Web App ---
    let tgUser = {}; // Объект для данных пользователя TG
    let userId = 'guest'; // ID пользователя
    try {
        if (window.Telegram && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.expand(); // Расширяем окно приложения
            tg.ready(); // Сообщаем TG, что приложение готово

            // Получаем данные пользователя
            tgUser = tg.initDataUnsafe?.user || {};
            userId = tgUser.id || 'guest_' + Math.random().toString(36).substring(7); // Генерируем гостевой ID

            console.log("Telegram User Data:", tgUser); // Для отладки

            // Устанавливаем имя пользователя
            let displayName = "Гость";
            if (tgUser.first_name) {
                displayName = tgUser.first_name;
                if (tgUser.last_name) {
                    displayName += ` ${tgUser.last_name}`;
                }
            } else if (tgUser.username) {
                displayName = tgUser.username;
            }
            userNameElement.textContent = displayName;

            // Пытаемся установить аватар (может не сработать без бэкенда/прокси)
            // Сначала проверим photo_url
            if (tgUser.photo_url) {
                 setAvatar(tgUser.photo_url);
            } else {
                // Если фото нет, генерируем плейсхолдер с инициалами
                 const initials = (tgUser.first_name ? tgUser.first_name[0] : '') + (tgUser.last_name ? tgUser.last_name[0] : '');
                 const placeholderUrl = `https://via.placeholder.com/90/${getRandomColor()}/FFFFFF?text=${initials || '?'}`;
                 setAvatar(placeholderUrl);
            }

        } else {
            console.warn("Telegram Web App script не найден или не инициализирован.");
             userNameElement.textContent = "Гость Профиля"; // Запасное имя
             setAvatar(`https://via.placeholder.com/90/${getRandomColor()}/FFFFFF?text=?`); // Запасной аватар
        }
    } catch (error) {
        console.error("Ошибка при инициализации Telegram Web App:", error);
        userNameElement.textContent = "Ошибка Загрузки";
        setAvatar(`https://via.placeholder.com/90/FF0000/FFFFFF?text=E`); // Аватар ошибки
    }

    // Функция для установки аватара в профиле и хедере
    function setAvatar(url) {
        if (userAvatarElement) userAvatarElement.src = url;
        if (headerAvatar) headerAvatar.src = url.replace('/90/', '/40/'); // Уменьшаем размер для хедера
    }


    // --- XP Система ---
    const MAX_LEVEL = 10;
    const BASE_XP_PER_LEVEL = 50; // Было 50, сделаем 100 для первого
    const XP_INCREASE_PER_LEVEL = 50;
    let currentUserLevel = 1; // TODO: Загружать из localStorage или бэка
    let currentUserXP = 0;    // TODO: Загружать из localStorage или бэка

    /** Рассчитывает XP для следующего уровня */
    function calculateXPNeeded(level) {
        if (level >= MAX_LEVEL) return Infinity;
        //return BASE_XP_PER_LEVEL + (level * XP_INCREASE_PER_LEVEL); // Линейная прогрессия
        // Сделаем чуть сложнее: 100, 150, 225, 300... (немного растет шаг)
        return BASE_XP_PER_LEVEL + Math.floor((level - 1) * XP_INCREASE_PER_LEVEL * (1 + (level-1)*0.1));
    }

     /** Обновляет отображение XP и уровня */
    function updateXPDisplay() {
        if (!userLevelElement || !profileXpBarElement || !xpTextElement || !userAvatarElement || !levelTextContainer) {
             console.error("Не найдены все необходимые элементы для XP системы!");
             return;
        }

        const xpNeeded = calculateXPNeeded(currentUserLevel);
        const xpProgress = currentUserXP; // Показываем текущий XP
        const progressPercent = (xpNeeded === Infinity || xpNeeded === 0) ? 100 : Math.min((xpProgress / xpNeeded) * 100, 100) ; // Не > 100%

        userLevelElement.textContent = currentUserLevel;
        profileXpBarElement.style.width = `${progressPercent}%`;

        if (xpNeeded === Infinity) {
            xpTextElement.textContent = `МАКС. УРОВЕНЬ`;
            profileXpBarElement.style.width = `100%`;
        } else {
            xpTextElement.textContent = `${xpProgress} / ${xpNeeded} XP`;
        }

        updateAvatarAndLevelTextGlow(); // Обновляем свечение
        // TODO: Сохранять currentUserLevel и currentUserXP в localStorage
    }

    /** Определяет классы свечения/градиента */
    function getGlowClassesForLevel(level) {
        let avatarGlowClass = '';
        let levelTextClass = '';
        let isTextGradient = false;

        if (level === 1) { avatarGlowClass = 'avatar-glow-yellow'; }
        else if (level === 2) { avatarGlowClass = 'avatar-glow-green'; }
        else if (level === 3) { avatarGlowClass = 'avatar-glow-orange'; }
        else if (level === 4) { avatarGlowClass = 'avatar-glow-red'; }
        else if (level === 5) { avatarGlowClass = 'avatar-glow-pink'; } // Снова зеленый
        // Градиенты
        else if (level === 6) { avatarGlowClass = 'avatar-glow-yellow-red'; levelTextClass = 'level-text-yellow-red'; isTextGradient = true; }
        else if (level === 7) { avatarGlowClass = 'avatar-glow-orange-yellow'; levelTextClass = 'level-text-orange-yellow'; isTextGradient = true; }
        else if (level === 8) { avatarGlowClass = 'avatar-glow-pink-yellow'; levelTextClass = 'level-text-pink-yellow'; isTextGradient = true; }
        else if (level === 9 ) { avatarGlowClass = 'avatar-glow-pink-purple'; levelTextClass = 'level-text-pink-purple'; isTextGradient = true; }
        else if (level >= MAX_LEVEL) { avatarGlowClass = 'avatar-glow-gold'; levelTextClass = 'level-text-gold'; isTextGradient = true; }

        return { avatarGlowClass, levelTextClass, isTextGradient };
    }

    /** Обновляет свечение аватара и текст уровня */
    function updateAvatarAndLevelTextGlow() {
         if (!userAvatarElement || !levelTextContainer) return;

        const { avatarGlowClass, levelTextClass, isTextGradient } = getGlowClassesForLevel(currentUserLevel);

        // Очистка старых классов аватара
        const avatarClassesToRemove = Array.from(userAvatarElement.classList).filter(cls => cls.startsWith('avatar-glow-'));
        userAvatarElement.classList.remove(...avatarClassesToRemove);
        // Очистка старых классов текста
        const textClassesToRemove = Array.from(levelTextContainer.classList).filter(cls => cls.startsWith('level-text-'));
        levelTextContainer.classList.remove(...textClassesToRemove);
        levelTextContainer.classList.remove('level-text-gradient');

        // Применение новых классов
        if (avatarGlowClass) {
            userAvatarElement.classList.add(avatarGlowClass);
        }
        if (levelTextClass && isTextGradient) {
            levelTextContainer.classList.add('level-text-gradient', levelTextClass);
        }
    }

    // Обработчик кнопки добавления XP
    if (addXpButton) {
        addXpButton.addEventListener('click', () => {
            const xpToAdd = parseInt(xpValueSpan?.textContent || '25'); // Берем значение из span
            if (isNaN(xpToAdd) || xpToAdd <= 0) return;

            if (currentUserLevel >= MAX_LEVEL) {
                 console.log("Максимальный уровень достигнут!");
                 // Можно добавить визуальный фидбек, типа тряски кнопки
                 addXpButton.style.animation = 'shake 0.5s';
                 setTimeout(() => { addXpButton.style.animation = ''; }, 500);
                 return;
            }

            currentUserXP += xpToAdd;
            console.log(`Added ${xpToAdd} XP. Current XP: ${currentUserXP}`);

            let xpNeeded = calculateXPNeeded(currentUserLevel);
            let leveledUp = false;

            // Проверка на повышение уровня
            while (currentUserXP >= xpNeeded && currentUserLevel < MAX_LEVEL) {
                 leveledUp = true;
                currentUserXP -= xpNeeded; // Вычитаем XP, необходимые для текущего уровня
                currentUserLevel++;       // Повышаем уровень
                console.log(`Level Up! New level: ${currentUserLevel}. Remaining XP: ${currentUserXP}`);
                xpNeeded = calculateXPNeeded(currentUserLevel); // Пересчитываем для следующего уровня
                 if (xpNeeded === Infinity) { // Если достигли макс. уровня в цикле
                     currentUserXP = 0; // Обнуляем XP на макс. уровне (или оставляем)
                     break;
                 }
            }

            if(leveledUp) {
                 // Добавить эффект при повышении уровня (например, вспышка на аватаре)
                userAvatarElement.style.transition = 'none'; // Отключаем плавность для вспышки
                userAvatarElement.style.transform = 'scale(1.1)';
                userAvatarElement.style.filter = 'brightness(1.5)';
                setTimeout(() => {
                    userAvatarElement.style.transition = 'box-shadow 0.3s ease, transform 0.2s ease, filter 0.2s ease'; // Включаем обратно
                    userAvatarElement.style.transform = 'scale(1)';
                    userAvatarElement.style.filter = 'brightness(1)';
                }, 200);
            }

            updateXPDisplay(); // Обновляем интерфейс
        });
    }

    // --- Кнопки действий в профиле ---
    profileActionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            const targetContentIdMap = {
                'show-reviews-history': 'content-reviews-history',
                'show-reviews-my': 'content-reviews-my',
                'show-achievements': 'content-achievements',
                'show-referral': 'content-referral',
                'show-partnership': 'content-partnership',
            };
            const targetId = targetContentIdMap[action];

            // Скрываем все секции контента
            profileContentSections.forEach(section => section.classList.remove('visible'));

            if (targetId) {
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    // Показываем нужную секцию
                    targetSection.classList.add('visible');
                    console.log(`Action: ${action}, showing section: ${targetId}`);
                     // Можно добавить прокрутку к началу секции
                    // targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    console.log(`Action: ${action}, no target section found.`);
                }
            } else {
                 console.log(`Action: ${action} - No content section defined.`);
                 // Здесь можно добавить обработку для действий без контентных секций
            }
        });
    });


    // --- Навигация по нижним кнопкам (без изменений) ---
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetPageId = button.getAttribute('data-target');
            pages.forEach(page => page.classList.remove('active'));
            const targetPage = document.getElementById(targetPageId);
            if (targetPage) targetPage.classList.add('active');
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            // Скрываем все открытые секции контента в профиле при переходе на другую страницу
            if (targetPageId !== 'page-profile') {
                profileContentSections.forEach(section => section.classList.remove('visible'));
            }
        });
    });

    // --- Открытие/закрытие модального окна (без изменений) ---
    if (peopleGrid) {
        peopleGrid.addEventListener('click', (event) => {
            const card = event.target.closest('.profile-card');
            if (card) {
                // ... (логика заполнения и открытия модалки как раньше) ...
                const userId = card.getAttribute('data-user-id');
                const cardName = card.querySelector('.card-name').textContent;
                const cardRating = card.querySelector('.card-rating').innerHTML;
                const cardPhoto = card.querySelector('.card-photo').style.backgroundImage;
                const cardAvatarSrc = card.querySelector('.card-avatar-placeholder i')
                                        ? `https://via.placeholder.com/60/${getRandomColor()}/FFFFFF?text=${cardName.charAt(0)}`
                                        : card.querySelector('.card-avatar-placeholder img')?.src;

                modalAvatar.src = cardAvatarSrc || `https://via.placeholder.com/60/${getRandomColor()}/FFFFFF?text=${cardName.charAt(0)}`;
                modalName.textContent = cardName;
                modalRating.innerHTML = cardRating;
                modalReviewsContainer.innerHTML = generateFakeReviews(cardName); // Используем старую функцию

                modalOverlay.style.display = 'block';
                profileModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    }
    function closeModal() {
        modalOverlay.style.display = 'none';
        profileModal.style.display = 'none';
        document.body.style.overflow = '';
    }
    if (modalCloseButton) modalCloseButton.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);


    // --- Вспомогательные функции (без изменений) ---
    function getRandomColor() {
        return Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    }
    function generateFakeReviews(userName) {
         const fakeReviewers = ["Иван П.", "Мария К.", "Алексей С.", "Елена В.", "Дмитрий Р."];
        const fakeComments = [
            `Отличная встреча с ${userName}! Все прошло супер.`,
            `Приятно было пообщаться с ${userName}. Рекомендую!`,
            `${userName} немного опоздал(а), но в целом все хорошо.`,
            `Вежливый и интересный собеседник ${userName}.`,
            `Все отлично, ${userName} молодец!`
        ];
        const numReviews = Math.floor(Math.random() * 4) + 2;
        let reviewsHtml = '';
        for (let i = 0; i < numReviews; i++) {
            const reviewer = fakeReviewers[Math.floor(Math.random() * fakeReviewers.length)];
            const comment = fakeComments[Math.floor(Math.random() * fakeComments.length)];
            const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
            const date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
            const formattedDate = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric'});
            reviewsHtml += `
                <div class="review-item">
                    <p><strong>От ${reviewer}:</strong> "${comment}"</p>
                    <span><i class="fas fa-star"></i> ${rating}</span> - <small>${formattedDate}</small>
                </div>
            `;
        }
        return reviewsHtml || '<p>Отзывов пока нет.</p>';
    }

     // Добавляем простой CSS для анимации тряски кнопки
     const styleSheet = document.createElement("style");
     styleSheet.type = "text/css";
     styleSheet.innerText = `
        @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-3px); }
            50% { transform: translateX(3px); }
            75% { transform: translateX(-3px); }
            100% { transform: translateX(0); }
        }
     `;
     document.head.appendChild(styleSheet);


    // --- Инициализация при загрузке ---
    updateXPDisplay(); // Первичный вызов для отображения XP и свечения
    // Убедимся, что страница профиля активна (уже делается в HTML, но для надежности)
    if (!document.querySelector('.page.active')) {
        document.getElementById('page-profile')?.classList.add('active');
    }
    if (!document.querySelector('.nav-button.active')) {
       document.querySelector('.nav-button[data-target="page-profile"]')?.classList.add('active');
    }
    // Скрываем все секции контента при загрузке
    profileContentSections.forEach(section => section.classList.remove('visible'));
});