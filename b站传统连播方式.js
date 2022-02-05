	// ==UserScript==
	// @name         b站传统连播方式
	// @version      2022.2.6
	// @author       Mirion
	// @match        https://www.bilibili.com/video/*
	// ==/UserScript==

	(function () {
		'use strict';

		// 用户设置
		var singlePageAutoplay = false; // 单P是否连播
		var multiPageAutoplay = true; // 多P是否连播
		var collectionAutoplay = true; // 合集是否连播
		var multiPageFinishAutoplay = false; // 多P最后一P是否连播
		var collectionFinishAutoplay = false; // 合集最后一P是否连播

		// 辅助函数
		function _(selector, parent = document) {
			return parent.querySelector(selector)
		}

		function _a(selector, parent = document) {
			return parent.querySelectorAll(selector)
		}

		function _s(selector) {
			return window.getComputedStyle(_(selector));
		}

		// 等待页面加载完成
		var observer = new MutationObserver(function self() {

			console.log('[传统连播方式] 页面加载完成')
			observer.disconnect()

			// 隐藏原连播按钮
			var style = document.createElement("style")
			style.innerHTML = '.next-button, .bilibili-player-video-btn-setting-right-playtype { display:none; }'
			document.body.appendChild(style)

			// 监听 pushState
			const bindHistoryEvent = function (type) {
				const historyEvent = history[type]
				return function () {
					const newEvent = historyEvent.apply(this, arguments)
					const e = new Event(type)
					e.arguments = arguments
					window.dispatchEvent(e)
					return newEvent
				}
			}

			history.pushState = bindHistoryEvent('pushState');

			window.addEventListener('pushState', () => {
				console.log('[传统连播方式] 触发 pushState')
				setTimeout(self, 5000)
			}, {
				once: true
			})

			// 设置连播
			function setAutoplay(b) {
				if (b) {
					if (_('.next-button .on') == null) {
						_('.next-button').click()
					}
					console.log('[传统连播方式] 自动开启连播')
				} else {
					if (_('.next-button .on') != null) {
						_('.next-button').click()
					}
					console.log('[传统连播方式] 自动关闭连播')
				}
			}

			// 判断页面类型
			var pageType
			if (_('.base-video-sections-v1') != null) {
				pageType = 'collection'
			} else if (_('#multi_page') != null) {
				pageType = 'multiPage'
			} else {
				pageType = 'singlePage'
			}
			console.log(`[传统连播方式] 当前页面类型: ${pageType}`)

			// 单P逻辑
			if (pageType == 'singlePage') {

				setAutoplay(singlePageAutoplay)

			}

			// 多P逻辑
			if (pageType == 'multiPage') {

				if (multiPageAutoplay) {
					if (multiPageFinishAutoplay) {
						setAutoplay(true)
					} else {
						let videoCount = _a('.list-box li').length
						let currentVideo = _('.list-box .on .page-num').innerText.substring(1)
						if (currentVideo == videoCount) {
							setAutoplay(false)
						} else {
							setAutoplay(true)
						}
					}
				} else {
					setAutoplay(false)
				}

			}

			// 合集逻辑
			if (pageType == 'collection') {

				// 加长合集列表
				let cardCount = _a('.video-episode-card').length
				if (cardCount > 8) {
					cardCount = 8
				}
				let videoListHeight = cardCount * 34 + 8 + 'px'
				_('.video-sections-content-list').style = `height:${videoListHeight};max-height:${videoListHeight}`

				// 连播逻辑
				if (collectionAutoplay) {
					if (collectionFinishAutoplay) {
						setAutoplay(true)
					} else {
						// 找到当前合集
						let section = _a('.video-sections-item')
						let currentSection
						for (let i of section) {
							if (_('.video-episode-card__info-playing', i) != null) {
								currentSection = i
								break
							}
						}
						// 找到当前视频
						let video = _a('.video-episode-card', currentSection)
						let videoCount = video.length
						let currentVideo
						for (let i = 0; i < videoCount; ++i) {
							if (_('.video-episode-card__info-playing', video[i]) != null) {
								currentVideo = i + 1
								break
							}
						}
						if (currentVideo == videoCount) {
							setAutoplay(false)
						} else {
							setAutoplay(true)
						}
					}
				} else {
					setAutoplay(false)
				}

			}
		})

		observer.observe(_('#v_upinfo'), {
			childList: true,
			subtree: true
		})

	})()
