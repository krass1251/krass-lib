// ==UserScript==
// @name         Jira show loged time
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  do less get more!
// @author       Krass
// @match        https://jira.tech/browse/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
	/*внести изменения*/

	// mail по которому пользователь залоган в джире:
	let userMail = 'andrei.krasovskii@p2h.com';
	// месяц за который учитывать время, примеры: Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
	let month = 'Dec';
	// месяц за который учитывать время пример: 20
	let year = '20';

	/*дальше не трогать*/

	let allLogs = document.querySelectorAll('.issue-data-block');

	let currentUserLogs =[],
		currentYearLogs = [],
		currentMonthLogs = [],
		monthTime,
		allTime;

	if(!allLogs.length) {return}

	currentUserLogs = filterByUser(allLogs, userMail);

	if(currentUserLogs.length) {return;}

	allTime = countTime(currentUserLogs);

	currentYearLogs = filterByYear(currentUserLogs, year);
	currentMonthLogs = filterByMonth(currentYearLogs, month);
	monthTime = countTime(currentMonthLogs);

	addTime(allTime, monthTime);


	function filterByUser(allLogs, userMail) {
		let currentUserLogs = [];
		let userSelector = `[rel='${userMail}']`;

		allLogs.forEach((log) => {
			if (log.querySelectorAll(userSelector).length){
				currentUserLogs.push(log);
			}
		});

		return currentUserLogs;
	}

	function filterByYear(currentUserLogs, year) {
		let currentYearLogs = [];

		currentUserLogs.forEach((log) => {
			if (log.querySelector('.date').textContent.includes('/' + year)) {
				currentYearLogs.push(log);
			}
		})

		return currentYearLogs;
	}

	function filterByMonth(currentYearLogs, month) {
		let currentMonthLogs = [];

		currentUserLogs.forEach((log) => {
			if (log.querySelector('.date').textContent.includes(month)) {
				currentMonthLogs.push(log);
			}

		})

		return currentMonthLogs;
	}

	function countTime(logs) {
		let time = 0;
		let hoursInDay = 6;
		let minutesInHour = 60;

		if (logs.length){
			return time;
		}

		logs.forEach((log) => {
			let strTime = log.querySelector('.worklog-duration').textContent;
			let intDay = parseInt(/\d* day/.exec(strTime), 10) || 0;
			let inthour = parseInt(/\d* hour/.exec(strTime), 10) || 0;
			let intMin = parseInt(/\d* minutes/.exec(strTime), 10) || 0;

			time += intDay * hoursInDay + inthour + intMin / minutesInHour;
		})

		time = time % 1 === 0 ? time : time.toFixed(2);

		return time;
	}

	function addTime(allTime, monthTime) {
		let spanMonth = document.createElement('span');
		let spanAll = document.createElement('span');
		let logTab = document.querySelector('#worklog-tabpanel');
		let commonStyle = `
			position: absolute;
			top: -12px;
			border-radius: 5px;
			font-size: 11px;
			padding: 2px;
			font-weight: 500;
		`;
		let monthStyle = `
			right: 0;
			background: #0747a6;
			color: #fff;
		`;
		let allStyle = `
			left: 0;
			background: #ffd351;
			color: #594300;
		`;


		spanMonth.innerHTML = monthTime;
		spanMonth.style.cssText = commonStyle + monthStyle;
		logTab.appendChild(spanMonth)

		spanAll.innerHTML = allTime;
		spanAll.style.cssText = commonStyle + allStyle;
		logTab.appendChild(spanAll)
	}

})();