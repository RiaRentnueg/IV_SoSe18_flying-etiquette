/* eslint-env browser */

var FlyingEtiquette = FlyingEtiquette || {};
FlyingEtiquette.StartDiagramController = function() {
    "use strict";

    var that = {},
      dots,
      innerRingSegments,
      outerRingSegments,
      outerInfoText,
      innerInfoText;
    
    function setupEventListeners() {
        dots = document.querySelectorAll(".participantDots");
        outerRingSegments = document.querySelectorAll(".outer");
        innerRingSegments = document.querySelectorAll(".inner");
        outerInfoText = document.querySelector(".outerInfoText");
        innerInfoText = document.querySelector(".innerInfoText");
        
        for(let i = 0; i < outerRingSegments.length; i++) {
            outerRingSegments[i].addEventListener("mouseover", showOuterRingInformation);
            outerRingSegments[i].addEventListener("mouseleave", removeOuterRingInformation);
        }
        
        for(let j = 0; j < innerRingSegments.length; j++) {
            innerRingSegments[j].addEventListener("click", changeDotsColor);
            innerRingSegments[j].addEventListener("mouseover", showInnerRingInformation);
            innerRingSegments[j].addEventListener("mouseleave", removeInnerRingInformation);
        }
        
    }
    
    function changeDotsColor(e) {
        var answer,
            question,
            keyPair;
        
        question = e.target["__data__"]["data"]["question"];
        answer = e.target["__data__"]["data"]["answer"];
        
        resetDotsColor();
        selectDotsColor(keyPair, answer, question);
    }
    
    function resetDotsColor() {
        for(let i = 1; i < dots.length; i++) {
            dots[i].style = ("fill: rgb(20,20,100)");
        }
    }
    
    //nur wenn Antwort und Frage übereinstimmen
    function selectDotsColor(keyPair, answer, question) {
        for(let i = 1; i < dots.length; i++) {
            keyPair = dots[i]["__data__"]["data"];
            for (let key in keyPair){
                if (answer === keyPair[key] && key === question) {
                    dots[i].style = ("fill: rgb(0,80,250)");
                }
            }
        }
    }
    
    function showOuterRingInformation(e) {
        outerInfoText.innerHTML = e.target["__data__"]["data"];
    }
    
    function removeOuterRingInformation(e) {
        outerInfoText.innerHTML = "";
    }
    
    function showInnerRingInformation(e) {
        innerInfoText.innerHTML = e.target["__data__"]["data"]["answer"] + "  (" + (e.target["__data__"]["data"]["value"] / 856 * 100) + "%)";
        outerInfoText.innerHTML = e.target["__data__"]["data"]["question"];
    }
    
    function removeInnerRingInformation(e) {
        innerInfoText.innerHTML = "";
        outerInfoText.innerHTML = "";
    }
    
    that.setupEventListeners = setupEventListeners;
    return that;
};