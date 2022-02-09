// ==UserScript==
// @name         b站屏蔽视频卡片
// @version      2022.2.9
// @author       Mirion
// @match        https://www.bilibili.com/*
// ==/UserScript==

(function () {
	'use strict';

	window.onload = () => {

		// 用户设置
		var titleKeywordList = [] // 标题关键词屏蔽列表
		var upList = [] // up主屏蔽列表

		// 辅助函数
		function _(selector, parent = document) {
			return parent.querySelector(selector)
		}

		function _a(selector, parent = document) {
			return parent.querySelectorAll(selector)
		}

		// 判断页面类型
		var pageType
		var url = document.location.href
		if (url == 'https://www.bilibili.com/') {
			pageType = 'main'
		} else if (url.startsWith('https://www.bilibili.com/video/')) {
			pageType = 'video'
		} else {
			return
		}
		console.log(`[屏蔽视频卡片] 当前页面类型: ${pageType}`)

		// 主页逻辑
		if (pageType == 'main') {
			let videoList = _a('.recommend-container__2-line > .bili-video-card')
			for (let i of videoList) {
				let title = _('.bili-video-card__info--tit', i).innerText.replace(' ', '')
				for (let j of titleKeywordList) {
					if (title.indexOf(j) != -1) {
						i.style = 'display:none'
						console.log(`[屏蔽视频卡片] 屏蔽一个视频卡片，触发标题关键词：${j}`)
					}
				}
				let up = _('.bili-video-card__info--author', i).innerText.replace(' ', '')
				for (let j of upList) {
					if (up == j) {
						i.style = 'display:none'
						console.log(`[屏蔽视频卡片] 屏蔽一个视频卡片，来自up：${j}`)
					}
				}
			}
		}

		// 视频页逻辑
		if (pageType == 'video') {
			let videoList = _a('.rec-list > .video-page-card-small')
			for (let i of videoList) {
				let title = _('.info .title', i).innerText.replace(' ', '')
				for (let j of titleKeywordList) {
					if (title.indexOf(j) != -1) {
						i.style = 'display:none'
						console.log(`[屏蔽视频卡片] 屏蔽一个视频卡片，触发标题关键词：${j}`)
					}
				}
				let up = _('.upname .name', i).innerText.replace(' ', '')
				for (let j of upList) {
					if (up == j) {
						i.style = 'display:none'
						console.log(`[屏蔽视频卡片] 屏蔽一个视频卡片，来自up：${j}`)
					}
				}
			}
		}

	}

})();
