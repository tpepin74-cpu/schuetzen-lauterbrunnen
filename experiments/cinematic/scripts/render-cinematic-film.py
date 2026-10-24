#!/usr/bin/env python3
"""Render the scroll camera as a seekable 24 fps film from photographic keyframes.
The photographs remain unchanged; only the animated projection is rendered.
"""
import argparse,json,sys,subprocess,math
from pathlib import Path
parser=argparse.ArgumentParser()
parser.add_argument('--profile',choices=['desktop','mobile'],default='desktop')
parser.add_argument('--opencv-path')
parser.add_argument('--samples-only',action='store_true')
args=parser.parse_args()
if args.opencv_path:sys.path.insert(0,args.opencv_path)
import cv2
import numpy as np
from PIL import Image
from cinematic_morph import PhotoMorph
cv2.setNumThreads(3)
ROOT=Path(__file__).resolve().parents[1]
PUBLIC=ROOT/'public';OUT=PUBLIC/'assets/cinematic'
QA=ROOT/'docs/cinematic-qa';QA.mkdir(parents=True,exist_ok=True)
manifest=json.loads((OUT/'sequence.json').read_text())
mobile=args.profile=='mobile'
variant=manifest.get('mobile',{}) if mobile else {}
logical=variant.get('logicalAspect',manifest['logicalAspect'])
W,H=(900,1350) if mobile else (1600,900)
frames=[]
for f in manifest['frames']:
    over=next((x for x in variant.get('frames',[]) if x['id']==f['id']),{})
    frames.append({**f,**over})
trans={(x['from'],x['to']):x for x in manifest['transitions']}
trans.update({(x['from'],x['to']):x for x in variant.get('transitions',[])})
FPS=24;COUNT=384;END=.578
Y,X=np.mgrid[:H,:W].astype(np.float32)
QX=X/max(1,W-1);QY=Y/max(1,H-1)

def smooth(a,b,x):
    t=np.clip((x-a)/(b-a),0,1)
    return t*t*(3-2*t)

def read(src):
    with Image.open(PUBLIC/src.lstrip('/')) as im:
        return np.asarray(im.convert('RGB')).copy()

def cover(im):
    h,w=im.shape[:2]
    scale=max(W/w,H/h);nw,nh=w*scale,h*scale
    l=(nw-W)/(2*scale);t=(nh-H)/(2*scale)
    pil=Image.fromarray(im)
    return np.asarray(pil.resize((W,H),Image.Resampling.LANCZOS,box=(l,t,l+W/scale,t+H/scale))).copy()

def remap(im,x,y):
    return cv2.remap(im,x.astype(np.float32),y.astype(np.float32),cv2.INTER_LINEAR,borderMode=cv2.BORDER_REPLICATE)

photos={f['id']:cover(read(f['src'])) for f in frames}
cascade=read(manifest['cascade']['src']);water=read(manifest['water']['src'])
# Inverse warp is solved on the same compact vector grid, then interpolated to
# full video resolution, keeping walls stable and render cost bounded.
flow_cache={}
def flow_map(url,ran):
    path=PUBLIC/url.lstrip('/')
    raw=np.frombuffer(path.with_suffix('.bin').read_bytes(),dtype='<u2')
    w,h=map(int,raw[:2]);data=raw[2:].reshape(h,w,2).astype(np.float32)/65535.
    return (data-.5)*(2*ran)

def pair_data(a,b):
    key=(a['id'],b['id'])
    if key in flow_cache:return flow_cache[key]
    spec=trans[key];ran=spec.get('range',.5)
    f=flow_map(spec['forward'],ran);back=flow_map(spec['backward'],ran)
    h,w=f.shape[:2];yy,xx=np.mgrid[:h,:w].astype(np.float32)
    q=np.stack((xx/(w-1),yy/(h-1)),axis=-1)
    flow_cache.clear();flow_cache[key]=(f,back,q)
    return f,back,q

def sample_vec(field,uv):
    h,w=field.shape[:2]
    return remap(field,uv[...,0]*(w-1),uv[...,1]*(h-1))

morphs={}
def sequence(p):
    i=next((i for i in range(len(frames)-1) if p<frames[i+1]['p']),len(frames)-1)
    a=frames[i];b=frames[min(i+1,len(frames)-1)]
    if a is b:return photos[a['id']]
    t=float(np.clip((p-a['p'])/(b['p']-a['p']),0,1))
    key=a['id']+':'+b['id']
    if key not in morphs:
        m=PhotoMorph(photos[a['id']],photos[b['id']],key,mobile)
        morphs[key]=m
        print(f'{args.profile}: {key}: {m.points} landmarks, {len(m.tris)} triangles',flush=True)
    return morphs[key].frame(t)

