<div class="panel">
  <label>{{__ "Points of interest"}}</label>
	<span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
	<span class="tooltip-content">{{__ 'A json object of key-value pairs, e.g. {"start":125,"end":342}. Create new points of interest by clicking at the map.'}}</span>
  <textarea name="poi" class="poifield">{{poi}}</textarea>
</div>

<div class="panel">

  <label>{{__ "Image"}}</label>
	<span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
	<span class="tooltip-content">{{__ "SVG-image including a background image and a layer of path points"}}</span>
  <input type="file" name="background_uploader" class="bgupload" />
  <textarea name="backdrop" class="imageurl">{{backdrop}}</textarea>
</div>

<div class="panel">

  <label>{{__ "Path layer"}}</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "Name of path layer in the SVG image"}}</span>
  <input name="pathlayer" type="text" value="{{pathlayer}}" />

</div>

<div class="panel">
  <label>{{__ "Point density"}}</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "Density of points in SVG image"}}</span>
  <input name="dotresolution" type="text" value="{{dotresolution}}" />

</div>

<div class="panel">
  <label>{{__ "Scoring function"}}</label>
      <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "Scoring function defined as function score(path){} returning a JSON object of scores"}}</span>

  <textarea name="scoring">{{scoring}}</textarea>

</div>

<div class="panel">
    <label for="" class="has-icon">{{__ "Response identifier"}}</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <div class="tooltip-content">{{__ 'The identifier of the choice. This identifier must not be used by any other response or item variable. An identifier is a string of characters that must start with a Letter or an underscore ("_") and contain only Letters, underscores, hyphens ("-"), period (".", a.k.a. full-stop), Digits, CombiningChars and Extenders.'}}</div>

    <input type="text"
           name="identifier"
           value="{{identifier}}"
           placeholder="e.g. RESPONSE"
           data-validate="$notEmpty; $qtiIdentifier; $availableIdentifier(serial={{serial}});">
</div>
