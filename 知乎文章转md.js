// ==UserScript==
// @name         知乎文章转md
// @version      2022.4.7
// @author       Mirion
// @match        https://zhuanlan.zhihu.com/p/*
// ==/UserScript==

(function () {
	'use strict';

	function _(p, h = document) {
		return h.querySelector(p)
	}

	function _a(p, h = document) {
		return h.querySelectorAll(p)
	}

	if (_('.Post-Title') == null) {
		console.log('[文章转md] 不是文章页面')
		return
	}

	var result = '# ' + _('.Post-Title').innerText

	function addLine(p) {
		result += '\n\n' + p
	}

	if (_('.Catalog') != null) {
		addLine('[TOC]')
	}

	for (let i of _('.Post-RichText').cloneNode(true).childNodes) {

		// inline
		for (let j of _a('br', i)) {
			j.innerText = '<br>'
		}
		for (let j of _a('i', i)) {
			j.innerText = '_' + j.innerText + '_'
		}
		for (let j of _a('b', i)) {
			j.innerText = '**' + j.innerText + '**'
		}
		for (let j of _a('code:not(pre code)', i)) {
			j.innerText = '`' + j.innerText + '`'
		}
		for (let j of _a('li', i)) {
			j.innerText = '<br>' + j.innerText
		}
		for (let j of _a('pre', i)) {
			j.innerText = '```<br>' + j.innerText + '<br>```'
		}
		for (let j of _a('pre span', i)) { // bug
			if (j.innerText == '')
				j.innerText = '<br>'
		}
		for (let j of _a('a', i)) {
			j.innerText = `[${j.innerText}](${j['href']})`
		}
		for (let j of _a('img:not([data-formula])', i)) {
			j.innerText = `![${j.innerText}](${j['src']})`
		}
		for (let j of _a('img[data-formula]', i)) {
			j.innerText = '<math>' + j.getAttribute('data-formula') + '</math>'
		}
		for (let j of _a('noscript, figcaption', i)) {
			j.innerText = ''
		}
		let text = i.innerText.replaceAll('<br>', '\n')
			.replaceAll(' <math>', '$').replaceAll('<math>', '$')
			.replaceAll('</math> ', '$').replaceAll('</math>', '$')

		// block
		switch (i.nodeName.toLowerCase()) {
			case 'p':
			case 'div':
			case 'figure':
				addLine(text)
				break
			case 'h2':
				addLine('## ' + text)
				break
			case 'h3':
				addLine('### ' + text)
				break
			case 'hr':
				addLine('***')
				break
			case 'blockquote':
				addLine('> ' + text.replaceAll('\n', '\n> '))
				break
			case 'ol':
				addLine(text.replaceAll('\n', '\n1. ').substring(1))
				break
			case 'ul':
				addLine(text.replaceAll('\n', '\n- ').substring(1))
				break
			default:
				addLine('<span style="color:red">无法识别的标签</span>')
				break
		}

	}

	var list = result.split('\n\n')
	// TODO

	console.log(list.join('\n\n'))

})();
