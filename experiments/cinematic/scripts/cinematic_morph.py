"""Sparse, geometrically constrained photo interpolation for a camera move.

Control points follow persistent real objects. Optical texture detail does not
bend independently. Triangles are warped exactly before the textures are mixed.
"""
from pathlib import Path
import json
import cv2
import numpy as np

ROOT=Path(__file__).resolve().parents[1]

def signed(tri):
    a,b,c=tri
    return np.cross(b-a,c-a)

def controls(a,b,key,mobile=False):
    h,w=a.shape[:2]
    manual=[]
    for name in ['morph-anchors-architecture.json','morph-anchors-table.json']:
        p=ROOT/'docs'/name
        if p.exists():
            obj=json.loads(p.read_text())
            vals=obj.get(('mobile:' if mobile else '')+key)
            if vals is None: vals=obj.get(key,[])
            # Desktop coordinates are remapped into the mobile virtual cover.
            is_mobile_specific=('mobile:'+key) in obj
            for row in vals:
                xa,ya,xb,yb=map(float,row)
                if mobile and not is_mobile_specific:
                    xa=(xa-.5)*(16/9)/(2/3)+.5
                    xb=(xb-.5)*(16/9)/(2/3)+.5
                if all(-.12<v<1.12 for v in [xa,ya,xb,yb]):
                    manual.append((np.array([xa,ya]),np.array([xb,yb]),True,0.))
    gray_a=cv2.cvtColor(a,cv2.COLOR_RGB2GRAY);gray_b=cv2.cvtColor(b,cv2.COLOR_RGB2GRAY)
    # Work at moderate size: the correspondence grid controls whole surfaces.
    sw=min(900,w);sh=round(h*sw/w)
    ga=cv2.resize(gray_a,(sw,sh));gb=cv2.resize(gray_b,(sw,sh))
    sift=cv2.SIFT_create(nfeatures=5000,contrastThreshold=.02)
    ka,da=sift.detectAndCompute(ga,None);kb,db=sift.detectAndCompute(gb,None)
    candidates=[]
    if da is not None and db is not None:
        matches=cv2.BFMatcher(cv2.NORM_L2).knnMatch(da,db,k=2)
        good=[m for pair in matches if len(pair)==2 for m,n in [pair] if m.distance<.68*n.distance]
        if len(good)>=8:
            aa=np.float32([ka[m.queryIdx].pt for m in good]);bb=np.float32([kb[m.trainIdx].pt for m in good])
            H,hm=cv2.findHomography(aa,bb,cv2.RANSAC,3)
            F,fm=cv2.findFundamentalMat(aa,bb,cv2.FM_RANSAC,2.5,.995)
            keep=np.zeros(len(good),bool)
            if hm is not None:keep|=hm.ravel().astype(bool)
            if fm is not None and len(fm)==len(good):keep|=fm.ravel().astype(bool)
            for i,m in enumerate(good):
                if not keep[i]:continue
                pa=aa[i]/[sw,sh];pb=bb[i]/[sw,sh]
                if np.linalg.norm(pa-pb)>.58:continue
                if min(pa.min(),pb.min(),1-pa.max(),1-pb.max())<.025:continue
                # Explicit architecture/table landmarks take priority locally.
                if any(min(np.linalg.norm(pa-x),np.linalg.norm(pb-y))<.055 for x,y,_,_ in manual):continue
                candidates.append((pa,pb,False,float(m.distance)))
    chosen=list(manual)
    for item in sorted(candidates,key=lambda x:x[3]):
        pa,pb,_,_=item
        q=(pa+pb)/2
        if any(np.linalg.norm(q-(x+y)/2)<.045 for x,y,_,_ in chosen):continue
        chosen.append(item)
        if len(chosen)>=110:break
    # A common hull makes every frame fully covered, with no disappearing edges.
    boundary=[(0,0),(.25,0),(.5,0),(.75,0),(1,0),(1,.25),(1,.5),(1,.75),(1,1),(.75,1),(.5,1),(.25,1),(0,1),(0,.75),(0,.5),(0,.25)]
    for xy in boundary:
        p=np.array(xy,dtype=np.float64)
        if any(np.linalg.norm(p-(x+y)/2)<.015 for x,y,_,_ in chosen):continue
        chosen.append((p,p,True,0.))
    return chosen

def triangulate(items):
    points=np.array([(a+b)/2 for a,b,_,_ in items],np.float32)
    # OpenCV needs all vertices inside the rectangular subdivision.
    size=10000
    scaled=np.clip(points,0,1)*(size-2)+1
    sub=cv2.Subdiv2D((0,0,size,size))
    for p in scaled:sub.insert(tuple(map(float,p)))
    triangles=[]
    for row in sub.getTriangleList():
        tri=np.array(row,np.float32).reshape(3,2)
        ids=[]
        for q in tri:
            d=np.linalg.norm(scaled-q,axis=1);j=int(d.argmin())
            if d[j]>.2:break
            ids.append(j)
        if len(ids)==3 and len(set(ids))==3:triangles.append(tuple(ids))
    return triangles

