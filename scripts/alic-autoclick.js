// ==UserScript==
// @name         Aliexpress click open when ready
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  кликет по кнопке опен когда видет ее
// @author       Krass
// @match        https://sale.aliexpress.com/__mobile/daily_cash_out_m.htm*
// @match        https://sale.aliexpress.com/__mobile/daily-cash-out-gaming_m.htm*
// @match        https://login.aliexpress.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

let openClass  = ".letterOpen___28NJv";
let openClass2  = "._2KULi";
let registrationTab  = ".fm-tabs-tab";
let shareBonnus  = ".btnBox___KrqIl";
//let socialShareDialog  = ".social-share-benefit-panel-wrap.show";
let copylink  = "#copylink";

(function () {
    'use strict';

    function waitForElement(querySelector, timeout=0){
        const startTime = new Date().getTime();
        return new Promise((resolve, reject)=>{
            const timer = setInterval(()=>{
                const now = new Date().getTime();
                if(document.querySelector(querySelector)){
                    clearInterval(timer);
                    resolve();
                }else if(timeout && now - startTime >= timeout){
                    clearInterval(timer);
                    reject();
                }
            }, 100);
        });
    }

    //подожди опен и кликни
    waitForElement(openClass, 15000).then(function(){
        console.log("нашло кнопку опен");
        const myElement = document.querySelector(openClass);
        sendTouchEvent(150, 150, myElement, 'touchstart');
        sendTouchEvent(220, 200, myElement, 'touchend');
    }).catch(()=>{
        console.log("не нашло кнопку опен");
    });

    //подожди опен и кликни
    waitForElement(openClass2, 15000).then(function(){
        console.log("нашло кнопку опен2");
        debugger;
        const myElement = document.querySelector(openClass2);
        sendTouchEvent(150, 150, myElement, 'touchstart');
        sendTouchEvent(220, 200, myElement, 'touchend');
    }).catch(()=>{
        console.log("не нашло кнопку опен2");
    });

    //подожди registrationTab и кликни
    waitForElement(registrationTab, 15000).then(function(){
        console.log("нашло кнопку registrationTab");
        const myElement = document.querySelector(registrationTab);
        myElement.click();
        let login = rs(['6-9','zZ0']);
        let inputLogin = document.querySelectorAll('.fm-text')[0];
        let inputPass = document.querySelectorAll('.fm-text')[1];

        debugger;
        inputPass.setAttribute("value", 'pop090' + login);
        inputPass.dispatchEvent(new Event("change", {bubbles: true}));
        inputPass.dispatchEvent(new Event("blur", {bubbles: true}));

        setTimeout(() => {
            inputLogin.setAttribute("value", login + '@gmail.com');
            inputLogin.dispatchEvent(new Event("change", {bubbles: true}));
            inputLogin.dispatchEvent(new Event("blur", {bubbles: true}));
        }, 500);

    }).catch((e)=>{
        console.log(e);
        console.log("не нашло registrationTab");
    });

    //подожди shareBonnus и кликни
    waitForElement(shareBonnus, 15000).then(function(){
        console.log("нашло кнопку shareBonnus");
        const myElement = document.querySelector(shareBonnus);
        sendTouchEvent(150, 150, myElement, 'touchstart');
        sendTouchEvent(220, 200, myElement, 'touchend');
    }).catch(()=>{
        console.log("не нашло shareBonnus");
    });

    //подожди copylink и кликни
    waitForElement(copylink, 15000).then(function(){
        console.log("нашло кнопку copylink");
        const myElement = document.querySelector(copylink);
        let i = 0;

        let myInterval = setInterval(function() {
            debugger;
            if (myElement) {
                myElement.click();
                sendTouchEvent(150, 150, myElement, 'touchstart');
                sendTouchEvent(220, 200, myElement, 'touchend');
            }
            if ( i > 3 ) clearInterval(myInterval);
            i++
        }, 1000);

        //setTimeout(() => {
        // sendTouchEvent(150, 150, myElement, 'touchstart');
        // sendTouchEvent(220, 200, myElement, 'touchend');
        // }, 3000);
    }).catch(()=>{
        console.log("не нашло copylink");
    });


    /* eventType is 'touchstart', 'touchmove', 'touchend'... */
    function sendTouchEvent(x, y, element, eventType) {
        const touchObj = new Touch({
            identifier: Date.now(),
            target: element,
            clientX: x,
            clientY: y,
            radiusX: 2.5,
            radiusY: 2.5,
            rotationAngle: 10,
            force: 0.5,
        });

        const touchEvent = new TouchEvent(eventType, {
            cancelable: true,
            bubbles: true,
            touches: [touchObj],
            targetTouches: [],
            changedTouches: [touchObj],
            shiftKey: true,
        });

        //touchEvent.isTrusted = true;
        element.dispatchEvent(touchEvent);
    }

    console.log(rs(['6-9','zZ0']));

    function randomString (length, chars = 'zZ0') {
        let characters = '';

        if (chars.search(/[a-z]/) !== -1) {
            characters += 'abcdefghijklmnopqrstuvwxyz';
        }
        if (chars.search(/[A-Z]/) !== -1) {
            characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }
        if (chars.search(/[а-яё]/) !== -1) {
            characters += 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
        }
        if (chars.search(/[А-ЯЁ]/) !== -1) {
            characters += 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
        }
        if (chars.search(/[0-9]/) !== -1) {
            characters += '0123456789';
        }

        const charactersLength = characters.length;
        let result = '';

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    };

    function randomRange(min, max) {
        return Math.floor(Math.random() * (max + 1 - min)) + min;
    };

    // https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
    const arrayShuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            const temp = array[i];

            array[i] = array[j];
            array[j] = temp;
        }

        return array;
    };

    function rs(params) {
        if (!params || !params.length) {
            return '';
        }

        let len;
        let chars = params.length > 1 ? params[1] : 'aA0';
        const spl = params[0].split('-');

        if (spl.length > 1) {
            const min = parseInt(spl[0].trim());
            const max = parseInt(spl[1].trim());

            if (!min || !max) {
                return '';
            }

            len = randomRange(min, max);
        } else {
            len = parseInt(spl[0]);
        }

        if (!len) {
            return '';
        }

        return randomString(len, chars);
    }


})();