#!/usr/bin/env python3
"""Build motion-vector data for the photographic scroll renderer.

This analyses photographs; it does not retouch them. The source WebP photographs
remain unchanged. Flow is stored as xHi,xLo,yHi,yLo in 16-bit normalized units,
with Y downward. The browser must decode these data PNGs without premultiplication.
Run with OpenCV/numpy/Pillow available, or pass --opencv-path for an isolated install.
"""
from pathlib import Path
import argparse
import json
import sys
import struct

parser = argparse.ArgumentParser()
parser.add_argument('--opencv-path')
args = parser.parse_args()
if args.opencv_path:
    sys.path.insert(0, args.opencv_path)
import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT/'public'
OUT = PUBLIC/'assets/cinematic'
OUT.mkdir(parents=True, exist_ok=True)
cv2.setNumThreads(4)
FRAMES = [
    ('approach', .19, '/assets/cinematic/approach.webp'),
    ('steps-low', .285, '/assets/cinematic/steps-low.webp'),
    ('steps-high', .34, '/assets/cinematic/steps-high.webp'),
    ('landing', .395, '/assets/cinematic/landing.webp'),
    ('terrace-turn', .415, '/assets/cinematic/terrasse-turn.webp'),
    ('table-wide', .435, '/assets/cinematic/table-wide.webp'),
    ('table-approach', .49, '/assets/cinematic/table-approach.webp'),
    ('fondue', .558, '/assets/journey/fondue.webp'),
]
RANGE = .5

def photograph(src, size):
    """Read into the same virtual cover frame used by the WebGL renderer."""
    im=Image.open(PUBLIC/src.lstrip('/')).convert('RGB')
    w,h=size
    scale=max(w/im.width,h/im.height)
    nw,nh=im.width*scale,im.height*scale
    left=(nw-w)/(2*scale); top=(nh-h)/(2*scale)
    box=(left,top,left+w/scale,top+h/scale)
    return np.asarray(im.resize((w,h),Image.Resampling.LANCZOS,box=box))

def initial_flow(a,b):
    """Use shared photographic features to initialise large camera changes."""
    h,w=a.shape
    sift=cv2.SIFT_create(nfeatures=3500,contrastThreshold=.018)
    ka,da=sift.detectAndCompute(a,None); kb,db=sift.detectAndCompute(b,None)
    report={'matches':0,'inliers':0,'seed':'zero'}
    if da is None or db is None: return None,report
    matches=cv2.BFMatcher(cv2.NORM_L2).knnMatch(da,db,k=2)
    good=[m for pair in matches if len(pair)==2 for m,n in [pair] if m.distance<.71*n.distance]
    report['matches']=len(good)
    if len(good)<8:return None,report
    aa=np.float32([ka[m.queryIdx].pt for m in good]); bb=np.float32([kb[m.trainIdx].pt for m in good])
    H,inliers=cv2.findHomography(aa,bb,cv2.RANSAC,3.5,maxIters=2500,confidence=.995)
    if H is None:return None,report
    report['inliers']=int(inliers.sum())
    corners=np.float32([[0,0],[w,0],[w,h],[0,h]]).reshape(-1,1,2)
    dest=cv2.perspectiveTransform(corners,H).reshape(-1,2)
    ratio=cv2.contourArea(dest)/(w*h)
    valid=(report['inliers']>=7 and .2<ratio<5 and np.isfinite(dest).all() and np.max(np.abs(dest))<max(w,h)*3)
    if not valid:
        M,mask=cv2.estimateAffinePartial2D(aa,bb,method=cv2.RANSAC,ransacReprojThreshold=3.5)
        if M is None or mask.sum()<6:return None,report
        H=np.vstack((M,[0.,0.,1.]));report['seed']='similarity'
    else:report['seed']='homography'
    yy,xx=np.mgrid[:h,:w].astype(np.float32)
    pts=np.stack((xx,yy),axis=-1)
    warped=cv2.perspectiveTransform(pts.reshape(-1,1,2),H).reshape(h,w,2)
    return (warped-pts).astype(np.float32),report

