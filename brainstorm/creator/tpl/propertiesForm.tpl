
<div class="panel">

    <label for="messages">{{__ "Test-taker nickname"}}</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "E.g. 'Me' or 'You'"}}</span>
    <input type="text" name="nickname" value="{{nickname}}" />
</div>

<div class="panel">

    <label for="messages">{{__ "'Bot' input"}}</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "Automated input from bots. Provide one bot input on each line on the form: Seconds before shown;Name of Bot;color;Input. E.g. 3;Amy;red;I think it is a good idea!"}}</span>
    <textarea name="messages">{{messages}}</textarea>
</div>

<div class="panel">

    <label for="messages">{{__ "Time limit (seconds)"}}</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "Time before the brainstorm is ended in seconds."}}</span>
    <input type="text" name="timeLimit" value="{{timeLimit}}" />
</div>

<div class="panel">

    <label for="messages">{{__ "Start message"}}</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "A text that asks the test-taker to click here when s/he is ready to begin."}}</span>
    <input type="text" name="startText" value="{{startText}}" />
</div>

<div class="panel">

    <label for="messages">{{__ "Time is out-message"}}</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "Message to the test taker, when the time for brainstorming is out."}}</span>
    <input type="text" name="endText" value="{{endText}}" />

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
