
<div class="panel">
    <label for="colors">{{__ "Colors"}}</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "Colors to choose from. Use HTML Color codes, one on each line."}}</span>
    <textarea name="colors">{{colors}}</textarea>
</div>

<div class="panel">

    <label for="colors">{{__ "Preset figure"}}</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "Figure painted at the canvas from the beginning. You can draw and copy it, and insert the data here."}}</span>
    <textarea name="scene">{{scene}}</textarea>
</div>

<div class="panel">

    <label for="colors">{{__ "Scoring"}}</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "Scoring function."}}</span>
    <textarea name="scoring">{{scoring}}</textarea>

</div>

<div class="panel">
    <label for="gameUrl">{{__ "Game Url"}}</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "Reference to where the game is found."}}</span>
    <input type="text" name="gameUrl" value="{{gameUrl}}" />
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
