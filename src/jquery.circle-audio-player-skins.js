//http://victorblog.com/html5-canvas-gradient-creator/ - help to generate gradiants


var CircleAudioPlayerSkins = CircleAudioPlayerSkins || {} ;

CircleAudioPlayerSkins.prototype = $.extend(CircleAudioPlayerSkins, {
    plane: {
            outerCircle: {color: "rgba(0,0,0,0)"},
            progressBar: {loadColor: "rgba(178,230,23,1)", fillColor: "#0095DA"},
            innerCircle: {color: "#F5F5F5", margin: 15},
            buttons: {playColor: '#666666', playHoverColor: '#0095DA', pauseColor: '#666666', pauseHoverColor: '#0095DA', soundLed:{color:'#666666', size: 1 } }
        },
    black: {
        outerCircle: {color: "gradient:linear:#585858:#A6A6A6"},
        progressBar: {loadColor: "rgba(255, 255, 255, 0.7)", fillColor: "gradient:radial:distribute-0,0.733,0.991:rgba(255, 238, 40, 1.000):rgba(130, 194, 238, 1.000):rgba(40, 40, 40, 1.000)", margin: 20, shadow:{type: 'inner'}},
        innerCircle: {color: "gradient:radial:#7f7f7f:#474646", margin: 35, shadow:{type: 'outer'}},
        buttons: {playColor: '#666666', playHoverColor: '#0095DA', pauseColor: '#666666', pauseHoverColor: '#0095DA', soundLed:{color:'#00ff00', size: 1 } }
    },
    green: {
        outerCircle: {color: "gradient:linear:#005400:#008000"},
        progressBar: {loadColor: "rgba(255, 255, 255, 0.4)", fillColor: "gradient:radial:rgba(0, 128, 0, 1.000):rgba(0, 84, 0, 1.000)", margin: 20, shadow:{type: 'inner'}},
        innerCircle: {color: "gradient:radial:#008000:#005400", margin: 35, shadow:{type: 'outer'}},
        buttons: {playColor: '#005400', playHoverColor: '#44ce44', pauseColor: '#005400', pauseHoverColor: '#44ce44', soundLed:{color:'#00ff00', size: 1 } }
    }
});
