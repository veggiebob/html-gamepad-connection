var drawRobot = function (processingInstance) {
    with (processingInstance) {
        var x = width/2;
        var y = height/2;
        var vx = 0;
        var vy = 0;
        var radius = 50;
        var angle = 0;
        var anglespeed = 0;
        var cone = loadImage('cone.png')
        imageMode(CENTER);
        var sign = function(x) {
            return x > 0 ? 1:-1;
        }
        var scaleInput = function (x) {
            return Math.pow(Math.abs(x), 2) * sign(x);
        }
        setup = function() {
            width = 600;
            height = 400;
            x = width/2;
            y = height/2;
            size(600, 400);
        }
        draw = function() {
            try {
                var controller = controllers[selectedController];
                var leftAxis = getJoystick("joy1", controller);
                var rightAxis = getJoystick("joy2", controller);
                var difficulty = 3.5;
                var leftTank = scaleInput(leftAxis[1]) * difficulty;
                var rightTank = scaleInput(rightAxis[1]) * difficulty;
                var trackWidth = 26;
                var I = 1/2 * 120 * 15 * 15      * 0.3; // robot radius 15 inches
                var torque = (rightTank - leftTank) * trackWidth; // T = I * a
                var alpha = torque / I; // theta / s ^ 2
                var rotateRadius = trackWidth / (rightTank - leftTank) // in
                var movex = trackWidth * (rightTank + leftTank) * Math.sin(-angle); // Force
                var movey = trackWidth * (rightTank + leftTank) * Math.cos(-angle); // Force
                vx -= movex / 120;//F = ma
                vy -= movey / 120;
                anglespeed += alpha;//
            } catch (e) {
                console.log("no controller data")
            }
            image(cone, width * 0.25, height * 0.5, 50, 50)
            image(cone, width * 0.75, height * 0.5, 50, 50)
            fill(255, 255, 255, 100);
            rect(-1, -1, width+2, height+2);
            p1 = [x + radius * Math.cos(angle),
                y + radius * Math.sin(angle)];
            p2 = [
                x - radius * Math.cos(angle),
                y - radius * Math.sin(angle)];
            heading = [
                x + radius * Math.cos(angle + Math.PI/2),
                y + radius * Math.sin(angle + Math.PI/2)
            ]
            line(
                p1[0], p1[1],
                p2[0], p2[1]
            );
            line(
                x, y,
                heading[0], heading[1]
            )
            ellipse(p1[0], p1[1], radius * 0.2, radius * 0.2);
            ellipse(p2[0], p2[1], radius * 0.2, radius * 0.2);
            angle += anglespeed;
            x += vx;
            y += vy;
            var friction = 0.75;
            vx *= friction;
            vy *= friction;
            anglespeed *= friction;
        }
    }
}
var ProcessingInstance = new Processing(document.getElementById("display"), drawRobot);