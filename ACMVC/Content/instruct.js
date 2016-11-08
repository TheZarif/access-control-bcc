
    function animate(elem,style,unit,from,to,time,prop) {
        if( !elem) return;
        var start = new Date().getTime(),
                timer = setInterval(function() {
                    var step = Math.min(1,(new Date().getTime()-start)/time);
                    if (prop) {
                        elem[style] = (from+step*(to-from))+unit;
                    } else {
                        elem.style[style] = (from+step*(to-from))+unit;
                    }
                    if( step == 1) clearInterval(timer);
                },25);
        elem.style[style] = from+unit;
    }
document.addEventListener("DOMContentLoaded", function(event) { 
    var e=document.getElementsByClassName("tabContainer");
    for(k=0;k< e.length;k++) {
        var r= e[k];
        var a = r.childNodes;

        for (i = 0; i < a.length; i++) {
            var b = a[i];
            b.onclick = function () {

                var c = this.parentElement.childNodes;
                for (j = 0; j < c.length; j++) {
                    var f = c[j];
                    f.className = f.className.replace(" btn-default", "").replace(" btn-success activated", "") + " btn-default";

                }
                this.className = this.className.replace(" btn-default", "") + " btn-success activated";
                var g=document.getElementById(this.getAttribute("data-step"));
                g?
                        animate(g.parentElement, "scrollTop", "", g.parentElement.scrollTop, g.offsetTop, 300, true):0;
                //console.log(g.parentElement.offsetTop, g.offsetTop);
            }
        }
    }

    document.getElementById("offi").onclick = function ()
    {
        var w=document.getElementById("segments");
        animate(w, "scrollTop", "", w.scrollTop, 0, 200, true);
        u(this);
        var p=document.getElementById("official").getElementsByClassName("btn-success activated")[0];
        p=p?p: document.getElementById("official").children[0];
        o(p);

    }
    document.getElementById("visi").onclick = function ()
    {
        var w=document.getElementById("segments");
        animate(w, "scrollTop", "", w.scrollTop, 35, 200, true);
        u(this);
        var p=document.getElementById("visitors").getElementsByClassName("btn-success activated")[0];
        p=p?p: document.getElementById("visitors").children[0];
        o(p);
    }
    
});
function u(elem) {
        var c = elem.parentElement.childNodes;
        for (j = 0; j < c.length; j++) {
            var f = c[j];
            f.className = f.className.replace(" btn-default", "").replace(" btn-success activated", "") + " btn-default";

        }

        elem.className = elem.className.replace(" btn-default", "") + " btn-success activated";
    }
    function o(elem){
        var c = elem.parentElement.childNodes;
        for (j = 0; j < c.length; j++) {
            var f = c[j];
            f.className = f.className.replace(" btn-default", "").replace(" btn-success activated", "") + " btn-default";

        }
        elem.className = elem.className.replace(" btn-default", "") + " btn-success activated";
        var g=document.getElementById(elem.getAttribute("data-step"));
        g?animate(g.parentElement, "scrollTop", "", g.parentElement.scrollTop, g.offsetTop, 300, true):0;
    }