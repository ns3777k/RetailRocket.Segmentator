'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

;(function (root, factory) {
    if (typeof define == 'function' && _typeof(define.amd) === 'object' && define.amd) {
        define(['retailrocket.segmentator'], factory());
    } else if ((typeof root === 'undefined' ? 'undefined' : _typeof(root)) === 'object' && _typeof(root.document) === 'object') {
        root.retailrocket = root.retailrocket || {};
        root.retailrocket.segmentator = factory();
    }
})(this, function () {
    /** @const {String} */
    var defaultVisitorSegmentRecordCookieName = 'rr-VisitorSegment';

    /**
     * Получение значения cookie
     *
     * @param {String} name Название
     * @returns {null|String} Значение или null
     */
    function getCookie(name) {
        var cookies = document.cookie.split(';');
        var segments = null;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = cookies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var cookie = _step.value;

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
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
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
    function setCookie(name, value, expirationInSeconds) {
        var path = arguments.length <= 3 || arguments[3] === undefined ? '/' : arguments[3];
        var domain = arguments[4];

        var cookieValue = encodeURIComponent(value);
        var expirationDate = new Date();
        expirationDate.setSeconds(expirationDate.getSeconds() + expirationInSeconds);

        if (expirationInSeconds != null) {
            cookieValue += "; expires=" + expirationDate.toUTCString();
        }

        cookieValue = cookieValue + ';path=' + path;

        if (domain) {
            cookieValue = cookieValue + '; domain=' + domain;
        }

        document.cookie = name + '=' + cookieValue;
    }

    /**
     * Хелпер для перевода дней в секунды
     *
     * @param {Number} days Количество дней
     * @returns {Number} Количество секунд
     */
    function daysToSeconds(days) {
        return days * 24 * 60 * 60;
    }

    /**
     * Хелпер для генерация случайного числа между min и max
     *
     * @param {Number} min Минимальное значение
     * @param {Number} max Максимальное значение
     * @returns {Number} Случайное число
     */
    function randomInt(min, max) {
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
         * @param {String} options.path='/' Cookie путь
         * @param {String} options.domain Cookie домен
         * @returns {NaN|Number} Сегмент пользователя
         */

        getVisitorSegment: function getVisitorSegment(nSegment) {
            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var visitorSegmentCookie = defaultVisitorSegmentRecordCookieName;
            if (options.splitName) {
                visitorSegmentCookie = visitorSegmentCookie + '-' + options.splitName;
            }

            var visitorSegmentRecord = getCookie(visitorSegmentCookie);
            if (!visitorSegmentRecord || visitorSegmentRecord.split(':')[0] != nSegment) {
                visitorSegmentRecord = nSegment + ':' + randomInt(1, nSegment);
            }

            setCookie(visitorSegmentCookie, visitorSegmentRecord, daysToSeconds(options.expireInDay || 60), options.path || '/', options.domain);

            var visitorSegment = visitorSegmentRecord.split(':')[1];
            return parseInt(visitorSegment, 10);
        }
    };
});