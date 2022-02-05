// ==UserScript==
// @name         b站传统连播方式
// @version      2022.1.17
// @author       Mirion
// @match        https://www.bilibili.com/video/*
// ==/UserScript==

(function () {
	'use strict';

	var mutationObserver = new MutationObserver(() => {

		document.querySelector('.next-button').style.display = 'none';

		var style = document.createElement("style");
		style.innerHTML = ".bilibili-player-video-btn-setting-right-playtype { display:none; }";
		document.body.appendChild(style);

		function enableAutoplayNext() {
			console.log('自动开启连播');
			if (document.querySelector('.next-button .on') == null) {
				document.querySelector('.next-button').click();
			}
		}

		function disableAutoplayNext() {
			console.log('自动关闭连播');
			if (document.querySelector('.next-button .on') != null) {
				document.querySelector('.next-button').click();
			}
		}

		if (document.querySelector('#multi_page') == null) {
			disableAutoplayNext();
			return 0;
		}

		function checkLastPage() {
			var url = window.location.href;
			var currentP = url.substring(url.indexOf('?p=') + 3);
			var totalP = document.querySelectorAll('.list-box li').length
			if (currentP != totalP) {
				enableAutoplayNext();
			} else {
				disableAutoplayNext();
			}
		}

		checkLastPage();

		const bindHistoryEvent = function (type) {
			const historyEvent = history[type];
			return function () {
				const newEvent = historyEvent.apply(this, arguments);
				const e = new Event(type);
				e.arguments = arguments;
				window.dispatchEvent(e);
				return newEvent;
			};
		};

		history.pushState = bindHistoryEvent('pushState');
		history.replaceState = bindHistoryEvent('replaceState');
		window.addEventListener('pushState', checkLastPage);
		window.addEventListener('replaceState', checkLastPage);

	});

	mutationObserver.observe(document.querySelector('#danmukuBox'), {
		attributes: true
	});

})();
