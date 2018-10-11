$(document).ready(function() {

  //initialize datepicker
  $('#datepicker').datepicker($.datepicker.regional['']).datepicker('option', {
    onSelect : function(selectedDate, date) {
      $('#calendar').weekCalendar('gotoWeek', createDateForCalendar(date))
    },
    onChangeMonthYear: function(year, month, date) {
      $('#calendar').weekCalendar('gotoWeek', createDateForCalendar(date))
    }
  })

  //initialize mock EvenData
  var year = new Date().getFullYear()
  var month = new Date().getMonth()
  var day = new Date().getDate()

  var eventData = {
    events : [
      {'id': generateId(), 'start': new Date(year, month, day, 12), 'end': new Date(year, month, day, 13, 35),'title':'Lunch with Mike'},
      {'id': generateId(), 'start': new Date(year, month, day, 14), 'end': new Date(year, month, day, 14, 45),'title':'Dev Meeting'},
      {'id': generateId(), 'start': new Date(year, month, day + 1, 18), 'end': new Date(year, month, day + 1, 18, 45),'title':'Hair cut'},
      {'id': generateId(), 'start': new Date(year, month, day - 1, 8), 'end': new Date(year, month, day - 1, 9, 30),'title':'Team breakfast'},
      {'id': generateId(), 'start': new Date(year, month, day + 1, 14), 'end': new Date(year, month, day + 1, 15),'title':'Product showcase'}
    ]
  }

  //initialize Calanadar
  $('#calendar').weekCalendar({
    timeslotsPerHour: 4,
    hourLine: true,
    timeslotHeight: 25,
    data: eventData,
    allowCalEventOverlap: true,
    overlapEventsSeparate: true,
    headerSeparator: ' ',
    switchDisplay: {'1 day': 1, '3 next days': 3, 'work week': 5, 'full week': 7},
    height: function($calendar) {
      return $(window).height()
    },
    eventRender : function(calEvent, element) {
      renderEvent(calEvent,element )
    },
    eventDrag : function(calEvent, element) {
      var newElem = element.clone().attr('id', 'clone-draggable').css('opacity', '.6')
      element.parent().append(newElem)
      element.css('opacity', '.7');
      onDragEvent(calEvent, element)
    },
    eventNew: function(calEvent, element) {
      if($("#myForm").length) closeDialogWithRefesh()
      else openDialog(element, calEvent)
    },
    eventClick: function(calEvent, element) {
      openDialog(element, calEvent)
    },
    eventDrop: function(newCalEvent, newCalEvent) {
      $('#clone-draggable').remove()
    },
    eventResize: function(newCalEvent) {
       $('#calendar').weekCalendar('updateEvent', newCalEvent)
    },
    resizable: function (params) {
      return true
    },
    calendarAfterLoad: function (calendar) {
      //change datepicker date if the month has changed
      var dateNew = new Date(calendar.data('startDate'));
      var datrePickerDate = $('#datepicker').datepicker( "getDate" ).getMonth();
      if(datrePickerDate !== dateNew.getMonth()) $('#datepicker').datepicker("setDate", dateNew)
    }
  })

  function createDateForCalendar(date){
    return date.selectedMonth + 1+"/"+date.selectedDay+"/"+date.selectedYear
  }

  // generate unique ID
  function generateId() {
    return  Math.random().toString(36).substr(2, 9);
  }

  //call to render event card
  function renderEvent(calEvent,element) {
    var startDate = calEvent.start.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).toLowerCase()
    var endDate = calEvent.end.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).toLowerCase()
    element.html("<div class='title-card-event'>"+calEvent.title+"</div>"+startDate+" to "+endDate);

  }

  //call when event card is dragging
  function onDragEvent(calEvent, element){
    $(element).draggable({
      drag: function(event, ui) {
        var diffTime = calEvent.end.getTime() - calEvent.start.getTime();
        var startTime = toLocaleStringDate(new Date(ui.position.top / 25 * 15 * 60 * 1000))
        var endTime = toLocaleStringDate(new Date(ui.position.top / 25 * 15 * 60 * 1000 + diffTime))
        element.html("<div class='title-card-event'>"+calEvent.title+"</div>"+startTime+" to "+endTime);
      }
    })
  }

  function toLocaleStringDate(date) {
    return date.toLocaleString('en-US', { timeZone: 'UTC', hour: 'numeric', minute: 'numeric', hour12: true }).toLowerCase()
  }


  //call to close dialog and refersh event
  function closeDialogWithRefesh(calEvent){
    $('#myForm').dialog('close').remove();
    if(calEvent)  $('#calendar').weekCalendar('updateEvent', calEvent)
    else  $('#calendar').weekCalendar('removeUnsavedEvents')
  }

  //init and open dialog to set title to event
  function openDialog(element, calEvent) {
    element.parent().append("<form id='myForm'><label for='title-event' class='label-title-event'>Title Event:</label><textarea id='title-event' class='title-input' name='title-event' rows='4'>"+calEvent.title+"</textarea></form>")

    $('#myForm').dialog({
      position: {
        my: 'right top',
        at: 'left top',
        of: element
      },
      resizable: false,
      dialogClass: 'success-dialog',
      show: {
        effect: "puff",
        duration: 300
      },
      hide: {
        effect: "explode",
        duration: 400
      },
      buttons: [
        {
          text: "Save",
          click: function() {
            calEvent.id = generateId();
            calEvent.title = $('#title-event').val()
            closeDialogWithRefesh(calEvent)
          }
        },
      ],
      create: function( event ) {
        var columnPosLeft = $(element).parent().position().left
        var dialogWidth = $(event.target).parent().width()
        if(dialogWidth > columnPosLeft){
          $(event.target).dialog('option','position',{ my: 'left top', at: 'right top', of: element})
        }
      },
      close: function() {
        closeDialogWithRefesh()
      }
    })
  }

});
