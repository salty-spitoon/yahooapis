// Common js functionality across all ydn docs
function getElementsByTagNames(list,obj) {
  if (!obj) var obj = document;
    var tagNames = list.split(',');
    var resultArray = new Array();
    for (var i = 0; i < tagNames.length; i++) {
      var tags = obj.getElementsByTagName(tagNames[i]);
      for (var j = 0; j < tags.length;j++) {
        resultArray.push(tags[j]);
      }
    }

  var testNode = resultArray[0];
  if (!testNode) { 
    return []; 
  }
  if (testNode.sourceIndex) {
    resultArray.sort(function (a,b) {
        return a.sourceIndex - b.sourceIndex;
    });
  }
  else if (testNode.compareDocumentPosition) {
    resultArray.sort(function (a,b) {
        return 3 - (a.compareDocumentPosition(b) & 6);
    });
  }
  return resultArray;
}

// Right-nav Generation
var toc = "<div class='pure-menu pure-menu-open'><ul><div class='docs-nav'><ul class='docs-nav-section'><li class='docs-nav-title'><a style='text-decoration:none'>Contents</a></li><hr class='sidebar-separator'><ul class='docs-nav-level-2 active'>";
var headerList = getElementsByTagNames('h2');

// Check if right-nav is really long
// If so, let's limit the height
if (headerList.length > 15) {
  // Apply style to always show scrollbar when there is overflow
  $('.right-nav').addClass('scrollbar');
  $('.right-nav').css('height', '450px');
}

if (headerList.length > 0) {
  for (var i = 0; i < headerList.length; i++) {
    var title = headerList[i].textContent.replace('¶', '');
    var anchor = $(headerList[i]).find('a').attr('href');
    if (headerList[i].tagName == 'H2') {
      toc += "<li class=''></li><li><a href='http://developer.yahoo.com/static/js/&quot;&#32;+&#32;anchor&#32;+&#32;&quot;'" + ">" + "<span class='break-word'>" + title + "</span></a>";
      toc += "</li>"
    }
  }
  toc += "</ul></ul></div></ul></div>";
  $('.right-nav').append(toc);
}

// Scrollspy for right-nav highlighting
var lastId,
  topMenu = $('.right-nav'),
  topMenuHeight = topMenu.outerHeight()+15,
  // All list items
  menuItems = topMenu.find("a"),
  // Anchors corresponding to menu items
  scrollItems = menuItems.map(function(){
    var item = $($(this).attr("href"));
    if (item.length) { return item; }
  });

// Anchor navigation for right-nav onClick
menuItems.click(function(e){
var href = $(this).attr("href"),
    offsetTop = href === "#" ? 0 : $(href).offset().top-topMenuHeight+1;
$('html, body').stop().animate({ 
    scrollTop: offsetTop
}, 300);
  e.preventDefault();
});

// Highlight "active" section on right-nav
$(window).scroll(function() {
 // Get container scroll position
 var fromTop = $(this).scrollTop()+topMenuHeight;
 
 // Get id of current scroll item
 var cur = scrollItems.map(function(){
   if ($(this).offset().top < fromTop)
     return this;
 });
 // Get the id of the current element
 cur = cur[cur.length-1];
 var id = cur && cur.length ? cur[0].id : "";
 
 if (lastId !== id) {
     lastId = id;
     // Set/remove active class
     menuItems
       .parent().removeClass("active")
       .end().filter("[href='#"+id+"']").parent().addClass("active");
 }                   
});

$('.toggle-nav').click(function() {
  if ($('.toggle-nav').hasClass('collapsed')) {
    var rightNavToggleWidth = $("#right-nav").width() == 117 ? "2%" : "10%";
    $('#right-nav').animate({ width: rightNavToggleWidth }, function () {
    });

    var toggleWidth = $("#main").width() == 681 ? "66%" : "58%";
    $('#main').animate({ width: toggleWidth }, function () {
      $('.toggle-nav').find('i').toggleClass('fa fa-arrow-right fa fa-arrow-left');
      $('.right-nav').css('display', '');
      $('.toggle-nav').addClass('expanded');
      $('.toggle-nav').removeClass('collapsed');
    });
  } else {

    // Hide right-nav before collapsing
    $('.right-nav').css('display', 'none');

    var rightNavToggleWidth = $("#right-nav").width() == 117 ? "2%" : "10%";
    $('#right-nav').animate({ width: rightNavToggleWidth }, function () {
    });

    var toggleWidth = $("#main").width() == 681 ? "66%" : "58%";
    $('#main').animate({ width: toggleWidth }, function () {
      $('.toggle-nav').find('i').toggleClass('fa fa-arrow-right fa fa-arrow-left');
      $('.toggle-nav').addClass('collapsed');
      $('.toggle-nav').removeClass('expanded');
    });

  }

});

$( window ).resize(function() {
  var width = $(window).width();
  if (width < 1160) {
    $('#main').css('width', '100%');
  } else {
    if ($('.toggle-nav').hasClass('collapsed')) {
      $('#main').css('width', '66%');
      $('#right-nav').css('width', '2%');
    } else {
      $('#main').css('width', '58%');
      $('#right-nav').css('width', '10%');
    }
  }
});