<script>// Track Ad Load [boxad]
//--load time + set bounce
mps.adloadCallback = function(eo) {
  //debugmode.log && console.log('[mps:Detect] AD LOAD CALLBACK: '+eo._mps._slot)
  if(!eo || !eo._mps || !eo._mps._elapsed || !eo._mps._slot) {
    debugmode.log && console.log('[mps:Detect] FAILED: adloadCallback '+(eo._mps._elapsed))
    return false;
  }
  if(eo._mps._slot == 'boxad') {
    mps._ck.w('mps_detect_hp_load','$$$');
    _satellite.setVar('ad load time', eo._mps._elapsed);
    _satellite.track('home page ad loaded');
    debugmode.log && console.log('[mps:Detect] track load at '+(eo._mps._elapsed))
  }
}
//--interval detection
mps._detect = function(adslot,noloadcall,intervalcall,detectobj){
  if(!adslot || !mps._adloads) return false;
  var detect = typeof(detectobj !='object') ? { tries: 5, interval: 2000, slot: adslot, loadset: mps._loadset } : detectobj;
  debugmode.log && console.log('[mps:Detect] Initialized for '+detect.slot+' '+mps._elapsed(), detect);
  var i = 0; mps._t = mps._t || {};
  mps._t.detect = setInterval(function(){
    i++;
    if(i > detect.tries) {
      debugmode.log && console.log('[mps:Detect] Hit Max Tries ('+(i-1)+') '+mps._elapsed());
      clearInterval(mps._t.detect);
      return true;
    }
    detect.loaded = (mps._adloads[detect.loadset] && mps._adloads[detect.loadset][detect.slot]) ? true : false;
    if(typeof(intervalcall)=='function') intervalcall.apply(this, [i,detect]);
    if(!detect.loaded && typeof(noloadcall)=='function') noloadcall.apply(this, [i,detect]);
  }, detect.interval)  
}
//--init interval detection
mps._detect(
  'boxad',
  function(i,detect){ (debugmode.log && console.log('[mps:Detect] '+(2000*i)+'ms: track missing '+detect.slot)); if(typeof(_satellite)=='object'){ _satellite.setVar('ad timer duration', 2000*i); _satellite.track('ad timer'); } },
  function(i){ if(typeof(_satellite)=='object'){ (debugmode.log && console.log('[mps:Detect] '+(2000*i)+'ms: track on page')); _satellite.setVar('home page view duration', 2000*i); _satellite.track('home page view timer'); } }
);
</script>