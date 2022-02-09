// ==UserScript==
// @name         b站屏蔽视频卡片
// @version      2022.1.17
// @author       Mirion
// @match        https://www.bilibili.com/*
// ==/UserScript==

(function () {
	'use strict';
	
	setTimeout(() => {

		var keywordList = [];

		var url = window.location.href;
		var titles, videocards;
		if (url == 'https://www.bilibili.com/') {
			titles = document.querySelectorAll('.recommend-container__2-line .bili-video-card__info--tit');
			videocards = [].slice.apply(document.querySelectorAll('.recommend-container__2-line > .bili-video-card'));
		} else if (url.startsWith('https://www.bilibili.com/video/')) {
			titles = document.querySelectorAll('#reco_list .title');
			videocards = document.querySelectorAll('#reco_list .video-page-card-small');
		}

		var count = 0;
		for (let i of titles) {
			for (let j of keywordList) {
				if (i.title.indexOf(j) != -1) {
					console.log('移除视频卡片    [标题]：%s    [关键词]：%s', i.title, j);
					videocards[count].remove();
					break;
				}
			}
			count++;
		}

	}, 2000);

})();
