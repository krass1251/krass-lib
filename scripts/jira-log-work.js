// ==UserScript==
// @name         Jira show loged time
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to do nothing!
// @author       Krass
// @match        https://jira.tech/browse/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
  	/*внести изменения*/

    // mail по которому пользователь залоган в джире:
	// let user = 'andrei.krasovskii@p2h.com';
	let user = 'aleksandr.nektarov@p2h.com';

    // месяц за который учитывать время, примеры: Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
	let moth = 'Sep';
	let year = '20';

	/*дальше не трогать*/
	let allLogs = document.querySelectorAll('.issue-data-block');
	let userSelector = `[rel='${user}']`;
	let currentUserLogs =[],
		currentMothLogs = [],
		time = 0;
	if(!allLogs.length) {return};
	allLogs.forEach((log) => {
		if (log.querySelectorAll(userSelector).length){
			currentUserLogs.push(log);
		}
	})

	currentUserLogs.forEach((log) => {
		if (log.querySelector('.date').textContent.includes(moth) && log.querySelector('.date').textContent.includes('/' + year)) {
			currentMothLogs.push(log);
		}

	})

	currentMothLogs.forEach((log) => {
		let strTime = log.querySelector('.worklog-duration').textContent;
		let intDay = parseInt(/\d* day/.exec(strTime), 10) || 0;
		let inthour = parseInt(/\d* hour/.exec(strTime), 10) || 0;
		let intMin = parseInt(/\d* minutes/.exec(strTime), 10) || 0;

		time += intDay * 6 + inthour + intMin / 60;
	})

	let span = document.createElement('span');
	let logTab = document.querySelector('#worklog-tabpanel');

    time = time % 1 === 0 ? time : time.toFixed(2);
	span.innerHTML = time;
	span.style.cssText = `
		position: absolute;
		top: -12px;
		right: 0;
		background: #0747a6;
		border-radius: 5px;
		color: #fff;
		font-size: 11px;
		padding: 2px;
		font-weight: 500;
	`;
	logTab.appendChild(span)

	console.log(time + ' hour');

})();