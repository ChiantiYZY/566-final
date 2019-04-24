#version 300 es
precision highp float;

uniform vec3 u_Eye, u_Ref, u_Up;
uniform vec2 u_Dimensions;
uniform float u_Time;

in vec2 fs_Pos;
in vec4 fs_Col;
out vec4 out_Col;

/**
 * Noise functions
 */


const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

float noise( in vec2 x )
{
	return sin(1.5*x.x)*sin(1.5*x.y);
}

float fbm4( vec2 p )
{
    float f = 0.0;
    f += 0.5000*noise( p ); p = m*p*2.02;
    f += 0.2500*noise( p ); p = m*p*2.03;
    f += 0.1250*noise( p ); p = m*p*2.01;
    f += 0.0625*noise( p );
    return f/0.9375;
}

float fbm6( vec2 p )
{
    float f = 0.0;
    f += 0.500000*(0.5+0.5*noise( p )); p = m*p*2.02;
    f += 0.250000*(0.5+0.5*noise( p )); p = m*p*2.03;
    f += 0.125000*(0.5+0.5*noise( p )); p = m*p*2.01;
    f += 0.062500*(0.5+0.5*noise( p )); p = m*p*2.04;
    f += 0.031250*(0.5+0.5*noise( p )); p = m*p*2.01;
    f += 0.015625*(0.5+0.5*noise( p ));
    return f/0.96875;
}

float func( vec2 q, out vec4 ron )
{
    float ql = length( q );
    q.x += 0.05*sin(0.01*u_Time+ql*4.1);
    q.y += 0.05*sin(0.01*u_Time+ql*4.3);
    q *= 0.5;

	vec2 o = vec2(0.0);
    o.x = 0.5 + 0.5*fbm4( vec2(2.0*q          )  );
    o.y = 0.5 + 0.5*fbm4( vec2(2.0*q+vec2(5.2))  );

	float ol = length( o );
    o.x += 0.02*sin(0.01*u_Time+ol)/ol;
    o.y += 0.02*sin(0.01*u_Time+ol)/ol;

    vec2 n;
    n.x = fbm6( vec2(4.0*o+vec2(9.2))  );
    n.y = fbm6( vec2(4.0*o+vec2(5.7))  );

    vec2 p = 4.0*q + 4.0*n;

    float f = 0.5 + 0.5*fbm4( p );

    f = mix( f, f*f*f*3.5, f*abs(n.x) );

    float g = 0.5 + 0.5*sin(4.0*p.x)*sin(4.0*p.y);
    f *= 1.0-0.5*pow( g, 8.0 );

	ron = vec4( o, n );
	
    return f;
}


vec3 doMagic(vec2 p)
{
	vec2 q = p*0.6;

    vec4 on = vec4(0.0);
    float f = func(q, on);

	vec3 col = vec3(0.0);
    col = mix( vec3(0.0196, 0.5804, 0.1608), vec3(0.0235, 0.2588, 0.4784), f );
    col = mix( col, vec3(0.1922, 0.0039, 0.1098), dot(on.zw,on.zw) );
    col = mix( col, vec3(0.502, 0.0118, 0.2157), 0.5*on.y*on.y );
    col = mix( col, vec3(0.0,0.2,0.4), 0.5*smoothstep(1.2,1.3,abs(on.z)+abs(on.w)) );
    col = clamp( col*f*2.0, 0.0, 1.0 );
	return 1.1*col*col;

}

float rand(vec2 uv) {
    const highp float a = 12.9898;
    const highp float b = 78.233;
    const highp float c = 43758.5453;
    highp float dt = dot(uv, vec2(a, b));
    highp float sn = mod(dt, 3.1415);
    return fract(sin(sn) * c);
}

void draw_stars(inout vec4 color, vec2 uv) {
    float t = sin(u_Time * 0.1 * rand(-uv)) * 0.5 + 0.5;
    //color += step(0.99, stars) * t;
    color += smoothstep(0.99, 1.0, rand(uv)) * t;
}



void main() {

  vec2 dim = vec2(400.0, 400.0);
    vec2 p = (-dim.xy+200.0*vec2(fs_Pos))/dim.y;


    //p = (-u_Dimensions.xy+2.0*vec2(fs_Pos));

    
    vec2 uv = vec2(noise(fs_Pos)) / dim.xy;
    vec2 p1 = vec2(400.0/ 400.0, 1.0);
    p1 = vec2(0.0, 1.0);
    vec3 color1 = doMagic(p);
    out_Col = vec4(color1 * 1.1, 1.0 );

    out_Col = vec4(0.9137, 0.7451, 0.3804, 1.0);
    //draw_stars(out_Col, uv);

    //out_Col = vec4(p1, p1);

    //out_Col = (1.0 - distance * 0.4) * (vec4(getMountainColor(), 1.0) + vec4(pinkClouds * 0.3, 0.4) + (starColor * 0.9));
		return;
}