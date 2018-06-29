/* eslint-env browser */

var FlyingEtiquette = FlyingEtiquette || {};
FlyingEtiquette.StartDiagramController = function() {
    "use strict";

    var that = {},
      dots,
      innerRingSegments,
      outerRingSegments;
    
    function setupEventListeners() {
        dots = document.querySelectorAll(".participantDots");
        outerRingSegments = document.querySelectorAll(".outer");
        innerRingSegments = document.querySelectorAll(".inner");
        
        for(let i = 0; i < innerRingSegments.length; i++) {
            innerRingSegments[i].addEventListener("click", testInnerRing);
        }
        console.log(dots);
    }
    
    function testInnerRing(e) {
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
            for (var key in keyPair){
                if (answer === keyPair[key] && key === question) {
                    dots[i].style = ("fill: rgb(0,80,250)");
                }
            }
        }
    }
    
    that.setupEventListeners = setupEventListeners;
    return that;
};