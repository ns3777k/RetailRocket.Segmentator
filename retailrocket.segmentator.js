;(function(root, factory) {
    if (typeof define == 'function' && typeof define.amd === 'object' && define.amd) {
        define(['retailrocket.segmentator'], factory());
    } else if (typeof root === 'object' && typeof root.document === 'object') {
        root.retailrocket = root.retailrocket || {};
        root.retailrocket.segmentator = factory();
    }
}(this, function () {
    /** @const {String} */
    var defaultVisitorSegmentRecordCookieName = 'rr-VisitorSegment';

    /**
     * Получение значения cookie
     *
     * @param {String} name Название
     * @returns {null|String} Значение или null
     */
    function getCookie (name) {
        var cookies = document.cookie.split(';');
        var segments = null;

        for (var i = 0; i < cookies.length; i++) {
            var x = cookies[i].substr(0, cookies[i].indexOf('='));
            var y = cookies[i].substr(cookies[i].indexOf('=') + 1);
            x = x.replace(/^\s+|\s+$/g, '');
            if (x == name) {
                try {
                    segments = decodeURIComponent(y);
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
    function setCookie (name, value, expirationInSeconds, path, domain) {
        var cookieValue = encodeURIComponent(value);
        var expirationDate = new Date();
        expirationDate.setSeconds(expirationDate.getSeconds() + expirationInSeconds);

        if (expirationInSeconds != null) {
            cookieValue += "; expires=" + expirationDate.toUTCString();
        }

        cookieValue += ';path=' + (path || '/');

        if (domain) {
            cookieValue += '; domain=' + domain;
        }

        document.cookie = name + '=' + cookieValue;
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
         * @param {Number} nSegment Количество сегментов
         * @param {Object} options Параметры
         * @param {String} options.splitName Название теста чтобы добавить в ключ cookie
         * @param {Number} options.expireInDay=60 Cookie TTL
         * @param {String} options.domain Cookie домен
         * @returns {NaN|Number} Сегмент пользователя
         */
        getVisitorSegment: function (nSegment, options) {
            options = options || {};
            var visitorSegmentCookie = defaultVisitorSegmentRecordCookieName;
            if (options.splitName) {
                visitorSegmentCookie += '-' + options.splitName;
            }

            var visitorSegmentRecord = getCookie(visitorSegmentCookie);
            if (!visitorSegmentRecord || visitorSegmentRecord.split(':')[0] != nSegment) {
                visitorSegmentRecord = nSegment + ':' + randomInt(1, nSegment);
            }

            setCookie(
                visitorSegmentCookie,
                visitorSegmentRecord,
                daysToSeconds(options.expireInDay || 60),
                '/',
                options.domain
            );

            var visitorSegment = visitorSegmentRecord.split(':')[1];
            return parseInt(visitorSegment, 10);
        }
    };
}));