def dense(a,b):
    gray_a=cv2.cvtColor(a,cv2.COLOR_RGB2GRAY);gray_b=cv2.cvtColor(b,cv2.COLOR_RGB2GRAY)
    seed,report=initial_flow(gray_a,gray_b)
    dis=cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
    dis.setFinestScale(0)
    dis.setGradientDescentIterations(40)
    dis.setVariationalRefinementIterations(8)
    flow=dis.calc(gray_a,gray_b,seed.copy() if seed is not None else None)
    # Regularise residual texture motion to keep large architectural surfaces calm.
    if seed is not None:
        residual=flow-seed
        residual=cv2.GaussianBlur(residual,(0,0),2.8)
        max_residual=min(gray_a.shape)*.16
        flow=seed+np.clip(residual,-max_residual,max_residual)
    else:
        flow=cv2.GaussianBlur(flow,(0,0),3.2)
    h,w=gray_a.shape
    flow[...,0]/=w;flow[...,1]/=h
    flow=np.clip(flow,-RANGE,RANGE)
    report['magnitude_p90']=round(float(np.quantile(np.linalg.norm(flow,axis=2),.9)),4)
    return flow,report

def save_flow(flow,path,output_size):
    small=cv2.resize(flow,output_size,interpolation=cv2.INTER_AREA)
    encoded=np.rint(np.clip(small/(2*RANGE)+.5,0,1)*65535).astype(np.uint16)
    data=np.stack((encoded[...,0]>>8,encoded[...,0]&255,encoded[...,1]>>8,encoded[...,1]&255),axis=-1).astype(np.uint8)
    Image.fromarray(data,'RGBA').save(path,optimize=True)
    # Exact CPU fallback data, independent of canvas alpha conversion.
    with path.with_suffix('.bin').open('wb') as stream:
        stream.write(struct.pack('<HH',*output_size))
        stream.write(encoded.astype('<u2').tobytes())

frames=[]
for id,p,src in FRAMES:
    im=Image.open(PUBLIC/src.lstrip('/'))
    frames.append({'id':id,'p':p,'src':src,'aspect':im.width/im.height})
manifest={'version':1,'flowRange':RANGE,'logicalAspect':16/9,
          'cascade':{'src':'/assets/journey/cascade.webp','aspect':1672/941},
          'water':{'src':'/assets/cinematic/water-close.webp','aspect':1672/941},
          'frames':frames,'transitions':[],
          'mobile':{'logicalAspect':2/3,'frames':[
              {'id':'table-wide','p':.435,'src':'/assets/cinematic/table-wide-mobile.webp','aspect':2/3},
              {'id':'table-approach','p':.49,'src':'/assets/cinematic/table-approach-mobile.webp','aspect':2/3},
              {'id':'fondue','p':.558,'src':'/assets/journey/fondue-mobile.webp','aspect':2/3}],
              'transitions':[]}}
reports=[]
for mobile in (False,True):
    size=(512,768) if mobile else (768,432)
    output_size=(256,384) if mobile else (384,216)
    prefix='mobile-' if mobile else ''
    data=[]
    for frame in frames:
        override=next((x for x in manifest['mobile']['frames'] if x['id']==frame['id']),None) if mobile else None
        src=override['src'] if override else frame['src']
        data.append(photograph(src,size))
    target=manifest['mobile']['transitions'] if mobile else manifest['transitions']
    for i in range(len(frames)-1):
        a,b=frames[i],frames[i+1]
        base=f"flow-{prefix}{a['id']}-{b['id']}"
        f,r1=dense(data[i],data[i+1]);back,r2=dense(data[i+1],data[i])
        forward=base+'-f.png';backward=base+'-b.png'
        save_flow(f,OUT/forward,output_size);save_flow(back,OUT/backward,output_size)
        target.append({'from':a['id'],'to':b['id'],'forward':'/assets/cinematic/'+forward,'backward':'/assets/cinematic/'+backward,'range':RANGE})
        report={'mobile':mobile,'from':a['id'],'to':b['id'],'forward':r1,'backward':r2}
        reports.append(report);print(json.dumps(report),flush=True)
(OUT/'sequence.json').write_text(json.dumps(manifest,indent=2)+'\n')
(ROOT/'docs/cinematic-flow-report.json').write_text(json.dumps(reports,indent=2)+'\n')
print('Saved sequence.json and motion vector maps. Photographs unchanged.',flush=True)
