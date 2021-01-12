
<div class="panel">

    <label>{{__ "Texts"}}</label>
	<span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
	<span class="tooltip-content">{{__ "Droppable texts, one on each line."}}</span>
    <textarea name="strings">{{strings}}</textarea>
</div>

<div class="panel">

    <label>{{__ "Image"}}</label>
	<span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
	<span class="tooltip-content">{{__ "Image as data/image or uploaded from file."}}</span>
    <input name="backdrop" type="text" class="imageurl" value="{{backdrop}}" />
    <input type="file" name="background_uploader" class="bgupload" />
</div>

<div class="panel">
    <div><input type="checkbox" name="infiniteTexts" {{#if infiniteTexts}}checked{{/if}} /><label for="infiniteTexts">{{__ "Infinite texts"}}</label></div>
</div>

<div class="panel">
    <div><input type="checkbox" name="numbering" {{#if numbering}}checked{{/if}} /><label for="numbering">{{__ "Numbering"}}</label></div>
</div>

<div class="panel">

    <label>{{__ "Spots in dropzone"}}</label>
	<span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
	<span class="tooltip-content">{{__ "Maximum number of texts allowed to be dropped in each dropzone."}}</span>
    <input name="maxDropped" type="text" value="{{maxDropped}}" />
</div>

<div class="panel">
    <label>{{__ "Extra CSS styling"}}</label>
	<span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
	<span class="tooltip-content">{{__ "Extra styling for texts."}}</span>
    <input name="droppedStyle" type="text" value="{{droppedStyle}}" />
</div>

<div class="panel">
    <label>{{__ "Zones"}}</label>
   	<span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
	<span class="tooltip-content">{{__ "Point and drag on image to create droppable zones. Data will appear here."}}</span>
    <textarea name="dropzones" class="dropzones">{{dropzones}}</textarea>

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
