/**
 * Created with IntelliJ IDEA.
 * User: 松松
 * Date: 12-12-17
 * Time: 下午7:36
 * To change this template use File | Settings | File Templates.
 */

define(function (require, exports, module) {

    var $img = $('#img');
    var $pic = $('#img img');
    var $document = $(document);

    if ($img[0].setCapture) {
        $document.on('mousedown', function (ev) {
            $img[0].setCapture();
        });

        $document.on('mouseup', function (ev) {
            $img[0].releaseCapture();
        });
    }

    function addDragListener(ev) {
        ev.preventDefault();
    }

    var x, y, left, top, w, h, isZoom;

    //绑定事件
    $img.mousedown(function (event) {
        x = event.pageX;
        y = event.pageY;
        left = parseInt($img.css('left'), 10);
        top = parseInt($img.css('top'), 10);

        isZoom = event.ctrlKey;
        //判断是放大还是拖放模式
        if (isZoom) {
            w = $pic.width();
            h = $pic.height();
            $(document).mousemove(zoom);
            $(document).one('mouseup', function () {
                $(document).off("mousemove", zoom);
                center();
            });
        } else {
            $(document).mousemove(move);
            $(document).one('mouseup', function () {
                $(document).off("mousemove", move);
                center();
            });
        }

        //拖动是禁止选中文字，以避免“扫黑”影响体验
        $document.on('select', addDragListener);
        $document.on('selectstart', addDragListener);
        $document.on('dragstart', addDragListener);
        $(document).one('mouseup', function () {
            $(document).off("select", addDragListener);
            $document.off('selectstart', addDragListener);
            $(document).off("dragstart", addDragListener);
        });

    });

    //移动图片
    function move(event) {
        var _x = event.pageX;
        var _y = event.pageY;

        $img.css({
            left: left + (_x - x),
            top: top + (_y - y)
        });

    }

    //缩放图片
    function zoom(event) {
        var _x = event.pageX;
        var clientW = $document.width();
        var clientH = $document.height();
        console.log(clientW, clientH);
        if (x < _x) {
            console.log('ZOOM ++ ');
            $pic.css(
                {  width: (w + (_x - x) * 6 ) + 'px' }
            );
            $img.css({
                left: (left - (_x - x) * 2) + 'px',
                top: (top - (_x - x) * 2) + 'px'
            })
        } else {
            console.log('ZOOM -- ');
            var newW = (w - (x - _x) * 4 );
            if (newW > 50) {
                $pic.css(
                    {  width: newW + 'px' }
                );
                $img.css({
                    left: (left + ( x - _x) * 2) + 'px',
                    top: (top + (x - _x) * 2) + 'px'
                })
            } else {
                $pic.css(
                    {  width: '50px' }
                );
            }
        }
    }

    //将图片放在中央
    function center() {
        var left = parseInt($img.css('left'), 10);
        var top = parseInt($img.css('top'), 10);

        var docWidth = $document.width();
        var docHeight = $document.height();

        if (($img.width() < docWidth && $img.height() < docHeight) || (left > docWidth || top > docHeight)) {
            $img.css({
                left: (docWidth / 2 - $img.width() / 2) + 'px',
                top: (docHeight / 2 - $img.height() / 2) + 'px'
            })
        }
    }

    $(window).on('resize', center);

});
