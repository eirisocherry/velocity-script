


// -------------------Code-------------------

function Velocity(thisObj) {

    // -------------------Global variables-------------------

    // About
    var name = "Velocity Script";
    var version = "1.0";

    // Build UI
    var dropdownMenuSelection;

    // Solver UI
    var sourceFPSDefault;
    var compFPSDefault;
    var compFPSValue;
    var sourceFPSValue;

    // Misc
    var alertMessage = [];

    // -------------------UI-------------------

    function buildUI(thisObj) {

        // -------------------UI-------------------

        var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", name + " " + version, undefined, { resizeable: true });

        // UI elements
        res = "group\
            {\
                orientation:'column', alignment:['fill','center'], alignChildren:['fill','fill'],\
                textGroup: Group\
                {\
                    orientation:'column',\
                    staticText: StaticText{text: 'Velocity Script by Rikki'}\
                }\
                velocityGroup: Group\
                {\
                    orientation:'row', alignChildren:['fill','center'],\
                    addVelocityButton: Button{text: 'Add Velocity'}\
                    typeDropdown: DropDownList{properties:{items:['Regular', 'Advanced']}},\
                }\
                splitGroup: Group\
                {\
                    orientation:'column', alignChildren:['fill','center'],\
                    splitButton: Button{text: 'Split'}\
                }\
                settingsGroup: Group\
                {\
                    orientation:'row', alignment:['right','center'],\
                    solveButton: Button{text: '=', maximumSize:[25,25]}\
                    helpButton: Button{text: '?', maximumSize:[25,25]},\
                    deleteVelocityButton: Button{text: 'x', maximumSize:[25,25]},\
                }\
            }";

        // Add UI elements to the panel
        myPanel.grp = myPanel.add(res);
        // Refresh the panel
        myPanel.layout.layout(true);
        // Set minimal panel size
        myPanel.grp.minimumSize = myPanel.grp.size;
        // Add panel resizing function 
        myPanel.layout.resize();
        myPanel.onResizing = myPanel.onResize = function () {
            this.layout.resize();
        }

        // -------------------Buttons-------------------

        myPanel.grp.velocityGroup.addVelocityButton.onClick = function () {
            switch (dropdownMenuSelection) {
                case 'Regular':
                    addRegularVelocityButton();
                    break;

                case 'Advanced':
                    addVelocityButton();
                    break;

                default:
                    alert("Select which type of velocity you want to add first. (Regular or Advanced)")
                    break;
            }
        }

        myPanel.grp.velocityGroup.typeDropdown.selection = 0;
        dropdownMenuSelection = myPanel.grp.velocityGroup.typeDropdown.selection.text;
        myPanel.grp.velocityGroup.typeDropdown.onChange = function () {
            dropdownMenuSelection = myPanel.grp.velocityGroup.typeDropdown.selection.text;
        }

        myPanel.grp.splitGroup.splitButton.onClick = function () {
            splitButton();
        }

        myPanel.grp.settingsGroup.solveButton.onClick = function () {
            solverUI();
        }

        myPanel.grp.settingsGroup.helpButton.onClick = function () {
            alertShow(
                "Author: youtube.com/@shy_rikki\n" +
                "Source: github.com/eirisocherry/velocity-script"
            );
        }

        myPanel.grp.settingsGroup.deleteVelocityButton.onClick = function () {
            deleteVelocityButton();
        }

        return myPanel;
    }

    // Create Solver UI
    createSolverUI();
    defaultValues();

    function createSolverUI(thisObj) {

        // -------------------UI-------------------

        var settingsPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Solver", undefined, { resizeable: true });

        // UI elements
        var res = "group\
        {\
            orientation:'column', alignment:['fill','center'], alignChildren:['fill','fill'],\
            inputGroup: Group\
            {\
                orientation:'column', alignment:['fill','center'], alignChildren:['fill','center'],\
                sourceFPS: Group\
                {\
                    orientation:'row', alignChildren:['fill','center'],\
                    staticText1: StaticText{text: 'Source FPS:'},\
                    inputBox1: EditText{characters: 10}\
                },\
                compFPS: Group\
                {\
                    orientation:'row', alignChildren:['fill','center'],\
                    staticText2: StaticText{text: 'Composition FPS:'},\
                    inputBox2: EditText{characters: 10}\
                },\
                textGroup: Group\
                {\
                    orientation:'column',\
                    staticText3: StaticText{text: 'Formula: 100%/(sourceFPS/compFPS)'}\
                },\
            },\
            solveButtonGroup: Group\
            {\
                orientation:'column', alignChildren:['fill','center'],\
                solveButton: Button{text: 'Solve'}\
            },\
            buttonsGroup: Group\
            {\
                orientation:'row', alignChildren:['fill','center'],\
                okButton: Button{text: 'Ok'},\
                updateButton: Button{text: 'Update'},\
            }\
        }";

        // Add UI elements to the panel
        settingsPanel.grp = settingsPanel.add(res);

        // Refresh the panel
        settingsPanel.layout.layout(true);
        settingsPanel.layout.resize();
        settingsPanel.onResizing = settingsPanel.onResize = function () {
            this.layout.resize();
        };

        // -------------------Buttons-------------------

        settingsPanel.grp.solveButtonGroup.solveButton.onClick = function () {
            newDefaultValues();
            solveButton();
        };

        settingsPanel.grp.buttonsGroup.okButton.onClick = function () {
            defaultValues();
            settingsPanel.hide();
        };

        settingsPanel.grp.buttonsGroup.updateButton.onClick = function () {
            defaultValues();
        };

        // -------------------Functions-------------------

        defaultValues = function () {
            var comp = app.project.activeItem;

            if (!(comp instanceof CompItem)) {
                compFPSValue = 24;
            } else {
                compFPSValue = comp.frameRate;
            }

            if ((comp instanceof CompItem) && comp.selectedLayers.length != 0) {
                var mainLayer = comp.selectedLayers[0];

                if (mainLayer && mainLayer.hasVideo) {
                    sourceFPSValue = mainLayer.source.frameRate;
                } else {
                    sourceFPSValue = 500;
                }

            } else {
                sourceFPSValue = 500;
            }

            settingsPanel.grp.inputGroup.sourceFPS.inputBox1.text = sourceFPSValue;
            sourceFPSDefault = parseFloat(settingsPanel.grp.inputGroup.sourceFPS.inputBox1.text);

            settingsPanel.grp.inputGroup.compFPS.inputBox2.text = compFPSValue;
            compFPSDefault = parseFloat(settingsPanel.grp.inputGroup.compFPS.inputBox2.text);
        }

        newDefaultValues = function () {
            var sourceFPSInput = parseFloat(settingsPanel.grp.inputGroup.sourceFPS.inputBox1.text);
            if (!isNaN(sourceFPSInput)) {
                sourceFPSDefault = sourceFPSInput;
            } else {
                settingsPanel.grp.inputGroup.sourceFPS.inputBox1.text = sourceFPSValue;
                sourceFPSDefault = parseFloat(settingsPanel.grp.inputGroup.sourceFPS.inputBox1.text);
                alert("Error: 'Source FPS' is not a number or empty, resetting back to " + settingsPanel.grp.inputGroup.sourceFPS.inputBox1.text);
            }

            var compFPSInput = parseFloat(settingsPanel.grp.inputGroup.compFPS.inputBox2.text);
            if (!isNaN(compFPSInput)) {
                compFPSDefault = compFPSInput;
            } else {
                settingsPanel.grp.inputGroup.compFPS.inputBox2.text = compFPSValue;
                compFPSDefault = parseFloat(settingsPanel.grp.inputGroup.compFPS.inputBox2.text);
                alert("Error: 'Composition FPS' is not a number or empty, resetting back to " + settingsPanel.grp.inputGroup.compFPS.inputBox2.text);
            }
        }

        solveButton = function () {
            var minimalSpeed = 100 / (sourceFPSDefault / compFPSDefault);;
            alert(
                "Recommended minimal speed: " + minimalSpeed.toFixed(2) + "% (~" + Math.ceil(minimalSpeed) + "%)\n" +
                "Formula: 100% / ( layerFPS: " + sourceFPSDefault + " / compFPS: " + compFPSDefault + " )\n" +
                "Increase the speed if you still see identical frames.");
        }

        solverUI = function () {
            defaultValues();
            if (settingsPanel && settingsPanel.visible) {
                settingsPanel.hide();
            } else if (settingsPanel) {
                settingsPanel.show();
            } else {
                alert("Settings panel is not available.");
            }
        }

        settingsPanel.onClose = function () {
            defaultValues();;
        };

        return settingsPanel;
    }

    // -------------------Button functions-------------------

    function addRegularVelocityButton() {

        // -------------------Checkers-------------------

        var comp = app.project.activeItem;

        if (!(comp instanceof CompItem)) {
            alert("Open a composition first.");
            return;
        }
        if (comp.selectedLayers.length === 0) {
            alert("Select a video you want apply velocity to.");
            return;
        }

        if (comp.selectedLayers.length > 1) {
            var confirmDelete = confirm("Applying velocity to several layers at once might cause AE to crash.\n\n" +
            "Still continue?");
            if (!confirmDelete) {
                return;
            }
        }

        // -------------------Add velocity-------------------

        app.beginUndoGroup("Add regular velocity");

        var errorCollector = false;

        var selectedLayersAmount = comp.selectedLayers.length;
        for (var i = selectedLayersAmount - 1; i >= 0; i--) {

            var mainLayer = comp.selectedLayers[i];

            if (!mainLayer.hasVideo) {
                alertPush('[' + mainLayer.index + '] "' + mainLayer.name + '" is not a video.');
                errorCollector = true;
                continue;
            }

            if (!mainLayer.canSetTimeRemapEnabled) {
                alertPush('[' + mainLayer.index + '] "' + mainLayer.name + '" doesn\'t support velocity.');
                errorCollector = true;
                continue;
            }

            if (mainLayer.timeRemapEnabled) {
                var confirmReapply = confirm(
                    'Velocity is already applied to [' + mainLayer.index + '] "' + mainLayer.name + '"\n' +
                    'Do you want to reapply it?.');
                if (!confirmReapply) {
                    continue;
                }
            }

            if (mainLayer.timeRemapEnabled) {
                mainLayer.timeRemap.expression = '';
                mainLayer.timeRemapEnabled = false;
            }

            deleteEffects(mainLayer, ["Speed (%)", "Offset", "Time-reverse layer"]);

            var mainLayerInPoint = mainLayer.inPoint;
            var mainLayerOutPoint = mainLayer.outPoint;
            var mainLayerStartTime = mainLayer.startTime;
            var compFrameDuration = comp.frameDuration;
            var timeRemap = mainLayer.property("Time Remap");
            mainLayer.timeRemapEnabled = true;

            // Set keyframes and get their indices
            timeRemap.setValueAtTime(mainLayerInPoint, mainLayerInPoint - mainLayerStartTime);
            var firstKeyframeIndex = timeRemap.nearestKeyIndex(mainLayerInPoint);

            timeRemap.setValueAtTime(mainLayerOutPoint - compFrameDuration, mainLayerOutPoint - mainLayerStartTime - compFrameDuration);
            var secondKeyframeIndex = timeRemap.nearestKeyIndex(mainLayerOutPoint - compFrameDuration);

            // Store the indices of the keyframes we want to keep
            var keyIndicesToKeep = [
                firstKeyframeIndex,
                secondKeyframeIndex
            ];

            // Remove all keyframes except the ones we want to keep
            for (var j = timeRemap.numKeys; j > 0; j--) {
                if (keyIndicesToKeep.indexOf(j) === -1) {
                    timeRemap.removeKey(j);
                }
            }

            mainLayer.inPoint = mainLayerInPoint;
            mainLayer.outPoint = mainLayerOutPoint;
        }

        if (errorCollector) {
            alertShow();
        }

        app.endUndoGroup();
    }

    function addVelocityButton() {

        // -------------------Checkers-------------------

        var comp = app.project.activeItem;

        if (!(comp instanceof CompItem)) {
            alert("Open a composition first.");
            return;
        }
        if (comp.selectedLayers.length === 0) {
            alert("Select a video you want apply velocity to.");
            return;
        }

        if (comp.selectedLayers.length > 1) {
            var confirmDelete = confirm("Applying velocity to several layers at once might cause AE to crash.\n\n" +
            "Still continue?");
            if (!confirmDelete) {
                return;
            }
        }

        // -------------------Add velocity-------------------

        app.beginUndoGroup("Add velocity");

        var errorCollector = false;

        var selectedLayersAmount = comp.selectedLayers.length;
        for (var i = selectedLayersAmount - 1; i >= 0; i--) {

            var mainLayer = comp.selectedLayers[i];

            if (!mainLayer.hasVideo) {
                alertPush('[' + mainLayer.index + '] "' + mainLayer.name + '" is not a video.');
                errorCollector = true;
                continue;
            }

            if (!mainLayer.canSetTimeRemapEnabled) {
                alertPush('[' + mainLayer.index + '] "' + mainLayer.name + '" doesn\'t support velocity.');
                errorCollector = true;
                continue;
            }

            if (mainLayer.timeRemapEnabled) {
                var confirmReapply = confirm(
                    'Velocity is already applied to [' + mainLayer.index + '] "' + mainLayer.name + '"\n' +
                    'Do you want to reapply it?.');
                if (!confirmReapply) {
                    continue;
                }
            }

            if (mainLayer.timeRemapEnabled) {
                mainLayer.timeRemap.expression = '';
                mainLayer.timeRemapEnabled = false;
            }

            deleteEffects(mainLayer, ["Speed (%)", "Offset", "Time-reverse layer"]);

            var speedSlider = mainLayer.Effects.addProperty("Slider Control");
            speedSlider.name = "Speed (%)";
            speedSlider.property("Slider").setValue(100);
            speedSlider.property("Slider").setValueAtTime(mainLayer.inPoint - comp.frameDuration, 100);

            var offsetSlider = mainLayer.Effects.addProperty("Slider Control");
            offsetSlider.name = "Offset";
            offsetSlider.property("Slider").setValue(0);

            var timeReverseCheckbox = mainLayer.Effects.addProperty("Checkbox Control");
            timeReverseCheckbox.name = "Time-reverse layer";
            timeReverseCheckbox.property("Checkbox").setValue(0);

            var velocityExpression =
                '// Variables\n' +
                'var speedControl = effect("Speed (%)")("Slider");\n' +
                'var numberOfSpeedKeyframes = speedControl.numKeys;\n' +
                'var offsetControl = effect("Offset")("Slider");\n' +
                'var offsetValue = offsetControl.value/1000;\n' +
                'var inverseControl = effect("Time-reverse layer")("Checkbox");\n' +
                'var timeRemapFirstKeyTime = timeRemap.key(1).time;\n' +
                'var firstOffset = 0;\n' +
                'var timeOffset = 0;\n' +
                'var lastOffset = 0;\n' +
                'var finalTime = 0;\n' +
                'var inversedTime = 0;\n' +
                'var layerDuration = thisLayer.source.duration;\n' +
                'var fixedLayerDuration = thisLayer.source.duration - thisLayer.source.frameDuration;\n' +
                '\n' +
                '// Frame by frame interpolation\n' +
                'if (numberOfSpeedKeyframes > 0 && speedControl.key(1).time < time) {\n' +
                '    // Area before the first keyframe\n' +
                '    var firstKeyframeTime = speedControl.key(1).time;\n' +
                '    var firstKeyframeValue = speedControl.key(1).value;\n' +
                '    if (firstKeyframeTime - timeRemapFirstKeyTime > 0) {\n' +
                '        firstOffset = (firstKeyframeValue - 100) * (firstKeyframeTime - timeRemapFirstKeyTime);\n' +
                '    }\n' +
                '\n' +
                '    // Area after the last keyframe\n' +
                '    var lastKeyframeTime = speedControl.key(numberOfSpeedKeyframes).time;\n' +
                '    var lastKeyframeValue = speedControl.key(numberOfSpeedKeyframes).value;\n' +
                '    if (time - lastKeyframeTime > 0) {\n' +
                '        lastOffset = (lastKeyframeValue - 100) * (time - lastKeyframeTime);\n' +
                '    }\n' +
                '\n' +
                '    // Area between the first and the latest keyframes\n' +
                '    if (time - lastKeyframeTime < 0) {\n' +
                '        for (var t = timeToFrames(firstKeyframeTime); t < timeToFrames(time); t++) {\n' +
                '            var currentSpeed = speedControl.valueAtTime(framesToTime(t)) - 100;\n' +
                '            timeOffset += currentSpeed * thisComp.frameDuration;\n' +
                '        }\n' +
                '    } else {\n' +
                '        for (var t = timeToFrames(firstKeyframeTime); t < timeToFrames(lastKeyframeTime); t++) {\n' +
                '            var currentSpeed = speedControl.valueAtTime(framesToTime(t)) - 100;\n' +
                '            timeOffset += currentSpeed * thisComp.frameDuration;\n' +
                '        }\n' +
                '    }\n' +
                '\n' +
                '    // Final result\n' +
                '    finalTime = time - timeRemapFirstKeyTime + offsetValue + (firstOffset + timeOffset + lastOffset) * 0.01;\n' +
                '} else {\n' +
                '    // Add area before 1st keyframe (or whole area if no keyframes)\n' +
                '    finalTime = (time - timeRemapFirstKeyTime) * speedControl.value * 0.01 + offsetValue;\n' +
                '}\n' +
                '\n' +
                '// Time-reverse layer?\n' +
                'if (inverseControl.value == 1) {\n' +
                '   finalTime =  layerDuration - finalTime;\n' +
                '} else {\n' +
                '   finalTime;\n' +
                '}\n' +
                '\n' +
                '// Limit duration to the last frame\n' +
                'if (finalTime > fixedLayerDuration){\n' +
                '	finalTime = fixedLayerDuration;\n' +
                '} else {\n' +
                '	finalTime;\n' +
                '}';

            var mainLayerinPoint = mainLayer.inPoint;
            var mainLayeroutPoint = mainLayer.outPoint;
            var timeRemap = mainLayer.property("Time Remap");
            mainLayer.timeRemapEnabled = true;
            timeRemap.expression = velocityExpression;
            if (timeRemap.numKeys == 2) {
                timeRemap.removeKey(2);
            }
            mainLayer.inPoint = mainLayerinPoint;
            mainLayer.outPoint = mainLayeroutPoint;
        }

        if (errorCollector) {
            alertShow();
        }

        app.endUndoGroup();
    }

    function splitButton() {

        // -------------------Checkers-------------------

        var comp = app.project.activeItem;
        var mainLayer = comp.selectedLayers[0];
        var currentTime = comp.time;
        var compFrameDuration = comp.frameDuration;
        var mainLayerOutPoint = mainLayer.outPoint;
        var mainLayerInPoint = mainLayer.inPoint;

        if (!(comp instanceof CompItem)) {
            alert("Open a composition first.");
            return;
        }
        if (comp.selectedLayers.length === 0) {
            alert("Select a video with velocity.");
            return;
        }
        if (comp.selectedLayers.length > 1) {
            alert("Select only one video with velocity.");
            return;
        }

        if (!mainLayer.hasVideo) {
            alert("This layer doesn't support velocity. Precomp it first.");
            return;
        }

        if (!mainLayer.timeRemapEnabled) {
            alert("Add velocity to the layer first.");
            return;
        }

        if (currentTime <= mainLayerInPoint || currentTime >= mainLayerOutPoint) {
            alert("You can't split a layer outside its duration.");
            return;
        }

        var splitMode;
        var offsetEffectExist = effectsExistance(mainLayer, ["Speed (%)", "Offset", "Time-reverse layer"]);
        if (offsetEffectExist && mainLayer.timeRemapEnabled && mainLayer.property("Time Remap").expression !== "") {
            splitMode = "Advanced";
        } else {
            splitMode = "Regular";
        }

        // -------------------Split-------------------

        app.beginUndoGroup("Split");

        // Dublicate the layer
        mainLayer.outPoint = currentTime;
        var duplicatedLayer = mainLayer.duplicate();
        duplicatedLayer.inPoint = currentTime;
        duplicatedLayer.outPoint = mainLayerOutPoint;

        switch (splitMode) {
            case 'Regular':

                // Read time remap value on main layer
                var mainLayerTimeRemap = mainLayer.property("Time Remap");
                var timeRemapValue = mainLayerTimeRemap.valueAtTime(currentTime, true);
                var timeRemapValueBehind = mainLayerTimeRemap.valueAtTime(currentTime-compFrameDuration, true);

                // Remove all keyframes from current to the right on main layer
                mainLayerTimeRemap.setValueAtTime(currentTime-compFrameDuration, timeRemapValueBehind);
                var mainLayerCurrentKeyframeIndex = mainLayerTimeRemap.nearestKeyIndex(currentTime-compFrameDuration);
                for (var i = mainLayerTimeRemap.numKeys; i > mainLayerCurrentKeyframeIndex; i--) {
                    mainLayerTimeRemap.removeKey(i);
                }

                // Add keyframe on dublicated layer
                var duplicatedLayerTimeRemap = duplicatedLayer.property("Time Remap");
                duplicatedLayerTimeRemap.setValueAtTime(currentTime, timeRemapValue);
                var dublicateLayerCurrentKeyframeIndex = duplicatedLayerTimeRemap.nearestKeyIndex(currentTime);

                // Remove all keyframes from left to the current on dublicated layer 
                for (var i = dublicateLayerCurrentKeyframeIndex - 1; i > 0; i--) {
                    duplicatedLayerTimeRemap.removeKey(i);
                }

                break;

            case 'Advanced':

                // -------------------Offset-------------------

                var sliderControl = mainLayer.property("Effects").addProperty("ADBE Slider Control");
                var getOffsetExpression =
                    '// Variables\n' +
                    'var speedControl = effect("Speed (%)")("Slider");\n' +
                    'var numberOfSpeedKeyframes = speedControl.numKeys;\n' +
                    'var offsetControl = effect("Offset")("Slider");\n' +
                    'var offsetValue = offsetControl.value/1000;\n' +
                    'var inverseControl = effect("Time-reverse layer")("Checkbox");\n' +
                    'var timeRemapFirstKeyTime = timeRemap.key(1).time;\n' +
                    'var firstOffset = 0;\n' +
                    'var timeOffset = 0;\n' +
                    'var lastOffset = 0;\n' +
                    'var finalTime = 0;\n' +
                    'var inversedTime = 0;\n' +
                    'var layerDuration = thisLayer.source.duration;\n' +
                    'var fixedLayerDuration = thisLayer.source.duration - thisLayer.source.frameDuration;\n' +
                    '\n' +
                    '// Frame by frame interpolation\n' +
                    'if (numberOfSpeedKeyframes > 0 && speedControl.key(1).time < time) {\n' +
                    '    // Area before the first keyframe\n' +
                    '    var firstKeyframeTime = speedControl.key(1).time;\n' +
                    '    var firstKeyframeValue = speedControl.key(1).value;\n' +
                    '    if (firstKeyframeTime - timeRemapFirstKeyTime > 0) {\n' +
                    '        firstOffset = (firstKeyframeValue - 100) * (firstKeyframeTime - timeRemapFirstKeyTime);\n' +
                    '    }\n' +
                    '\n' +
                    '    // Area after the last keyframe\n' +
                    '    var lastKeyframeTime = speedControl.key(numberOfSpeedKeyframes).time;\n' +
                    '    var lastKeyframeValue = speedControl.key(numberOfSpeedKeyframes).value;\n' +
                    '    if (time - lastKeyframeTime > 0) {\n' +
                    '        lastOffset = (lastKeyframeValue - 100) * (time - lastKeyframeTime);\n' +
                    '    }\n' +
                    '\n' +
                    '    // Area between the first and the latest keyframes\n' +
                    '    if (time - lastKeyframeTime < 0) {\n' +
                    '        for (var t = timeToFrames(firstKeyframeTime); t < timeToFrames(time); t++) {\n' +
                    '            var currentSpeed = speedControl.valueAtTime(framesToTime(t)) - 100;\n' +
                    '            timeOffset += currentSpeed * thisComp.frameDuration;\n' +
                    '        }\n' +
                    '    } else {\n' +
                    '        for (var t = timeToFrames(firstKeyframeTime); t < timeToFrames(lastKeyframeTime); t++) {\n' +
                    '            var currentSpeed = speedControl.valueAtTime(framesToTime(t)) - 100;\n' +
                    '            timeOffset += currentSpeed * thisComp.frameDuration;\n' +
                    '        }\n' +
                    '    }\n' +
                    '\n' +
                    '    // Final result\n' +
                    '    finalTime = time - timeRemapFirstKeyTime + offsetValue + (firstOffset + timeOffset + lastOffset) * 0.01;\n' +
                    '} else {\n' +
                    '    // Add area before 1st keyframe (or whole area if no keyframes)\n' +
                    '    finalTime = (time - timeRemapFirstKeyTime) * speedControl.value * 0.01 + offsetValue;\n' +
                    '}\n' +
                    '\n' +
                    'if (numberOfSpeedKeyframes > 0 && speedControl.key(1).time < time) {\n' +
                    '    (firstOffset + timeOffset + lastOffset)*0.01*1000 + offsetControl.value\n' +
                    '} else {\n' +
                    '    if (time - timeRemapFirstKeyTime > 0) {\n' +
                    '       firstOffset = (speedControl.value - 100) * (time - timeRemapFirstKeyTime);\n' +
                    '   }\n' +
                    '   (firstOffset)*0.01*1000 + offsetControl.value;\n' +
                    '}';

                // Get offset value
                sliderControl.property("Slider").expression = getOffsetExpression;
                var calculatedOffsetValue = sliderControl.property("Slider").value;
                sliderControl.remove();

                // Remove all offset keyframes on dublicated layer
                var duplicatedLayerOffsetSlider = duplicatedLayer.property("Effects").property("Offset").property("Slider");
                if (duplicatedLayerOffsetSlider.numKeys > 0) {
                    for (var i = duplicatedLayerOffsetSlider.numKeys; i > 0; i--) {
                        duplicatedLayerOffsetSlider.removeKey(i);
                    }
                }

                // Apply offset value on dublicated layer
                duplicatedLayerOffsetSlider.setValue(calculatedOffsetValue);

                // -------------------Speed-------------------

                // Remove all speed keyframes from current to the right on main layer
                var mainLayerSpeedSlider = mainLayer.property("Effects").property("Speed (%)").property("Slider");
                var speedValue = mainLayerSpeedSlider.valueAtTime(currentTime, true);
                var speedValueBehind = mainLayerSpeedSlider.valueAtTime(currentTime-compFrameDuration, true);
                if (mainLayerSpeedSlider.numKeys > 0) {
                    mainLayerSpeedSlider.setValueAtTime(currentTime-compFrameDuration, speedValueBehind);
                    var mainLayerCurrentKeyframeIndex = mainLayerSpeedSlider.nearestKeyIndex(currentTime-compFrameDuration);
                    for (var i = mainLayerSpeedSlider.numKeys; i > mainLayerCurrentKeyframeIndex; i--) {
                        mainLayerSpeedSlider.removeKey(i);
                    }
                }

                // Remove all offset keyframes from current to the right on main layer
                var mainLayerOffsetSlider = mainLayer.property("Effects").property("Offset").property("Slider");
                var offsetValueBehind = mainLayerOffsetSlider.valueAtTime(currentTime-compFrameDuration, true);
                if (mainLayerOffsetSlider.numKeys > 0) {
                    mainLayerOffsetSlider.setValueAtTime(currentTime-compFrameDuration, offsetValueBehind);
                    var mainLayerCurrentKeyframeIndex = mainLayerOffsetSlider.nearestKeyIndex(currentTime-compFrameDuration);
                    for (var i = mainLayerOffsetSlider.numKeys; i > mainLayerCurrentKeyframeIndex; i--) {
                        mainLayerOffsetSlider.removeKey(i);
                    }
                }

                // Add speed keyframe on dublicated layer
                var duplicatedLayerSpeedSlider = duplicatedLayer.property("Effects").property("Speed (%)").property("Slider");
                duplicatedLayerSpeedSlider.setValueAtTime(currentTime, speedValue);
                var currentSpeedKeyframeIndex = duplicatedLayerSpeedSlider.nearestKeyIndex(currentTime);

                // Remove all speed keyframes from left to the current on dublicated layer
                if (duplicatedLayerSpeedSlider.numKeys > 1) {
                    var currentSpeedKeyframeIndex = duplicatedLayerSpeedSlider.nearestKeyIndex(currentTime);
                    for (var i = currentSpeedKeyframeIndex - 1; i > 0; i--) {
                        duplicatedLayerSpeedSlider.removeKey(i);
                    }
                }
                // Set initial speed keyframe on dublicated layer
                duplicatedLayerSpeedSlider.setValueAtTime(currentTime - compFrameDuration, 100);

                break;
        }

        // Adjust selection
        mainLayer.selected = false;
        duplicatedLayer.selected = true;

        app.endUndoGroup();
    }

    function deleteVelocityButton() {

        // -------------------Checkers-------------------

        var comp = app.project.activeItem;

        if (!(comp instanceof CompItem)) {
            alert("Open a composition first.");
            return;
        }

        if (comp.selectedLayers.length === 0) {
            alert("Select a video you want to remove velocity from.");
            return;
        }

        if (comp.selectedLayers.length > 1) {
            var confirmDelete = confirm("Deleting velocity from several layers at once might cause AE to crash.\n\n" +
            "Still continue?");
            if (!confirmDelete) {
                return;
            }
        }

        // -------------------Delete velocity-------------------

        app.beginUndoGroup("Delete Velocity");

        var errorCollector = false;

        var selectedLayersAmount = comp.selectedLayers.length;
        for (var i = selectedLayersAmount - 1; i >= 0; i--) {

            var mainLayer = comp.selectedLayers[i];

            if (!mainLayer.hasVideo) {
                alertPush('[' + mainLayer.index + '] "' + mainLayer.name + '" is not a video.');
                errorCollector = true;
                continue;
            }

            var offsetEffectExist = effectsExistance(mainLayer, ["Speed (%)", "Offset", "Time-reverse layer"]);
            if (!offsetEffectExist && !mainLayer.timeRemapEnabled) {
                alertPush('[' + mainLayer.index + '] "' + mainLayer.name + '" has nothing to delete.');
                errorCollector = true;
                continue;
            }

            // Disable time remap
            if (mainLayer.timeRemapEnabled) {
                mainLayer.timeRemap.expression = '';
                mainLayer.timeRemapEnabled = false;
            }

            // Delete controllers
            if (offsetEffectExist) {
                deleteEffects(mainLayer, ["Speed (%)", "Offset", "Time-reverse layer"]);
            }

        }

        if (errorCollector) {
            alertShow();
        }

        mainLayer.selected = true;
        app.endUndoGroup();
    }

    // -------------------Small functions-------------------

    function effectsExistance(layer, effectsToCheck) {

        var isArray = effectsToCheck && typeof effectsToCheck.length === 'number' && typeof effectsToCheck !== 'string';
        if (!isArray) {
            effectsToCheck = [effectsToCheck];
        }

        var effects = layer.property("ADBE Effect Parade");
        var effectsExist = false;

        if (!layer.hasVideo) {
            return effectsExist;
        }

        for (var i = 0; i < effectsToCheck.length; i++) {
            for (var j = 1; j <= effects.numProperties; j++) {
                if (effects.property(j).name.indexOf(effectsToCheck[i]) !== -1) {
                    effectsExist = true;
                    break;
                }
            }
            if (effectsExist) {
                break;
            }
        }

        return effectsExist;
    }

    function deleteEffects(layer, effectsToDelete) {
        var effects = layer.property("ADBE Effect Parade");
        for (var i = effects.numProperties; i >= 1; i--) {
            var effect = effects.property(i);
            for (var j = 0; j < effectsToDelete.length; j++) {
                if (effect.name.indexOf(effectsToDelete[j]) !== -1) {
                    effect.remove();
                    break;
                }
            }
        }
    }

    // Debug
    function alertPush(message) {
        alertMessage.push(message);
    }

    function alertShow(message) {

        alertMessage.push(message);

        if (alertMessage.length === 0) {
            return;
        }

        var allMessages = alertMessage.join("\n\n")

        var dialog = new Window("dialog", "Information");
        var textGroup = dialog.add("group");
        textGroup.orientation = "column";
        textGroup.alignment = ["fill", "top"];

        var text = textGroup.add("edittext", undefined, allMessages, { multiline: true, readonly: true });
        text.alignment = ["fill", "fill"];
        text.preferredSize.width = 300;
        text.preferredSize.height = 300;

        var closeButton = textGroup.add("button", undefined, "Close");
        closeButton.onClick = function () {
            dialog.close();
        };

        dialog.show();

        alertMessage = [];

    }

    // -------------------Show UI-------------------

    var myScriptPal = buildUI(thisObj);
    if ((myScriptPal != null) && (myScriptPal instanceof Window)) {
        myScriptPal.center();
        myScriptPal.show();
    }
    if (this instanceof Panel)
        myScriptPal.show();
}
Velocity(this);

// --------------------------------------
