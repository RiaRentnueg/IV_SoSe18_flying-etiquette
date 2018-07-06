/* eslint-env browser */

var FlyingEtiquette = FlyingEtiquette || {};
FlyingEtiquette.StartDiagramController = function() {
    "use strict";

    var that = {},
      dots,
      innerRingSegments,
      outerRingSegments,
      outerInfoText,
      innerInfoText,
      dotsInfoText;
    
    function setupEventListeners() {
        dots = document.querySelectorAll(".participantDots");
        outerRingSegments = document.querySelectorAll(".outer");
        innerRingSegments = document.querySelectorAll(".inner");
        
        outerInfoText = document.querySelector(".outerInfoText");
        innerInfoText = document.querySelector(".innerInfoText");
        dotsInfoText = document.querySelector(".dotsInfoText");
        
        for(let i = 0; i < outerRingSegments.length; i++) {
            outerRingSegments[i].addEventListener("mouseover", showOuterRingInformation);
            outerRingSegments[i].addEventListener("mouseleave", removeOuterRingInformation);
        }
        
        for(let j = 0; j < innerRingSegments.length; j++) {
            innerRingSegments[j].addEventListener("click", changeDotsColor);
            innerRingSegments[j].addEventListener("mouseover", showInnerRingInformation);
            innerRingSegments[j].addEventListener("mouseleave", removeInnerRingInformation);
        }
        
        for(let k = 1; k < dots.length; k++) {
            dots[k].addEventListener("click", showDotsInformation);
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
        outerInfoText.innerHTML = "<br>" + e.target["__data__"]["data"];
    }
    
    function removeOuterRingInformation(e) {
        outerInfoText.innerHTML = "";
    }
    
    function showInnerRingInformation(e) {
        innerInfoText.innerHTML = "<br>" + e.target["__data__"]["data"]["answer"] + " <br> (" + (e.target["__data__"]["data"]["value"] / 856 * 100) + "%)";
        outerInfoText.innerHTML = "<br>" + e.target["__data__"]["data"]["question"];
    }
    
    function removeInnerRingInformation(e) {
        innerInfoText.innerHTML = "";
        outerInfoText.innerHTML = "";
    }
    
    //when hovering over a dot, the answers to the question from the participant appear in the info box
    function showDotsInformation(e) {
        var dotsData,
            ringAnswers;
        
        //saves the data of the dot temporarily on hover
        dotsData = e.target["__data__"]["data"];
        ringAnswers = document.querySelectorAll(".inner");
        
        for (let j = 0; j < ringAnswers.length; j++) {
            //ringAnswers[j].children[0].style.stroke = "white";
            //ringAnswers[j].children[0].style.strokeWidth = "0.5px";
        }
        
        //iterate through the object for every key (question) except the participant ID 
        for(let key in dotsData) {
            if(key === "value"){
                continue;
            }
            
            for(let i = 0; i < ringAnswers.length; i++) {
                var question = ringAnswers[i]["__data__"]["data"]["question"],
                    answer = ringAnswers[i]["__data__"]["data"]["answer"],
                    segment = ringAnswers[i].children[0];
                
                if(question === key && answer === dotsData[key]) {
                    segment.style.stroke = "blue";
                    segment.style.strokeWidth = "1px";
                    segment.style.fill = "rgb(0,0,0)"
                } 
            }
        }
    }
    
    
    that.setupEventListeners = setupEventListeners;
    return that;
};