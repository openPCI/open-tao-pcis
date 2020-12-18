
<div class="panel">

    <label for="messages">{{__ "Cells"}}</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "Write the number of cells at each row. Separated by commas."}}</span>
    <input type="text" name="cells" value="{{cells}}" />
    <label for="texts">{{__ "Texts"}}</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "Write the texts. One per line."}}</span>
    <textarea name="texts">{{texts}}</textarea>
	<input type="checkbox" name="randomorder" {{#if randomorder}}checked="checked"{{/if}}/>
    <label>{{__ "Randomize"}}</label>
	<div></div>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "Randomize the the order of texts for each testtaker."}}</span>

    <label for="messages">{{__ "Sample"}}</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "If only a random subset of the texts should be presented to the test-taker, give the size of the sample (0 presents all texts)."}}</span>
    <input type="text" name="sample" value="{{sample}}" />

    <label for="messages">{{__ "Sample from groups"}}</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "If only a random subset of the texts should be presented to the test-taker, and the texts are ordered in groups, give the number of the grops (all texts for the first group should come first, then fror the second group, etc.)"}}</span>
    <input type="text" name="numGroups" value="{{#if numGroups}}{{numGroups}}{{else}}1{{/if}}" />

    <label for="descriptions">{{__ "Descriptions"}}</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "Descriptions to be placed below, left of, on top of and right of the boxes. Comma-separated. First line: Comments below the boxes, second line: Comments to the left of the boxes, etc."}}</span>
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
