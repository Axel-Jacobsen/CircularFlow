[x,y] = meshgrid(-5:1:5,-5:1:5);

SCALE = 2;
a = 2;
b = 5;
w = 1;

r = sqrt(x.^2 + y.^2); % r in function of (x, y)
theta = atan2(y, x); % theta in function of (x, y)

u = -((a^2 * w)/(b^2-a^2) * (b^2./ r - r)).*sin(theta);
v =  ((a^2 * w)/(b^2-a^2) * (b^2./ r - r)).*cos(theta);

th = 0:pi/50:2*pi;
xunit = a * cos(th);
yunit = a * sin(th);

hold on;
plot(xunit, yunit);

xunit = xunit * b / a;
yunit = yunit * b / a;
plot(xunit, yunit);

quiver(x, y, u, v, SCALE)
