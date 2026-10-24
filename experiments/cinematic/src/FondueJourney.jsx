import { motion, useTransform } from 'framer-motion';
import './FondueJourney.css';

const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const ease=t=>t*t*(3-2*t);
function sample(p,stops,values){if(p<=stops[0])return values[0];for(let i=1;i<stops.length;i++){if(p<=stops[i]){const t=ease(clamp((p-stops[i-1])/(stops[i]-stops[i-1])));return values[i-1]+(values[i]-values[i-1])*t;}}return values.at(-1);}

// Positions are in the photographic scene's 1600 × 900 coordinate space.
// The fork's first tine is the origin of the right-hand rig, so the same bread
// cube remains attached while the wrist, fork and bite move as one object.
function forkPose(p,mobile){
  const keys=[.655,.69,.716,.739,.755,.795,.90,.94,.98,1];
  if(mobile){
    let x=sample(p,keys,[980,760,535,404,404,435,435,440,460,460]);
    let y=sample(p,keys,[1110,770,705,638,638,839,821,650,600,620]);
    let rotation=sample(p,keys,[16,12,8,8,8,-60,-60,-12,-6,-6]);
    const scale=sample(p,keys,[.55,.58,.62,.62,.62,.34,.34,.75,1.4,1.8]);
    if(p>=.795&&p<=.90){const angle=ease(clamp((p-.795)/.105))*Math.PI*3;x=435+28*Math.sin(angle);y=830+9*Math.cos(angle);rotation=-60+4*Math.sin(angle);}
    return {x,y,rotation,scale};
  }
  let x=sample(p,keys,[1390,985,817,690,690,815,815,830,860,880]);
  let y=sample(p,keys,[870,510,470,399,399,615,589,443,405,410]);
  let rotation=sample(p,keys,[9,3,0,0,0,-38,-38,-20,-6,-6]);
  let scale=sample(p,keys,[.9,.95,1,1,1,.65,.65,1.1,2.35,2.65]);
  if(p>=.795&&p<=.90){const t=ease(clamp((p-.795)/.105));const angle=t*Math.PI*3;x=815+64*Math.sin(angle);y=602+13*Math.cos(angle);rotation=-38+4*Math.sin(angle);}
  return {x,y,rotation,scale};
}
function leftPose(p,mobile){
  const keys=[.585,.615,.658,.70,.739,.765,.79];
  if(mobile){return {x:sample(p,keys,[125,180,420,420,420,230,-70]),y:sample(p,keys,[1050,925,660,660,660,1000,1450]),rotate:sample(p,keys,[-12,-5,0,0,0,-7,-15]),scale:sample(p,keys,[.5,.55,.62,.62,.62,.56,.48])};}
  let x=sample(p,keys,[215,330,720,720,720,430,115]);
  let y=sample(p,keys,[890,660,430,430,430,775,1090]);
  const rotate=sample(p,keys,[-12,-5,0,0,0,-7,-15]);
  let scale=sample(p,keys,[.78,.85,1,1,1,.9,.8]);
  return {x,y,rotate,scale};
}
const asTransform=({x,y,rotation=0,rotate,scale=1})=>`translate(${x}px, ${y}px) rotate(${rotate??rotation}deg) scale(${scale})`;

