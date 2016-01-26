/** @type {Object} */
window.retailrocket = window.retailrocket || {};

/** @type {Object} */
window.retailrocket.segmentator = (function () {

    /** @const {String} */
    var defaultVisitorSegmentRecordCookieName = 'rr-VisitorSegment';

    /**
     * Получение значения cookie
     *
     * @param {String} name Название
     * @returns {null|String} Значение или null
     */
    function getCookie (name) {
        var i, x, y, cookies = document.cookie.split(';');
        for (i = 0; i < cookies.length; i++) {
            x = cookies[i].substr(0, cookies[i].indexOf('='));
            y = cookies[i].substr(cookies[i].indexOf('=') + 1);
            x = x.replace(/^\s+|\s+$/g, '');
            if (x == name) {
                return unescape(y);
            }
        }
        return null;
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
        var expirationDate = new Date();
        expirationDate.setSeconds(expirationDate.getSeconds() + expirationInSeconds);
        var cookieValue = escape(value);

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
    function daysToSecond (days) {
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
                daysToSecond(options.expireInDay || 60),
                '/',
                options.domain
            );

            var visitorSegment = visitorSegmentRecord.split(':')[1];
            return parseInt(visitorSegment, 10);

        }
    };

}());
