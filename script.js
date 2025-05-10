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
    const profileActionButtons = document.querySelectorAll('.profile-actions .action-button[data-action]');
    const profileContentSections = document.querySelectorAll('.page'); // Ищем все секции с классом page

    const menuPage = document.getElementById('page-menu'); // Контейнер страницы Меню
     // Элементы нового универсального модального окна
     const genericModalOverlay = document.getElementById('generic-modal-overlay');
     const genericModal = document.getElementById('generic-modal');
     const genericModalCloseButton = document.getElementById('generic-modal-close-button');
     const genericModalTitle = document.getElementById('generic-modal-title');
     const genericModalContent = document.getElementById('generic-modal-content');
     const headerIconsContainer = document.querySelector('.header-icons'); // Контейнер иконок хедера
     // Элементы страницы "Отзывы на меня"
     const myReviewsCountSpan = document.getElementById('my-reviews-count');
     const myReviewsAvgRatingSpan = document.getElementById('my-reviews-avg-rating');
     const myRatingIndicator = document.getElementById('my-rating-indicator');
     const myReviewsListContainer = document.getElementById('my-reviews-list');
     // Элементы страницы "История отзывов"
     const historyReviewsCountSpan = document.getElementById('history-reviews-count');
     const historyStarSummaryContainer = document.getElementById('history-star-summary');
     const reviewsHistoryListContainer = document.getElementById('reviews-history-list');
    // modal comments
     const reviewFormContainer = document.getElementById('modal-review-form-container');
    const reviewFormStarsContainer = document.getElementById('review-form-stars');
    const reviewFormTagsContainer = document.getElementById('review-form-tags');
    const reviewFormTextInput = document.getElementById('review-form-text');
    const reviewFormSubmitButton = document.getElementById('review-form-submit');
     
 
 
 
    // --- Инициализация Telegram Web App ---
    let tgUser = {}; // Объект для данных пользователя TG
    let userId = 'guest'; // ID пользователя
    let currentReviewTargetUserId = null;
    let selectedStarRating = 0;
    let selectedReviewTags = []; // Массив ID выбранных тегов
    window.mockMyReviews = [
        { id: 1, reviewer: "Иван П.", reviewerId: "user123", avatar: `https://via.placeholder.com/30/4682B4/FFFFFF?text=И`, rating: 5.0, text: "Все супер, рекомендую!", date: "2025-05-03", likes: 25, isLiked: false },
        { id: 2, reviewer: "Елена В.", reviewerId: "user124", avatar: `https://via.placeholder.com/30/8A2BE2/FFFFFF?text=Е`, rating: 4.0, text: "Немного опоздала, но в целом все хорошо.", date: "2025-04-30", likes: 10, isLiked: true }, // Пример лайкнутого
        { id: 3, reviewer: "Сергей М.", reviewerId: "user125", avatar: `https://via.placeholder.com/30/008080/FFFFFF?text=С`, rating: 5.0, text: "Отлично пообщались!", date: "2025-04-25", likes: 30, isLiked: false },
        // ... и так далее для остальных
        { id: 4, reviewer: "Ольга К.", reviewerId: "user126", avatar: `https://via.placeholder.com/30/FF6347/FFFFFF?text=О`, rating: 4.5, text: "Приятная девушка, все понравилось.", date: "2025-04-22", likes: 18, isLiked: false },
        { id: 5, reviewer: "Петр Л.", reviewerId: "user127", avatar: `https://via.placeholder.com/30/7B3F00/FFFFFF?text=П`, rating: 3.5, text: "Не очень понял юмора, но в целом ок.", date: "2025-04-20", likes: 5, isLiked: false },
        { id: 6, reviewer: "Мария Д.", reviewerId: "user128", avatar: `https://via.placeholder.com/30/FF69B4/FFFFFF?text=М`, rating: 5.0, text: "Лучшая встреча!", date: "2025-04-15", likes: 42, isLiked: true },
    ];
    // Отзывы, ОСТАВЛЕННЫЕ МНОЙ (для page-reviews-history)
    window.mockReviewsHistory = [
         { id: 10, targetUser: "Петр Л.", targetUserId: "user127", avatar: `https://via.placeholder.com/30/7B3F00/FFFFFF?text=П`, rating: 5.0, text: "Отличная встреча, все прошло хорошо!", date: "2025-05-01", likes: 12, isLiked: false },
         { id: 11, targetUser: "Мария К.", targetUserId: "user128", avatar: `https://via.placeholder.com/30/FF69B4/FFFFFF?text=М`, rating: 4.5, text: "Приятный собеседник.", date: "2025-04-28", likes: 8, isLiked: true }, // Пример лайкнутого
         // ... и так далее для остальных
         { id: 12, targetUser: "Дмитрий С.", targetUserId: "user129", avatar: `https://via.placeholder.com/30/556B2F/FFFFFF?text=Д`, rating: 4.0, text: "Нормально посидели.", date: "2025-04-26", likes: 3, isLiked: false },
         { id: 13, targetUser: "Анна В.", targetUserId: "user130", avatar: `https://via.placeholder.com/30/DC143C/FFFFFF?text=А`, rating: 5.0, text: "Очень интересно было!", date: "2025-04-18", likes: 22, isLiked: false },
         { id: 14, targetUser: "Екатерина Ж.", targetUserId: "user131", avatar: `https://via.placeholder.com/30/FFD700/FFFFFF?text=Е`, rating: 5.0, text: "Рекомендую!", date: "2025-04-10", likes: 15, isLiked: false },
         { id: 15, targetUser: "Михаил П.", targetUserId: "user132", avatar: `https://via.placeholder.com/30/191970/FFFFFF?text=М`, rating: 3.0, text: "Скучновато.", date: "2025-04-05", likes: 1, isLiked: false },
    ];
    const positiveReviewTags = [
        { id: 'tag-photo-ok', text: "Фото соответствуют", iconClass: "fas fa-camera-retro" },
        { id: 'tag-success-meet', text: "Успешная встреча", iconClass: "fas fa-handshake" },
        { id: 'tag-great-person', text: "Отличный человек", iconClass: "fas fa-user-check" },
        { id: 'tag-date-good', text: "Свидание прошло хорошо", iconClass: "fas fa-glass-cheers" },
        { id: 'tag-nice-talk', text: "Прекрасная беседа", iconClass: "fas fa-comments" },
        { id: 'tag-punctual', text: "Пунктуальный", iconClass: "fas fa-clock" },
        { id: 'tag-polite', text: "Вежливый", iconClass: "fas fa-smile-beam" },
        { id: 'tag-interesting', text: "Интересный собеседник", iconClass: "fas fa-brain" },
        { id: 'tag-clean-look', text: "Опрятный вид", iconClass: "fas fa-user-tie" } // Дополнительный
    ];
    
    const negativeReviewTags = [
        { id: 'tag-bad-talk', text: "Ужасное общение", iconClass: "fas fa-comment-slash" },
        { id: 'tag-bad-time', text: "Плохо прошло время", iconClass: "fas fa-calendar-times" },
        { id: 'tag-date-unpleasant', text: "Свидание неприятное", iconClass: "fas fa-sad-tear" },
        { id: 'tag-messy-look', text: "Вид неопрятный", iconClass: "fas fa-user-alt-slash" }, // Используем другую иконку
        { id: 'tag-photo-mismatch', text: "Фото не совпали", iconClass: "fas fa-image" }, // Добавляем иконку к "fas fa-not-equal" или "fas fa-user-secret"
        { id: 'tag-late', text: "Опоздал(а)", iconClass: "fas fa-history" },
        { id: 'tag-rude', text: "Грубый", iconClass: "fas fa-angry" },
        { id: 'tag-boring', text: "Скучный собеседник", iconClass: "fas fa-bed" }
    ];
    const mockUserAchievements = [
        {
            id: 'level_3',
            title: 'Новичок Плюс',
            description: 'Достигнуть 3-го уровня профиля.',
            iconClass: 'fas fa-angle-double-up',
            targetValue: 3,
            currentValue: 1, // Будет обновлено из currentUserLevel
            isCompleted: false
        },
        {
            id: 'rating_4_7',
            title: 'Мастер Оценки',
            description: 'Получить средний рейтинг 4.7+',
            iconClass: 'fas fa-star-half-alt',
            targetValue: 4.7, // Цель по рейтингу
            currentValue: 0,  // Будет обновлено из mockMyReviews
            reviewsNeeded: 3, // Минимальное кол-во отзывов для этого достижения
            isCompleted: false
        },
        {
            id: 'reviews_left_5',
            title: 'Общительный',
            description: 'Оставить более 5 отзывов другим пользователям.',
            iconClass: 'fas fa-comments',
            targetValue: 5,
            currentValue: 0, // Будет обновлено из mockReviewsHistory.length
            isCompleted: false
        },
        {
            id: 'reviews_received_3',
            title: 'Душа Компании',
            description: 'Получить более 3 отзывов от пользователей.',
            iconClass: 'fas fa-users',
            targetValue: 3,
            currentValue: 0, // Будет обновлено из mockMyReviews.length
            isCompleted: false
        },
        {
            id: 'profile_reliability_90',
            title: 'Образец Надежности',
            description: 'Достигнуть надежности профиля 90%+',
            iconClass: 'fas fa-shield-alt',
            targetValue: 90, // Проценты
            currentValue: 80, // Пример, может браться из элемента #reliability-bar
            isCompleted: false
        },
        {
            id: 'first_search',
            title: 'Искатель Приключений',
            description: 'Воспользоваться поиском хотя бы 1 раз.',
            iconClass: 'fas fa-search-location',
            targetValue: 1, // 0 - не выполнено, 1 - выполнено
            currentValue: 0, // Пример, можно хранить в localStorage
            isCompleted: false
        }
    ];
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('copy-btn')) {
            const input = e.target.closest('.referral-input-container').querySelector('.referral-link');
            input.select();
            
            try {
                navigator.clipboard.writeText(input.value).then(() => {
                    const status = e.target.closest('.referral-input-container').nextElementSibling;
                    if (status && status.classList.contains('copy-status')) {
                        status.style.display = 'block';
                        setTimeout(() => {
                            status.style.display = 'none';
                        }, 2000);
                    }
                });
            } catch (err) {
                // Fallback для старых браузеров
                document.execCommand('copy');
                const status = e.target.closest('.referral-input-container').nextElementSibling;
                if (status && status.classList.contains('copy-status')) {
                    status.style.display = 'block';
                    setTimeout(() => {
                        status.style.display = 'none';
                    }, 2000);
                }
            }
        }
    });
    
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

    function handleReviewListClick(event) {
        const target = event.target;
        
        // --- Обработка клика на кнопке опций (открытие/закрытие меню) ---
        const optionsButton = target.closest('.review-options-button');
        if (optionsButton) {
            // Закрыть другие открытые меню
            document.querySelectorAll('.review-options-menu.active').forEach(menu => {
                if (menu !== optionsButton.querySelector('.review-options-menu')) {
                    menu.classList.remove('active');
                }
            });
            // Переключить текущее меню
            const menu = optionsButton.querySelector('.review-options-menu');
            if (menu) menu.classList.toggle('active');
            event.stopPropagation(); // Предотвращаем всплытие, чтобы не сработал document.click
            return;
        }
    
        // --- Обработка пунктов меню ---
        const menuItem = target.closest('.review-options-menu li');
        if (menuItem) {
            console.log('Options menu item detected.');
            const action = menuItem.dataset.action;
            const reviewId = menuItem.dataset.reviewId;
            const userIdForProfile = menuItem.dataset.userId;
            const reviewItemElement = menuItem.closest('.review-item');
    
            switch (action) {
                case 'report':
                    alert(`Жалоба на отзыв ID: ${reviewId}`);
                    break;
                case 'profile':
                    alert(`Открыть профиль пользователя ID: ${userIdForProfile}`);
                    break;
                case 'hide':
                    if (reviewItemElement) reviewItemElement.style.display = 'none';
                    break;
            }
            
            // Закрыть меню
            const parentMenu = menuItem.closest('.review-options-menu');
            if (parentMenu) parentMenu.classList.remove('active');
            return;
        }
    

        // --- Обработка кнопки лайка ---
       // Внутри функции handleReviewListClick:

        // --- Обработка кнопки лайка ---
        let likeButton = target.closest('.like-button');
        if (!likeButton && (target.tagName === 'I' || target.tagName === 'SPAN') && target.parentElement.classList.contains('like-button')) {
            likeButton = target.parentElement;
           
        } else if (!likeButton && target.tagName === 'BUTTON' && target.classList.contains('like-button')) {
            likeButton = target; // Кликнули на саму кнопку
            
        }

        if (likeButton) {
           
            const reviewId = parseInt(likeButton.dataset.reviewId); 
            const dataSourceType = likeButton.dataset.source; 
        
            // Проверяем значение dataSourceType
            
        
            let sourceArray;
            switch (dataSourceType) {
                case 'myReviews':
                    sourceArray = window.mockMyReviews;
                    break;
                case 'reviewsHistory':
                    sourceArray = window.mockReviewsHistory;
                    break;
                default:
                
                    return;
            }
        
            // Проверяем, что массив не пустой

        
            // Ищем отзыв
            const review = sourceArray.find(r => r.id === reviewId);
            if (review) {
                review.isLiked = !review.isLiked;
                review.likes += review.isLiked ? 1 : -1;

                // Обновляем DOM
                const heartIcon = likeButton.querySelector('i'); // Это элемент <i>
                const likesCountSpan = likeButton.querySelector('.likes-count');

                likesCountSpan.textContent = review.likes;

                // Сначала удаляем все классы, связанные с состоянием лайка и анимацией
                likeButton.classList.remove('liked', 'animate-heart'); // Убираем animate-heart с кнопки, если был
                heartIcon.classList.remove('fas', 'far', 'animate-heart'); // Убираем все с иконки

                if (review.isLiked) {
                    likeButton.classList.add('liked'); // Класс для стилизации кнопки (например, цвет текста)
                    heartIcon.classList.add('fas');   // Заполненное сердце
                    heartIcon.classList.add('fa-heart'); // Основной класс иконки
                    
                    // Применяем анимацию к иконке
                    heartIcon.classList.add('animate-heart');
                    // Убираем класс анимации после ее завершения, чтобы она могла сработать снова
                    setTimeout(() => {
                        heartIcon.classList.remove('animate-heart');
                    }, 600); // Должно совпадать с длительностью анимации
                } else {
                    // likeButton.classList.remove('liked'); // Уже удалили выше
                    heartIcon.classList.add('far');   // Пустое сердце
                    heartIcon.classList.add('fa-heart'); // Основной класс иконки
                }
                 console.log(`Liked review ID: ${reviewId}, Liked: ${review.isLiked}, Likes: ${review.likes}`);
            }
            return;
        }

        // Если клик был не по кнопке опций и не по меню, закрываем все открытые меню
        document.querySelectorAll('.review-options-menu.active').forEach(menu => {
            menu.classList.remove('active');
        });
    }

    if (myReviewsListContainer) {
        console.log("Attaching listener to myReviewsListContainer");
        myReviewsListContainer.addEventListener('click', handleReviewListClick);
    } else {
        console.error("myReviewsListContainer NOT FOUND when trying to attach listener!");
    }

    if (reviewsHistoryListContainer) {
        console.log("Attaching listener to reviewsHistoryListContainer");
        reviewsHistoryListContainer.addEventListener('click', handleReviewListClick);
    } else {
        console.error("reviewsHistoryListContainer NOT FOUND when trying to attach listener!");
    }

    if (modalReviewsContainer) { // modalReviewsContainer - это контейнер для отзывов в МОДАЛКЕ ПРОФИЛЯ ДРУГОГО ЮЗЕРА
        console.log("Attaching listener to modalReviewsContainer");
        modalReviewsContainer.addEventListener('click', handleReviewListClick);
    } else {
        console.error("modalReviewsContainer (for profile modal) NOT FOUND when trying to attach listener!");
    }
    // Дополнительно: закрывать меню опций при клике в любом месте документа, кроме самого меню
    document.addEventListener('click', (event) => {
        const isClickInsideOptionsMenu = event.target.closest('.review-options-menu');
        const isClickOnOptionsButton = event.target.closest('.review-options-button');

        if (!isClickInsideOptionsMenu && !isClickOnOptionsButton) {
            document.querySelectorAll('.review-options-menu.active').forEach(menu => {
                menu.classList.remove('active');
            });
        }
    });
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
    document.querySelectorAll('.profile-actions .action-button[data-target]').forEach(button => {
        button.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          const targetId = this.getAttribute('data-target');
          
          // 1. Скрываем все страницы
          document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
          });
          
          // 2. Показываем нужную страницу
          const targetPage = document.getElementById(targetId);
          if (targetPage) {
            targetPage.classList.add('active');
            const backButton = targetPage.querySelector('.back-button');
            if (backButton) {
                backButton.onclick = (e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    
                    // Скрываем текущую страницу
                    targetPage.classList.remove('active');
                    
                    // Показываем страницу профиля
                    document.getElementById('page-profile').classList.add('active');
                };
            }
            
            // 3. Загружаем данные если нужно
            if (targetId === 'page-my-reviews') {
              populateMyReviewsPage();
            } else if (targetId === 'page-reviews-history') {
              populateReviewsHistoryPage();
            }
          }
        });
      });

      function populateMyReviewsPage() {
        if (!myReviewsListContainer || !myReviewsCountSpan || !myReviewsAvgRatingSpan || !myRatingIndicator) return;

        myReviewsListContainer.innerHTML = ''; // Очищаем предыдущие отзывы

        if (mockMyReviews.length === 0) {
             myReviewsCountSpan.textContent = 'Всего отзывов: 0';
             myReviewsAvgRatingSpan.textContent = 'Средний рейтинг: -';
             myRatingIndicator.style.left = '50%'; // По центру, если нет рейтинга
             myReviewsListContainer.innerHTML = '<p class="loading-placeholder">Пока нет ни одного отзыва.</p>';
            return;
        }

        let totalRating = 0;
        mockMyReviews.forEach(review => {
            totalRating += review.rating;
            myReviewsListContainer.innerHTML += createReviewItemHTML(review, false); // false - не история
        });

        const averageRating = totalRating / mockMyReviews.length;
        myReviewsCountSpan.textContent = `Всего отзывов: ${mockMyReviews.length}`;
        myReviewsAvgRatingSpan.textContent = `Средний рейтинг: ${averageRating.toFixed(1)}`;

        // Обновляем положение индикатора на шкале (от 0% до 100%)
        const indicatorPosition = (averageRating / 5) * 100;
        myRatingIndicator.style.left = `${Math.max(0, Math.min(100, indicatorPosition))}%`;
    }

    /** Заполняет страницу "История отзывов" */
    function populateReviewsHistoryPage() {
         if (!reviewsHistoryListContainer || !historyReviewsCountSpan || !historyStarSummaryContainer) return;

         reviewsHistoryListContainer.innerHTML = ''; // Очищаем

         if (mockReviewsHistory.length === 0) {
             historyReviewsCountSpan.textContent = 'Всего оставлено: 0';
             historyStarSummaryContainer.innerHTML = '<p class="loading-placeholder">Вы еще не оставляли отзывы.</p>';
             reviewsHistoryListContainer.innerHTML = '<p class="loading-placeholder">Нет оставленных отзывов.</p>';
             return;
         }

         const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
         mockReviewsHistory.forEach(review => {
             const roundedRating = Math.round(review.rating); // Округляем для статистики
             if (roundedRating >= 1 && roundedRating <= 5) {
                 starCounts[roundedRating]++;
             }
             reviewsHistoryListContainer.innerHTML += createReviewItemHTML(review, true); // true - это история
         });

         historyReviewsCountSpan.textContent = `Всего оставлено: ${mockReviewsHistory.length}`;

         // Генерируем HTML для статистики по звездам
         let summaryHTML = '';
         for (let i = 5; i >= 1; i--) {
             if (starCounts[i] > 0) { // Показываем только те, что есть
                  summaryHTML += `
                     <div class="star-rating-line">
                    <span class="star-icons">${'<i class="fas fa-star"></i>'.repeat(i)}</span>
                    <span class="star-label">${i} ${i === 1 ? 'звезда' : (i > 1 && i < 5 ? 'звезды' : 'звезд')}:</span>
                    <span class="star-count">${starCounts[i]}</span>
                    </div>
                 `;
             }
         }
         historyStarSummaryContainer.innerHTML = summaryHTML || '<p class="loading-placeholder">Нет данных для статистики.</p>';
    }

    function createReviewItemHTML(review, isHistory) {
        const title = isHistory ? `Отзыв на ${review.targetUser}:` : `От ${review.reviewer}:`;
        const avatar = review.avatar || `https://via.placeholder.com/30/${getRandomColor()}/FFFFFF?text=?`;
        const rating = review.rating.toFixed(1);
        const date = new Date(review.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric'});
        const relevantUserId = isHistory ? review.targetUserId : review.reviewerId;
    
        // Генерируем HTML для иконок выбранных тегов
        let tagIconsHTML = '';
        if (review.selectedTags && review.selectedTags.length > 0) {
            tagIconsHTML = '<div class="review-tag-icons-display">';
            review.selectedTags.forEach(tag => {
                tagIconsHTML += `<i class="${tag.iconClass}" title="${tag.text}"></i>`;
            });
            tagIconsHTML += '</div>';
        }
    
        return `
            <div class="review-item" data-review-id="${review.id}">
                <div class="review-options-button">
                    <i class="fas fa-ellipsis-v"></i>
                    <div class="review-options-menu">
                        <ul>
                            <li data-action="report" data-review-id="${review.id}"><i class="fas fa-flag"></i> Пожаловаться</li>
                            <li data-action="profile" data-user-id="${relevantUserId}"><i class="fas fa-user-circle"></i> Профиль</li>
                            <li data-action="hide" data-review-id="${review.id}"><i class="fas fa-eye-slash"></i> Скрыть отзыв</li>
                        </ul>
                    </div>
                </div>
                <div class="review-header">
                     <img src="${avatar}" alt="Аватар" class="review-avatar">
                     <div class="review-info">
                        <div class="review-meta"> <span><i class="fas fa-star"></i> ${rating}</span>
                            ${tagIconsHTML} <small>${date}</small>
                        </div>
                        <p><strong>${title}</strong> "${review.text}"</p>
                     </div>
                 </div>
                 <div class="review-actions">
                     <button class="like-button ${review.isLiked ? 'liked' : ''}" data-review-id="${review.id}" data-source="${isHistory ? 'reviewsHistory' : 'myReviews'}">
                         <i class="${review.isLiked ? 'fas' : 'far'} fa-heart"></i>
                         <span class="likes-count">${review.likes}</span>
                     </button>
                 </div>
            </div>
        `;
    }
    if (reviewFormStarsContainer) {
        const stars = Array.from(reviewFormStarsContainer.children);
    
        // Подсветка звезд при наведении
        reviewFormStarsContainer.addEventListener('mouseover', (event) => {
            const starValue = parseInt(event.target.dataset.starValue);
            if (!starValue) return;
            stars.forEach((star, index) => {
                star.classList.toggle('hovered', index < starValue);
                // Используем far/fas для временной подсветки
                star.classList.toggle('fas', index < starValue);
                star.classList.toggle('far', index >= starValue && !star.classList.contains('selected'));
            });
        });
    
        // Сброс подсветки при уходе мыши (возврат к selected)
        reviewFormStarsContainer.addEventListener('mouseout', () => {
            stars.forEach((star, index) => {
                star.classList.remove('hovered');
                const isSelected = star.classList.contains('selected');
                star.classList.toggle('fas', isSelected);
                star.classList.toggle('far', !isSelected);
            });
        });
    
        // Клик по звезде
        reviewFormStarsContainer.addEventListener('click', (event) => {
            const starValue = parseInt(event.target.dataset.starValue);
            if (!starValue) return;
            selectedStarRating = starValue;
            stars.forEach((star, index) => {
                star.classList.toggle('selected', index < starValue);
                // Обновляем иконку на постоянной основе
                star.classList.toggle('fas', index < starValue);
                star.classList.toggle('far', index >= starValue);
            });
            console.log("Selected rating:", selectedStarRating);
            populateReviewTags(selectedStarRating); // Показываем теги
        });
    }
    function populateReviewTags(rating) {
        if (!reviewFormTagsContainer) return;
        reviewFormTagsContainer.innerHTML = ''; // Очищаем контейнер
        
        // Всегда показываем контейнер, даже если тегов нет
        reviewFormTagsContainer.style.display = 'flex'; 
        reviewFormTagsContainer.style.minHeight = '50px'; // Фиксированная высота
        
        // Определяем теги для всех рейтингов 1-5
        const tagsToShow = rating >= 4 
            ? positiveReviewTags 
            : negativeReviewTags; // 1-3 звезды
    
        // Добавляем все теги, даже если массив пуст
        tagsToShow.forEach(tag => {
            const tagButton = document.createElement('button');
            tagButton.classList.add('review-tag-button');
            tagButton.innerHTML = `<i class="${tag.iconClass}"></i> ${tag.text}`;
            reviewFormTagsContainer.appendChild(tagButton);
        });
    
        // Если тегов нет, добавляем заглушку
        if (tagsToShow.length === 0) {
            reviewFormTagsContainer.innerHTML = `
                <div class="tags-placeholder">
                    Нет тегов для выбранной оценки
                </div>
            `;
        }
    }
    if (reviewFormTagsContainer) {
        reviewFormTagsContainer.addEventListener('click', (event) => {
            const tagButton = event.target.closest('.review-tag-button');
            if (!tagButton) return;
    
            const tagId = tagButton.dataset.tagId;
            tagButton.classList.toggle('selected');
    
            if (tagButton.classList.contains('selected')) {
                if (!selectedReviewTags.find(t => t.id === tagId)) { // Добавляем, если еще нет
                     const tagData = positiveReviewTags.find(t => t.id === tagId) || negativeReviewTags.find(t => t.id === tagId);
                     if (tagData) selectedReviewTags.push(tagData);
                }
            } else {
                selectedReviewTags = selectedReviewTags.filter(t => t.id !== tagId);
            }
            console.log("Selected tags:", selectedReviewTags);
        });
    }
    if (reviewFormSubmitButton) {
        reviewFormSubmitButton.addEventListener('click', () => {
            if (selectedStarRating === 0) {
                alert("Пожалуйста, выберите оценку (звезды).");
                return;
            }
            if (!currentReviewTargetUserId) {
                alert("Ошибка: не определен пользователь для отзыва.");
                return;
            }
    
            const reviewText = reviewFormTextInput.value.trim();
            const newReviewId = Math.max(0, ...mockMyReviews.map(r => r.id), ...mockReviewsHistory.map(r => r.id)) + 1;
    
            const newReview = {
                id: newReviewId,
                // Данные текущего пользователя (оставляющего отзыв)
                reviewer: tgUser.first_name || tgUser.username || "Аноним", // Имя текущего пользователя
                reviewerId: userId, // ID текущего пользователя
                avatar: tgUser.photo_url || `https://via.placeholder.com/30/${getRandomColor()}/FFFFFF?text=${(tgUser.first_name || 'A')[0]}`,
                
                // Данные о пользователе, которому оставляют отзыв (эти поля не отображаются в createReviewItemHTML если isHistory=false)
                targetUser: modalName.textContent, // Имя пользователя из модалки
                targetUserId: currentReviewTargetUserId, 
    
                rating: selectedStarRating,
                text: reviewText,
                date: new Date().toISOString().split('T')[0], // Сегодняшняя дата
                likes: 0,
                isLiked: false,
                selectedTags: selectedReviewTags.map(tag => ({ text: tag.text, iconClass: tag.iconClass })) // Сохраняем только текст и иконку
            };
    
            console.log("Submitting new review:", newReview);
    
            // Добавляем отзыв в начало списка отображаемых в модалке
            if (modalReviewsContainer) {
                // Передаем isHistory = false, т.к. это отзыв от "меня" на кого-то, но он НЕ из моей истории ПОКА ЧТО
                // но createReviewItemHTML ожидает isHistory для определения title.
                // Чтобы title был "От Аноним:", isHistory должно быть false
                const reviewItemHTML = createReviewItemHTML(newReview, false);
                modalReviewsContainer.insertAdjacentHTML('afterbegin', reviewItemHTML); // Добавляем в начало
            }
    
            // Добавляем в "мою историю оставленных отзывов"
            window.mockReviewsHistory.unshift(newReview); // Добавляем в начало массива
            // Если активна страница истории, можно ее обновить
            if (document.getElementById('page-reviews-history')?.classList.contains('active')) {
                populateReviewsHistoryPage();
            }
    
    
            // Очистка формы
            selectedStarRating = 0;
            selectedReviewTags = [];
            if(reviewFormTextInput) reviewFormTextInput.value = '';
            if(reviewFormStarsContainer) {
                Array.from(reviewFormStarsContainer.children).forEach(star => {
                    star.classList.remove('selected', 'fas');
                    star.classList.add('far');
                });
            }
            if(reviewFormTagsContainer) reviewFormTagsContainer.innerHTML = '';
            if(reviewFormTagsContainer) reviewFormTagsContainer.style.display = 'none';
    
            alert("Отзыв добавлен!");
            // Можно закрыть модалку или обновить ее часть
        });
    }    
    
   if (headerIconsContainer) {
    headerIconsContainer.addEventListener('click', (event) => {
        const targetElement = event.target.closest('.header-icon');
        if (!targetElement) return;

        // Клик по иконке Настроек
        if (targetElement.classList.contains('settings-icon')) {
            const modalTargetId = targetElement.getAttribute('data-modal-target');
            if (modalTargetId === 'modal-settings') {
                const title = 'Настройки';
                const contentHTML = `
                    <h4>Настройки приложения</h4>
                    <p>Здесь скоро появятся настройки уведомлений, приватности и другие опции.</p>
                    <label><input type="checkbox" checked> Получать уведомления об отзывах</label><br>
                    <label><input type="checkbox"> Скрывать профиль от незнакомцев</label>
                `;
                openGenericModal(modalTargetId, title, contentHTML);
            }
        }
        // Клик по иконке Уведомлений
        else if (targetElement.classList.contains('notification-icon-container')) {
            const badge = targetElement.querySelector('.notification-badge');
            if (badge) badge.style.display = 'none';
            
            const title = 'Уведомления';
            const contentHTML = `
    <div class="notifications-container">
        <div class="notification-item unread">
            <div class="notification-icon">
                <i class="fas fa-thumbs-up"></i>
            </div>
            <div class="notification-content">
                <p class="notification-text">На ваш комментарий поставили <strong>5 лайков</strong></p>
                <p class="notification-time">10 минут назад</p>
            </div>
        </div>
        
        <div class="notification-item unread">
            <div class="notification-icon">
                <i class="fas fa-comment"></i>
            </div>
            <div class="notification-content">
                <p class="notification-text">На вашем профиле <strong>новый комментарий</strong> от пользователя @Anna</p>
                <p class="notification-time">35 минут назад</p>
            </div>
        </div>
        
        <div class="notification-item">
            <div class="notification-icon">
                <i class="fas fa-eye"></i>
            </div>
            <div class="notification-content">
                <p class="notification-text">Ваш профиль просмотрели <strong>70 человек</strong> за сегодня</p>
                <p class="notification-time">2 часа назад</p>
            </div>
        </div>
        
        <div class="notification-item">
            <div class="notification-icon">
                <i class="fas fa-star"></i>
            </div>
            <div class="notification-content">
                <p class="notification-text">Вы получили <strong>новый отзыв</strong> с оценкой 5 звёзд</p>
                <p class="notification-time">Вчера, 18:45</p>
            </div>
        </div>
    </div>
    
    <div class="notifications-actions">
        <button class="mark-all-read">Отметить всё как прочитанное</button>
        <button class="clear-all">Очистить все</button>
    </div>
`;
            
            openGenericModal('modal-notifications', title, contentHTML);
            
            // Добавляем обработчики для кнопок в модалке
            setTimeout(() => {
                const modal = document.getElementById('modal-notifications');
                if (modal) {
                    modal.querySelector('.mark-all-read')?.addEventListener('click', () => {
                        modal.querySelectorAll('.notification-item').forEach(item => {
                            item.classList.remove('unread');
                        });
                    });
                    
                    modal.querySelector('.clear-all')?.addEventListener('click', () => {
                        modal.querySelectorAll('.notification-item').forEach(item => item.remove());
                    });
                }
            }, 100);
        }
    });
}
    function updateAchievementsProgress() {
        mockUserAchievements.forEach(ach => {
            switch (ach.id) {
                case 'level_3':
                    ach.currentValue = currentUserLevel;
                    break;
                case 'rating_4_7':
                    if (mockMyReviews.length >= ach.reviewsNeeded) {
                        const totalRating = mockMyReviews.reduce((sum, review) => sum + review.rating, 0);
                        ach.currentValue = parseFloat((totalRating / mockMyReviews.length).toFixed(1));
                    } else {
                        ach.currentValue = 0; // Недостаточно отзывов для расчета
                    }
                    break;
                case 'reviews_left_5':
                    ach.currentValue = mockReviewsHistory.length;
                    break;
                case 'reviews_received_3':
                    ach.currentValue = mockMyReviews.length;
                    break;
                case 'profile_reliability_90':
                    // Предположим, что у нас есть доступ к значению надежности
                    // Для примера возьмем статичное или из DOM, если оно там обновляется
                    const reliabilityElement = document.querySelector('.progress-bar-fill.reliability');
                    if (reliabilityElement) {
                        ach.currentValue = parseFloat(reliabilityElement.style.width) || 80;
                    }
                    break;
                case 'first_search':
                    // Это можно было бы хранить в localStorage
                    // ach.currentValue = localStorage.getItem('firstSearchDone') === 'true' ? 1 : 0;
                    // Пока оставим как есть, для демонстрации
                    break;
            }
            // Обновляем статус выполнения
            if (ach.id === 'rating_4_7') {
                 ach.isCompleted = ach.currentValue >= ach.targetValue && mockMyReviews.length >= ach.reviewsNeeded;
            } else {
                 ach.isCompleted = ach.currentValue >= ach.targetValue;
            }
        });
    }
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
    profileActionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            const targetContentIdMap = {
                'show-reviews-history': 'content-reviews-history',
                'show-reviews-my': 'content-reviews-my',
            };
            const targetId = targetContentIdMap[action];

            // Скрываем все секции контента в профиле
            profileContentSections.forEach(section => section.classList.remove('visible'));

            if (targetId) {
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.classList.add('visible');
                    console.log(`Profile Action: ${action}, showing section: ${targetId}`);
                }
            }
        });
    });
    function openGenericModal(modalId, title, contentHTML) {
        // ... (как раньше) ...
         console.log(`Opening generic modal: ${modalId}`);
         if (genericModalTitle) genericModalTitle.textContent = title;
         if (genericModalContent) genericModalContent.innerHTML = contentHTML; // Важно: эта строка должна быть здесь
         if (genericModalOverlay) genericModalOverlay.style.display = 'block';
         if (genericModal) genericModal.style.display = 'block';
         document.body.style.overflow = 'hidden';
    }
    // --- Обработка кнопок в МЕНЮ (открытие универсальной модалки) ---
    if (menuPage) {
        menuPage.addEventListener('click', (event) => {
            const button = event.target.closest('.action-button[data-modal-target]');
            if (!button) return; // Клик не по кнопке с модальным таргетом

            const modalTargetId = button.getAttribute('data-modal-target');
            let title = 'Информация'; // Заголовок по умолчанию
            let contentHTML = '<p>Контент не найден.</p>'; // Контент по умолчанию

            // Определяем контент и заголовок для каждой кнопки меню
           switch (modalTargetId) {
                case 'modal-achievements':
                    title = 'Достижения';
                    updateAchievementsProgress(); // Обновляем прогресс перед отображением
                    contentHTML = '<div class="achievements-grid">';
                    mockUserAchievements.forEach(ach => {
                        const progressPercent = ach.targetValue > 0 ? Math.min((ach.currentValue / ach.targetValue) * 100, 100) : (ach.isCompleted ? 100 : 0);
                        const displayCurrentValue = ach.isCompleted && ach.targetValue > 0 ? ach.targetValue : ach.currentValue;
                        // Для бинарных (0/1) достижений текст будет 0/1 или 1/1
                        const progressText = `${ach.isCompleted && ach.targetValue === 1 ? 1 : displayCurrentValue}/${ach.targetValue}`;

                        contentHTML += `
                            <div class="achievement-block ${ach.isCompleted ? 'completed' : ''}">
                                <i class="${ach.iconClass} achievement-icon"></i>
                                <h5 class="achievement-title">${ach.title}</h5>
                                <p class="achievement-description">${ach.description}</p>
                                <div class="achievement-progress-bar-container">
                                    <div class="achievement-progress-bar-fill" style="width: ${progressPercent}%;"></div>
                                </div>
                                <span class="achievement-progress-text">${progressText}</span>
                            </div>
                        `;
                    });
                    contentHTML += '</div>'; // Закрываем achievements-grid
                    break;
                    case 'modal-referral':
                        title = 'Реферальная программа';
                        contentHTML = `
                            <h4>Пригласите друзей!</h4>
                            <p>Поделитесь вашей уникальной ссылкой:</p>
                            <div class="referral-input-container">
                                <input type="text" class="referral-link" value="t.me/DateCheckerBot?start=${userId}" readonly>
                                <button class="copy-btn">Скопировать ссылку</button>
                            </div>
                            <p class="copy-status" style="display:none; color: var(--green); margin-top: 5px;">Ссылка скопирована!</p>
                            <p>Получайте <strong>+100 XP</strong> за каждого друга, который зарегистрируется и получит первый отзыв!</p>
                        `;
                        break;
                case 'modal-partnership':
                    title = 'Партнерство';
                    contentHTML = `
                        <h4>Хотите сотрудничать?</h4>
                        <p>Мы всегда открыты для интересных предложений и партнерства.</p>
                        <p>Свяжитесь с нами: <a href="mailto:partnership@datechecker.example">partnership@datechecker.example</a></p>
                    `;
                    break;
                case 'modal-settings':
                     title = 'Настройки';
                     contentHTML = `
                         <h4>Настройки приложения</h4>
                         <p>Здесь скоро появятся настройки уведомлений, приватности и другие опции.</p>
                         <label><input type="checkbox" checked> Получать уведомления об отзывах</label><br>
                         <label><input type="checkbox"> Скрывать профиль от незнакомцев</label>
                     `;
                    break;
                 case 'modal-support':
                     title = 'Поддержка';
                     contentHTML = `
                         <h4>Служба поддержки</h4>
                         <p>Если у вас возникли вопросы или проблемы, напишите нам:</p>
                         <p><a href="mailto:support@datechecker.example">support@datechecker.example</a> или в Telegram <a href="https://t.me/DateCheckerSupportBot" target="_blank">@DateCheckerSupportBot</a></p>
                     `;
                    break;
                
            }

            // Заполняем и показываем универсальную модалку
            if (genericModalTitle) genericModalTitle.textContent = title;
            if (genericModalContent) genericModalContent.innerHTML = contentHTML;
            if (genericModalOverlay) genericModalOverlay.style.display = 'block';
            if (genericModal) genericModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Блокируем скролл фона
            openGenericModal(modalTargetId, title, contentHTML);
        });
    }

    // --- Закрытие УНИВЕРСАЛЬНОЙ модалки ---
    function closeGenericModal() {
        if (genericModalOverlay) genericModalOverlay.style.display = 'none';
        if (genericModal) genericModal.style.display = 'none';
        document.body.style.overflow = '';
    }
    if (genericModalCloseButton) genericModalCloseButton.addEventListener('click', closeGenericModal);
    if (genericModalOverlay) genericModalOverlay.addEventListener('click', closeGenericModal);

    // --- Навигация по нижним кнопкам (Обновлено для загрузки данных страниц отзывов) ---
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetPageId = button.getAttribute('data-target');
            const previousActivePage = document.querySelector('.page.active'); // Запоминаем текущую страницу

            // Скрываем все страницы
            pages.forEach(page => page.classList.remove('active'));

            // Показываем нужную страницу
            const targetPage = document.getElementById(targetPageId);
            if (targetPage) {
                 targetPage.classList.add('active');
                 closeGenericModal(); // Закрываем модалки при переходе

                 // === ЗАГРУЗКА ДАННЫХ ДЛЯ СТРАНИЦ ОТЗЫВОВ ===
                 if (targetPageId === 'page-my-reviews' && (!myReviewsListContainer.dataset.loaded || previousActivePage?.id !== targetPageId)) {
                      console.log("Loading data for page-my-reviews");
                      populateMyReviewsPage();
                      myReviewsListContainer.dataset.loaded = "true"; // Отмечаем, что загрузили
                 } else if (targetPageId === 'page-reviews-history' && (!reviewsHistoryListContainer.dataset.loaded || previousActivePage?.id !== targetPageId)) {
                      console.log("Loading data for page-reviews-history");
                      populateReviewsHistoryPage();
                      reviewsHistoryListContainer.dataset.loaded = "true"; // Отмечаем, что загрузили
                 }

            } else {
                 console.error(`Target page not found: ${targetPageId}`);
                 // Вернуть на профиль, если страница не найдена
                 document.getElementById('page-profile')?.classList.add('active');
                 navButtons.forEach(btn => btn.classList.remove('active'));
                 document.querySelector('.nav-button[data-target="page-profile"]')?.classList.add('active');
                 return; // Выходим, чтобы не сбросить активную кнопку
            }

            // Обновляем активное состояние кнопок
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
    
    // --- Открытие/закрытие модального окна ПРОФИЛЯ ПОЛЬЗОВАТЕЛЯ (обновлен вызов генерации отзывов) ---
    if (peopleGrid) {
        peopleGrid.addEventListener('click', (event) => {
            const card = event.target.closest('.profile-card');
            if (card) {
                const userIdFromCard = card.dataset.userId; // Получаем ID пользователя из карточки
                currentReviewTargetUserId = userIdFromCard; // Сохраняем ID для формы отзыва
    
                const cardName = card.querySelector('.card-name').textContent;
                const cardRatingText = card.querySelector('.card-rating').innerHTML;
                const cardAvatarSrc = card.querySelector('.card-avatar-placeholder i')
                                        ? `https://via.placeholder.com/60/${getRandomColor()}/FFFFFF?text=${cardName.charAt(0)}`
                                        : card.querySelector('.card-avatar-placeholder img')?.src; // Если бы там было img
    
                modalAvatar.src = cardAvatarSrc || `https://via.placeholder.com/60/${getRandomColor()}/FFFFFF?text=${cardName.charAt(0)}`;
                modalName.textContent = cardName;
                modalRating.innerHTML = cardRatingText;
                
                // Генерируем отзывы на этого пользователя (userIdFromCard)
                // TODO: Нужна функция, которая будет получать реальные отзывы на userIdFromCard
                // Пока используем generateFakeReviewsWithAvatarsForModal, но она не идеальна для этого
                modalReviewsContainer.innerHTML = generateFakeReviewsWithAvatarsForModal(cardName, userIdFromCard);
    
                // Сбрасываем форму отзыва при открытии модалки
                selectedStarRating = 0;
                selectedReviewTags = [];
                if (reviewFormTextInput) reviewFormTextInput.value = '';
                if (reviewFormStarsContainer) {
                    Array.from(reviewFormStarsContainer.children).forEach(star => {
                         star.classList.remove('selected', 'fas', 'hovered');
                         star.classList.add('far');
                    });
                }
                if (reviewFormTagsContainer) reviewFormTagsContainer.innerHTML = '';
                if (reviewFormTagsContainer) reviewFormTagsContainer.style.display = 'none';
    
    
                modalOverlay.style.display = 'block';
                profileModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    }

    function closeModal() { /* ... */
        modalOverlay.style.display = 'none';
        profileModal.style.display = 'none';
        document.body.style.overflow = '';
    }
    if (modalCloseButton) modalCloseButton.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', (event) => { if (event.target === modalOverlay) closeModal(); });
    function generateFakeReviewsWithAvatarsForModal(userName, targetUserId) { // targetUserId - ID пользователя, чей профиль смотрим
        let reviewsHtml = '';
        // Генерируем несколько случайных отзывов на этого пользователя (targetUserId)
        // Предположим, что mockMyReviews - это все отзывы в системе, и мы фильтруем их
        const reviewsAboutTargetUser = mockMyReviews.filter(r => r.reviewerId !== userId); // Не наши собственные отзывы
        const numReviewsToShow = Math.min(reviewsAboutTargetUser.length, Math.floor(Math.random() * 2) + 1); // 1-2 отзыва

        for (let i = 0; i < numReviewsToShow; i++) {
             // Берем случайный отзыв, который мог бы быть оставлен на этого пользователя
             // В реальном приложении здесь были бы реальные отзывы на targetUserId
            
             const randomReviewData = reviewsAboutTargetUser[Math.floor(Math.random() * reviewsAboutTargetUser.length)];
             // Передаем данные в createReviewItemHTML
             reviewsHtml += createReviewItemHTML({
                id: randomReviewData.id, // Уникальный ID для модалки
                reviewer: randomReviewData.reviewer,
                reviewerId: randomReviewData.reviewerId,
                avatar: randomReviewData.avatar,
                rating: randomReviewData.rating,
                text: `Это демо-отзыв на ${userName}. ${randomReviewData.text.substring(0,30)}...`,
                date: randomReviewData.date,
                likes: Math.floor(Math.random() * 10), // Случайные лайки для модалки
                isLiked: Math.random() < 0.3 // Случайно лайкнут ли
            }, false); // false - это не история моих отзывов
        }
        return reviewsHtml || '<p class="loading-placeholder">Отзывов пока нет.</p>';
    }
    // --- Вспомогательные функции (без изменений) ---
    // --- Вспомогательные функции ---
    function getRandomColor() {
        return Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    }
     // ... (анимация shake) ...
     const styleSheet = document.createElement("style");
     styleSheet.type = "text/css";
     styleSheet.innerText = `@keyframes shake { 0% { transform: translateX(0); } 25% { transform: translateX(-3px); } 50% { transform: translateX(3px); } 75% { transform: translateX(-3px); } 100% { transform: translateX(0); } }`;
     document.head.appendChild(styleSheet);

     document.querySelector('.review-list').addEventListener('click', handleReviewListClick);
     document.querySelector('.review-list').innerHTML += createReviewItemHTML(review, false);

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