/* eslint-env browser */

var FlyingEtiquette = FlyingEtiquette || {};
FlyingEtiquette.StartDiagramModel = function() {
    "use strict";

    var that = {},
        rawDotsData = [],
        tempData = [],
        currData = [],
        container = {},
        columnsData = [],
        dataArray = [];

    //setup the csv data and save the different processed data collections in separate arrays
    function setupCsvData() {
        d3.csv("./data/flying-etiquette.csv", function(data) {
            processDotsData(data);
            //this loop saves all answers form the dataset into a temporary array that can then be sorted and provides the output we need, the first column of the data is an id, which is irrelevant at this point, so the loop starts at 1
            for(let i = 1; i < data.columns.length; i++){
                //this saves the data needed for the outer ring in a seperate array
                columnsData.push(data.columns[i]);
                
                //creates a list of all the answers from every participant for a single question
                for(let j = 0; j < data.length; j++){
                    tempData.push(data[j][data.columns[i]]);
                }
                
                countArrayElements(tempData, data.columns[i]);
                //reset the temporary list of answers for the next loop
                tempData = [];
            }
        });
    }
    
    //this outputs the data needed to draw the inner ring segments of the start diagram in the StartDiagramManager
    function getInnerRingData() {
        return currData;
    }
    
    //this outputs the data needed to draw the outer ring segments of the start diagram in the StartDiagramManager
    function getOuterRingData() {
        return columnsData;
    }
    
    //this outputs the data needed to draw the outer ring segments of the start diagram in the StartDiagramManager
    function getProccessedDotsData() {
        return dataArray;
    }
    
    //the elements in the array are sorted and then the function iterates through the array and counts the amount of same answers until a different one appears, the important data is being saved in a container and the new answer is then the current answer until a different one is selected again
    function countArrayElements(array, questionName) {
        var current = null,
            count = 0;
        
        array.sort();
        
        for(let i = 0; i < array.length; i++) {
            if (array[i] !== current) {
                if (count > 0) {
                    setupContainer(questionName, current, count);
                }
                current = array[i];
                count = 1;
            } else {
                count++;
            }
        }
        //this regards the last set of answers
        if (count > 0) {
            setupContainer(questionName, current, count);
        }
    }
    
    //the question, the answer and the amount of the answers are being saved in an object container and then pushed into an array, which later contains every answer and the amount these answers have been given by a participant, the container is then being emptied so that a new set of data can be pushed into the array
    function setupContainer(question, answer, value) {
        container.question = question;
        container.answer = answer;
        container.value = value;
        currData.push(container);
        container = {};
    }
    
    //process the data so that all answers from a participant can be saved in the same object and to make it easier to later compare the data of the dots with the data of the outer and inner ring
    function processDotsData(rawData) {
        for (let i = 0; i < rawData.length; i++){
            var dataValue  = rawData[i]["RespondentID"],
                travelFreq = rawData[i]["How often do you travel by plane?"],
                reclOwnSeat = rawData[i]["Do you ever recline your seat when you fly?"],
                height = rawData[i]["How tall are you?"],
                childUnder18 = rawData[i]["Do you have any children under 18?"],
                threeSeatArmRest = rawData[i]["In a row of three seats, who should get to use the two arm rests?"],
                twoSeatArmRest = rawData[i]["In a row of two seats, who should get to use the middle arm rest?"],
                windowShadeControl = rawData[i]["Who should have control over the window shade?"],
                moveToUnsoldSeat = rawData[i]["Is it rude to move to an unsold seat on a plane?"],
                speakWithStranger = rawData[i]["Generally speaking, is it rude to say more than a few words to the stranger sitting next to you on a plane?"],
                howOftenGetUp = rawData[i]["On a 6 hour flight from NYC to LA, how many times is it acceptable to get up if you're not in an aisle seat?"],
                obligationWhenReclining = rawData[i]["Under normal circumstances, does a person who reclines their seat during a flight have any obligation to the person sitting behind them?"],
                rudeToRecline = rawData[i]["Is it rude to recline your seat on a plane?"],
                eliminateReclining = rawData[i]["Given the opportunity, would you eliminate the possibility of reclining seats on planes entirely?"],
                switchSeatForFriends = rawData[i]["Is it rude to ask someone to switch seats with you in order to be closer to friends?"],
                switchSeatForFamily = rawData[i]["Is it rude to ask someone to switch seats with you in order to be closer to family?"],
                wakePassengerForBathroom = rawData[i]["Is it rude to wake a passenger up if you are trying to go to the bathroom?"],
                wakePassengerForWalking = rawData[i]["Is it rude to wake a passenger up if you are trying to walk around?"],
                rudeToBringBaby = rawData[i]["In general, is it rude to bring a baby on a plane?"],
                rudeToBringUnrulyChild = rawData[i]["In general, is it rude to knowingly bring unruly children on a plane?"],
                violationElectronics = rawData[i]["Have you ever used personal electronics during take off or landing in violation of a flight attendant's direction?"],
                violationSmoking = rawData[i]["Have you ever smoked a cigarette in an airplane bathroom when it was against the rules?"],
                gender = rawData[i]["Gender"],
                age = rawData[i]["Age"],
                householdIncome = rawData[i]["Household Income"],
                education = rawData[i]["Education"],
                location = rawData[i]["Location (Census Region)"];
            
            dataArray[i] = {"value": dataValue,
                            "How often do you travel by plane?": travelFreq,
                            "Do you ever recline your seat when you fly?": reclOwnSeat,
                            "How tall are you?": height,
                            "Do you have any children under 18?": childUnder18,
                            "In a row of three seats, who should get to use the two arm rests?": threeSeatArmRest,
                            "In a row of two seats, who should get to use the middle arm rest?": twoSeatArmRest,
                            "Who should have control over the window shade?": windowShadeControl,
                            "Is it rude to move to an unsold seat on a plane?": moveToUnsoldSeat,
                            "Generally speaking, is it rude to say more than a few words to the stranger sitting next to you on a plane?": speakWithStranger,
                            "On a 6 hour flight from NYC to LA, how many times is it acceptable to get up if you're not in an aisle seat?": howOftenGetUp,
                            "Under normal circumstances, does a person who reclines their seat during a flight have any obligation to the person sitting behind them?": obligationWhenReclining,
                            "Is it rude to recline your seat on a plane?": rudeToRecline,
                            "Given the opportunity, would you eliminate the possibility of reclining seats on planes entirely?": eliminateReclining,
                            "Is it rude to ask someone to switch seats with you in order to be closer to friends?": switchSeatForFriends,
                            "Is it rude to ask someone to switch seats with you in order to be closer to family?": switchSeatForFamily,
                            "Is it rude to wake a passenger up if you are trying to go to the bathroom?": wakePassengerForBathroom,
                            "Is it rude to wake a passenger up if you are trying to walk around?": wakePassengerForWalking,
                            "In general, is it rude to bring a baby on a plane?": rudeToBringBaby,
                            "In general, is it rude to knowingly bring unruly children on a plane?": rudeToBringUnrulyChild,
                            "Have you ever used personal electronics during take off or landing in violation of a flight attendant's direction?": violationElectronics,
                            "Have you ever smoked a cigarette in an airplane bathroom when it was against the rules?": violationSmoking,
                            "Gender": gender,
                            "Age": age,
                            "Household Income": householdIncome,
                            "Education": education,
                            "Location (Census Region)": location};
        }
    }
    
    that.setupCsvData = setupCsvData;
    that.getInnerRingData = getInnerRingData;
    that.getOuterRingData = getOuterRingData;
    that.getProcessedDotsData = getProccessedDotsData;
    return that;
};
