
<div class="panel">

    <label>Tekster</label>
    <textarea name="strings">{{strings}}</textarea>

    <label>billede</label>
    <input name="backdrop" type="text" class="imageurl" value="{{backdrop}}" />
    <input type="file" name="background_uploader" class="bgupload" />
    <div><input type="checkbox" name="infiniteTexts" {{#if infiniteTexts}}checked{{/if}} /><label for="infiniteTexts">Uendelig tekster</label></div>
    <label>Pladser i dropzone</label>
    <input name="maxDropped" type="text" value="{{maxDropped}}" />
    <label>Zoner</label>
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
