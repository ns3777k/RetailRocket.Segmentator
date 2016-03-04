;(function (root, factory) {
    if (typeof define == 'function' && typeof define.amd === 'object' && define.amd) {
        define(['retailrocket.segmentator'], factory());
    } else if (typeof root === 'object' && typeof root.document === 'object') {
        root.retailrocket = root.retailrocket || {};
        root.retailrocket.segmentator = factory();
    }
}(this, function () {
    /** @const {String} */
    const defaultVisitorSegmentRecordCookieName = 'rr-VisitorSegment';

    /**
     * Получение значения cookie
     *
     * @param {String} name Название
     * @returns {null|String} Значение или null
     */
    function getCookie (name) {
        const cookies = document.cookie.split(';');
        let segments = null;

        for (let cookie of cookies) {
            var x = cookie.substr(0, cookie.indexOf('='));
            var y = cookie.substr(cookie.indexOf('=') + 1);
            x = x.replace(/^\s+|\s+$/g, '');
            if (x == name) {
                try {
                    segments = decodeURIComponent(y);
                    break;
                } catch (e) {
                    segments = null;
                }
            }
        }

        return segments;
    }

    /**
     * Установка cookie
     *
     * @param {String} name Название
     * @param {String} value Значение
     * @param {Number} expirationInSeconds Время жизни в секундах
     * @param {String} path Путь
     * @param {String} domain Домен
     */
    function setCookie (name, value, expirationInSeconds, path = '/', domain) {
        let cookieValue = encodeURIComponent(value);
        let expirationDate = new Date();
        expirationDate.setSeconds(expirationDate.getSeconds() + expirationInSeconds);

        if (expirationInSeconds != null) {
            cookieValue += "; expires=" + expirationDate.toUTCString();
        }

        cookieValue = `${cookieValue};path=${path}`;

        if (domain) {
            cookieValue = `${cookieValue}; domain=${domain}`;
        }

        document.cookie = `${name}=${cookieValue}`;
    }

    /**
     * Хелпер для перевода дней в секунды
     *
     * @param {Number} days Количество дней
     * @returns {Number} Количество секунд
     */
    function daysToSeconds (days) {
        return days * 24 * 60 * 60;
    }

    /**
     * Хелпер для генерация случайного числа между min и max
     *
     * @param {Number} min Минимальное значение
     * @param {Number} max Максимальное значение
     * @returns {Number} Случайное число
     */
    function randomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return {
        /**
         * Вычисляет, сохраняет в cookie и возвращает сегмент пользователя
         *
         * @param {Number} segments Количество сегментов
         * @param {Object} options Параметры
         * @param {String} options.splitName Название теста чтобы добавить в ключ cookie
         * @param {Number} options.expireInDay=60 Cookie TTL
         * @param {String} options.path='/' Cookie путь
         * @param {String} options.domain Cookie домен
         * @returns {NaN|Number} Сегмент пользователя
         */
        getVisitorSegment (segments, options = {}) {
            let visitorSegmentCookie = defaultVisitorSegmentRecordCookieName;
            if (options.splitName) {
                visitorSegmentCookie = `${visitorSegmentCookie}-${options.splitName}`;
            }

            let visitorSegmentRecord = getCookie(visitorSegmentCookie);
            if (!visitorSegmentRecord || visitorSegmentRecord.split(':')[0] != segments) {
                visitorSegmentRecord = segments + ':' + randomInt(1, segments);
            }

            setCookie(
                visitorSegmentCookie,
                visitorSegmentRecord,
                daysToSeconds(options.expireInDay || 60),
                options.path || '/',
                options.domain
            );

            const visitorSegment = visitorSegmentRecord.split(':')[1];
            return parseInt(visitorSegment, 10);
        }
    };
}));
