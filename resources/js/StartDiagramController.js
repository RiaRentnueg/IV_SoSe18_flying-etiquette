/* eslint-env browser */

var FlyingEtiquette = FlyingEtiquette || {};
FlyingEtiquette.StartDiagramController = function() {
    "use strict";

    var that = {},
      manager,
      dots,
      innerRingSegments,
      outerRingSegments,
      outerInfoText,
      innerInfoText,
      activeSegments = [],
      activeDot = [];
    
    //setup the selectors and the events for said selectors
    function setupEventListeners() {
        initSelectors();
        initOuterRingEvents();
        initInnerRingEvents();
        initDotsEvents();
    }
    
    //initialize the variables with selectors to handle their events and the StartDiagramManager for visual changes that occur later
    function initSelectors() {
        manager = FlyingEtiquette.StartDiagramManager();
        
        dots = document.querySelectorAll(".participantDots");
        outerRingSegments = document.querySelectorAll(".outer");
        innerRingSegments = document.querySelectorAll(".inner");

        outerInfoText = document.querySelector(".outerInfoText");
        innerInfoText = document.querySelector(".innerInfoText");
    }
    
    //initialize the events when the user interacts with the outer ring (questions) of the start diagram
    function initOuterRingEvents() {
        for(let i = 0; i < outerRingSegments.length; i++) {
            outerRingSegments[i].addEventListener("mouseover", showOuterRingInformation);
            outerRingSegments[i].addEventListener("mouseleave", removeOuterRingInformation);
        }
    }
    
    //initialize the events when the user interacts with the inner ring (answer) of the start diagram
    function initInnerRingEvents() {
        for(let i = 0; i < innerRingSegments.length; i++) {
            innerRingSegments[i].addEventListener("click", changeDotsColor);
            innerRingSegments[i].addEventListener("mouseover", showInnerRingInformation);
            innerRingSegments[i].addEventListener("mouseleave", removeInnerRingInformation);
        }
    }
    
    //initialize the events when the user interacts with the dots (participants and their answers) of the start diagram
    function initDotsEvents() {
        for(let i = 1; i < dots.length; i++) {
            dots[i].addEventListener("click", showDotsInformation);
        }
    }
    
    //change the dot color when the user clicks on a segment of the inner ring, first check if the current segment is active or not and add the segment to the list of active segments if it was inactive before, then reset the colors of the dots and the inner ring segments, mark all active segments and then color every dot
    function changeDotsColor(e) {
        
        if(checkActiveOrInactive(e)){
            activeSegments.push(e.target);
        }
        
        resetDotsColor();
        resetInnerRingColor();
        markActiveSegments();
        selectDotsColor();
                
    }
    
    //checks if the clicked on segment is active or inactive, a segment is active after the user clicked on it and the user can set it as inactive by clicking on it again, if the user clicks on an element and it is included in the activeSegments array this segment is no longer active and then removed from the array. If the clicked on segment was inactive it is now active (boolean active = true), if it was active, it is now inactive and removed from the activeSegments list (boolean active = false)
    function checkActiveOrInactive(e){
        var active = true;
        for(let i = 0; i < activeSegments.length; i++) {
            if(activeSegments[i] === e.target && activeSegments.length !== 0) {
                activeSegments.splice(i, 1);
                active = false;
                break;
            }
        }
        return active;
    }
    
    //reset the dots color to the non-highlight color for every dot
    function resetDotsColor() {
        for(let i = 1; i < dots.length; i++) {
            manager.colorInactiveDot(dots[i]);
        }
    }
    
    //reset the color of the inner ring segments, this is to prevent having falsely marked segments. Initiate a counter that goes up every time when the current question is different from the previous one and save the current question now as the previous question, the number of the counter corresponds to a spot inside an array (colorRange in StartDiagramManager) that has the same color for each answer of a question
    function resetInnerRingColor() {
        var preQuestion,
            curQuestion,
            colorCounter = 0;
        
        for(let i = 0; i < innerRingSegments.length; i++) {
            curQuestion = innerRingSegments[i]["__data__"]["data"]["question"];
            
            if(curQuestion === preQuestion) {
                manager.reassignRingColor(innerRingSegments[i], colorCounter);
            } else {
                if(preQuestion !== undefined) {
                    colorCounter++;
                }
                manager.reassignRingColor(innerRingSegments[i], colorCounter);
            }
            preQuestion = innerRingSegments[i]["__data__"]["data"]["question"];
        }
    }
    
    //currently active segments should be highlighted in a different color, the same color that is used for highlighting corresponding answers when clicking on a participant dot is also used here
    function markActiveSegments() {
        for(let i = 0; i < activeSegments.length; i++) {
            manager.colorActiveSegment(activeSegments[i]);
        }
    }
    
    //select the color for each dot(highlighted or non-highlighted), also an array named activeDot is created that saves only dots that correspond to the previously selected answers of the inner ring segment that are saved in the activeSegments array. If there are 2 or more active segments, the function iterates through the activeDot array for each segment and leaves the new collection of dots in a temporary array that will then be the new list of active dots. All dots that should be higlighted are then in the activeDot array at the end of the loop.
    function selectDotsColor() {
        var tempActiveDot = [];
        
        //reset the list of active dots
        activeDot = [];
        
        for(let i = 0; i < activeSegments.length; i++) {
            if (i === 0) {
                setUpDotsArray(dots,activeDot,i);
            } else {
                setUpDotsArray(activeDot,tempActiveDot,i);
                
                //set the new reduced list as the current list of active dots and remove the items from the temporary list
                activeDot = tempActiveDot;
                tempActiveDot = [];
            }
        }
        
        highlightActiveDots();
        
    }
    
    //highlight all active dots that correspond to the currently marked question with the highlight color 
    function highlightActiveDots() {
        for(let i = 0; i < activeDot.length; i++) {
            manager.colorActiveDot(activeDot[i]);
        }
    }
    
    //set up a new dotsArray that includes only participants from the initial collection that again selected the same answers and questions from the current active segment 
    function setUpDotsArray(initialCollection,newCollection,iteration) {
        var keyPair,
            answer,
            question;
        
        for(let i = 1; i < initialCollection.length; i++) {
            keyPair = initialCollection[i]["__data__"]["data"];
            answer = activeSegments[iteration]["__data__"]["data"]["answer"];
            question = activeSegments[iteration]["__data__"]["data"]["question"];

            //iterates through every question(key) for every entery of keyPair and checks if the answers and the corresponding question are the same, in which case the participant is also a part of the new collection
            for (let key in keyPair){
                if (answer === keyPair[key] && key === question) {
                    newCollection.push(initialCollection[i]);
                }
            }
        }
    }

    //shows the current question in the info box while hovering over a segment of the outer ring
    function showOuterRingInformation(e) {
        manager.setOuterRingHoverText(outerInfoText, e);
    }
    
    //removes the current question in the info box while exiting a segment of the outer ring
    function removeOuterRingInformation(e) {
        manager.removeOuterRingHoverText(outerInfoText);
    }
    
    //shows the current question, answer and percentage in the info box while hovering over a segment of the inner ring
    function showInnerRingInformation(e) {
        manager.setInnerRingHoverText(innerInfoText, outerInfoText, e);
    }
    
    //removes the current question, answer and percentage in the info box while exiting a segment of the inner ring
    function removeInnerRingInformation(e) {
        manager.removeInnerRingHoverText(innerInfoText, outerInfoText);
    }
    
    //show visual information about the dots, first reset the visuals for the inner ring, then highlight all ring segments that correspond with the answers given by the participant visualized through the dot and then highlight this participant so that the user can later hover over the answers and still know which participant was selected
    function showDotsInformation(e) {
        resetRingInformation();
        highlightInnerRingSegments(e);
        showSelectedParticipant(e.target);
    }
    
    //reset the activeSegments as well as the visual representation of the inner ring
    function resetRingInformation() {
        activeSegments = [];
        resetInnerRingColor();
    }
    
    //highlight the segments of the inner ring that are the same as the answers given by the selected participant, the participant id is being ignored as it is not displayed in the inner ring
    function highlightInnerRingSegments(e) {
        var dotsData = e.target["__data__"]["data"],
            ringAnswers = document.querySelectorAll(".inner");
        
        for(let key in dotsData) {
            if(key === "value"){
                continue;
            }
            
            for(let i = 0; i < ringAnswers.length; i++) {
                var question = ringAnswers[i]["__data__"]["data"]["question"],
                    answer = ringAnswers[i]["__data__"]["data"]["answer"],
                    segment = ringAnswers[i].children[0];
                
                if(question === key && answer === dotsData[key]) {
                    manager.colorActiveSegment(segment);
                }
            }
        }
    }
    
    //show only the participant dot that the user clicked on and highlight it with the highlight color, every other dot gets the non-highlighted color
    function showSelectedParticipant(clickedDot) {
        for(let i = 1; i < dots.length; i++) {
            if(dots[i] === clickedDot) {
                manager.colorActiveDot(dots[i]);
            } else {
                manager.colorInactiveDot(dots[i]);
            }
        }        
    }
    

    that.setupEventListeners = setupEventListeners;
    return that;
};