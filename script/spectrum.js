/**
 * Copyright (c) 2016, Marco Buzzanca. 
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
var Spectrum = {
    eProps : { 
        'bubbles': true, 
        'cancelable': false 
    },

    validKeys : new Set([
        33, // PageUp
        34, // PageDown
        37, // Left Arrow
        38, // Up Arrow
        39, // Right Arrow
        40, // Down Arrow
    ]),

    hDraw : function(track, thumb, fill, range)
    {
        if (range.value == range.min)
        {
            thumb.style.left = "0";
            fill.style.width = "0";
        }
        else
        {
            var offset = (range.value - range.min) / 
                (range.max - range.min) * 
                (track.offsetWidth - thumb.offsetWidth);

            thumb.style.left = offset + "px";
            fill.style.width = (offset + thumb.offsetWidth / 2) + "px";
        }
    },

    vDraw : function(track, thumb, fill, range)
    {
        if (range.value == range.min)
        {
            thumb.style.bottom = "0";
            fill.style.height = "0";
        }
        else
        {
            var offset = (range.value - range.min) / 
                (range.max - range.min) * 
                (track.offsetHeight - thumb.offsetHeight);

            thumb.style.bottom = offset + "px";
            fill.style.height = (offset + thumb.offsetHeight / 2) + "px";
        }
    },

    mouseEvent : function(src, e)
    {
        var range = src.querySelector("input[type=range]");
        var thumb = src.querySelector(".thumb");
        var offset, value;
        
        if (src.offsetWidth > src.offsetHeight)
        {
            offset = e.pageX - Math.round(src.getBoundingClientRect().left);
            value = (offset - thumb.offsetWidth / 2) / 
                (src.offsetWidth - thumb.offsetWidth);
        }
        else
        {
            offset = e.pageY - Math.round(src.getBoundingClientRect().top);
            value = 1.0 - (offset - thumb.offsetHeight / 2) / 
                (src.offsetHeight - thumb.offsetHeight);
        }

        range.value = value * (range.max - range.min) + parseInt(range.min)
        range.dispatchEvent(new Event("input", Spectrum.eProps));
    },
        
    onMouseDown : function(e)
    {    
        Spectrum.mouseEvent(this, e); 

        Spectrum.draggedNode = this;
        document.addEventListener("mousemove", Spectrum.onGlobalMouseMove);
        document.addEventListener("mouseup", Spectrum.onGlobalMouseUp);

        // Prevents default dragdrop, but let the control be focused.
        e.preventDefault();
        this.focus();
    },

    onMouseUp : function(e)
    {    
        var range = this.querySelector("input[type=range]");
        range.dispatchEvent(new Event("change", Spectrum.eProps));
    },

    onKeyDown : function(e)
    {
        if (Spectrum.validKeys.has(e.keyCode))
        {
            var range = this.querySelector("input[type=range]");
            var diff;

            switch (e.keyCode)
            {
                case 33:
                    diff = 0.1 * (range.max - range.min);
                    break;
                case 34:
                    diff = -0.1 * (range.max - range.min);
                    break;
                case 37:
                case 40:
                    diff = -parseInt(range.step);
                    break;
                case 38:
                case 39:
                    diff = parseInt(range.step);
                    break;
                default:
                    throw "Unreachable case";
            }

            range.value = parseInt(range.value) + diff;
            range.dispatchEvent(new Event("input", Spectrum.eProps));

            // Prevents side effects like scrolling of its container
            e.preventDefault();
        }
    },

    onKeyUp : function(e)
    {
        if (Spectrum.validKeys.has(e.keyCode))
        {
            var range = this.querySelector("input[type=range]");
            range.dispatchEvent(new Event("change", Spectrum.eProps));
        }
    },

    onGlobalMouseMove : function (e)
    {
        Spectrum.mouseEvent(Spectrum.draggedNode, e);
    },

    onGlobalMouseUp : function(e)
    {
        var range = Spectrum.draggedNode.querySelector("input[type=range]");

        document.removeEventListener("mousemove", Spectrum.onGlobalMouseMove);
        document.removeEventListener("mouseup", Spectrum.onGlobalMouseUp);
        delete Spectrum.draggedNode;

        range.dispatchEvent(new Event("change", Spectrum.eProps));
    },

    makeUpdater : function(draw, track, thumb, fill, range) 
    {
        return function(value) 
        {
            value = Math.round(value / range.step) * range.step;
            value = value < range.min ? range.min : 
                value > range.max ? range.max : value;

            range.dataset.value = value;
            draw(track, thumb, fill, range);
        }
    },

    attach : function(spectrumClass, query)
    {   
        if (typeof query === "undefined")
            query = "input[type=range]";
    
        var ranges = document.querySelectorAll(query);

        for (var i = 0; i < ranges.length; i++)
        {
            var element = ranges[i];
            var thumb = document.createElement("div");
            var fill = document.createElement("div");
            var track = document.createElement("div");
            var spectrum = document.createElement("div");

            thumb.className = "thumb";
            fill.className = "fill"; 
            track.className = "track";
            spectrum.className = spectrumClass;

            if (element.offsetWidth >= element.offsetHeight)
            {
                spectrum.style.width = element.offsetWidth + "px";
                draw = Spectrum.hDraw;
            }
            else
            {
                spectrum.style.height = element.offsetHeight + "px";
                draw = Spectrum.vDraw;
            }
            
            // HTML5 defaults
            if (!element.min)  element.min = 0;
            if (!element.max)  element.max = 100;
            if (!element.step) element.step = 1;

            element.dataset.value = element.value;

            Object.defineProperty(element, "value", {
                get: function() {  return this.dataset.value; },
                set: Spectrum.makeUpdater(draw, track, thumb, fill, element)
            });

            element.style.display = "none";
            element.parentNode.insertBefore(spectrum, element);

            spectrum.appendChild(element);
            spectrum.appendChild(track);
            spectrum.appendChild(fill);
            spectrum.appendChild(thumb);

            spectrum.tabIndex = 0;

            spectrum.addEventListener("keyup", Spectrum.onKeyUp);
            spectrum.addEventListener("keydown", Spectrum.onKeyDown);
            spectrum.addEventListener("mouseup", Spectrum.onMouseUp);
            spectrum.addEventListener("mousedown", Spectrum.onMouseDown);

            // Matches default value
            draw(track, thumb, fill, element);
        }
    }
};