def source_uv(im):
    h,w=im.shape[:2];ratio=w/h
    sx=min(1,logical/ratio);sy=min(1,ratio/logical)
    return (QX-.5)*sx+.5,(QY-.5)*sy+.5

cx,cy=source_uv(cascade);wx,wy=source_uv(water)

def water_frame(p):
    approach=float(smooth(0,.105,p));zoom=math.exp(math.log(4)*approach)
    ax=(cx-.5)/zoom+.5;ay=(cy-.5)/zoom+.5+.17*approach
    cliff=remap(cascade,ax*(cascade.shape[1]-1),ay*(cascade.shape[0]-1))
    if p<=.068:return cliff
    immerse=float(smooth(.068,.118,p));opening=float(smooth(.12,.195,p))
    ripple=(np.sin(QY*12+p*32)*.060+np.sin(QY*29-p*22)*.023+np.sin(QY*81+QX*17-p*43)*.012)
    wu=(wx-.5)*.68+.5+np.sign(QX-.5)*opening*.17+np.sin(QY*53+QX*11-p*28)*.005
    wv=(wy-.5)*.68+.39+p*.66+np.sin(QX*17+p*38)*.008
    wet=remap(water,wu*(water.shape[1]-1),wv*(water.shape[0]-1))
    radius=-.20+opening*1.03
    oval=np.abs((QY-.54)*1.6)**1.5*.18*(1-opening)
    luminance=(wet[...,0]*.2126+wet[...,1]*.7152+wet[...,2]*.0722)/255
    edge=np.abs(QX-.5)-radius+ripple+oval+(luminance-.62)*.035*(1-opening)
    aperture=1-smooth(-.040,.045,edge)
    destination=photos['approach']
    distortion=np.sin(QY*37+p*78)*.0066*immerse*(1-opening)
    dest=remap(destination,(QX+np.sin(QY*53+QX*11-p*28)*.011*immerse*(1-opening))*(W-1),(QY+distortion)*(H-1))
    width=.02+1.06*immerse
    cover_mask=(1-smooth(width-.06,width+.06,np.abs(QX-.5)+ripple*.3))*immerse
    color=cliff.astype(np.float32)*(1-cover_mask[...,None])+wet.astype(np.float32)*cover_mask[...,None]
    op=aperture*immerse
    color=color*(1-op[...,None])+dest.astype(np.float32)*op[...,None]
    mist=np.exp(-np.abs(edge)*28)*.11*immerse*(1-opening)
    color=color*(1-mist[...,None])+np.array([234,242,240],np.float32)*mist[...,None]
    return np.clip(color,0,255).astype(np.uint8)

def render(p):
    return water_frame(p) if p<.195 else sequence(p)

SAMPLES=[0,.045,.09,.125,.152,.18,.19,.2375,.285,.3125,.34,.3675,.395,.405,.415,.425,.435,.4625,.49,.524,.558]
for p in SAMPLES:
    Image.fromarray(render(p)).save(QA/f'{args.profile}-{p:.4f}.jpg',quality=92)
print(f'{args.profile}: {len(SAMPLES)} sample frames saved',flush=True)
if args.samples_only:sys.exit(0)
path=OUT/f'journey-{args.profile}.mp4'
tmp=OUT/f'journey-{args.profile}.rendering.mp4'
command=['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','19','-g','6','-keyint_min','6','-sc_threshold','0','-bf','0','-threads','3','-pix_fmt','yuv420p','-movflags','+faststart',str(tmp)]
process=subprocess.Popen(command,stdin=subprocess.PIPE)
try:
    for i in range(COUNT):
        p=END*i/(COUNT-1)
        process.stdin.write(render(p).tobytes())
        if i%48==0:print(f'{args.profile}: frame {i}/{COUNT}',flush=True)
    process.stdin.close()
    code=process.wait()
    if code:raise RuntimeError(f'ffmpeg exited {code}')
    tmp.replace(path)
except BaseException:
    process.kill();process.wait();raise
print(json.dumps({'profile':args.profile,'file':str(path),'fps':FPS,'frames':COUNT,'width':W,'height':H,'bytes':path.stat().st_size}),flush=True)
