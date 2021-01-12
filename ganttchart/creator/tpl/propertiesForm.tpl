
<div class="panel">

    <label for="messages">{{__"Number of Days"}}</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "Provide the number of days to show in the Gantt Chart"}}</span>
    <input type="text" name="period" value="{{period}}" />

</div>

<div class="panel">

    <label for="messages">Start date</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "Provide the actual date for calculation of day name"}}</span>
    <input type="text" name="startDate" value="{{startDate}}" placeholder="mm/dd/yyyy" />
</div>

<div class="panel">

    <div><input type="checkbox" name="weekNumHack" {{#if weekNumHack}}checked{{/if}} /><label for="weekNum">{{__"Show week number (Hack)"}}</label></div>
    <div><input type="checkbox" name="weekDays" {{#if weekDays}}checked{{/if}} /><label for="weekDays">{{__"Show week days"}}</label></div>
    <div><input type="checkbox" name="useHours" {{#if useHours}}checked{{/if}} /><label for="useHours">{{__"Show hours"}}</label></div>
    <div><input type="checkbox" name="useHalfHours" {{#if useHalfHours}}checked{{/if}} /><labe´l for="useHalfHours">{{__"Show half hours"}}</label></div>
    <div><input type="checkbox" name="showTimeRange" {{#if showTimeRange}}checked{{/if}} /><label for="showTimeRange">{{__"Show start and end time"}}</label></div>
    <div><input type="checkbox" name="months" {{#if months}}checked{{/if}} /><label for="months">{{__"Show months"}}</label></div>
    <div><input type="checkbox" name="disableWeekends" {{#if disableWeekends}}checked{{/if}} /><label for="disableWeekends">{{__"Don't use weekends"}}</label></div>

</div>

<div class="panel">
    <label for="messages">{{__ "Start time (hours)"}}</label>
    <input type="text" name="dayStart" value="{{dayStart}}" placeholder="8" />

</div>

<div class="panel">
    <label for="messages">{{__ "End time (hours)"}}</label>
    <input type="text" name="dayEnd" value="{{dayEnd}}" placeholder="16" />

</div>

<div class="panel">
    <label for="messages">{{__ "Gantt tasks"}}</label>
    <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
    <span class="tooltip-content">{{__ "One task/activity at each line on the form Task name;color code (e.g. #ffaa00)"}}</span>
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
