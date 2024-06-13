# Velocity Script
After Effects script that allows you to animate time-remapping using speed slider.  
![image](https://github.com/eirisocherry/velocity-script/assets/115040224/81934aea-8e62-4647-97d9-1a03598343e3)  


## Installation
1. Download the `Velocity_Script.jsx` script.  
2. Move the file to:  
   - Windows: `C:\Program Files\Adobe\Adobe After Effects <version>\Support Files\Scripts\ScriptUI Panels`  
   - macOS: `/Applications/Adobe After Effects <version>/Scripts/ScriptUI Panels`  
3. Restart After Effects.  

## Usage
1. Open After Effects.  
2. Go to `Window`, scroll all the way down and open `Velocity_Script.jsx`.  
3. The Velocity Script panel will open. It's dockable.  

### Buttons
- **[Add Velocity]** Adds velocity.  
- - **Regular**: default time-remapping.  
- - **Advanced**: time-remapping with a speed slider.  
![image](https://github.com/eirisocherry/velocity-script/assets/115040224/31f331f9-3a6d-487e-9cfa-2fbbfc3cc8fd)  
- **[Split]** Splits the layer and removes useless velocity keyframes.  
- **[=]** Opens the 'minimal speed' calculator.  
- **[?]** Shows some information.  
- **[x]** Removes the velocity.  

### Controllers
**Speed (%):** playback speed.  
**Offset:** frame offset (the value shows the real frame offset only with 1000fps footage, with other framerates it shows 1000/<layer_fps> times higher value).  
**Time-reverse layer:** reverse playback, play the source from end to start.  
**Graph support (SLOW!):** audio only controller, <0> force linear keyframe interpolation, <1> graph support (make sure to set comp fps to 30+, otherwise your audio will stutter a lot)  

![image](https://github.com/eirisocherry/velocity-script/assets/115040224/cfd2bc86-881b-4be8-9cba-527ccea5083f)  

## Support
Author: https://youtube.com/@shy_rikki  
Useful stuff: http://motionscript.com/articles/speed-control.html  
If you have any questions or found a bug, please create an issue in this repository or dm me in discord: `shy_rikki`  
