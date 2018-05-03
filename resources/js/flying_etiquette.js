/* eslint-env browser */

var FlyingEtiquette = FlyingEtiquette || {};
FlyingEtiquette = (function() {
    "use strict";
    
    var that = {};
    
    function init() {
        var startDiagramBox = document.querySelector(".startDiagramBox"),
            startDiagramSvg = document.querySelector(".startDiagram");
        initStartDiagram(startDiagramBox, startDiagramSvg);
    }
    
    function initStartDiagram(diagramBox, diagramSvg) {
        var startDiagramManager = new FlyingEtiquette.StartDiagramManager(diagramBox, diagramSvg);
        startDiagramManager.setupCsvData();
    }
    
    that.init = init;
    return that;
    }());