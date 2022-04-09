// ==UserScript==
// @name         b站屏蔽视频卡片
// @version      2022.4.9
// @author       Mirion
// @match        https://www.bilibili.com/*
// ==/UserScript==

(function () {
	'use strict';

	window.onload = () => {

		// 用户设置
		var titleKeywordList = [
			'原神', '幻塔', '胡桃', '钟离', '米哈游', '雄狮少年', '紫晶矿', // 晦气
			'王者荣耀', '崩三', '第五人格', '英雄联盟', '手游', // 手游
			'学霸', '学渣', '高三', '高中', '高考', '涨分', '提分', '自习', '学姐', '中考', '刷题', '成绩', '学习', // 应试
			'身材', '健身', '脂肪', '减肥', '瘦身', '减脂', // 健身
			'拖延', '戒断', '矫正', '自律', '高效', // 健康生活
			'亲身经历', '我做的', '我开发', '自制', // “亲自”
			'小姐姐', '网文', // 低俗
			'小米', '手机', // 手机
			'大厂面试', '元宇宙' // 其它
		] // 标题关键词屏蔽列表
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
        
		// 隐藏特别推荐
		var style = document.createElement("style")
		style.innerHTML = '.video-page-special-card-small { display:none; }'
		document.body.appendChild(style)

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
