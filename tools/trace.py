import numpy as np, cv2, sys
from PIL import Image
src=np.array(Image.open('../public/assets/logo/logo-referenz.png')).astype(np.float32)
R,G,B,A=[src[:,:,i] for i in range(4)]
H,W=A.shape
op=A>128
def region(m,x0,y0,x1,y1):
    z=np.zeros_like(m); z[y0:y1,x0:x1]=m[y0:y1,x0:x1]; return z
S=4
def trace(mask, eps=1.2, minarea=30, blur=0.8):
    m=cv2.GaussianBlur(mask.astype(np.float32),(0,0),blur)
    big=cv2.resize(m,(W*S,H*S),interpolation=cv2.INTER_CUBIC)
    b=(big>0.5).astype(np.uint8)
    cs,hier=cv2.findContours(b,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_NONE)
    d=[]
    for c in cs:
        if cv2.contourArea(c) < minarea*S*S: continue
        c=cv2.approxPolyDP(c,eps,True).reshape(-1,2)/S
        d.append("M"+" ".join("%.1f %.1f"%(x,y) for x,y in c)+"Z")
    return "".join(d)
luma=0.3*R+0.59*G+0.11*B
yy,xx=np.mgrid[0:H,0:W]
inside=((xx-752)**2+(yy-297)**2)<(268**2)
goat=region(op&(luma<70)&inside,540,40,960,470)
red=op&(R>110)&(G<70)&(B<70)
seal=region(red,160,80,460,360)
lines=region(red,330,455,1200,525)
green=op&(G>R+8)&(G>B+25)&(luma<150)
word=region(green,190,510,1330,900)
n,lab,st,_=cv2.connectedComponentsWithStats(word.astype(np.uint8),8)
for i in range(1,n):
    x,y,w,h,a=st[i]
    if w>330 or (y+h>850 and h<60 and w>80): word[lab==i]=False
moon=region(green & (((xx-752)**2+(yy-297)**2)>(285**2)),1005,40,1215,265)
# Sonne: Kreis aus nicht-transparenten Pixeln
sun=region(op,470,10,1030,462)
ys,xs=np.nonzero(sun)
l,r,t=xs.min(),xs.max(),ys.min()
cx=(l+r)/2; rad=(r-l)/2; cy=t+rad
out=dict(goat=trace(goat),seal=trace(seal,minarea=4),lines=trace(lines,minarea=4),word=trace(word),moon=trace(moon,blur=2.2),cx=cx,cy=cy,rad=rad)
import json; json.dump(out,open('paths.json','w'))
print({k:(len(v) if isinstance(v,str) else v) for k,v in out.items()})