class PhotoMorph:
    def __init__(self,a,b,key,mobile=False):
        self.a=a;self.b=b;self.h,self.w=a.shape[:2];self.key=key
        items=controls(a,b,key,mobile)
        # Remove automatic matches that produce folded/crossing surfaces.
        for _ in range(70):
            tris=triangulate(items);bad=[]
            for ids in tris:
                pa=np.array([items[j][0] for j in ids]);pb=np.array([items[j][1] for j in ids])
                if signed(pa)*signed(pb)<=1e-10:
                    bad.extend(j for j in ids if not items[j][2])
            if not bad:break
            counts={j:bad.count(j) for j in set(bad)}
            remove=max(counts,key=lambda j:(counts[j],items[j][3]));items.pop(remove)
        self.tris=triangulate(items)
        self.pa=np.array([x for x,_,_,_ in items],np.float32)*[self.w-1,self.h-1]
        self.pb=np.array([x for _,x,_,_ in items],np.float32)*[self.w-1,self.h-1]
        self.manual=sum(1 for x in items if x[2])-16
        self.points=len(items)

    def warp(self,source,vertices,destination):
        # The destination-ROI offset below is intentional and correct: the
        # affine matrix maps global source pixels into local destination pixels.
        # Repeated diagonal textures instead come from nearly collapsed source
        # triangles expanded by extreme amounts, or from a folded surface.
        # Do not let one such triangle stretch a one-pixel strip over a wall.
        src=np.asarray(vertices,np.float32)
        dst=np.asarray(destination,np.float32)
        threshold=max(2.,.006*np.hypot(self.w,self.h))
        global_h,_=cv2.findHomography(src,dst,cv2.RANSAC,threshold) if len(src)>=4 else (None,None)
        if global_h is None or not np.isfinite(global_h).all():
            affine,_=cv2.estimateAffinePartial2D(src,dst,method=cv2.RANSAC,ransacReprojThreshold=threshold)
            if affine is None:
                delta=np.median(dst-src,axis=0)
                affine=np.array([[1.,0.,delta[0]],[0.,1.,delta[1]]])
            global_h=np.vstack([affine,[0.,0.,1.]])
        centre=np.array([self.w*.5,self.h*.5,1.])
        den=float(global_h[2]@centre)
        projected=global_h@centre
        jacobian=(global_h[:2,:2]*den-np.outer(projected[:2],global_h[2,:2]))/max(den*den,1e-10)
        camera_scale=max(.05,float(np.sqrt(abs(np.linalg.det(jacobian)))))
        unsafe=False
        for ids in self.tris:
            st=src[list(ids)];dt=dst[list(ids)]
            if abs(float(signed(st)))<.1 or float(signed(st))*float(signed(dt))<=0:
                unsafe=True;break
            linear=cv2.getAffineTransform(st,dt)[:,:2]
            values=np.linalg.svd(linear,compute_uv=False)
            if (not np.isfinite(values).all() or values[-1]<camera_scale/3.
                    or values[0]>camera_scale*3. or values[0]/max(values[-1],1e-9)>4.5):
                unsafe=True;break
        if unsafe:
            # A single coherent camera transform keeps straight objects straight
            # when independently generated views cannot support a valid mesh.
            # Fall back for the whole image; mixing local and global patches
            # would introduce new visible triangle seams.
            self.last_warp_mode='projective-fallback'
            return cv2.warpPerspective(source,global_h,(self.w,self.h),flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_REPLICATE)
        self.last_warp_mode='mesh'
        result=source.copy()
        for ids in self.tris:
            st=np.float32(vertices[list(ids)]);dt=np.float32(destination[list(ids)])
            if abs(float(signed(dt)))<.1:continue
            # Rasterise exactly at the interpolated triangle rather than using
            # an iterative inverse field (which can ripple on large camera moves).
            x,y,rw,rh=cv2.boundingRect(dt)
            x0=max(0,x);y0=max(0,y);x1=min(self.w,x+rw);y1=min(self.h,y+rh)
            if x1<=x0 or y1<=y0:continue
            local=dt-[x0,y0]
            M=cv2.getAffineTransform(st,np.float32(local))
            part=cv2.warpAffine(source,M,(x1-x0,y1-y0),flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_REPLICATE)
            mask=np.zeros((y1-y0,x1-x0),np.uint8)
            cv2.fillConvexPoly(mask,np.rint(local*16).astype(np.int32),255,lineType=cv2.LINE_8,shift=4)
            cv2.copyTo(part,mask,result[y0:y1,x0:x1])
        return result

    def frame(self,t):
        if t<=.000001:return self.a
        if t>=.999999:return self.b
        dest=self.pa*(1-t)+self.pb*t
        a=self.warp(self.a,self.pa,dest)
        b=self.warp(self.b,self.pb,dest)
        # Geometry travels for the full interval. The texture handover is brief
        # and centred on the aligned surfaces, limiting transparent furnishings.
        mix=np.clip((t-.32)/.36,0,1);mix=mix*mix*(3-2*mix)
        return cv2.addWeighted(a,1-float(mix),b,float(mix),0)
