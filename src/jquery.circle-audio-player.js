/* =========================================================
 * jquery.circle-audio-player.js
 * Repo: https://github.com/sohamgreens/circle-audio-player
 * Demo: https://github.com/sohamgreens/circle-audio-player
 * Docs: https://github.com/sohamgreens/circle-audio-player
 * =========================================================
 * Started by Harish Chauhan;
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


(function ($) {

    var defaults = {
        radius: 100,
        skin: 'default',
    };

    var CircleAudioPlayer = function (element, options) {
        this.id = this._guid();
        this.element = $(element);
        this.options = $.extend({}, defaults, options);
        this.radius = 100;
        this.scale = 1;
        this.diameter = this.radius * 2;
        this.loaded = 0.0;
        this.played = 0.0;
        this.is_mouseover = false;
        this.canvas = null;
        this.ctx = null;
        this.init();
    }

    CircleAudioPlayer.prototype = {
        constructor: CircleAudioPlayer,
        
        config: {
            skins: {
                default: {
                    outerCircle: {color: "gradient:linear:#f5f5f5:#e8e8e8"},
                    progressBar: {loadColor: "rgba(255, 255, 255, 0.7)", fillColor: "gradient:linear:rgba(255, 110, 2, 1.000):rgba(255, 255, 0, 1.000):rgba(255, 109, 0, 1.000)", margin: 20, shadow:{type: 'inner'}},
                    innerCircle: {color: "gradient:linear:#ececec:#d4d4d4", margin: 35, shadow:{type: 'outer'}},
                    buttons: {playColor: '#666666', playHoverColor: '#00ff00', pauseColor: '#666666', pauseHoverColor: '#ff0000'}
                },
                plane: {
                    outerCircle: {color: "rgba(0,0,0,0)"},
                    progressBar: {loadColor: "rgba(178,230,23,1)", fillColor: "#0095DA"},
                    innerCircle: {color: "#F5F5F5", margin: 15},
                    buttons: {playColor: '#666666', playHoverColor: '#0095DA', pauseColor: '#666666', pauseHoverColor: '#0095DA'}
                },
                black: {
                    outerCircle: {color: "gradient:linear:#585858:#A6A6A6"},
                    progressBar: {loadColor: "rgba(255, 255, 255, 0.7)", fillColor: "#0095DA", margin: 20, shadow:{type: 'inner'}},
                    innerCircle: {color: "gradient:linear:#A6A6A6:#585858", margin: 35, shadow:{type: 'outer'}},
                    buttons: {playColor: '#666666', playHoverColor: '#0095DA', pauseColor: '#666666', pauseHoverColor: '#0095DA'}
                }
            }
        },
        
        init: function () {
            this._create();
            this._bindEvents();
            this.render();
        },
        
        getSkin: function(){
            return this.config.skins[this.options.skin];
        },
        
        _guid: function() {
            function s4() {
              return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
              s4() + '-' + s4() + s4() + s4();
        },
        
        _create: function(){
            this.canvas = $('<canvas></canvas>').attr('width', this.diameter+"px")
                                        .attr('height', this.diameter+"px")
                                        .css({
                                                width: this.diameter+"px", 
                                                height: this.diameter+"px",
                                                cursor: 'pointer'
                                            });
            this.ctx = this.canvas[0].getContext("2d");
            
            
            if(this.options.radius != this.radius){
                var scale = this.options.radius / this.radius;
                this.scale = scale;
                this.canvas.attr('width', (this.diameter * scale)+"px")
                            .attr('height', (this.diameter * scale)+"px")
                            .width(this.diameter * scale).height( this.diameter * scale);
                this.ctx.scale(scale, scale);
            }
            
            this.element.after(this.canvas).hide();
        },
        
        _bindEvents: function(){
            //listen events of player
            this.element.on("progress", this._onProgress);
            this.element.on("timeupdate", this._onTimeUpdate);
            this.element.on("canplay", this._onProgress);
            
            //events on canvas
            var self = this;
            this.canvas.hover( function() {
                self.is_mouseover = true;
                self.render();
              }, function() {
                self.is_mouseover = false;
                self.render();
              });
              
            this.canvas.on("click", function(event){self._onClick(event);});
        },
        
        _onProgress: function(evt){
            console.info("on progress");
            var player = $(this).data("circle-audio-player");
            var d = this.duration;
            try{
                var z = this.buffered.end(this.buffered.length-1);

                player.loaded = z / d;
                player.render();
            }catch(e){
                ;
            }
        },
        
        _onTimeUpdate: function(evt){
            var player = $(this).data("circle-audio-player");
            var t = this.currentTime;
            var d = this.duration;
            
            player.played = t / d;
            player.render();
            
            //console.info( t, " : ", d );
        },
        
        _onClick: function(evt){
            var media = this.element[0];
            if(media.paused){
                media.play();
            }else{
                media.pause();
            }
            this.render();
            //console.info( t, " : ", d );
        },
        
        render: function(){
            // Get Skin
            var skin = this.getSkin();
            
            // clear canvas
            this.ctx.clearRect(0, 0, this.diameter, this.diameter);
            
            // create outer circle
            this._drawCircle(skin.outerCircle);
            this._drawProgressBar(skin.progressBar);
            this._drawCircle(skin.innerCircle);
            this._drawButton(skin.buttons);
            
        },
        
        _parseColor: function(color, center, radius){
            var diameter = 2 * radius;
            if(color.match(/^gradient/)){
                //gradieant
                var info_arr = color.split(":");
                if(info_arr[1] == "radial"){
                    var grd=this.ctx.createRadialGradient(center,center,0,radius,radius,radius);
                }else{
                    var grd = this.ctx.createLinearGradient(0, 0, diameter, diameter);
                }
                
                var i=2;
                if(info_arr[2].match(/^distribute/)){
                    var i=3, j=0;
                    var distb_arr = info_arr[2].replace(/^distribute-/, '').split(",");
                    for(var k=i; k<info_arr.length; k++){
                        var d = parseFloat(distb_arr[j++], 10);
                        grd.addColorStop(d, info_arr[k]);
                    }
                }else{
                    var d = 1 / (info_arr.length - 3), j=0; 
                    for(var k=i; k<info_arr.length; k++){
                        grd.addColorStop(j, info_arr[k]);
                        j += d;
                    }
                }
                return grd;
            }else{
                return color;
            }
        },
        
        _drawCircle: function(props){
            this.ctx.save();
            var radius = this.radius;
            var center = this.radius;
            if(props.margin) radius = radius - props.margin;
    
            if(props.color){
                var angle = props.angle ? props.angle * Math.PI * 2 : 2 * Math.PI;
                this.ctx.beginPath();
                this.ctx.moveTo(center, center);
                this.ctx.arc(center, center, radius, 0, angle, false);
                
                this.ctx.fillStyle= this._parseColor(props.color, center, radius);
                this.ctx.closePath();
                
                if(props.shadow && props.shadow.type == 'outer'){                
                    this.ctx.lineWidth = 0;
                    this.ctx.shadowBlur = (props.shadow.blur ? props.shadow.blur : 5) * this.scale;
                    this.ctx.shadowColor = props.shadow.color ? props.shadow.color : 'rgba(0, 0, 0, 0.6)';
                    this.ctx.shadowOffsetX = 0;
                    this.ctx.shadowOffsetY = 0;
                }
                
                this.ctx.fill();
            }
            
            if(props.shadow && props.shadow.type == 'inner'){
                
                this.ctx.beginPath();
                this.ctx.arc(center, center, radius, 0, Math.PI * 2, false);
                this.ctx.clip();
                
                this.ctx.beginPath();
                this.ctx.strokeStyle = '#000000';
                this.ctx.lineWidth = (props.shadow.width ? props.shadow.width : 5);
                this.ctx.shadowBlur = (props.shadow.blur ? props.shadow.blur : 5) * this.scale;
                this.ctx.shadowColor = props.shadow.color ? props.shadow.color : 'rgba(0, 0, 0, 0.6)';
                this.ctx.shadowOffsetX = 0;
                this.ctx.shadowOffsetY = 0;
                this.ctx.arc(center, center, radius + 3, 0, 2 * Math.PI, false);
                this.ctx.stroke();
            }
            
            //this.ctx.stroke();
            this.ctx.restore();
        },
        
        
        _drawProgressBar: function(props){
            if(this.loaded > 0){
                this._drawCircle({color: props.loadColor, angle: this.loaded, margin: props.margin  });
            }
            if(this.played > 0){
                this._drawCircle({color: props.fillColor, angle: this.played, margin: props.margin  });
            }
            this._drawCircle(props);
        },
        
        _drawButton: function(props){
            this.ctx.save();
            var radius = this.radius;
            
            var media = this.element[0];
            
            var is_play = !media.paused;
            var text = is_play ? "\u2759\u2759" : "\u25ba";
            var dw = is_play ? 0:5;
            
            this.ctx.save();
            this.ctx.font = "normal bold 50px arial";
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline="middle";
            this.ctx.fillStyle = this._parseColor(!is_play ? (this.is_mouseover ? props.playHoverColor : props.playColor) : (this.is_mouseover ? props.pauseHoverColor : props.pauseColor));
            this.ctx.fillText(text, radius + dw, radius);
            this.ctx.restore();
            
        }
        
        
    }
    
    
    $.fn.circleAudioPlayer = function(){
        $(this).each(function(){
            
            var radius = $(this).data('radius') ? $(this).data('radius') : 100;
            var skin = $(this).data('skin') ? $(this).data('skin') : 'default';
            
            var player = new CircleAudioPlayer($(this)[0], {radius: radius, skin: skin});
            $(this).data("circle-audio-player", player);
        })
    }
    
    $(function(){
        $("[data-circle-audio-player]").circleAudioPlayer();
    })

}(jQuery));