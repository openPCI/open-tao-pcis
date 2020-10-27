
<div class="panel">

    <label for="messages">Celler</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "Tooltip_nickname"}}</span>
    <input type="text" name="cells" value="{{cells}}" />
    <label for="texts">Tekster</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "Tooltip_nickname"}}</span>
    <textarea name="texts">{{texts}}</textarea>
	<label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <input type="checkbox" name="randomorder" {{#if randomorder}}checked="checked"{{/if}}/>
        <span class="icon-checkbox"></span> {{__ "Randomize"}}
    </label>
	<label>
	<span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content" data-tooltip-theme="info"></span>
    <span class="tooltip-content">
        {{__ "Randomize the texts for each testtaker."}}
    </span>
    </label>
    <label for="descriptions">{{__ "Descriptions"}}</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "Descriptions to be placed below the boxes. Comma-separated."}}</span>
    <textarea name="descriptions">{{descriptions}}</textarea>
	<label>
    
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