export default function FondueJourney({progress,mobile=false}){
  const width=mobile?900:1600;
  const height=mobile?1350:900;
  const photo=mobile?'/assets/journey/fondue-mobile.webp':'/assets/journey/fondue.webp';
  const opacity=useTransform(progress,[0,.556,.575,1],[0,0,1,1]);
  const visibility=useTransform(progress,p=>p<.551?'hidden':'visible');
  const cameraScale=useTransform(progress,[0,.90,1],[1,1,1.035]);
  const cameraY=useTransform(progress,[0,1],['0vh','0vh']);
  const leftTransform=useTransform(progress,p=>asTransform(leftPose(p,mobile)));
  const rightTransform=useTransform(progress,p=>asTransform(forkPose(p,mobile)));
  const leftOpacity=useTransform(progress,[0,.587,.61,.767,.792,1],[0,0,1,1,0,0]);
  const leftBreadOpacity=useTransform(progress,p=>p<.739?1:0);
  const leftEmptyOpacity=useTransform(progress,p=>p<.739?0:1);
  const rightOpacity=useTransform(progress,[0,.65,.684,1],[0,0,1,1]);
  const bareForkOpacity=useTransform(progress,[0,.894,.91,1],[1,1,0,0]);
  const coatedForkOpacity=useTransform(progress,[0,.894,.91,1],[0,0,1,1]);
  const breadOpacity=useTransform(progress,p=>p<.739?0:sample(p,[.739,.776,.797,1],[1,1,0,0]));
  const submergedOpacity=useTransform(progress,[0,.777,.798,.895,.914,1],[0,0,1,1,0,0]);
  const strandOpacity=useTransform(progress,[0,.90,.917,.945,.957,1],[0,0,.92,.8,0,0]);
  const strandPath=useTransform(progress,p=>{const a=forkPose(p,mobile);return mobile?`M 450 832 C 451 796, ${a.x-8} ${a.y+58}, ${a.x+13} ${a.y+17}`:`M 815 604 C 819 576, ${a.x-8} ${a.y+58}, ${a.x+13} ${a.y+17}`;});
  const backgroundBlur=useTransform(progress,[0,.947,.985,1],['blur(0px)','blur(0px)','blur(1.6px)','blur(1.6px)']);

  return <motion.div className={`fondue-journey ${mobile?'fondue-mobile':''}`} style={{opacity,visibility}} aria-hidden="true">
    <motion.div className="fondue-camera" style={{scale:cameraScale,y:cameraY}}>
      <svg className="fondue-stage-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <clipPath id="fondue-pot-front"><path d={mobile?'M236 805 C245 891 658 894 670 805 L661 940 Q600 1012 451 1015 Q285 1000 247 948Z':'M516 570 C534 653 1100 665 1131 568 L1124 691 Q1068 789 822 794 Q585 780 530 710Z'}/></clipPath>
          <clipPath id="fondue-cheese-surface"><ellipse cx={mobile?450:817} cy={mobile?830:585} rx={mobile?198:282} ry={mobile?39:46}/></clipPath>
          <filter id="photo-edge" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB"><feMorphology in="SourceAlpha" operator="dilate" radius=".9" result="wide"/><feFlood floodColor="#fff8e9" floodOpacity=".72"/><feComposite in2="wide" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <linearGradient id="melted-cheese" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#ba893e"/><stop offset=".35" stopColor="#f9df9d"/><stop offset=".6" stopColor="#fff1ca"/><stop offset="1" stopColor="#d6ad66"/></linearGradient>
        </defs>
        <motion.image href={photo} width={width} height={height} preserveAspectRatio="none" style={{filter:backgroundBlur}}/>
        <motion.g style={{opacity:strandOpacity}}><motion.path d={strandPath} fill="none" stroke="url(#melted-cheese)" strokeWidth="4.2" strokeLinecap="round"/><motion.path d={strandPath} fill="none" stroke="#fff0c7" strokeWidth="1.1" strokeLinecap="round"/></motion.g>
        <motion.g className="hand-rig right-hand-rig" style={{transform:rightTransform,originX:0,originY:0,transformBox:'view-box',opacity:rightOpacity}}>
          <motion.image href="/assets/journey/right-fork.webp" x="-41.02" y="-54.69" width="1000" height="666.667" style={{opacity:bareForkOpacity}}/>
          <motion.image href="/assets/journey/right-cheese.webp" x="-41.02" y="-54.69" width="1000" height="666.667" style={{opacity:coatedForkOpacity}}/>
          <motion.image className="bread-on-fork" href="/assets/journey/bread.webp" x="-50" y="-51" width="160" height="160" style={{opacity:breadOpacity}}/>
        </motion.g>
        <motion.image href={photo} width={width} height={height} preserveAspectRatio="none" clipPath="url(#fondue-cheese-surface)" style={{opacity:submergedOpacity}}/>
        <motion.image href={photo} width={width} height={height} preserveAspectRatio="none" clipPath="url(#fondue-pot-front)" style={{opacity:submergedOpacity}}/>
        <motion.g className="hand-rig left-hand-rig" style={{transform:leftTransform,originX:0,originY:0,transformBox:'view-box',opacity:leftOpacity}}>
          <motion.image href="/assets/journey/left-bread.webp" x="-569.66" y="-214.84" width="1000" height="666.667" style={{opacity:leftBreadOpacity}}/>
          <motion.image href="/assets/journey/left-empty.webp" x="-569.66" y="-214.84" width="1000" height="666.667" style={{opacity:leftEmptyOpacity}}/>
        </motion.g>
      </svg>
    </motion.div>
  </motion.div>;
}
