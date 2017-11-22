/**
 * Created by busin on 20.11.2017.
 */
$(window).on('load', function() {
    var draggables = new Draggables();
    draggables.init();
    $(document).on('click', '.navbar-brand', function() {
        draggables.create();
        $(this).blur();
    });
    $(document).on('click', '.close-left', function(){
        draggables.close(this);
    });
    $(document).on('click', '.calc-button', function(e){
        var id = $(this).closest('.calc').attr('id');
        var sign = $(this).html();
        draggables.buttonClick(id, sign);
    });
    $(document).on('click', '.calc', function(e){
        var zIndex = draggables.getMaxZindex().zIndex;
        $(this).css({"z-index": zIndex + 1});
    });
    $(document).on('keypress', function(event){
        event.preventDefault();
        var max_zIndex = draggables.getMaxZindex().zIndex;
        var id = draggables.getMaxZindex().id;
        var sign = String.fromCharCode(event.charCode);
        if (event.which == 13) sign = '=';
        if (id) draggables.buttonClick(id, sign);
    });
    $(document).on('keypress', function(event){
        event.preventDefault();
        var id = draggables.getMaxZindex().id;
        var sign = String.fromCharCode(event.charCode);
        if (event.which == 13) sign = '=';
        $('#' + id + ' button.' + event.charCode).addClass('active');
    });
    $(document).on('keyup', function(event){
        event.preventDefault();
        $('button').removeClass('active');
    });
});

var Draggables = function () {
    this.init = function () {
        this.count = 0;
        this.create();
    };
    this.getMaxZindex = function () {
        var max_zIndex = -1;
        var id = "";
        $('.calc').each(function (index, el) {
            var zIndex = parseInt($(el).css("z-index"));
            if (zIndex > max_zIndex ) {
                id = $(el).attr('id');
                max_zIndex = zIndex;
            }
        });
        return {zIndex: max_zIndex, id: id};
    };
    this.create = function () {
        this.count++;
        var id = "draggable-" + this.count;
        var newZindex = Math.max(0, this.getMaxZindex().zIndex) + 1;
        var html = $(
            '<div id=' + id + ' class="calc container-fluid" style="z-index:' + newZindex + '">' +
                '<div class="blur"></div>' +
                '<button class="close-left">&times;</button>' +
                '<div class="input-group">' +
                    '<span class="input"><input type="text"> =</span> ' +
                    '<span class="answer">0</span>' +
                    '<span class="errors"></span>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col-xs-3"><button class="calc-button">AC</button></div>' +
                    '<div class="col-xs-3"><button class="calc-button 40">(</button></div>' +
                    '<div class="col-xs-3"><button class="calc-button 41">)</button></div>' +
                    '<div class="col-xs-3"><button class="calc-button 47">÷</button></div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col-xs-3"><button class="calc-button 55">7</button></div>' +
                    '<div class="col-xs-3"><button class="calc-button 56">8</button></div>' +
                    '<div class="col-xs-3"><button class="calc-button 57">9</button></div>' +
                    '<div class="col-xs-3"><button class="calc-button 42">×</button></div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col-xs-3"><button class="calc-button 52">4</button></div>' +
                    '<div class="col-xs-3"><button class="calc-button 53">5</button></div>' +
                    '<div class="col-xs-3"><button class="calc-button 54">6</button></div>' +
                    '<div class="col-xs-3"><button class="calc-button 45">−</button></div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col-xs-3"><button class="calc-button 49">1</button></div>' +
                    '<div class="col-xs-3"><button class="calc-button 50">2</button></div>' +
                    '<div class="col-xs-3"><button class="calc-button 51">3</button></div>' +
                    '<div class="col-xs-3"><button class="calc-button 43">+</button></div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col-xs-6"><button class="calc-button 48">0</button></div>' +
                    '<div class="col-xs-3"><button class="calc-button 46">,</button></div>' +
                    '<div class="col-xs-3"><button class="calc-button 13">=</button></div>' +
                '</div>' +
            '</div>'
        ).insertAfter('nav.navbar-fixed-top');
        $("#"+id).draggable({ containment: "body", scroll: false, stack: ".calc", cursor: "move", cancel: ""});
        $("#"+id).focus();
    };
    this.close = function (obj) {
        $(obj).parent().remove();
    };
    this.buttonClick = function (id, sign) {
        var input = $('#' + id + ' input');
        var ans = $('#' + id + ' .answer');
        var error = $('#' + id + ' .errors');
        sign = sign.replace('−', '-').replace('÷', '/').replace('×', '*').replace(',', '.');
        if ("+-*/=()0123456789.".indexOf(sign) > -1 || sign == 'AC') {
            error.html("");
            switch (sign){
                case 'AC':
                    input.val("");
                    ans.html("0");
                    break;
                case '=':
                    var str = input.val();
                    try {
                        var result = eval(str).toString();
                        if (result == "Infinity" || !result.match(/^-?[0-9]+(\.[0-9]+)?$/)) {
                            throw new EvalError("Error");
                        }
                        ans.html(Math.round(result * 100) / 100) ;
                    } catch (err) {
                        ans.html("0");
                        error.html("Error");
                    }
                    input.val("");
                    break;
                default:
                    input.val(function() {
                        if ("+-*/".indexOf(input.val().slice(-1)) > -1 && "+-*/".indexOf(sign) > -1) {
                            input.val(input.val().slice(0, -1));
                        }
                        if (ans.html() != '0' && !input.val() && "+-*/".indexOf(sign) > -1) {
                            this.value = ans.html();
                        }
                        return this.value + sign;
                    });
                break;
            };
        }
    };
};