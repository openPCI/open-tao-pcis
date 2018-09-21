
<div class="panel">

    <label for="messages">Dage</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "Tooltip_period"}}</span>
    <input type="text" name="period" value="{{period}}" />


    <label for="messages">Start dato</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "Tooltip_startDate"}}</span>
    <input type="text" name="startDate" value="{{startDate}}" placeholder="mm-dd-yyyy" />

    <div><input type="checkbox" name="weekDays" {{#if weekDays}}checked{{/if}} /><label for="weekDays"> Vis ugedage</label></div>
    <div><input type="checkbox" name="useHours" {{#if useHours}}checked{{/if}} /><label for="disableWeekends">Vis timer</label></div>
    <div><input type="checkbox" name="months" {{#if months}}checked{{/if}} /><label for="months"> Vis måneder</label></div>
    <div><input type="checkbox" name="disableWeekends" {{#if disableWeekends}}checked{{/if}} /><label for="disableWeekends">Brug ikke weekend</label></div>


    <label for="messages">Gantt tasks</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "Tooltip_tasks"}}</span>
    <textarea name="tasks">{{tasks}}</textarea>
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
